// src/App.jsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Importamos el Contexto y el Hook que acabamos de corregir
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; 

// Componentes de Autenticación
import Login from "./components/login.jsx";
import Register from "./components/Register.jsx";
import VerifyAccount from "./components/VerifyAccount.jsx";      
import ForgotPassword from "./components/ForgotPassword.jsx";    
import ResetPassword from "./components/ResetPassword.jsx";       

// Estilos de PrimeReact (Asegúrate de que estas rutas sean correctas)
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                

// --- Componente Placeholder del Dashboard ---
// (Lo puedes mover a src/components/Dashboard.jsx más tarde)
const Dashboard = () => {
    const { user, logout } = useAuth();
    return (
        <div className="p-5 text-center surface-card shadow-2 m-5 border-round">
            <h1>¡Bienvenido, {user?.nombre || 'Usuario'}! </h1>
            <button onClick={logout} className="p-button p-button-danger">Cerrar Sesión</button>
        </div>
    );
};

// --- Componente para Proteger Rutas ---
// Este componente se asegura de que solo los usuarios autenticados vean el contenido
const RutaProtegida = ({ element: Element }) => {
    const { isAuthenticated, loading } = useAuth();

    // Si todavía estamos verificando la sesión inicial, mostramos una carga.
    if (loading) {
        return <div className="text-center p-5">Verificando sesión...</div>; 
    }
    
    // Si NO está autenticado, lo enviamos al login.
    // Si SÍ está autenticado, muestra el componente (Dashboard en este caso).
    return isAuthenticated ? <Element /> : <Navigate to="/login" replace />;
};


function App() {
  
  return (
    // ESTA LÍNEA ES CRÍTICA: ENVUELVE TODA LA APLICACIÓN
    // PARA QUE TODOS LOS COMPONENTES PUEDAN USAR useAuth().
    <AuthProvider> 
      <div className="App">
        <Routes>
          
          {/* Rutas de Acceso Público */}
          <Route path="/" element={<Navigate to="/login" replace />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-account" element={<VerifyAccount />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} /> 

          {/* Ruta Protegida: Solo visible si isAuthenticated es TRUE */}
          <Route 
              path="/dashboard" 
              element={<RutaProtegida element={Dashboard} />} 
          />
          
          {/* Ruta de Comodín (404) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
          
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;