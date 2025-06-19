import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientsList from "../pages/PatientsList/index";
import TaskDiaryList from "../pages/TaskDiaryList/index";
import HoursList from "../pages/HoursList/index";
import TaskForm from "../pages/TaskForm/index";

const Stack = createNativeStackNavigator();

function IndicationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientsList" component={PatientsList} />
      <Stack.Screen name="TaskDiaryList" component={TaskDiaryList} />
      <Stack.Screen name="HoursList" component={HoursList} />
      <Stack.Screen name="TaskForm" component={TaskForm} />
    </Stack.Navigator>
  );
}

export default IndicationsStack;
