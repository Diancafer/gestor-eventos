// src/components/auth/ResetPassword.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Define la URL base de tu backend (puerto 3000)
const BASE_URL = 'http://localhost:3000/api/auth';

const ResetPassword = () => {
    // Hook para obtener los parámetros de la URL (?token=...)
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // Estado para almacenar el token extraído y la nueva contraseña
    const [token, setToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Estado para mensajes de la interfaz de usuario
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // 1. Extraer el token de la URL al cargar el componente
    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            // Se limpia el token de espacios innecesarios antes de guardarlo
            setToken(urlToken.trim()); 
        } else {
            setError('Error: No se encontró el token de restablecimiento en la URL.');
        }
    }, [searchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!token) {
            setError('Falta el token de restablecimiento. Por favor, revisa el enlace completo.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (newPassword.length < 6) {
             setError('La contraseña debe tener al menos 6 caracteres.');
             return;
        }

        setLoading(true);

        try {
            // 2. Enviar el token y la nueva contraseña en el cuerpo de la petición (JSON)
            const response = await axios.post(`${BASE_URL}/reset-password`, {
                //  El nombre de la clave debe ser exactamente 'token' y 'newPassword'
                token: token,
                newPassword: newPassword,
            }, {
                 // Esto asegura que las cookies de sesión/CORS funcionen correctamente
                 withCredentials: true 
            });

            setMessage(response.data.message || 'Contraseña restablecida con éxito.');
            
            // Redirigir al login después de un breve retraso
            setTimeout(() => {
                navigate('/login'); 
            }, 3000);

        } catch (err) {
            // El mensaje de error 400 del backend será capturado aquí
            const errorMessage = err.response?.data?.message || 'Error al intentar restablecer la contraseña. El token puede ser inválido o haber expirado.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    // Si hay un error de token en la URL, solo se muestra el mensaje
    if (error && error.includes('Error: No se encontró el token')) {
        return (
            <div className="container mt-5">
                <div className="alert alert-danger">{error}</div>
            </div>
        );
    }


    return (
        <div className="container my-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow">
                        <div className="card-body">
                            <h3 className="card-title text-center mb-4">Restablecer Contraseña</h3>
                            
                            {/* Mostrar mensajes de éxito o error */}
                            {message && <div className="alert alert-success">{message}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Nueva Contraseña:</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        disabled={loading}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Confirmar Contraseña:</label>
                                    <input 
                                        type="password" 
                                        className="form-control" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        minLength="6"
                                        disabled={loading}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100" 
                                    disabled={loading || !token || newPassword !== confirmPassword}
                                >
                                    {loading ? 'Restableciendo...' : 'Restablecer Contraseña'}
                                </button>
                                
                                <p className="text-center mt-3">
                                    <small>Token de URL: {token ? 'Detectado' : 'No detectado'}</small>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;