import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  Switch,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../../services/api";
import styles from "./styles";
import { useNavigation } from "@react-navigation/native";
import { useContextProvider } from "../../context/AuthContext";

const ConsultationDetails = ({ route }) => {
  const { consulta_id } = route.params;
  const navigation = useNavigation();
  const { token, user } = useContextProvider();
  const [consultation, setConsultation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [rescheduleModalVisible, setRescheduleModalVisible] = useState(false);
  const [newDate, setNewDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    realizada: false,
    data_agendada: "",
    medico_id: null,
    familia_id: null,
  });

  const isMedico = user?.role === 'medico';

  const fetchConsultationDetails = async () => {
    try {
      const response = await api.get(`consultas/${consulta_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConsultation(response.data);
      setFormData({
        descricao: response.data.descricao,
        realizada: response.data.status === "realizada",
        data_agendada: response.data.data_agendada,
        medico_id: response.data.medico_id,
        familia_id: response.data.familia_id
      });
    } catch (error) {
      console.error("Erro ao buscar detalhes da consulta:", error);
      if (error.response?.status === 401) {
        Alert.alert("Sessão expirada", "Por favor, faça login novamente");
        navigation.navigate('Login');
      } else {
        Alert.alert("Erro", "Não foi possível carregar os detalhes da consulta");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchConsultationDetails();
    });
    return unsubscribe;
  }, [navigation, token]);

  const handleDelete = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta consulta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            try {
              await api.delete(`consultas/${consulta_id}`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              Alert.alert("Sucesso", "Consulta excluída com sucesso");
              navigation.goBack();
            } catch (error) {
              console.error("Erro ao excluir consulta:", error);
              Alert.alert("Erro", "Não foi possível excluir a consulta");
            }
          },
        },
      ]
    );
  };

  const handleUpdate = async () => {
    try {
      const payload = {
        descricao: formData.descricao,
        status: formData.realizada ? "realizada" : "agendada",
        realizada: formData.realizada,
        data_agendada: consultation.data_agendada,
        medico_id: consultation.medico_id,
        familia_id: consultation.familia_id
      };

      await api.put(`consultas/${consulta_id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Sucesso", "Consulta atualizada com sucesso");
      setEditModalVisible(false);
      fetchConsultationDetails();
    } catch (error) {
      console.error("Erro ao atualizar consulta:", error);
      Alert.alert("Erro", "Não foi possível atualizar a consulta");
    }
  };

  const handleReschedule = async () => {
    try {
      const formattedDate = newDate.toISOString().replace("T", " ").split(".")[0];
      await api.put(`consultas/${consulta_id}/remarcar`, {
        nova_data: formattedDate,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Sucesso", "Consulta remarcada com sucesso");
      setRescheduleModalVisible(false);
      fetchConsultationDetails();
    } catch (error) {
      console.error("Erro ao remarcar consulta:", error);
      Alert.alert("Erro", "Não foi possível remarcar a consulta");
    }
  };

  const handleCancel = async () => {
    try {
      await api.put(`consultas/${consulta_id}/cancelar`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      Alert.alert("Sucesso", "Consulta cancelada com sucesso");
      fetchConsultationDetails();
    } catch (error) {
      console.error("Erro ao cancelar consulta:", error);
      Alert.alert("Erro", "Não foi possível cancelar a consulta");
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR", { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "agendada":
        return "#FFA500";
      case "realizada":
        return "#4CAF50";
      case "cancelada":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000000" />
      </View>
    );
  }

  if (!consultation) {
    return (
      <View style={styles.container}>
        <Text>Não foi possível carregar os detalhes da consulta</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Detalhes da Consulta</Text>

      <View style={styles.detailCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Descrição:</Text>
          <Text style={styles.value}>{consultation.descricao}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Status:</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consultation.status) }]}>
            <Text style={styles.statusText}>{consultation.status.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Data agendada:</Text>
          <Text style={styles.value}>{formatDate(consultation.data_agendada)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Médico:</Text>
          <Text style={styles.value}>{consultation.Medico.nome}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Família:</Text>
          <Text style={styles.value}>{consultation.Familia.nome}</Text>
        </View>
      </View>

      {isMedico && (
        <View style={styles.actionsContainer}>
          {consultation.status !== "cancelada" && (
            <>
              <TouchableOpacity 
                style={[styles.actionButton, styles.editButton]}
                onPress={() => setEditModalVisible(true)}
              >
                <Feather name="edit" size={16} color="white" />
                <Text style={styles.actionButtonText}>Editar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.rescheduleButton]}
                onPress={() => {
                  setNewDate(new Date(consultation.data_agendada));
                  setRescheduleModalVisible(true);
                }}
              >
                <Feather name="calendar" size={16} color="white" />
                <Text style={styles.actionButtonText}>Remarcar</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.cancelButton]}
                onPress={handleCancel}
              >
                <Feather name="x-circle" size={16} color="white" />
                <Text style={styles.actionButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => setModalVisible(true)}
          >
            <Feather name="trash-2" size={16} color="white" />
            <Text style={styles.actionButtonText}>Excluir</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal de confirmação de exclusão */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar exclusão</Text>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta consulta?</Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleDelete}
              >
                <Text style={styles.modalButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de edição simplificado */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Editar Consulta</Text>
            
            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Descrição da consulta"
              value={formData.descricao}
              onChangeText={(text) => setFormData({...formData, descricao: text})}
            />

            <View style={styles.switchContainer}>
              <Text style={styles.label}>Consulta realizada?</Text>
              <Switch
                value={formData.realizada}
                onValueChange={(value) => setFormData({...formData, realizada: value})}
                trackColor={{ false: "#767577", true: "#4CAF50" }}
                thumbColor={formData.realizada ? "#fff" : "#f4f3f4"}
              />
            </View>

            {formData.realizada && (
              <>
                <Text style={styles.label}>Data Realizada</Text>
                <TouchableOpacity 
                  style={styles.datePickerButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={styles.datePickerButtonText}>
                    {new Date().toLocaleDateString('pt-BR')}
                  </Text>
                </TouchableOpacity>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleUpdate}
              >
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de remarcação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={rescheduleModalVisible}
        onRequestClose={() => setRescheduleModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Remarcar Consulta</Text>
            
            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {newDate.toLocaleDateString('pt-BR')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.datePickerButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                {newDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </TouchableOpacity>

            {(showDatePicker || showTimePicker) && (
              <DateTimePicker
                value={newDate}
                mode={showDatePicker ? "date" : "time"}
                display="default"
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  setShowTimePicker(false);
                  if (selectedDate) {
                    setNewDate(selectedDate);
                  }
                }}
              />
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={() => setRescheduleModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.modalButton, styles.confirmModalButton]}
                onPress={handleReschedule}
              >
                <Text style={styles.modalButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ConsultationDetails;