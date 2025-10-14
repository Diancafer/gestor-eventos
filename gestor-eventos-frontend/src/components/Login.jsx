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

      // Guarda el token en localStorage
      localStorage.setItem('token', response.data.token);

      // Actualiza el contexto global
      login(response.data.usuario);

      // Redirige al dashboard
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Error de conexión o credenciales inválidas.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const cardTitle = (
    <div className="text-center text-2xl font-bold">Inicio de Sesión</div>
  );

  return (
    <div className="flex justify-content-center align-items-center min-h-screen p-4 surface-ground">
      <Card title={cardTitle} className="w-full md:w-25rem shadow-2">
        <form onSubmit={handleSubmit} className="p-fluid">
          {error && <Message severity="error" text={error} className="mb-3" />}

          {/* Campo Email */}
          <div className="field mb-3">
            <span className="p-float-label">
              <InputText
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
              <label htmlFor="email">Correo Electrónico</label>
            </span>
          </div>

          {/* Campo Contraseña */}
          <div className="field mb-2">
            <span className="p-float-label">
              <InputText
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                required
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>

          {/* Enlace de recuperación */}
          <div className="text-right mb-4">
            <Link to="/forgot-password" className="text-sm text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <Button
            type="submit"
            label="Entrar"
            icon="pi pi-sign-in"
            loading={loading}
            className="w-full p-button-success"
          />
        </form>

        <Divider align="center" className="my-4">
          <span className="p-tag">O</span>
        </Divider>

        <div className="text-center">
          <Link to="/register" className="text-primary hover:underline">
            ¿No tienes cuenta? Regístrate aquí
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Login;