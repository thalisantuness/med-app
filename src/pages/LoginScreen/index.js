import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import styles from "./styles";
import api from "../../services/api";
import { useContextProvider } from "../../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [loginStatus, setLoginStatus] = useState(null);
  const [loading, setLoading] = useState(false); 
  const { setName, setIsAdmin, setIsAuth, setToken, setPoints } = useContextProvider();

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const toggleModalSucess = () => {
    if (loginStatus === "success") {
      setModalVisible(!modalVisible);
      setIsAuth(true);
     
    } else if (loginStatus === "failed") {
      setModalVisible(!modalVisible);
    }
  };

  const onChangeEmailHandler = (email) => {
    setEmail(email);
    console.log(email);
  };

  const onChangePasswordHandler = (password) => {
    setPassword(password);
    console.log(password);
  };

  const handleLogin = async () => {
    const payload = {
      email: email,
      senha: password,
    };

    try {
      setLoading(true);
      console.log(payload);
      const response = await api.post("usuarios/login", payload);
       setIsAdmin(response.data.user.role);
       setToken(response.data.token)
       setName(response.data.user.nome)
       setPoints(response.data.user.pontos)
      const status = response.status;
      console.log("Resposta " + JSON.stringify(response.data))
      if (status === 200 || status === 201) {
        setLoginStatus("success");
      } else {
        setLoginStatus("failed");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      setLoginStatus("failed");
    } finally {
      setLoading(false); 
      setModalVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.form}>
        <Text style={styles.inputLabel}>E-mail</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu e-mail"
          onChangeText={onChangeEmailHandler}
        />

        <Text style={styles.inputLabel}>Senha</Text>
        <View style={styles.passwordInputContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Digite sua senha"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={onChangePasswordHandler}
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

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <TouchableOpacity>
          <Text style={styles.signupLinkText}> Faça agora</Text>
        </TouchableOpacity>
      </View> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {loginStatus === "success" ? (
              <Text>Login realizado com sucesso!</Text>
            ) : (
              <Text>Login falhou. Tente novamente.</Text>
            )}
            <TouchableOpacity
              style={styles.buttonCloseModalLogin}
              onPress={toggleModalSucess}
            >
              <Text style={styles.buttonTextCloseModalLogin}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
