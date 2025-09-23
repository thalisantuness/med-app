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

  const [hours] = useState(Array.from({ length: 17 }, (_, i) => i + 7));

  const fetchTasks = async () => {
    try {
      setLoading(true);

      // Define para qual paciente estamos buscando as tarefas.
      // Se for profissional/admin, usa o ID do paciente selecionado.
      // Se for família, usa o próprio ID do usuário.
      const pacienteIdParaBuscar = (user?.role === 'profissional' || user?.role === 'admin') 
        ? selectedPatientId 
        : user.id;

      if (!pacienteIdParaBuscar) {
        setSavedTasks([]); // Limpa as tarefas se nenhum paciente estiver selecionado
        setLoading(false);
        return;
      }
      
      // CORREÇÃO: A rota agora é sempre focada no paciente,
      // garantindo que todas as tarefas dele sejam exibidas para qualquer profissional.
      const response = await api.get(`/pacientes/${pacienteIdParaBuscar}/tarefas`, {
        params: {
          dia: day,
          mes_ano: month
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
    const unsubscribe = navigation.addListener('focus', () => {
      fetchTasks();
    });

    if (route.params?.shouldRefresh) {
      fetchTasks();
      navigation.setParams({ shouldRefresh: false });
    }

    fetchTasks();

    return unsubscribe;
  }, [navigation, route.params?.shouldRefresh, month, day, selectedPatientId, token, user]);

  const getTaskDescription = (hour) => {
    const savedTask = savedTasks.find(task => task.hora === hour);
    return savedTask ? savedTask.descricao : null;
  };

  const getTaskStatus = (hour) => {
    const savedTask = savedTasks.find(task => task.hora === hour);
    return savedTask ? savedTask.check : false;
  };

  const hasTask = (hour) => {
    return getTaskDescription(hour) !== null;
  };

  const handleItemPress = (hour) => {
    const savedTask = savedTasks.find(task => task.hora === hour);
    const isSavedTask = !!savedTask;

    if (user?.role === 'familia' && !isSavedTask) {
      return;
    }

    navigation.navigate("TaskForm", {
      month,
      day: parseInt(day),
      hour,
      dateString,
      savedTask, 
      isEditing: !isSavedTask, 
    });
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
            const isSavedTask = savedTasks.some(task => task.hora === item);
            const isChecked = getTaskStatus(item);
            const isFamilia = user?.role === 'familia';
            const canManage = user?.role === 'profissional' || user?.role === 'admin';
            const isClickable = canManage || (isFamilia && isSavedTask);


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
                  {isSavedTask && isChecked && (
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
