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
    const { token, user } = useContextProvider(); // Pega o usuário logado do contexto

    // Constantes para verificar o papel do usuário logado
    const isAdmin = user?.role === 'admin';
    const isProfissional = user?.role === 'profissional';

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // O estado inicial do formulário agora depende do papel do usuário logado
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        senha: '',
        role: isProfissional ? 'familia' : 'familia', // Se for profissional, o padrão é criar 'familia'
        profissional_type: 'medico',
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await api.get('/usuarios', {
                headers: { Authorization: `Bearer ${token}` },
            });
            // Filtra o próprio usuário da lista para não se ver
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
            // Remove o campo profissional_type se o usuário não for desse tipo
            delete payload.profissional_type;
        }

        try {
            await api.post('/usuarios', payload, {
                headers: { Authorization: `Bearer ${token}` },
            });
            Alert.alert('Sucesso', 'Usuário criado com sucesso!');
            // Reseta o formulário
            setFormData({ 
                nome: '', 
                cpf: '', 
                senha: '', 
                role: isProfissional ? 'familia' : 'familia', 
                profissional_type: 'medico' 
            });
            fetchUsers(); // Atualiza a lista
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
                <Text style={styles.userRole}>
                    {item.role === 'profissional' ? (item.profissional_type?.charAt(0).toUpperCase() + item.profissional_type?.slice(1) || 'Profissional') : 'Família'}
                </Text>
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

                {/* Seletor de Tipo de Usuário (Apenas para Admin) */}
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
                
                {/* Seletor de Tipo Profissional (Condicional) */}
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
