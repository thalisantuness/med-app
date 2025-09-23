import React from 'react';
import { ContextProvider } from "./src/context/AuthContext";
import AppNavigator from "./src/routes/AppNavigator";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ContextProvider>
        <AppNavigator />
      </ContextProvider>
    </SafeAreaProvider>
  );

}