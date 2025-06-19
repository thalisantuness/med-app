import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PatientsList from "../pages/PatientsList/index";
import TaskDiaryList from "../pages/TaskDiaryList/index";
import DaysList from "../pages/DaysList/index";
import HoursList from "../pages/HoursList/index";
import TaskForm from "../pages/TaskForm/index";

import LoginScreen from "../pages/LoginScreen/index";
import Register from "../pages/Register";
import Indication from "../pages/Indication";
import Indicators from "../pages/Indicators/index";
import Rewards from "../pages/Rewards";
import RewardAdd from "../pages/RewardAdd";
import Requests from "../pages/Requests";
import PointsAdd from "../pages/PointsAdd";

const Stack = createNativeStackNavigator();

function IndicationsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientsList" component={PatientsList} />
      <Stack.Screen name="TaskDiaryList" component={TaskDiaryList} />
      <Stack.Screen name="HoursList" component={HoursList} />
      <Stack.Screen name="TaskForm" component={TaskForm} />
      {/* <Stack.Screen name="DaysList" component={DaysList} /> */}
      {/* <Stack.Screen name="Indicators" component={Indicators} /> */}
      {/* <Stack.Screen name="Rewards" component={Rewards} />
      <Stack.Screen name="RewardAdd" component={RewardAdd} />
      <Stack.Screen name="Requests" component={Requests} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="PointsAdd" component={PointsAdd} /> */}
    </Stack.Navigator>
  );
}

export default IndicationsStack;
