import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const TaskForm = ({ route, navigation }) => {
  const { month, day, hour, fixedTask, dateString } = route.params;
  const { token, selectedPatientId, userIdLogin } = useContextProvider();
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    descricao: fixedTask || "",
    check: false,
  });

  const isFixedTask = !!fixedTask;

  const saveTask = async () => {
    const payload = {
      mes_ano: month, // "2025-06"
      dia: day, // número (ex: 19)
      hora: hour, // número (ex: 12)
      check: taskData.check,
      descricao: taskData.descricao,
      paciente_id: selectedPatientId, // ID do paciente selecionado
      medico_id: 1, // ID do médico logado
    };

    setLoading(true);
    try {
        console.log(payload)
      await api.post("tarefas", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      alert("Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.topContainer}>
        <Text style={styles.title}>
          Tarefa para {day}/{month.split("-")[1]} às {hour}:00
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[styles.input, isFixedTask && styles.disabledInput]}
          placeholder="Descrição da tarefa"
          multiline
          value={taskData.descricao}
          onChangeText={(text) =>
            !isFixedTask && setTaskData({ ...taskData, descricao: text })
          }
          editable={!isFixedTask}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setTaskData({ ...taskData, check: !taskData.check })}
          >
            {taskData.check && <Feather name="check" size={20} color="green" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Concluído</Text>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={saveTask}
          disabled={loading} // Removida a restrição para tarefas fixas
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>
              Salvar Tarefa
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskForm;