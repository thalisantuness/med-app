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

const PatientsList = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setSelectedPatientId } = useContextProvider();

  const fetchPatients = async () => {
    try {
      const response = await api.get("pacientes");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    navigation.navigate("TaskDiaryList");
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={16} color="#385b3e" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.pageTitle}>Selecione o paciente</Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#385b3e" />
        ) : (
          <FlatList
            data={patients}
            keyExtractor={(item) => String(item.usuario_id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() => handlePatientSelect(item.usuario_id)}
              >
                <View style={styles.itemContent}>
                  <Feather
                    name="user"
                    size={20}
                    color="#385b3e"
                    style={styles.userIcon}
                  />
                  <Text style={styles.patientName}>{item.nome}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="#385b3e" />
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PatientsList;
