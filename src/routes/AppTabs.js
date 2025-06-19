import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeStack from './HomeStack';
import TaskDiaryStack from './TaskDiaryStack';
import ProfileStack from './ProfileStack'

const Tab = createBottomTabNavigator();

function AppTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#307C31', // Cor ativa
        tabBarInactiveTintColor: '#8391A1', // Cor inativa
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'PatientsList':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'PatientsList':
              iconName = focused ? 'book' : 'book-outline';
              break;
           
             
            default:
              iconName = 'circle';
              break;
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Consultas" component={HomeStack} />
      <Tab.Screen name="Diário" component={TaskDiaryStack} /> 
      <Tab.Screen name="Perfil" component={ProfileStack} />   
    </Tab.Navigator>
  );
}

export default AppTabs;
