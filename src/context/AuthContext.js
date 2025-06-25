import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function ContextProvider({ children }) {
  const [token, setToken] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState({
    id: null,
    name: "",
    role: "", // 'medico' ou outro valor
    cpf: ""
  });

  const [selectedPatientId, setSelectedPatientId] = useState(null);

  return (
    <AuthContext.Provider
      value={{ 
        token, 
        setToken,
        isAuth, 
        setIsAuth,
        user,
        setUser,
        selectedPatientId, 
        setSelectedPatientId
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useContextProvider() {
  return useContext(AuthContext);
}