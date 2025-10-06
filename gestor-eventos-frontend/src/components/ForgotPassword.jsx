// src/components/ForgotPassword.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Link } from 'react-router-dom';

axios.defaults.withCredentials = true;

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            // Llamada al nuevo endpoint del backend
            const response = await axios.post(
                'http://localhost:3000/api/auth/forgot-password',
                { email }
            );

            setSuccessMessage(response.data.message || 'Instrucciones enviadas al correo.');
            
        } catch (err) {
            const msg = err.response?.data?.message || 'Error de conexión. Intente de nuevo.';
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4 surface-ground">
            <Card title="¿Olvidaste tu Contraseña?" className="w-full md:w-25rem shadow-2">
                
                <form onSubmit={handleSubmit} className="p-fluid">
                    
                    {error && <Message severity="error" text={error} className="mb-3 w-full" />}
                    {successMessage && <Message severity="success" text={successMessage} className="mb-3 w-full" />}

                    <p className="mb-4 text-center text-sm">Ingresa tu correo para recibir el enlace de reseteo.</p>

                    <div className="field mb-4">
                        <span className="p-float-label">
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                            <label htmlFor="email">Correo Electrónico</label>
                        </span>
                    </div>
                    
                    <Button 
                        type="submit" 
                        label="Enviar Enlace de Reseteo" 
                        icon="pi pi-send" 
                        loading={loading}
                        className="w-full" 
                    />
                </form>

                <div className="mt-4 text-center">
                    <Link to="/login" className="text-primary hover:underline">Volver al Login</Link>
                </div>
            </Card>
        </div>
    );
};

export default ForgotPassword;