// src/components/VerifyAccount.jsx

import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';

// Asegura que las peticiones manejen la sesión (aunque no es estrictamente necesario aquí)
axios.defaults.withCredentials = true;

const VerifyAccount = () => {
    // Hooks para leer la URL y navegar
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Estados para manejar la interfaz: 'verifying', 'success', 'error'
    const [status, setStatus] = useState('verifying'); 
    const [message, setMessage] = useState('');
    
    // Obtener el token de la URL (?token=XYZ123)
    // NOTA: El backend usa el endpoint '/verificar-email' y el frontend usa el componente VerifyAccount
    const token = searchParams.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de verificación no encontrado en la URL. El enlace es inválido.');
            return;
        }

        const verifyToken = async () => {
            try {
                // LLAMADA A LA API DEL BACKEND: Usando el endpoint 'verificar-email' que está en tu backend
                const response = await axios.get(`http://localhost:3000/api/auth/verificar-email?token=${token}`);
                
                setStatus('success');
                setMessage(response.data.message || '¡Cuenta verificada con éxito! Ya puedes iniciar sesión.');
                
                // Redirigir al Login después de 3 segundos
                setTimeout(() => {
                    navigate('/login');
                }, 3000);

            } catch (err) {
                setStatus('error');
                // Captura el mensaje de error que envía el backend (e.g., "enlace expirado")
                setMessage(err.response?.data?.message || 'Error al verificar. El enlace puede haber expirado o ser inválido.');
            }
        };

        verifyToken();
    }, [token, navigate]);


    const renderContent = () => {
        if (status === 'verifying') {
            return (
                <div className="text-center p-5">
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" animationDuration=".5s" />
                    <h3 className="mt-3">Verificando su cuenta...</h3>
                    <p>Por favor, espere un momento.</p>
                </div>
            );
        } else if (status === 'success') {
            return (
                <div className="text-center p-5">
                    <Message severity="success" text={message} className="mb-3 w-full" />
                    <Button 
                        label="Ir a Iniciar Sesión" 
                        icon="pi pi-check-circle" 
                        onClick={() => navigate('/login')} 
                        className="p-button-success mt-4"
                    />
                </div>
            );
        } else { // status === 'error'
             return (
                <div className="text-center p-5">
                    <Message severity="error" text={message} className="mb-3 w-full" />
                    <Link to="/login">
                        <Button 
                            label="Volver al Login" 
                            icon="pi pi-arrow-left" 
                            className="p-button-secondary mt-4"
                        />
                    </Link>
                </div>
            );
        }
    }

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4 surface-ground">
            <Card title="Verificación de Cuenta" className="w-full md:w-30rem shadow-2">
                {renderContent()}
            </Card>
        </div>
    );
};

export default VerifyAccount;