import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from '@react-native-community/datetimepicker';
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const AddConsultation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(false);
  const [formData, setFormData] = useState({
    descricao: "",
    data_agendada: "",
    status: "agendada",
    familia_id: null,
  });
  const [patients, setPatients] = useState([]);
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const { token, user } = useContextProvider();

  useEffect(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const adjustedMinutes = minutes < 30 ? 30 : 0;
    now.setMinutes(adjustedMinutes);
    now.setSeconds(0);
    if (minutes >= 30) now.setHours(now.getHours() + 1);
    setDate(now);
    setFormData(prev => ({...prev, data_agendada: formatDateToAPI(now)}));
  }, []);

  const fetchPatients = async () => {
    try {
      setLoadingPatients(true);
      const response = await api.get("/usuarios/pacientes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert("Erro", "Erro ao carregar pacientes. Tente novamente mais tarde.");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
    }
  }, [token]);

  const formatDateToAPI = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios');
    
    if (selectedDate) {
      const minutes = selectedDate.getMinutes();
      if (minutes > 0 && minutes < 30) {
        selectedDate.setMinutes(30);
      } else if (minutes > 30) {
        selectedDate.setMinutes(0);
        selectedDate.setHours(selectedDate.getHours() + 1);
      }
      selectedDate.setSeconds(0);
      
      setDate(selectedDate);
      setFormData({...formData, data_agendada: formatDateToAPI(selectedDate)});
    }
  };

  const showPickerModal = () => {
    setShowPicker(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        medico_id: user.id,
        familia_id: formData.familia_id,
        data_agendada: formData.data_agendada,
        descricao: formData.descricao,
        status: "agendada"
      };

      await api.post("/consultas", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving consultation:", error);
      Alert.alert("Erro", "Erro ao agendar consulta. Verifique os dados e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("ConsultationsList")} style={styles.backButton}>
          <Feather name="arrow-left" size={16} color="#385b3e" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topContainer}>
          <Text style={styles.title}>Agendar Nova Consulta</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Descrição da consulta"
            value={formData.descricao}
            onChangeText={(text) => setFormData({ ...formData, descricao: text })}
          />

          <Text style={styles.label}>Data e Hora</Text>
          
          <TouchableOpacity 
            style={[styles.input, {justifyContent: 'center'}]}
            onPress={showPickerModal}
          >
            <Text>
              {date.toLocaleDateString('pt-BR')} às {' '}
              {date.toLocaleTimeString('pt-BR', {hour: '2-digit', minute: '2-digit'})}
            </Text>
          </TouchableOpacity>
          
          {showPicker && (
            <DateTimePicker
              value={date}
              mode="datetime"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={new Date()}
              minuteInterval={30}
              locale="pt-BR"
            />
          )}

          <Text style={styles.label}>Paciente</Text>
          {loadingPatients ? (
            <ActivityIndicator size="small" color="#385b3e" />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.familia_id}
                onValueChange={(itemValue) =>
                  setFormData({ ...formData, familia_id: itemValue })
                }
              >
                <Picker.Item label="Selecione um paciente" value={null} />
                {patients.map((patient) => (
                  <Picker.Item
                    key={patient.usuario_id}
                    label={patient.nome}
                    value={patient.usuario_id}
                  />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!formData.familia_id || !formData.descricao || !formData.data_agendada) &&
                styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={loading || !formData.familia_id || !formData.descricao || !formData.data_agendada}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.loginButtonText}>Agendar Consulta</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddConsultation;