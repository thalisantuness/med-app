import { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Platform,
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

  const { token, user } = useContextProvider(); // Alterado para pegar o user completo

  // Ajusta o horário inicial para o próximo intervalo de 30 minutos
  useEffect(() => {
    const now = new Date();
    const minutes = now.getMinutes();
    const adjustedMinutes = minutes < 30 ? 30 : 60;
    now.setMinutes(adjustedMinutes);
    now.setSeconds(0);
    if (adjustedMinutes === 60) now.setHours(now.getHours() + 1);
    setDate(now);
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
      alert("Erro ao carregar pacientes. Tente novamente mais tarde.");
    } finally {
      setLoadingPatients(false);
    }
  };

  useEffect(() => {
    fetchPatients();
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
      // Ajusta os minutos para o intervalo de 30 minutos mais próximo
      const minutes = selectedDate.getMinutes();
      selectedDate.setMinutes(minutes < 30 ? 30 : 0);
      selectedDate.setSeconds(0);
      
      // Limita o horário entre 7h e 20h
      const hours = selectedDate.getHours();
      if (hours < 7) {
        selectedDate.setHours(7);
        selectedDate.setMinutes(0);
      } else if (hours >= 20) {
        selectedDate.setHours(19);
        selectedDate.setMinutes(30);
      }
      
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
        medico_id: user.id, // Usando o ID do médico logado
        familia_id: formData.familia_id,
        data_agendada: formData.data_agendada,
        descricao: formData.descricao,
        status: "agendada" // Adicionando status explicitamente
      };

      await api.post("/consultas", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      navigation.goBack();
    } catch (error) {
      console.error("Error saving consultation:", error);
      alert("Erro ao agendar consulta. Verifique os dados e tente novamente.");
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