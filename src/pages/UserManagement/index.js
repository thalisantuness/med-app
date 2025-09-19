import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import api from '../../services/api';
import styles from './styles';
import { useContextProvider } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const UserManagement = () => {
    const navigation = useNavigation();
    const { token } = useContextProvider();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        senha: '',
        role: 'familia',
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/usuarios', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
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
            Alert.alert('Atenção', 'Por favor, preencha todos os campos.');
            return;
        }
        setIsCreating(true);
        try {
            await api.post('/usuarios', formData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sucesso', 'Usuário criado com sucesso!');
            setFormData({ nome: '', cpf: '', senha: '', role: 'familia' });
            fetchUsers();
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Não foi possível criar o usuário.';
            console.error("Erro ao criar usuário:", error.response?.data || error);
            Alert.alert('Erro', errorMessage);
        } finally {
            setIsCreating(false);
        }
    };

    const renderUserItem = ({ item }) => (
        <View style={styles.userItem}>
            <View>
                <Text style={styles.userName}>{item.nome}</Text>
                <Text style={styles.userRole}>{item.role === 'medico' ? 'Médico' : 'Família'}</Text>
            </View>
            <Text style={styles.userCpf}>CPF: {item.cpf}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={16} color="#385b3e" />
                    <Text style={styles.backText}>Voltar</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.pageTitle}>Gerenciar Usuários</Text>

            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>Adicionar Novo Usuário</Text>
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
                <View style={styles.pickerContainer}>
                    <Picker
                        selectedValue={formData.role}
                        onValueChange={(itemValue) => handleInputChange('role', itemValue)}
                    >
                        <Picker.Item label="Família" value="familia" />
                        <Picker.Item label="Médico" value="medico" />
                    </Picker>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCreateUser} disabled={isCreating}>
                    {isCreating ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Adicionar Usuário</Text>}
                </TouchableOpacity>
            </View>

            <Text style={styles.listTitle}>Usuários Cadastrados</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#385b3e" />
            ) : (
                <FlatList
                    data={users}
                    renderItem={renderUserItem}
                    keyExtractor={(item) => String(item.usuario_id)}
                    ListEmptyComponent={<Text style={styles.emptyListText}>Nenhum usuário encontrado.</Text>}
                />
            )}
        </ScrollView>
    );
};

export default UserManagement;