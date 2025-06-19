import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, StatusBar, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const IndicatorsList = ({ navigation }) => {
  const [isSearchFocused, setSearchFocused] = useState(false);
  const [indicators, setIndicators] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para o indicador de carregamento
  const { isAdmin, token } = useContextProvider();

  async function fetchIndicators() {
    try {
      const response = await api.get('usuarios', {   
          headers: {
            Authorization: `Bearer ${token}`, 
          }  
      });
      const filteredIndications = response.data.filter(user => !user.admin);
      setIndicators(filteredIndications);
      console.log('Indicators:', filteredIndications);
    } catch (error) {
      console.error('Error fetching indications:', error);
    } finally {
      setLoading(false); 
    }
  }

  useEffect(() => {
    fetchIndicators();
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
          onPress={() => navigation.navigate('Home')}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.addUserButton}
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.addText}>Adicionar usuário</Text>
          <Feather name="plus" size={16} color="white" />
        </TouchableOpacity>
        
      </View>
      <Text style={styles.pageTitle}>Usuários</Text>
      <View style={styles.content}>
        <View style={styles.sectionContainer}>
          {loading ? (
            <ActivityIndicator size="large" color="#000000" />
          ) : (
            <FlatList
              data={indicators}
              keyExtractor={(item, index) => String(item.usuario_id)}
              renderItem={({ item }) => (
                <View style={styles.item}>
                  <Text style={styles.title}>{item.nome}</Text>
                  <Text style={styles.date}>Email: {item.email}</Text>
                  <Text style={styles.date}>Pontos: {item.pontos}</Text>
                  <TouchableOpacity style={styles.givePointsButton}  onPress={() => navigation.navigate('PointsAdd', { usuarioId: item.usuario_id })}>
                    <Text style={styles.givePointsText}>Dar pontos</Text>
                      <Feather
                        name="plus"
                        size={20}
                        color="white"
                       
                      />
                    </TouchableOpacity>
                  {/* {isAdmin && (
                    <TouchableOpacity>
                      <Feather
                        name="trash"
                        size={30}
                        color="#000000"
                        onPress={() => handleDelete(item.id)}
                      />
                    </TouchableOpacity>
                  )} */}
                </View>
              )}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default IndicatorsList;
