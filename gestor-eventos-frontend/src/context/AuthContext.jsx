import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

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

  const resetAuthState = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsAuthenticated(false);
    setLoading(false); // desbloquea la app
  };

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        resetAuthState();
        return setLoading(false); // evita bloqueo si no hay token
      }

      try {
        const response = await axios.get("http://localhost:3000/api/auth/check-session", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        });

        if (response.data.logueado) {
          setUser(response.data.usuario);
          setIsAuthenticated(true);
        } else {
          resetAuthState();
        }
      } catch {
        resetAuthState();
      } finally {
        setLoading(false); // asegura que loading termine
      }
    };

    checkSession();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post("http://localhost:3000/api/auth/login", {
      email,
      password,
    }, { withCredentials: true });

    const { token, usuario } = response.data;
    localStorage.setItem("token", token);
    setUser(usuario);
    setIsAuthenticated(true);
  };

  const logout = async () => {
    const token = localStorage.getItem("token");
    try {
      await axios.post("http://localhost:3000/api/auth/logout", null, {
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

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center min-h-screen">
        Cargando aplicación...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};