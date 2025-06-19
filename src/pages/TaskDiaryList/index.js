import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Calendar } from "react-native-calendars";
import { Feather } from '@expo/vector-icons';
import styles from "./styles";

const TaskDiaryList = ({ navigation }) => {
  const handleDayPress = (day) => {
    // Formata a data no formato que seu sistema espera (YYYY-MM)
    const [year, month, dayOfMonth] = day.dateString.split('-');
    const formattedMonth = `${year}-${month}`;
    
    navigation.navigate('HoursList', { 
      month: formattedMonth, 
      day: dayOfMonth 
    });
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
      </View>
      
      <Text style={styles.pageTitle}>Tarefas Diárias</Text>
      
      <View style={styles.content}>
        <Calendar
          style={styles.calendar}
          theme={{
            textMonthFontSize: 18,
            monthTextColor: "#385b3e",
            todayTextColor: "#cbe6ca", 
            todayBackgroundColor: "#385b3e",
            selectedDayTextColor: "#e8e8e8",
            arrowColor: "#385b3e",
            calendarBackground: "transparent",
            textDayStyle: { color: "#000000" },
          }}
          onDayPress={handleDayPress}
          markedDates={{
            // Você pode adicionar marcações especiais aqui se necessário
          }}
        />
      </View>
    </View>
  );
};

export default TaskDiaryList;