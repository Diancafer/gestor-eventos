import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "./context/AuthContext.jsx"; 
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';

// --- ESTILOS y LIBRERÍAS (Asegurar que se carguen) ---
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                
import './App.css'; // Estilos personalizados

// --- Componentes de Autenticación ---
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import VerifyAccount from "./components/VerifyAccount.jsx";      
import ForgotPassword from "./components/ForgotPassword.jsx";    
import ResetPassword from "./components/ResetPassword.jsx";       

// --- Componentes de Negocio ---
import EventList from './components/EventList.jsx'; 
import CreateEventForm from './components/CreateEventForm.jsx';
import AssignRoleForm from './components/AssignRoleForm.jsx';
import RegisterExpenseForm from './components/RegisterExpenseForm.jsx';
import UserPayments from './components/UserPayments.jsx';
import PaymentForm from './components/PaymentForm.jsx'; 

const ROLES = {
    ADMIN: 1,
    FINANZAS: 5,
    ORGANIZACION: 6,
    USUARIO: 7,
};

const RutaProtegida = ({ children, requiredRole }) => {
    const { isAuthenticated, loading, user } = useAuth();
    const location = useLocation();

    if (loading) {
        // Muestra mensaje mientras se verifica la sesión inicial
        return <div className="text-center p-5">Verificando sesión...</div>; 
    }

    if (!isAuthenticated) {
        // Redirige al login si no está autenticado
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    
    // Verificación de Rol (si se especifica un rol requerido)
    if (requiredRole && user && user.rol_id !== requiredRole) {
        return (
            <div className="p-5 text-center">
                <Card title="Acceso Denegado" className="max-w-xl mx-auto">
                    <p className="p-error">
                        Su rol ({user.rol_id}) no tiene permiso para ver este módulo.
                    </p>
                    <Button label="Volver al Dashboard" onClick={() => <Navigate to="/dashboard" />} className="mt-4 p-button-secondary" />
                </Card>
            </div>
        );
    }

    return children;
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const rolId = user?.rol_id;
    const rolNombre = user?.rol_nombre || 'Usuario'; 
    const userName = user?.nombre || 'Invitado';

    return (
        <div className="p-5 surface-ground min-h-screen">
            <div className="flex justify-content-between align-items-center mb-5">
                <h1>Dashboard de {userName} ({rolNombre})</h1>
                <Button label="Cerrar Sesión" icon="pi pi-sign-out" onClick={logout} className="p-button-danger" />
            </div>

            {/* Módulos Comunes (Disponibles para la mayoría de roles) */}
            <h2 className="text-xl mb-3">Módulos Comunes:</h2>
            <div className="grid">
                <div className="col-12 md:col-6 lg:col-4"><Card title="Eventos Disponibles" className="h-full"><EventList /></Card></div>
                <div className="col-12 md:col-6 lg:col-4"><Card title="Realizar Pago" className="h-full"><PaymentForm /></Card></div>
                <div className="col-12 md:col-6 lg:col-4"><Card title="Mi Historial de Pagos" className="h-full"><UserPayments /></Card></div>
            </div>

            <Divider className="my-5"/>

            {/* Módulos de Gestión (Condicionales por Rol) */}
            <h2 className="text-xl mb-3">Módulos de Gestión:</h2>
            <div className="grid">
                
                {/* Crear Evento (Admin o Organización) */}
                {(rolId === ROLES.ADMIN || rolId === ROLES.ORGANIZACION) && (
                    <div className="col-12 md:col-6 lg:col-4"><Card title="Creación de Eventos" className="h-full"><CreateEventForm /></Card></div>
                )}
                
                {/* Registrar Gasto (Admin o Finanzas) */}
                {(rolId === ROLES.ADMIN || rolId === ROLES.FINANZAS) && (
                    <div className="col-12 md:col-6 lg:col-4"><Card title="Registro de Gastos" className="h-full"><RegisterExpenseForm /></Card></div>
                )}
                
                {/* Asignar Roles (Solo Admin) */}
                {rolId === ROLES.ADMIN && (
                    <div className="col-12 md:col-6 lg:col-4"><Card title="Gestión de Roles" className="h-full"><AssignRoleForm /></Card></div>
                )}

            </div>
        </div>
    );
};

function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        {/* Rutas de Autenticación (Públicas) */}
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyAccount />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Rutas Protegidas */}
        {/* Usamos el Dashboard con el AuthGuard para proteger todos los módulos de negocio */}
        <Route 
          path="/dashboard" 
          element={<RutaProtegida><Dashboard /></RutaProtegida>} 
        />
        
        {/* Rutas de Comodín */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;