import React, { useState } from "react";
import { 
  StatusBar 
} from "expo-status-bar";
import {
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
  Pressable
} from "react-native";
import styles from "./styles.js";
import api from "../../services/api.js"
import { Feather } from '@expo/vector-icons';


export default function App({ navigation }) {
const [modalVisible, setModalVisible] = useState(false);
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const onChangeNameHandler = (name) => {
    setName(name);
    console.log(name)
  };
    
  const onChangeEmailHandler = (email) => {
    setEmail(email);
    console.log(email)
  };

  const onChangePasswordHandler = (password) => {
    setPassword(password);
    console.log(password)
  };

  async function postUsers () {
      const payload = {
       
        email: email,
        nome: name,
        senha: password,
       
      };   
      try {
        console.log(payload);
        const response = await api.post(
          "usuarios", 
          payload);
        console.log(response.data);
        setModalVisible(true);
      } catch (err) {
        console.error(err);
      } 
  };


  return (
    <View style={styles.container}>

<View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Indicators')}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>

      </View>

      <Text style={styles.titleRegisterLabel}>Cadastro de usuário</Text>
   
          <View style={{ padding: 16 }}>
   
          

            <Text style={styles.inputRegister}> Nome </Text>
            
            <TextInput style={styles.input} placeholder=""  onChangeText={onChangeNameHandler}/>
           

            <Text style={styles.inputRegister}> E-mail </Text>
            <TextInput style={styles.input} placeholder=""  onChangeText={onChangeEmailHandler}/>
           

            <Text style={styles.inputRegister}> Senha </Text>
            <TextInput
              style={styles.input}
              placeholder=""
              secureTextEntry={true}
              onChangeText={onChangePasswordHandler}
            />
          
          </View>
       

      <TouchableOpacity
        style={styles.buttonRegister}
        onPress={() => postUsers()}
      >
        <Text style={styles.buttonRegisterText}>Cadastrar</Text>
      </TouchableOpacity>

   

      <StatusBar style="auto" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Cadastro realizado com sucesso</Text>
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => navigation.navigate('Indicators')}>
              <Text style={styles.textStyle}>Continuar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}
