import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const RequestList = ({ navigation }) => {
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true); 
  const { isAdmin, token } = useContextProvider();

  async function fetchRequests() {
    try {
      const response = await api.get('solicitacoes',
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }

      ); 
      console.log(response.data);
      setRequests(response.data);
      console.log('Indications:', response.data);
    } catch (error) {
      console.error('Error fetching indications:', error);
    } finally {
      setLoading(false); 
    }
  }


  const handleAcceptRequest = async (solicitacao_id, usuario_id_terceiro) => {


    try {
      const response = await api.put(
        `solicitacoes/processar/${solicitacao_id}`, 
        {
          decisao: "aceita",
          usuario_id_terceiro: usuario_id_terceiro,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, 
          },
        }
      );
  
      if (response.status === 200) {
        const successMessage = response.data.message 
        Alert.alert("Aviso", successMessage);
        fetchRequests();
      }
    } catch (error) {
      console.error("Erro ao aceitar solicitação:", error);
      Alert.alert("Erro", "Não foi possível aceitar a solicitação.");
    }
  };


  const handleRejectRequest = async (solicitacao_id) => {
    console.log("Solicitação ID:", solicitacao_id); 
    console.log("Token:", token);
  
    try {
      const response = await api.put(
        `solicitacoes/processar/${solicitacao_id}`,
        {
          decisao: "rejeitada",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 200) {
        Alert.alert("Sucesso", "A solicitação foi rejeitada com sucesso!");
        fetchRequests(); 
      }
    } catch (error) {
      console.error("Erro ao rejeitar solicitação:", error.response || error);
      Alert.alert("Erro", "Não foi possível rejeitar a solicitação.");
    }
  };
  

  useEffect(() => {
    fetchRequests();
  }, []); 

  const onFocusSearch = () => {
    setSearchFocused(true);
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Rewards')}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.pageTitle}>Solicitações de recompensas</Text>
      <View style={styles.content}>
        <View style={styles.sectionContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            <FlatList
              data={requests}
              keyExtractor={(item, index) => String(item.id)}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.title}>{item.recompensa.nome}</Text>
                    <Text style={styles.title_name}>{item.usuario.nome}</Text>
                    <Text style={styles.title_status}>{item.status}</Text>
                    <Text style={styles.date}>Indicado em: {new Date(item.data_solicitacao).toLocaleDateString()}</Text>
                  </View>
                  <View style={styles.itemActions}>
                  {isAdmin === "admin" && (
                    <TouchableOpacity
                    style={styles.consolidationButton}
                    onPress={() => handleAcceptRequest(item.solicitacao_id, item.usuario_id)}
                      >
                    <Text style={styles.consolidationButtonText}>Aceitar</Text>
                    </TouchableOpacity>
                  )}

                  {isAdmin === "admin" && (
                     <TouchableOpacity
                     style={[styles.consolidationButton, { backgroundColor: "red" }]} 
                     onPress={() => handleRejectRequest(item.solicitacao_id)}
                   >
                     <Text style={styles.consolidationButtonText}>Recusar</Text>
                   </TouchableOpacity>
                    )}
                  </View>
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default RequestList;