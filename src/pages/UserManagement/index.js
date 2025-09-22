import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import styles from './styles';
import { useContextProvider } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

// O cabeçalho foi movido para fora e agora recebe props para evitar re-renderizações
const ListHeader = ({ 
  navigation, 
  isAdmin, 
  formData, 
  handleInputChange, 
  handleCreateUser, 
  isCreating 
}) => (
  <>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Feather name="arrow-left" size={16} color="#385b3e" />
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
    <Text style={styles.pageTitle}>Gerenciar Usuários</Text>
    
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Adicionar Novo Usuário</Text>
      {isAdmin && (
        <>
          <Text style={styles.label}>Tipo de Usuário</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.role}
              onValueChange={(itemValue) => handleInputChange('role', itemValue)}
            >
              <Picker.Item label="Família" value="familia" />
              <Picker.Item label="Profissional" value="profissional" />
              <Picker.Item label="Admin" value="admin" />
            </Picker>
          </View>
        </>
      )}
      
      {formData.role === 'profissional' && (
        <>
          <Text style={styles.label}>Tipo Profissional</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={formData.profissional_type}
              onValueChange={(itemValue) => handleInputChange('profissional_type', itemValue)}
            >
              <Picker.Item label="Médico(a)" value="medico" />
              <Picker.Item label="Psicólogo(a)" value="psicólogo" />
              <Picker.Item label="Terapeuta" value="terapeuta" />
              <Picker.Item label="Outro" value="outro" />
            </Picker>
          </View>
        </>
      )}
      
      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={formData.nome}
        onChangeText={(text) => handleInputChange('nome', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="CPF"
        value={formData.cpf}
        onChangeText={(text) => handleInputChange('cpf', text)}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={formData.senha}
        onChangeText={(text) => handleInputChange('senha', text)}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleCreateUser} disabled={isCreating}>
        {isCreating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar Usuário</Text>}
      </TouchableOpacity>
    </View>

    <Text style={styles.listTitle}>Usuários Cadastrados</Text>
  </>
);

const UserManagement = () => {
    const navigation = useNavigation();
    const { token, user } = useContextProvider();
    const isAdmin = user?.role === 'admin';
    const isProfissional = user?.role === 'profissional';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        senha: '',
        role: isProfissional ? 'familia' : 'familia',
        profissional_type: 'medico',
    });

    const fetchUsers = async () => {
        try {
            const response = await api.get('/usuarios', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data.filter(u => u.usuario_id !== user.id));
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            Alert.alert('Erro', 'Não foi possível carregar os usuários.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', fetchUsers);
        return unsubscribe;
    }, [navigation, token]);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleCreateUser = async () => {
        if (!formData.nome || !formData.cpf || !formData.senha) {
            Alert.alert('Atenção', 'Por favor, preencha todos os campos obrigatórios.');
            return;
        }
        setIsCreating(true);
        const payload = { ...formData };
        if (payload.role !== 'profissional') {
            delete payload.profissional_type;
        }
        try {
            await api.post('/usuarios', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sucesso', 'Usuário criado com sucesso!');
            setFormData({ 
                nome: '', cpf: '', senha: '', 
                role: isProfissional ? 'familia' : 'familia', 
                profissional_type: 'medico' 
            });
            fetchUsers();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Não foi possível criar o usuário.';
            console.error("Erro ao criar usuário:", error.response?.data || error);
            Alert.alert('Erro', errorMessage);
        } finally {
            setIsCreating(false);
        }
    };
    
    const renderUserItem = ({ item }) => {
        let userRoleLabel = 'Família'; // Valor padrão

        if (item.role === 'profissional') {
            // Capitaliza a primeira letra do tipo de profissional
            userRoleLabel = item.profissional_type?.charAt(0).toUpperCase() + item.profissional_type?.slice(1) || 'Profissional';
        } else if (item.role === 'admin') {
            userRoleLabel = 'Administrador';
        }

        return (
            <View style={styles.userItem}>
                <View>
                    <Text style={styles.userName}>{item.nome}</Text>
                    <Text style={styles.userRole}>{userRoleLabel}</Text>
                </View>
                <Text style={styles.userCpf}>CPF: {item.cpf}</Text>
            </View>
        );
    };

    if (loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#385b3e" style={{ flex: 1 }} />
        </View>
      );
    }
    
    return (
        <View style={styles.container}>
            <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item) => String(item.usuario_id)}
                ListHeaderComponent={
                  <ListHeader 
                    navigation={navigation}
                    isAdmin={isAdmin}
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleCreateUser={handleCreateUser}
                    isCreating={isCreating}
                  />
                }
                ListEmptyComponent={() => (
                  <>
                    <ListHeader 
                      navigation={navigation}
                      isAdmin={isAdmin}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleCreateUser={handleCreateUser}
                      isCreating={isCreating}
                    />
                    <Text style={styles.emptyListText}>Nenhum usuário encontrado.</Text>
                  </>
                )}
            />
        </View>
    );
};

export default UserManagement;
