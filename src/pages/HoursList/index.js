import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import api from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";

const HoursList = ({ route, navigation }) => {
  const { month, day, dateString } = route.params;
  const [year, monthNum] = month.split('-');
  const { token, selectedPatientId } = useContextProvider();
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

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await api.get(`/medicos/1/pacientes/${selectedPatientId}/tarefas`, {
          params: { mes_ano: month, dia: day },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSavedTasks(response.data);
      } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [month, day, selectedPatientId, token]);

  const getTaskDescription = (hour) => {
    // Verifica se há uma tarefa salva para este horário
    const savedTask = savedTasks.find(task => task.hora === hour);
    if (savedTask) return savedTask.descricao;
    
    // Se não houver tarefa salva, verifica se é uma tarefa fixa
    return fixedTasks[hour] || null;
  };

  const hasTask = (hour) => {
    return getTaskDescription(hour) !== null;
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
        <TouchableOpacity onPress={() => navigation.goBack()}>
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

            return (
              <TouchableOpacity
                style={[
                  styles.item,
                  hasTask(item) && styles.fixedTaskItem,
                ]}
                onPress={() =>
                  navigation.navigate("TaskForm", {
                    month,
                    day: parseInt(day),
                    hour: item,
                    fixedTask: isFixedTask ? fixedTasks[item] : null,
                    dateString,
                  })
                }
              >
                <Text style={styles.title}>
                  {item}:00 {description && `- ${description}`}
                </Text>
                {isFixedTask && (
                  <Feather name="lock" size={16} color="#385b3e" />
                )}
                {isSavedTask && !isFixedTask && (
                  <Feather name="check-circle" size={16} color="#385b3e" />
                )}
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

export default HoursList;