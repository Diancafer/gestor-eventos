import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // =======================================================
  // sCONFIGURACIÓN PARA FIJAR EL PUERTO
  // Esto resuelve el problema de CORS, ya que el backend (server.js)
  // está configurado para escuchar en http://localhost:5185.
  // =======================================================
  server: {
    // Fija el puerto del frontend a 5185.
    port: 5173, 
    
    //  Si el puerto 5185 está ocupado, Vite mostrará un error
    // en lugar de buscar automáticamente el siguiente puerto libre.
    strictPort: true 
  }
});