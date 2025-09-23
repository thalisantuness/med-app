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
  const {
    month,
    day,
    hour,
    dateString,
    savedTask,
  } = route.params;
  const { token, selectedPatientId, user } = useContextProvider();
  const [loading, setLoading] = useState(false);

  const [taskData, setTaskData] = useState(
    savedTask
      ? {
          descricao: savedTask.descricao,
          check: savedTask.check,
          tarefa_id: savedTask.tarefa_id,
        }
      : {
          descricao: "",
          check: false,
        }
  );

  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showFinalConfirmationModal, setShowFinalConfirmationModal] = useState(false);
  const [showCreateForAllModal, setShowCreateForAllModal] = useState(false);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isSavedTask = !!savedTask;
  const canManageTasks = user?.role === "profissional" || user?.role === "admin";
  const isFamilia = user?.role === "familia";

  if (isFamilia && !isSavedTask) {
    navigation.goBack();
    return null;
  }

  const updateAllTasks = async () => {
    try {
      // 1. Busca todas as tarefas que correspondem aos critérios para saber seus IDs
      const allTasksResponse = await api.get(`/medicos/${user.id}/tarefas`, {
        params: { mes_ano: month, dia: day, hora: hour },
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filtra para garantir que estamos atualizando apenas a tarefa com a mesma descrição original
      const tasksToUpdate = allTasksResponse.data.filter(
        (task) => task.descricao === savedTask.descricao
      );
      if (tasksToUpdate.length === 0) throw new Error("Nenhuma tarefa correspondente encontrada para atualizar.");
      const updatePromises = tasksToUpdate.map((task) => {
        const updatePayload = { ...task, check: taskData.check };
        return api.put(`/tarefas/${task.tarefa_id}`, updatePayload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      });

      // 3. Executa todas as atualizações
      await Promise.all(updatePromises);

    } catch (error) {
      console.error("Erro ao atualizar todas as tarefas:", error);
      throw error;
    }
  };

  const saveTask = async (forAllFamilies = false) => {
    setLoading(true);
    try {
      if (forAllFamilies) {
        if (isSavedTask) {
          await updateAllTasks();
        } else {
          const payload = {
            mes_ano: month, dia: day, hora: hour, check: taskData.check,
            descricao: taskData.descricao, medico_id: user.id, paciente_id: null,
          };
          await api.post("/tarefas/todas-familias", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      } else {
        // Lógica para paciente único
        if (!selectedPatientId || !user.id) {
            Alert.alert("Erro", "Paciente ou profissional não identificado. Por favor, selecione o paciente novamente.");
            setLoading(false);
            return;
        }
        
        const payload = {
          mes_ano: month, dia: day, hora: hour, check: taskData.check,
          descricao: taskData.descricao, medico_id: user.id, paciente_id: selectedPatientId,
        };
        
        console.log("Enviando payload para API:", payload); 

        if (isSavedTask) {
          await api.put(`/tarefas/${taskData.tarefa_id}`, payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          await api.post("/tarefas", payload, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }
      }

      // Navega de volta com flag de atualização
      navigation.navigate("HoursList", {
        month, day, dateString, shouldRefresh: true,
      });
    } catch (error) {
      console.error("Erro ao salvar tarefa:", error.response?.data || error);
      Alert.alert("Erro", error.response?.data?.error || "Erro ao salvar tarefa. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  // IMPLEMENTAÇÃO: Função de exclusão simplificada, sem parâmetros
  const handleDelete = async () => {
    setLoading(true);
    setShowDeleteModal(false); 
    try {
        await api.delete(`/tarefas/${taskData.tarefa_id}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        Alert.alert("Sucesso", "Tarefa excluída com sucesso.");
        navigation.navigate("HoursList", {
            month, day, dateString, shouldRefresh: true,
        });
    } catch (error) {
        console.error("Erro ao excluir tarefa:", error.response?.data || error);
        Alert.alert("Erro", "Erro ao excluir a tarefa. Tente novamente.");
    } finally {
        setLoading(false);
    }
  };

  const handleSavePress = () => {
    const wasJustChecked = taskData.check && (!savedTask || !savedTask.check);

    if (canManageTasks && !isSavedTask) {
      setShowCreateForAllModal(true);
      return;
    }

    if (canManageTasks && wasJustChecked) {
      setShowConfirmationModal(true);
      return;
    }
    saveTask(false);
  };

  const handleConfirmForAll = () => {
    setShowConfirmationModal(false);
    setShowFinalConfirmationModal(true);
  };

  const handleFinalConfirm = () => {
    setShowFinalConfirmationModal(false);
    saveTask(true);
  };
  
  const isDescricaoEditable = canManageTasks;
  const isCheckboxEditable = canManageTasks;
  const showSaveButton = canManageTasks;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
        
        {canManageTasks && isSavedTask && (
            <TouchableOpacity onPress={() => setShowDeleteModal(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                <Feather name="trash-2" size={16} color="red" />
                <Text style={[styles.backText, {color: 'red', marginLeft: 4}]}>Excluir</Text>
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
          style={[styles.input, !isDescricaoEditable && styles.disabledInput]}
          placeholder="Descrição da tarefa"
          multiline
          value={taskData.descricao}
          onChangeText={(text) =>
            setTaskData({ ...taskData, descricao: text })
          }
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

      {canManageTasks && (
        <>
          {/* Modais de Salvar/Atualizar */}
          <Modal
            transparent={true}
            visible={showCreateForAllModal}
            onRequestClose={() => setShowCreateForAllModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Salvar Tarefa</Text>
                <Text style={styles.modalText}>
                  Deseja salvar esta tarefa para todos os pacientes ou apenas
                  para o paciente atual?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowCreateForAllModal(false);
                      saveTask(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Apenas este</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={() => {
                      setShowCreateForAllModal(false);
                      setShowFinalConfirmationModal(true);
                    }}
                  >
                    <Text style={styles.modalButtonText}>Para todos</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>

          <Modal
            transparent={true}
            visible={showConfirmationModal}
            onRequestClose={() => setShowConfirmationModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Atenção</Text>
                <Text style={styles.modalText}>
                  Quer marcar esta tarefa como concluída para todos os
                  pacientes?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => {
                      setShowConfirmationModal(false);
                      saveTask(false);
                    }}
                  >
                    <Text style={styles.modalButtonText}>
                      Não, apenas este
                    </Text>
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
                  Tem certeza que deseja aplicar esta ação para TODOS os
                  pacientes?
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

          <Modal
            transparent={true}
            visible={showDeleteModal}
            onRequestClose={() => setShowDeleteModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Excluir Tarefa</Text>
                <Text style={styles.modalText}>
                  Tem certeza que deseja excluir esta tarefa? Esta ação não pode ser desfeita.
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setShowDeleteModal(false)}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, {backgroundColor: 'red'}]}
                    onPress={handleDelete}
                  >
                    <Text style={styles.modalButtonText}>Sim, excluir</Text>
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

