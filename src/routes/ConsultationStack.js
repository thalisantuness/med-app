import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ConsultationsList from "../pages/Consultations/index";
import AddConsultation from "../pages/AddConsultation";

const Stack = createNativeStackNavigator();

function ConsultationStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ConsultationsList" component={ConsultationsList} />
      <Stack.Screen name="AddConsultation" component={AddConsultation} />
    </Stack.Navigator>
  );
}

export default ConsultationStack;
