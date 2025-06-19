import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from "../../services/api";
import styles from "./styles";

const ConsultationsList = ({ navigation }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsultations = async () => {
    try {
      const response = await api.get('consultas');
      setConsultations(response.data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'agendada':
        return '#FFA500'; // Laranja
      case 'realizada':
        return '#4CAF50'; // Verde
      case 'cancelada':
        return '#F44336'; // Vermelho
      default:
        return '#9E9E9E'; // Cinza
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

         <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddConsultation')}
        >
          <Feather name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.pageTitle}>Lista de Consultas</Text>
      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <FlatList
            data={consultations}
            keyExtractor={(item) => String(item.consulta_id)}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.title}>{item.descricao}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                    <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                  </View>
                </View>
                
                <Text style={styles.familyText}>Família: {item.Familia.nome}</Text>
                <Text style={styles.doctorText}>Médico: {item.Medico.nome}</Text>
                
                <View style={styles.dateContainer}>
                  <Feather name="calendar" size={14} color="#385b3e" />
                  <Text style={styles.dateText}> {formatDate(item.data_agendada)}</Text>
                </View>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default ConsultationsList;