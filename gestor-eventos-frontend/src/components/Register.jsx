// src/components/Register.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';

axios.defaults.withCredentials = true;

const Register = () => {
    const [nombre, setNombre] = useState('');
    const [apellido, setApellido] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 1. NUEVO ESTADO: nombre de la empresa
    const [nombreEmpresa, setNombreEmpresa] = useState(''); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            const response = await axios.post(
                'http://localhost:3000/api/auth/register',
                { 
                    nombre, 
                    apellido, 
                    email, 
                    password, 
                    // 2. ENVIAMOS LA EMPRESA al backend
                    nombre_empresa: nombreEmpresa 
                }
            );

            setSuccessMessage(response.data.message || 'Registro exitoso. Revisando el correo...');
            
            // Opcional: Redirigir al login después del registro
            setTimeout(() => {
                navigate('/login'); 
            }, 3000); 

        } catch (err) {
            // Manejar errores de validación (400) o conflictos (500)
            const msg = err.response?.data?.message || 'Error al conectar con el servidor. Intente más tarde.';
            setError(msg);

        } finally {
            setLoading(false);
        }
    };

    const cardTitle = (
        <div className="text-center text-2xl font-bold">Registro de Cuenta</div>
    );

    return (
        <div className="flex justify-content-center align-items-center min-h-screen p-4 surface-ground">
            <Card title={cardTitle} className="w-full md:w-30rem shadow-2">
                
                <form onSubmit={handleSubmit} className="p-fluid">
                    
                    {error && <Message severity="error" text={error} className="mb-3 w-full" />}
                    {successMessage && <Message severity="success" text={successMessage} className="mb-3 w-full" />}

                    {/* Campo Nombre */}
                    <div className="field mb-3">
                        <span className="p-float-label">
                            <InputText id="nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} disabled={loading} required />
                            <label htmlFor="nombre">Nombre</label>
                        </span>
                    </div>

                    {/* Campo Apellido */}
                    <div className="field mb-3">
                        <span className="p-float-label">
                            <InputText id="apellido" type="text" value={apellido} onChange={(e) => setApellido(e.target.value)} disabled={loading} required />
                            <label htmlFor="apellido">Apellido</label>
                        </span>
                    </div>
                    
                    {/* 3. CAMPO NUEVO/CORREGIDO: Nombre de la Empresa */}
                    <div className="field mb-3">
                        <span className="p-float-label">
                            <InputText 
                                id="nombreEmpresa" 
                                type="text" 
                                value={nombreEmpresa} 
                                onChange={(e) => setNombreEmpresa(e.target.value)} 
                                disabled={loading} 
                                required 
                            />
                            <label htmlFor="nombreEmpresa">Nombre de la Empresa</label>
                        </span>
                    </div>

                    {/* Campo Email */}
                    <div className="field mb-3">
                        <span className="p-float-label">
                            <InputText id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} required />
                            <label htmlFor="email">Correo Electrónico</label>
                        </span>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="field mb-4">
                        <span className="p-float-label">
                            <InputText id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} required />
                            <label htmlFor="password">Contraseña</label>
                        </span>
                    </div>
                    
                    <Button 
                        type="submit" 
                        label="Crear Cuenta" 
                        icon="pi pi-user-plus" 
                        loading={loading}
                        className="w-full p-button-success" 
                    />
                </form>

                <Divider align="center" className="my-4">
                    <span className="p-tag">O</span>
                </Divider>

                <div className="text-center">
                    <Link to="/login" className="text-primary hover:underline">
                        ¿Ya tienes cuenta? Inicia Sesión
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Register;