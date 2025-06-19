import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, Image } from "react-native";
import styles from "./styles";
// import { Feather } from "@expo/vector-icons";
// import { useContextProvider } from "../../context/AuthContext";
// import { useEffect } from "react";
import Profile from "../../assets/perfil.png";

export default function ProfileScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <View style={styles.homeContainer}>
        <Text style={styles.titleWelcome}>Olá Usuário</Text>

        <Image source={Profile} style={styles.avatarProfissional} />

        <Text style={styles.titleInfoProfissional}> Gilberto Farias</Text>
      </View>
    </View>
  );
}
