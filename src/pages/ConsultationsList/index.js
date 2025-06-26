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

  const fetchConsultations = async () => {
    try {
      let endpoint;
      
      if (user?.role === 'medico') {
        endpoint = `medicos/${user.id}/consultas`;
      } else {
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
        // Mostrar mensagem de erro para o usuário
        alert("Erro ao carregar consultas. Tente novamente mais tarde.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
    if (user?.role === 'medico') {
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
        {user?.role === 'medico' && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate("AddConsultation")}
          >
            <Feather name="plus" size={20} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <Text style={styles.pageTitle}>
        {user?.role === 'medico' ? "Minhas Consultas" : "Consultas da Família"}
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