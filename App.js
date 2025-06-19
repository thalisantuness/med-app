import React, {useEffect} from 'react';
// import Routes from './src/routes';
import {ContextProvider} from "./src/context/AuthContext"
import AppNavigator from "./src/routes/AppNavigator"

export default function App(){

  return(
    <ContextProvider>
    <AppNavigator />
    {/* <Routes/> */}
    </ContextProvider>
  );

}