import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

const TaskForm = ({ route, navigation }) => {
  const { month, day, hour, fixedTask } = route.params;
  const { token, selectedPatientId } = useContextProvider();
  const [loading, setLoading] = useState(false);
  const [taskData, setTaskData] = useState({
    descricao: fixedTask || '', // Preenche com a tarefa fixa se existir
    check: false
  });

  // Se for uma tarefa fixa, bloqueia a edição da descrição
  const isFixedTask = !!fixedTask;

  const saveTask = async () => {
    const payload = {
      mes_ano: month,
      dia: day,
      hora: hour,
      check: taskData.check,
      descricao: taskData.descricao,
      usuario_id: selectedPatientId
    };
    
    setLoading(true);
    try {
      await api.post('tarefas', payload, {
        headers: {
          Authorization: `Bearer ${token}`, 
        }
      });
      navigation.navigate('PatientsList');
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
    } finally {
      setLoading(false);
    }
  };

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
      
      <View style={styles.topContainer}>
        <View style={styles.firstContainer}>
          <Text style={styles.title}>
            Tarefa para {day}/{month.split('-')[1]}/{month.split('-')[0]} às {hour}:00
          </Text>
        </View>
      </View>

      <View style={styles.form}>
        <TextInput
          style={[
            styles.input,
            isFixedTask && styles.disabledInput // Estilo para input desabilitado
          ]}
          placeholder="Descrição da tarefa"
          multiline
          value={taskData.descricao}
          onChangeText={(text) => !isFixedTask && setTaskData({...taskData, descricao: text})}
          editable={!isFixedTask}
        />
        
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={styles.checkbox}
            onPress={() => setTaskData({...taskData, check: !taskData.check})}
          >
            {taskData.check && <Feather name="check" size={20} color="green" />}
          </TouchableOpacity>
          <Text style={styles.checkboxLabel}>Concluído</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={saveTask}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.loginButtonText}>Salvar Tarefa</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskForm;