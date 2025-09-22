import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const ConsultationsList = ({ navigation }) => {
  const [consultations, setConsultations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, user } = useContextProvider();

  // Variável para controle de permissão de gerenciamento
  const canManageConsultations = user?.role === 'profissional' || user?.role === 'admin';

  const fetchConsultations = async () => {
    try {
      setLoading(true); // Garante que o loading seja exibido a cada nova busca
      let endpoint;
      
      // LÓGICA ATUALIZADA PARA OS 3 PERFIS DE USUÁRIO
      if (user?.role === 'admin') {
        // Admin vê todas as consultas do sistema
        endpoint = '/consultas';
      } else if (user?.role === 'profissional') {
        // Profissional vê apenas as suas consultas
        endpoint = `medicos/${user.id}/consultas`;
      } else {
        // Família vê apenas as suas consultas
        endpoint = `pacientes/${user.id}/consultas`;
      }

      const response = await api.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setConsultations(response.data);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      if (error.response?.status === 401) {
        navigation.navigate("Login");
      } else {
        alert("Erro ao carregar consultas. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Re-busca os dados toda vez que a tela recebe foco para mantê-la atualizada
    const unsubscribe = navigation.addListener('focus', () => {
      fetchConsultations();
    });
    
    return unsubscribe;
  }, [navigation, token, user]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString("pt-BR") +
      " " +
      date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    );
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

  const renderFamilyOrDoctorInfo = (item) => {
    // ATUALIZADO: Lógica de exibição para os 3 perfis
    if (user?.role === 'admin') {
      return (
        <>
          <Text style={styles.doctorText}>
            Profissional: {item.Medico?.nome || "N/A"}
          </Text>
          <Text style={styles.familyText}>
            Paciente: {item.Familia?.nome || "N/A"}
          </Text>
        </>
      );
    }
    if (user?.role === 'profissional') {
      return (
        <Text style={styles.familyText}>
          Paciente: {item.Familia?.nome || "Nome não disponível"}
        </Text>
      );
    } else {
      return (
        <Text style={styles.doctorText}>
          Médico: {item.Medico?.nome || "Nome não disponível"}
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        {/* ATUALIZADO: Botão de adicionar visível para profissional e admin */}
        {canManageConsultations && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddConsultation")}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.pageTitle}>
        {/* ATUALIZADO: Título dinâmico com base no perfil */}
        {user?.role === 'admin' ? "Todas as Consultas" : (user?.role === 'profissional' ? "Minhas Consultas" : "Consultas da Família")}
      </Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : consultations.length === 0 ? (
          <Text style={styles.emptyMessage}>Nenhuma consulta encontrada</Text>
        ) : (
          <FlatList
            data={consultations}
            keyExtractor={(item) => String(item.consulta_id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("ConsultationDetails", {
                    consulta_id: item.consulta_id,
                  })
                }
              >
                <View style={styles.itemHeader}>
                  <Text style={styles.title}>{item.descricao}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {item.status.toUpperCase()}
                    </Text>
                  </View>
                </View>

                {renderFamilyOrDoctorInfo(item)}

                <View style={styles.dateContainer}>
                  <Feather name="calendar" size={14} color="#385b3e" />
                  <Text style={styles.dateText}>
                    {formatDate(item.data_agendada)}
                  </Text>
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