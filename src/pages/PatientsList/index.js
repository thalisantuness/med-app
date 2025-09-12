import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  Linking
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const PatientsList = ({ navigation }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, setSelectedPatientId, user } = useContextProvider();

  const socialLinks = {
    site: "https://clinicacleuzacanan.com.br/",
    instagram: "https://www.instagram.com/clinicacleuzacanan",
    youtube: "https://www.youtube.com/@clinicacleuzacanan",
    whatsapp: "https://wa.link/mfkdqi"
  };

  const openURL = (url) => {
    Linking.openURL(url).catch(err => console.error('Erro ao abrir link:', err));
  };

  const fetchPatients = async () => {
    setLoading(true);
    try {
      let response;
      
      if (user?.role === 'familia') {
        // Se for família, busca apenas os próprios dados
        response = await api.get(`usuarios/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Transforma o único usuário em um array para manter a mesma estrutura
        setPatients([response.data]);
      } else {
        // Se for médico, busca todos os pacientes
        response = await api.get("usuarios/pacientes", {
          headers: { Authorization: `Bearer ${token}` },
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
      if (token) {
        fetchPatients();
      }
    });

    if (token) {
      fetchPatients();
    }

    return unsubscribe;
  }, [navigation, token, user]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <Text style={styles.pageTitle}>
        {user?.role === 'familia' ? 'Diário' : 'Selecione o paciente'}
      </Text>

      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#385b3e" />
        ) : (
          <>
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
                      name={user?.role === 'familia' ? 'calendar' : 'user'}
                      size={20}
                      color="#385b3e"
                      style={styles.userIcon}
                    />
                    <Text style={styles.patientName}>
                      {user?.role === 'familia' ? 'Calendário de atividades' : item.nome}
                    </Text>
                  </View>
                  {user?.role === 'medico' && (
                    <Feather name="chevron-right" size={20} color="#385b3e" />
                  )}
                </TouchableOpacity>
              )}
            />

            {/* Seção de redes sociais apenas para familia */}
            {user?.role === 'familia' && (
              <View style={styles.socialSection}>
                <Text style={styles.socialTitle}>Acompanhe a Clínica</Text>

                {/* Links de Cima */}
                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.socialButton, styles.siteButton]}
                    onPress={() => openURL(socialLinks.site)}
                  >
                    <Feather name="globe" size={20} color="white" />
                    <Text style={styles.socialButtonText}>Site</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.socialButton, styles.whatsappButton]}
                    onPress={() => openURL(socialLinks.whatsapp)}
                  >
                    <Feather name="message-circle" size={20} color="white" />
                    <Text style={styles.socialButtonText}>WhatsApp</Text>
                  </TouchableOpacity>
                </View>

                {/* Links de Baixo */}
                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.socialButton, styles.youtubeButton]}
                    onPress={() => openURL(socialLinks.youtube)}
                  >
                    <Feather name="youtube" size={20} color="white" />
                    <Text style={styles.socialButtonText}>YouTube</Text>
                  </TouchableOpacity>


                  <TouchableOpacity
                    style={[styles.socialButton, styles.instagramButton]}
                    onPress={() => openURL(socialLinks.instagram)}
                  >
                    <Feather name="instagram" size={20} color="white" />
                    <Text style={styles.socialButtonText}>Instagram</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

export default PatientsList;