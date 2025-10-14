import { Routes, Route, Navigate } from 'react-router-dom';

// Contexto de autenticación
import { AuthProvider, useAuth } from "./context/AuthContext.jsx"; 

// Componentes de Autenticación
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import VerifyAccount from "./components/VerifyAccount.jsx";      
import ForgotPassword from "./components/ForgotPassword.jsx";    
import ResetPassword from "./components/ResetPassword.jsx";       

// Estilos de PrimeReact
import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css';                
import 'primeicons/primeicons.css';                              
import 'primeflex/primeflex.css';                                

// --- Componente Placeholder del Dashboard ---
const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="p-5 text-center surface-card shadow-2 m-5 border-round">
      <h1>¡Bienvenido, {user?.nombre || 'Usuario'}! </h1>
      <button onClick={logout} className="p-button p-button-danger">
        Cerrar Sesión
      </button>
    </div>
  );
};

// --- Componente para Proteger Rutas ---
const RutaProtegida = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="text-center p-5">Verificando sesión...</div>; 
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider> 
      <div className="App">
        <Routes>
          {/* Rutas de Acceso Público */}
          <Route path="/" element={<Navigate to="/login" replace />} /> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyAccount />} /> 
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Ruta Protegida */}
          <Route 
            path="/dashboard" 
            element={<RutaProtegida element={<Dashboard />} />} 
          />
          
          {/* Ruta de Comodín (404) */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;