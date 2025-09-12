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

  // Links das redes sociais
  const socialLinks = {
    instagram: "https://www.instagram.com/suaconta",
    facebook: "https://www.facebook.com/suapagina",
    whatsapp: "https://wa.me/5511999999999"
  };

  const openSocialMedia = (url) => {
    Linking.openURL(url).catch(err => console.error('Erro ao abrir link:', err));
  };

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
                <Text style={styles.socialTitle}>Acompanhe-nos nas redes sociais</Text>
                
                <View style={styles.socialButtonsContainer}>
                  {/* Botão Instagram */}
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.instagramButton]}
                    onPress={() => openSocialMedia(socialLinks.instagram)}
                  >
                    <Feather name="instagram" size={24} color="white" />
                    <Text style={styles.socialButtonText}>Instagram</Text>
                  </TouchableOpacity>

                  {/* Botão Facebook */}
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.facebookButton]}
                    onPress={() => openSocialMedia(socialLinks.facebook)}
                  >
                    <Feather name="facebook" size={24} color="white" />
                    <Text style={styles.socialButtonText}>Facebook</Text>
                  </TouchableOpacity>

                  {/* Botão WhatsApp */}
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.whatsappButton]}
                    onPress={() => openSocialMedia(socialLinks.whatsapp)}
                  >
                    <Feather name="message-circle" size={24} color="white" />
                    <Text style={styles.socialButtonText}>WhatsApp</Text>
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