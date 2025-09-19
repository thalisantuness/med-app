// Importações necessárias no topo do arquivo
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Platform, // Importa Platform
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import api from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

// Configuração para notificações aparecerem com o app aberto
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

// Função para registrar e obter o token
async function registerForPushNotificationsAsync(authToken) {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Falha!', 'Não foi possível obter o token para notificações push!');
      return;
    }
    // IMPORTANTE: Substitua 'YOUR_PROJECT_ID' pelo ID do seu projeto no Expo
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'ccaee051-5503-4bd6-845c-ca43fcf51325' })).data;
    
    // Envia o token para o backend
    if (token && authToken) {
      try {
        await api.post('/usuarios/salvar-push-token', { token }, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      } catch (error) {
        console.error("Erro ao salvar push token:", error.response?.data || error);
      }
    }

  } else {
    Alert.alert('Aviso', 'Notificações Push só funcionam em dispositivos físicos.');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}


export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { setIsAuth, setToken, setUser } = useContextProvider();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleLogin = async () => {
    const payload = {
      cpf: cpf,
      senha: password,
    };

    try {
      setLoading(true);
      const response = await api.post("/login", payload);
      
      if (response.status === 200 || response.status === 201) {
        const { user, token } = response.data;
        
        // Armazena os dados no contexto
        setToken(token);
        setUser({
          id: user.usuario_id,
          name: user.nome,
          role: user.role,
          cpf: user.cpf,
          profissional_type: user.profissional_type || ""
        });
        setIsAuth(true);

        // **CHAMADA PARA REGISTRAR NOTIFICAÇÕES APÓS O LOGIN**
        await registerForPushNotificationsAsync(token);
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      Alert.alert("Login falhou", "Verifique suas credenciais e tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <Text style={styles.inputLabel}>CPF</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu CPF"
          value={cpf}
          onChangeText={setCpf}
          keyboardType="numeric"
        />

        <Text style={styles.inputLabel}>Senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.passwordIconContainer}
          >
            <Feather
              name={passwordVisible ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}