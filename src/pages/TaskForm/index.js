import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  Alert,
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
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalConfirmationModal, setShowFinalConfirmationModal] = useState(false);
  const [isSavingForAll, setIsSavingForAll] = useState(false);

  const isFixedTask = !!fixedTask;

  const saveTask = async (forAllFamilies = false) => {
    const payload = {
      mes_ano: month,
      dia: day,
      hora: hour,
      check: taskData.check,
      descricao: taskData.descricao,
      paciente_id: forAllFamilies ? null : selectedPatientId,
      medico_id: 2,
    };

    setLoading(true);
    try {
      if (forAllFamilies) {
        // Chamada para o endpoint de todas as famílias
        await api.post("tarefas/todas-familias", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Chamada normal para uma única tarefa
        await api.post("tarefas", payload, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      navigation.goBack();
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error);
      Alert.alert("Erro", "Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePress = () => {
    if (isFixedTask && taskData.check) {
      setShowConfirmationModal(true);
    } else {
      saveTask();
    }
  };

  const handleConfirmForAll = () => {
    setShowConfirmationModal(false);
    setShowFinalConfirmationModal(true);
  };

  const handleFinalConfirm = () => {
    setShowFinalConfirmationModal(false);
    saveTask(true); // Salva para todas as famílias
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
          onPress={handleSavePress}
          disabled={loading}
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

      {/* Modal de confirmação para todas as famílias */}
      <Modal
        transparent={true}
        visible={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Atenção</Text>
            <Text style={styles.modalText}>
              Quer marcar esta tarefa como concluída para todos os pacientes?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => {
                  setShowConfirmationModal(false);
                  saveTask(false); // Salva apenas para este paciente
                }}
              >
                <Text style={styles.modalButtonText}>Não, apenas este</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmForAll}
              >
                <Text style={styles.modalButtonText}>Sim, para todos</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de confirmação final */}
      <Modal
        transparent={true}
        visible={showFinalConfirmationModal}
        onRequestClose={() => setShowFinalConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmação Final</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja marcar esta tarefa como concluída para TODOS os pacientes?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowFinalConfirmationModal(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleFinalConfirm}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default TaskForm;