import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import UserManagement from '../pages/UserManagement'; 

const Stack = createNativeStackNavigator();

function UserStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagement} 
        options={{ title: "Gerenciar Usuários" }}
      />
    </Stack.Navigator>
  );
}

export default UserStack;