import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const start = (
        <div className="flex align-items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <i className="pi pi-calendar-plus text-2xl text-primary mr-2"></i>
            <span className="text-xl font-bold text-gray-800">GestorEventos</span>
        </div>
    );

    const end = (
        <div className="flex align-items-center gap-3">
            <div className="flex flex-column align-items-end mr-2 hidden md:flex">
                <span className="font-semibold text-sm">{user?.nombre || 'Usuario'}</span>
                <span className="text-xs text-500">{user?.rol_nombre || 'Invitado'}</span>
            </div>
            <Avatar icon="pi pi-user" shape="circle" className="bg-primary-50 text-primary" />
            <Button 
                icon="pi pi-power-off" 
                rounded 
                text 
                severity="danger" 
                aria-label="Cerrar Sesión" 
                onClick={logout} 
                tooltip="Cerrar Sesión"
                tooltipOptions={{ position: 'bottom' }}
            />
        </div>
    );

    return (
        <div className="card shadow-1 border-none border-noround">
            <Menubar start={start} end={end} style={{ border: 'none', borderRadius: 0 }} />
        </div>
    );
};

export default Navbar;