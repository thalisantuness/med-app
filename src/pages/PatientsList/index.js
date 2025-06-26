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
  const { token, setSelectedPatientId, user } = useContextProvider();

  const fetchPatients = async () => {
    try {
      let response;
      
      if (user?.role === 'familia') {
        // Se for família, busca apenas os próprios dados
        response = await api.get(`usuarios/${user.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Transforma o único usuário em um array para manter a mesma estrutura
        setPatients([response.data]);
      } else {
        // Se for médico, busca todos os pacientes
        response = await api.get("usuarios/pacientes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPatients(response.data);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      if (error.response?.status === 401) {
        navigation.navigate('Login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePatientSelect = (patientId) => {
    setSelectedPatientId(patientId);
    navigation.navigate("TaskDiaryList");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchPatients();
    });
    return unsubscribe;
  }, [navigation, token, user]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
    

      <Text style={styles.pageTitle}>
        {user?.role === 'familia' ? 'Meu Perfil' : 'Selecione o paciente'}
      </Text>

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
                {user?.role === 'medico' && (
                  <Feather name="chevron-right" size={20} color="#385b3e" />
                )}
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default PatientsList;