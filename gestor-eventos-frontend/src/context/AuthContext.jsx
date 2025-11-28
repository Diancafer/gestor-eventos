import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

// La URL de tu backend debe ser la misma usada en los componentes: http://localhost:3000
const BASE_URL = "http://localhost:3000/api/auth";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Función de utilidad para resetear la sesión
  const resetAuthState = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false); 
  };

  // Carga inicial y verificación de sesión
  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        resetAuthState();
        return; 
      }

      try {
        // Enviar el token en el header para que el backend lo valide
        const response = await axios.get(`${BASE_URL}/check-session`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });

        if (response.data.logueado) {
          // El backend devuelve { logueado: true, usuario: { id, email, rol_id, rol_nombre, nombre } }
          setUser(response.data.usuario);
          setIsAuthenticated(true);
        } else {
          resetAuthState();
        }
      } catch {
        resetAuthState();
      } finally {
        setLoading(false); 
      }
    };

    checkSession();
  }, []);

  // Función de login (usada en Login.jsx)
  const login = async (email, password) => {
    const response = await axios.post(`${BASE_URL}/login`, {
      email,
      password,
    }, { withCredentials: true });

    const { token, usuario } = response.data;
    localStorage.setItem("token", token);
    setUser(usuario);
    setIsAuthenticated(true);
  };

  // Función de logout (usada en App.jsx y en Login.jsx)
  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${BASE_URL}/logout`, null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
    } catch (error) {
      console.error("Error al cerrar sesión", error);
    } finally {
      resetAuthState();
    }
  };
  
  // Función para obtener el ID del rol (usada en App.jsx para control de módulos)
  const getRolId = () => user?.rol_id;
  
  // El valor del contexto
  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    getRolId,
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};