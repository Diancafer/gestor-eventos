import React, { useState, useRef } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "./context/AuthContext.jsx"; 
import { PrimeReactProvider } from 'primereact/api';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Menu } from 'primereact/menu';
import { Toast } from 'primereact/toast';
import { Avatar } from 'primereact/avatar';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                
import './App.css'; 

import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import VerifyAccount from "./components/VerifyAccount.jsx";      
import ForgotPassword from "./components/ForgotPassword.jsx";    
import ResetPassword from "./components/ResetPassword.jsx";       

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

    if (loading) return <div className="flex align-items-center justify-content-center min-h-screen">Verificando sesión...</div>;
    
    if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
    
    if (requiredRole && user && user.rol_id !== requiredRole) {
        return (
            <div className="flex align-items-center justify-content-center min-h-screen">
                <Card title="Acceso Denegado" className="text-center shadow-4">
                    <p className="mb-4 text-red-500">No tienes permiso para ver esta sección.</p>
                    <Button label="Volver" onClick={() => <Navigate to="/dashboard" />} />
                </Card>
            </div>
        );
    }
    return children;
};

const Dashboard = () => {
    const { user, logout } = useAuth();
    const rolId = user?.rol_id;
    const toast = useRef(null);
    
    const [dialogoVisible, setDialogoVisible] = useState(null);

    const itemsHerramientas = [
        {
            label: 'Gestión de Eventos',
            items: [
                {
                    label: 'Nuevo Evento',
                    icon: 'pi pi-calendar-plus',
                    command: () => setDialogoVisible('crearEvento'),
                    visible: rolId === ROLES.ADMIN || rolId === ROLES.ORGANIZACION
                },
                {
                    label: 'Registrar Gasto',
                    icon: 'pi pi-dollar',
                    command: () => setDialogoVisible('registrarGasto'),
                    visible: rolId === ROLES.ADMIN || rolId === ROLES.FINANZAS
                },
                {
                    label: 'Asignar Roles',
                    icon: 'pi pi-users',
                    command: () => setDialogoVisible('asignarRoles'),
                    visible: rolId === ROLES.ADMIN
                }
            ].filter(item => item.visible)
        },
        {
            label: 'Mi Cuenta',
            items: [
                {
                    label: 'Cerrar Sesión',
                    icon: 'pi pi-power-off',
                    command: () => logout()
                }
            ]
        }
    ];

    return (
        <div className="flex min-h-screen surface-ground">
            <Toast ref={toast} />

            <div className="w-18rem surface-card shadow-2 flex-shrink-0 flex flex-column hidden md:flex border-right-1 surface-border">
                <div className="p-4 flex align-items-center border-bottom-1 surface-border">
                    <i className="pi pi-calendar text-2xl text-primary mr-2"></i>
                    <span className="text-xl font-bold text-900">GestorEventos</span>
                </div>
                
                <div className="p-3 flex-1 overflow-y-auto">
                    <div className="mb-3 p-3 surface-ground border-round-md flex align-items-center gap-2">
                        <Avatar icon="pi pi-user" shape="circle" className="surface-overlay text-primary" />
                        <div className="overflow-hidden">
                            <div className="font-medium text-900 white-space-nowrap overflow-hidden text-overflow-ellipsis">{user?.nombre}</div>
                            <div className="text-xs text-500">{user?.rol_nombre}</div>
                        </div>
                    </div>
                    
                    <span className="text-sm font-semibold text-500 uppercase ml-2 mb-2 block mt-4">Herramientas</span>
                    <Menu model={itemsHerramientas} className="w-full border-none bg-transparent" />
                </div>
            </div>

            <div className="flex-1 flex flex-column min-w-0">
                
                <div className="md:hidden flex align-items-center justify-content-between p-3 surface-card shadow-1">
                    <span className="font-bold text-lg">GestorEventos</span>
                    <Button icon="pi pi-bars" text />
                </div>

                <div className="p-4 overflow-y-auto flex-1">
                    <h1 className="text-3xl font-bold text-900 mb-4">Panel de Control</h1>

                    <div className="md:hidden grid mb-4">
                        {itemsHerramientas[0].items.map((item, i) => (
                            <div key={i} className="col-6">
                                <Button label={item.label} icon={item.icon} className="w-full p-button-outlined" onClick={item.command} />
                            </div>
                        ))}
                    </div>

                    <div className="grid">
                        <div className="col-12 xl:col-8">
                            <Card title="Eventos Disponibles" className="h-full border-round-xl shadow-1">
                                <EventList />
                            </Card>
                        </div>

                        <div className="col-12 xl:col-4">
                            <div className="flex flex-column gap-4">
                                <Card title="Pagos Rápidos" className="border-round-xl shadow-1">
                                    <PaymentForm />
                                </Card>
                                <Card title="Mis Movimientos" className="border-round-xl shadow-1">
                                    <UserPayments />
                                </Card>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog 
                header="Crear Nuevo Evento" 
                visible={dialogoVisible === 'crearEvento'} 
                style={{ width: '50vw' }} 
                breakpoints={{ '960px': '75vw', '641px': '95vw' }}
                onHide={() => setDialogoVisible(null)}
                modal
            >
                <CreateEventForm />
            </Dialog>

            <Dialog 
                header="Registrar Gasto" 
                visible={dialogoVisible === 'registrarGasto'} 
                style={{ width: '40vw' }} 
                breakpoints={{ '960px': '75vw', '641px': '95vw' }}
                onHide={() => setDialogoVisible(null)}
                modal
            >
                <RegisterExpenseForm />
            </Dialog>

            <Dialog 
                header="Asignar Roles" 
                visible={dialogoVisible === 'asignarRoles'} 
                style={{ width: '40vw' }} 
                breakpoints={{ '960px': '75vw', '641px': '95vw' }}
                onHide={() => setDialogoVisible(null)}
                modal
            >
                <AssignRoleForm />
            </Dialog>
        </div>
    );
};

function App() {
  return (
    <PrimeReactProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} /> 
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyAccount />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route 
          path="/dashboard" 
          element={<RutaProtegida><Dashboard /></RutaProtegida>} 
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </PrimeReactProvider>
  );
}

export default App;