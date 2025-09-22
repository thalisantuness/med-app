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
  Keyboard,
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
  const [loadingMedicos, setLoadingMedicos] = useState(false);
  
  const [formData, setFormData] = useState({
    descricao: "",
    data_agendada: "",
    status: "agendada",
    familia_id: null,
    medico_id: null,
  });

  const [patients, setPatients] = useState([]);
  const [medicos, setMedicos] = useState([]);
  const [date, setDate] = useState(new Date());
  
  // Estados separados para o seletor de data
  const [showDateTimePicker, setShowDateTimePicker] = useState(false); // Para iOS
  const [showDatePicker, setShowDatePicker] = useState(false); // Para data no Android
  const [showTimePicker, setShowTimePicker] = useState(false); // Para hora no Android

  const { token, user } = useContextProvider();
  const isAdmin = user?.role === 'admin';

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
      const response = await api.get("/usuarios/pacientes", { headers: { Authorization: `Bearer ${token}` } });
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
      Alert.alert("Erro", "Erro ao carregar pacientes. Tente novamente mais tarde.");
    } finally {
      setLoadingPatients(false);
    }
  };
  
  const fetchMedicos = async () => {
    if (!isAdmin) return;
    try {
      setLoadingMedicos(true);
      const response = await api.get("/usuarios/medicos", { headers: { Authorization: `Bearer ${token}` } });
      setMedicos(response.data);
    } catch (error) {
      console.error("Error fetching medicos:", error);
      Alert.alert("Erro", "Erro ao carregar profissionais.");
    } finally {
      setLoadingMedicos(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchPatients();
      fetchMedicos();
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

  const adjustMinutes = (selectedDate) => {
    const newDate = new Date(selectedDate);
    const minutes = newDate.getMinutes();
    if (minutes > 0 && minutes < 30) {
      newDate.setMinutes(30);
    } else if (minutes > 30) {
      newDate.setMinutes(0);
      newDate.setHours(newDate.getHours() + 1);
    }
    newDate.setSeconds(0);
    return newDate;
  };

  // Handler para iOS (tudo de uma vez)
  const onChangeDateTime = (event, selectedDate) => {
    setShowDateTimePicker(false);
    if (event.type === 'set' && selectedDate) {
      const adjusted = adjustMinutes(selectedDate);
      setDate(adjusted);
      setFormData(prev => ({...prev, data_agendada: formatDateToAPI(adjusted)}));
    }
  };

  // Handlers para Android (em duas etapas)
  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentDate = new Date(date);
      currentDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDate(currentDate);
      setShowTimePicker(true); // Abre o seletor de hora
    }
  };

  const onChangeTime = (event, selectedDate) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedDate) {
      const currentDate = new Date(date);
      currentDate.setHours(selectedDate.getHours(), selectedDate.getMinutes(), 0, 0);
      const adjusted = adjustMinutes(currentDate);
      setDate(adjusted);
      setFormData(prev => ({...prev, data_agendada: formatDateToAPI(adjusted)}));
    }
  };

  const showPickerModal = () => {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
      setShowDatePicker(true);
    } else {
      setShowDateTimePicker(true);
    }
  };

  const handleSave = async () => {
    Keyboard.dismiss();
    setLoading(true);
    try {
      const payload = {
        medico_id: isAdmin ? formData.medico_id : user.id,
        familia_id: formData.familia_id,
        data_agendada: formData.data_agendada,
        descricao: formData.descricao,
        status: "agendada"
      };

      if (!payload.medico_id || !payload.familia_id || !payload.descricao) {
          Alert.alert("Atenção", "Por favor, preencha a descrição, o profissional e o paciente.");
          setLoading(false);
          return;
      }

      await api.post("/consultas", payload, { headers: { Authorization: `Bearer ${token}` } });
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

          {isAdmin && (
            <>
              <Text style={styles.label}>Profissional</Text>
              {loadingMedicos ? <ActivityIndicator size="small" color="#385b3e" /> : (
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={formData.medico_id}
                    onValueChange={(itemValue) => setFormData({ ...formData, medico_id: itemValue })}
                  >
                    <Picker.Item label="Selecione um profissional" value={null} />
                    {medicos.map((medico) => (
                      <Picker.Item key={medico.usuario_id} label={medico.nome} value={medico.usuario_id} />
                    ))}
                  </Picker>
                </View>
              )}
            </>
          )}
          
          <Text style={styles.label}>Paciente</Text>
          {loadingPatients ? <ActivityIndicator size="small" color="#385b3e" /> : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.familia_id}
                onValueChange={(itemValue) => setFormData({ ...formData, familia_id: itemValue })}
              >
                <Picker.Item label="Selecione um paciente" value={null} />
                {patients.map((patient) => (
                  <Picker.Item key={patient.usuario_id} label={patient.nome} value={patient.usuario_id} />
                ))}
              </Picker>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.loginButton,
              (!formData.familia_id || !formData.descricao || !formData.data_agendada) && styles.disabledButton,
            ]}
            onPress={handleSave}
            disabled={loading || !formData.familia_id || !formData.descricao || !formData.data_agendada}
          >
            {loading ? <ActivityIndicator color="white" /> : <Text style={styles.loginButtonText}>Agendar Consulta</Text>}
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Pickers para Android */}
      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={date}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      {/* Picker para iOS */}
      {showDateTimePicker && Platform.OS === 'ios' && (
        <DateTimePicker
          value={date}
          mode="datetime"
          display="spinner"
          onChange={onChangeDateTime}
          minimumDate={new Date()}
          minuteInterval={30}
        />
      )}
    </View>
  );
};

export default AddConsultation;