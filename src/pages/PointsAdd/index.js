import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import api from "../../services/api";
import styles from "./styles";
import { useContextProvider } from "../../context/AuthContext";

export default function PointsAdd({ navigation, route }) {
  const [pontos, setPontos] = useState(0);
  const { token } = useContextProvider();

  const { usuarioId } = route.params;

  const onChangePontosHandler = (pontos) => {
    setPontos(parseInt(pontos, 10)); 
  console.log(parseInt(pontos, 10));
  };

  async function postRewards() {
    console.log("Uusuario id" + usuarioId)
    const payload = {   
      pontos: pontos, 
    };

    try {
      console.log(payload);
      const response = await api.put(
        `usuarios/pontos/${usuarioId}`,
        payload, {
          headers: {
            Authorization: `Bearer ${token}`, 
          }  
        }
      );

      console.log(response.data);
      navigation.navigate("Home")
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate("Indicators")}
        >
          <Feather name="arrow-left" size={16} color="black" />
          <Text style={styles.backText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.topContainer}>
        <View style={styles.firstContainer}>
          <Text style={styles.title}>Dar pontos ao usuário</Text>
        </View>

      </View>


  

      <View style={styles.form}>
     
     
       

    
          <TextInput
            style={styles.input}
            placeholder="Pontos"
            onChangeText={onChangePontosHandler}
            keyboardType="numeric"
      
          />

       
    

        <TouchableOpacity style={styles.loginButton} onPress={postRewards}>
          <Text style={styles.loginButtonText}>Dar pontos</Text>
        </TouchableOpacity>
      </View>
   
   
    </View>
  );
}
