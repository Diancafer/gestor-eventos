// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext'; 

// 🛑 AÑADIR ESTA LÍNEA AQUÍ
import 'bootstrap/dist/css/bootstrap.min.css'; 

// Opcional: Si tienes tu propio archivo CSS global, déjalo también
import './index.css'; 


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> 
      <AuthProvider> 
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);