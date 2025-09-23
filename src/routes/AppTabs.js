import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import ConsultationStack from "./ConsultationStack";
import TaskDiaryStack from "./TaskDiaryStack";
import ProfileStack from "./ProfileStack";
import UserStack from "./UserStack"; 
import { useContextProvider } from "../context/AuthContext";

const Tab = createBottomTabNavigator();

function AppTabs() {
  const { user } = useContextProvider();

  // A lógica para mostrar/esconder a aba de usuários continua a mesma
  const showAdminFeatures = user?.role === 'profissional' || user?.role === 'admin';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#307C31",
        tabBarInactiveTintColor: "#8391A1",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Consultas") iconName = "calendar";
          else if (route.name === "Diário") iconName = "book";
          else if (route.name === "Perfil") iconName = "user";
          else if (route.name === "Usuários") iconName = "users";
          return <Feather name={iconName} size={size} color={color} />;
        },
        tabBarLabelStyle: { 
          fontSize: 12, 
          marginBottom: 5, 
        },
        tabBarStyle: { 
          height: 60, 
          paddingTop: 5,
        },
      })}
    >
      <Tab.Screen
        name="Consultas"
        component={ConsultationStack}
        options={{ title: "Consultas" }}
      />
      <Tab.Screen
        name="Diário"
        component={TaskDiaryStack}
        options={{ title: "Diário" }}
      />
      {showAdminFeatures && (
        <Tab.Screen
          name="Usuários"
          component={UserStack}
          options={{ title: "Usuários" }}
        />
      )}
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

export default AppTabs;
