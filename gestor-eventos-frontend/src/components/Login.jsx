import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Divider } from 'primereact/divider';
import { useAuth } from '../context/AuthContext.jsx';

axios.defaults.withCredentials = true;

const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:3000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', response.data.token);
      login(response.data.usuario);
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error de conexión o credenciales inválidas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-background"> 
      <Card className="auth-card w-full md:w-30rem p-4">
        
        <div className="text-center mb-5">
            <div className="text-primary text-3xl font-bold mb-2">GestorEventos</div>
            <span className="text-600 font-medium">Inicia sesión para continuar</span>
        </div>

        <form onSubmit={handleSubmit} className="p-fluid">
          {error && <Message severity="error" text={error} className="mb-4 w-full" />}

          <div className="field mb-4">
            <span className="p-float-label p-input-icon-left">
              <i className="pi pi-envelope" />
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="p-inputtext-lg"
              />
              <label htmlFor="email">Correo Electrónico</label>
            </span>
          </div>

          <div className="field mb-4">
            <span className="p-float-label p-input-icon-left">
              <i className="pi pi-lock" />
              <InputText
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
                className="p-inputtext-lg"
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>

          <div className="flex align-items-center justify-content-between mb-5">
             <Link to="/forgot-password" class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">
                 ¿Olvidaste tu contraseña?
             </Link>
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full p-button-lg"
          />
        </form>

        <Divider align="center" className="my-4">
          <span className="text-600 font-normal text-sm">O</span>
        </Divider>

        <div className="text-center">
            <span className="text-600 font-medium line-height-3">¿No tienes cuenta?</span>
            <Link to="/register" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">
                Regístrate aquí
            </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;