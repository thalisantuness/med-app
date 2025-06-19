import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons"; // Alterado para Feather
import ConsultationStack from "./ConsultationStack";
import TaskDiaryStack from "./TaskDiaryStack";
import ProfileStack from "./ProfileStack";

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#307C31",
        tabBarInactiveTintColor: "#8391A1",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Consultas") {
            iconName = "calendar";
          } else if (route.name === "Diário") {
            iconName = "book";
          } else if (route.name === "Perfil") {
            iconName = "user";
          }

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
      <Tab.Screen
        name="Perfil"
        component={ProfileStack}
        options={{ title: "Perfil" }}
      />
    </Tab.Navigator>
  );
}

export default AppTabs;
