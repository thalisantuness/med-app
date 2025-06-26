import React, { useState } from "react";
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
  const { month, day, hour, fixedTask, dateString, savedTask, isEditing: initialEditing = false } = route.params;
  const { token, selectedPatientId, user } = useContextProvider();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(initialEditing);
  const [taskData, setTaskData] = useState(savedTask ? {
    descricao: savedTask.descricao,
    check: savedTask.check,
    tarefa_id: savedTask.tarefa_id
  } : {
    descricao: fixedTask || "",
    check: false
  });

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalConfirmationModal, setShowFinalConfirmationModal] = useState(false);

  const isFixedTask = !!fixedTask;
  const isSavedTask = !!savedTask;
  const isMedico = user?.role === 'medico';
  const isFamilia = user?.role === 'familia';

  // Se for família e não tiver tarefa salva, volta para lista
  if (isFamilia && !isSavedTask) {
    navigation.goBack();
    return null;
  }

  const saveTask = async (forAllFamilies = false) => {
    const payload = {
      mes_ano: month,
      dia: day,
      hora: hour,
      check: taskData.check,
      descricao: taskData.descricao,
      paciente_id: forAllFamilies ? null : selectedPatientId,
      medico_id: user.id,
    };

    setLoading(true);
    try {
      if (isSavedTask && isEditing) {
        await api.put(`/tarefas/${taskData.tarefa_id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsEditing(false);
      } else if (forAllFamilies) {
        await api.post("tarefas/todas-familias", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await api.post("tarefas", payload, {
          headers: { Authorization: `Bearer ${token}` },
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

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = () => {
    if (isFixedTask && taskData.check && isMedico) {
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
    saveTask(true);
  };

  // Determina se os campos devem estar editáveis
  const isDescricaoEditable = isMedico && (isEditing || !isSavedTask) && !isFixedTask;
  const isCheckboxEditable = isMedico && (isEditing || !isSavedTask); // Checkbox editável em edição OU para novas tarefas
  const showSaveButton = isMedico && (isEditing || !isSavedTask);
  const showEditButton = isMedico && isSavedTask && !isEditing;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        
        {showEditButton && (
          <TouchableOpacity onPress={handleEditPress}>
            <Feather name="edit" size={16} color="black" />
            <Text style={styles.backText}>Editar</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.topContainer}>
        <Text style={styles.title}>
          Tarefa para {day}/{month.split("-")[1]} às {hour}:00
        </Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input, 
            !isDescricaoEditable && styles.disabledInput
          ]}
          placeholder="Descrição da tarefa"
          multiline
          value={taskData.descricao}
          onChangeText={(text) => setTaskData({...taskData, descricao: text})}
          editable={isDescricaoEditable}
        />

        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => {
              if (isCheckboxEditable) {
                setTaskData({ ...taskData, check: !taskData.check });
              }
            }}
            disabled={!isCheckboxEditable}
          >
            {taskData.check && <Feather name="check" size={20} color="green" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Concluído</Text>
        </View>

        {showSaveButton && (
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSavePress}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>
                {isSavedTask ? "Atualizar Tarefa" : "Salvar Tarefa"}
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      {isMedico && (
        <>
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
                      saveTask(false);
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
        </>
      )}
    </View>
  );
};

export default TaskForm;