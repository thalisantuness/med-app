import { StatusBar } from "expo-status-bar";
import { Text, View, TouchableOpacity, ScrollView, Alert } from "react-native";
import styles from "./styles";
import { Feather } from "@expo/vector-icons";
import { useContextProvider } from "../../context/AuthContext";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const { user, setIsAuth, setToken, setUser } = useContextProvider();
  const navigation = useNavigation();

  const getRoleName = () => {
    switch (user?.role) {
      case "profissional":
        const type = user.profissional_type
          ? user.profissional_type.charAt(0).toUpperCase() + user.profissional_type.slice(1)
          : 'Profissional';
        return type;
      case "familia":
        return "Família";
      case "admin":
        return "Administrador";
      default:
        return "Usuário";
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair da sua conta?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sair",
          onPress: () => {
            // Limpa todos os dados de autenticação
            setIsAuth(false);
            setToken("");
            setUser({
              id: null,
              name: "",
              role: "",
              cpf: ""
            });

          },
        },
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.container}
    >
      <StatusBar backgroundColor="white" barStyle="dark-content" />

      <View style={styles.profileHeader}>
        <View style={styles.avatarPlaceholder}>
          <Feather name="user" size={40} color="#fff" />
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.userName}>{user?.name || "Usuário"}</Text>
          <Text style={styles.userRole}>{getRoleName()}</Text>
        </View>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.sectionTitle}>Informações Pessoais</Text>

        <View style={styles.infoItem}>
          <Feather name="user" size={20} color="#385b3e" />
          <Text style={styles.infoText}>
            {user?.name || "Nome não informado"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Feather name="hash" size={20} color="#385b3e" />
          <Text style={styles.infoText}>
            {user?.cpf || "CPF não informado"}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Feather name="award" size={20} color="#385b3e" />
          <Text style={styles.infoText}>{getRoleName()}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
