// src/context/AuthContext.jsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Importamos useNavigate

// 1. Crear el Contexto
const AuthContext = createContext(null);

// Hook personalizado para usar el contexto fácilmente (CORREGIDO)
export const useAuth = () => {
    const context = useContext(AuthContext);
    
    // Si el componente no está dentro del proveedor, lanza un error que indica dónde falló.
    if (!context) {
        throw new Error('useAuth debe ser usado dentro de un AuthProvider');
    }
    
    return context;
};

// 2. Componente Proveedor (Provider)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
   // const navigate = useNavigate(); // Hook dentro del contexto para manejar redirecciones

    useEffect(() => {
        // Al cargar la app, verificamos si existe una sesión activa en el backend
        const checkSession = async () => {
            try {
                // Endpoint para verificar la sesión
                const response = await axios.get('http://localhost:3000/api/auth/verificar');
                
                if (response.data.logueado) {
                    setUser(response.data.usuario);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                // Si falla (ej. 401), limpia la sesión y no está autenticado
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    // Función que se llama desde el Login.jsx al tener éxito
    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
        // NO NAVEGAMOS AQUÍ. Dejamos que el componente Login lo haga para evitar problemas de ciclo de vida.
    };

    // Función que se llama desde el Logout
    const logout = async () => {
        try {
            await axios.post('http://localhost:3000/api/auth/logout');
            setUser(null);
            setIsAuthenticated(false);
            navigate('/login'); // Redirige al login después de cerrar sesión
        } catch (error) {
            console.error("Error al cerrar sesión", error);
        }
    };
    
    // Objeto que se expone a todos los componentes hijos
    const value = {
        user,
        isAuthenticated,
        loading,
        login,
        logout
    };

    // Muestra una pantalla de carga mientras se verifica la sesión
    if (loading) {
        return <div className="flex justify-content-center align-items-center min-h-screen">Cargando aplicación...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};