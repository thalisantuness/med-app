import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from "../../services/api";
import styles from "./styles";

const AddConsultation = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    descricao: '',
    data_agendada: '',
    status: 'agendada',
    medico_id: 1,
    familia_id: 1
  });
  const [doctors, setDoctors] = useState([]);
  const [families, setFamilies] = useState([]);

  const fetchDoctorsAndFamilies = async () => {
    try {
      setDoctors([{ usuario_id: 1, nome: "Dr. Renato Oliveira" }]);
      setFamilies([{ usuario_id: 1, nome: "Família Silva" }]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDoctorsAndFamilies();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.post('consultas', formData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header fixo */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.topContainer}>
          <View style={styles.firstContainer}>
            <Text style={styles.title}>Agendar Nova Consulta</Text>
          </View>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Descrição da consulta"
            value={formData.descricao}
            onChangeText={(text) => setFormData({...formData, descricao: text})}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Data e Hora (DD/MM/AAAA HH:MM)"
            value={formData.data_agendada}
            onChangeText={(text) => setFormData({...formData, data_agendada: text})}
            keyboardType="numbers-and-punctuation"
          />

          <Text style={styles.label}>Médico</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.medico_id}
              onValueChange={(itemValue) => setFormData({...formData, medico_id: itemValue})}
            >
              {doctors.map(doctor => (
                <Picker.Item key={doctor.usuario_id} label={doctor.nome} value={doctor.usuario_id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Família</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.familia_id}
              onValueChange={(itemValue) => setFormData({...formData, familia_id: itemValue})}
            >
              {families.map(family => (
                <Picker.Item key={family.usuario_id} label={family.nome} value={family.usuario_id} />
              ))}
            </Picker>
          </View>

          <Text style={styles.label}>Status</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.status}
              onValueChange={(itemValue) => setFormData({...formData, status: itemValue})}
            >
              <Picker.Item label="Agendada" value="agendada" />
              <Picker.Item label="Realizada" value="realizada" />
              <Picker.Item label="Cancelada" value="cancelada" />
            </Picker>
          </View>
          
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={handleSave}
            disabled={loading}
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