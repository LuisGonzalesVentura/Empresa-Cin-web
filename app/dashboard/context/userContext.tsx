"use client";  // Indica que este archivo es un componente del lado del cliente

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Crear un contexto para el usuario
const UserContext = createContext<any>(null);

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [userName, setUserName] = useState<string | null>(null);

  // Cargar usuario al montar el componente
  useEffect(() => {
    const cargarUsuario = () => {
      const userSession = localStorage.getItem("user");
      if (userSession) {
        const user = JSON.parse(userSession);
        setUserName(user.nombre);
      } else {
        setUserName(null); // Resetea si no hay usuario
      }
    };

    cargarUsuario();

    // Escuchar cambios en el localStorage desde otras pestañas
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "user") {
        cargarUsuario();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // Proveer el estado del usuario a todos los componentes hijos
  return (
    <UserContext.Provider value={{ userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};
