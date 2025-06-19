import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function ContextProvider({ children }) {
  const [token, setToken] = useState("");
  const [isAuth, setIsAuth] = useState(false)

  const [name, setName] = useState("");

  const [isAdmin, setIsAdmin] = useState(false);

  const [emailLogin, setEmailLogin] = useState("")

  const [userIdLogin, setUserIdLogin] = useState(0)

  const [indicationsLogin, setIndicationsLogin] = useState([])  

  const [points, setPoints] = useState(0);	

  const [selectedPatientId, setSelectedPatientId] = useState(null);

  return (
    <AuthContext.Provider
      value={{ token, isAuth, setIsAuth, setToken, name, setName, isAdmin, setIsAdmin, emailLogin, 
        setEmailLogin, userIdLogin,  selectedPatientId, setSelectedPatientId, setUserIdLogin, indicationsLogin, setIndicationsLogin, points, setPoints }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useContextProvider() {
  return useContext(AuthContext);
}
