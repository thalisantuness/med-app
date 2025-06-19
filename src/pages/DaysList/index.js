import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import styles from "./styles";

const DaysList = ({ route, navigation }) => {
  const { month } = route.params;
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gerar dias do mês
  const generateDays = () => {
    const [year, monthNum] = month.split('-');
    const daysInMonth = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    
    const daysList = [];
    for (let i = 1; i <= daysInMonth; i++) {
      daysList.push(i);
    }
    
    setDays(daysList);
    setLoading(false);
  };

  useEffect(() => {
    generateDays();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.pageTitle}>Dias de {month}</Text>
      
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color="#000000" />
        ) : (
          <FlatList
            data={days}
            keyExtractor={(item) => String(item)}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.item}
                onPress={() => navigation.navigate('HoursList', { month, day: item })}
              >
                <Text style={styles.title}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        )}
      </View>
    </View>
  );
};

export default DaysList;