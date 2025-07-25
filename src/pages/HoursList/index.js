import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import api from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";

const HoursList = ({ route, navigation }) => {
  const { month, day, dateString } = route.params;
  const [year, monthNum] = month.split('-');
  const { token, selectedPatientId, user } = useContextProvider();
  const [loading, setLoading] = useState(true);
  const [savedTasks, setSavedTasks] = useState([]);
  
  // Horários das 7h às 20h
  const [hours] = useState(Array.from({ length: 14 }, (_, i) => i + 7));

  // Tarefas fixas pré-definidas
  const fixedTasks = {
    12: "Almoço",
    14: "Academia",
    15: "Piscina",
    16: "Descanso",
    17: "Leitura",
    18: "Leitura",
    19: "Janta",
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      let response;
      
      if (user?.role === 'medico') {
        response = await api.get(`/medicos/${user.id}/pacientes/${selectedPatientId}/tarefas`, {
          params: { 
            dia: day,
            mes_ano: month
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        response = await api.get(`/pacientes/${user.id}/tarefas`, {
          params: { 
            dia: day,
            mes_ano: month
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      
      setSavedTasks(response.data);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      if (error.response?.status === 401) {
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Listener para quando a tela receber foco
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks();
    });

    // Verifica se veio da TaskForm com flag de atualização
    if (route.params?.shouldRefresh) {
      fetchTasks();
      navigation.setParams({ shouldRefresh: false });
    }

    // Carrega os dados inicialmente
    fetchTasks();

    return unsubscribe;
  }, [navigation, route.params?.shouldRefresh, month, day, selectedPatientId, token, user]);

  // ... restante do código permanece igual ...
  const getTaskDescription = (hour) => {
    const savedTask = savedTasks.find(task => task.hora === hour);
    if (savedTask) return savedTask.descricao;
    return fixedTasks[hour] || null;
  };

  const getTaskStatus = (hour) => {
    const savedTask = savedTasks.find(task => task.hora === hour);
    return savedTask ? savedTask.check : false;
  };

  const hasTask = (hour) => {
    return getTaskDescription(hour) !== null;
  };

  const handleItemPress = (hour) => {
    const isFixedTask = fixedTasks[hour] !== undefined;
    const isSavedTask = savedTasks.some(task => task.hora === hour);
    const savedTask = savedTasks.find(task => task.hora === hour);

    if (user?.role === 'familia' && !isSavedTask) {
      return;
    }

    if (isSavedTask) {
      navigation.navigate("TaskForm", {
        month,
        day: parseInt(day),
        hour,
        fixedTask: isFixedTask ? fixedTasks[hour] : null,
        dateString,
        savedTask,
        isEditing: false
      });
    } else {
      navigation.navigate("TaskForm", {
        month,
        day: parseInt(day),
        hour,
        fixedTask: isFixedTask ? fixedTasks[hour] : null,
        dateString
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#385b3e" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("TaskDiaryList")}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>
        Horas do dia {day}/{monthNum}
      </Text>

      <View style={styles.content}>
        <FlatList
          data={hours}
          keyExtractor={(item) => String(item)}
          renderItem={({ item }) => {
            const description = getTaskDescription(item);
            const isFixedTask = fixedTasks[item] !== undefined;
            const isSavedTask = savedTasks.some(task => task.hora === item);
            const isChecked = getTaskStatus(item);
            const isFamilia = user?.role === 'familia';
            const isClickable = !isFamilia || isSavedTask;

            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  hasTask(item) && styles.fixedTaskItem,
                  !isClickable && styles.disabledItem
                ]}
                onPress={() => handleItemPress(item)}
                disabled={!isClickable}
              >
                <Text style={[
                  styles.title,
                  !isClickable && styles.disabledText
                ]}>
                  {item}:00 {description && `- ${description}`}
                </Text>
                
                <View style={styles.iconsContainer}>
                  {isFixedTask && (
                    <Feather name="lock" size={16} color="#385b3e" style={styles.icon} />
                  )}
                  {(isSavedTask || isFixedTask) && isChecked && (
                    <Feather name="check-circle" size={16} color="#4CAF50" style={styles.icon} />
                  )}
                  {isFamilia && !isSavedTask && (
                    <Feather name="eye-off" size={16} color="#999" style={styles.icon} />
                  )}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default HoursList;