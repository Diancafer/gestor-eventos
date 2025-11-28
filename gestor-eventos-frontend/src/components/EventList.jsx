import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'primereact/button';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';

// URL de la API de transacciones
const API_URL = 'http://localhost:3000/api/metodo'; 

const EventList = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mensajeTx, setMensajeTx] = useState('');

  // Función para cargar los eventos
  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      setMensajeTx('');

      const token = localStorage.getItem('token');
      if (!token) throw new Error('Token no disponible');

      const response = await axios.post(API_URL, {
        nombreMetodo: 'visualizar_eventos', 
        datos: {}, 
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });

      if (response.data.success) {
        setEventos(response.data.eventos);
      } else {
        setError(response.data.error || 'Error al cargar eventos.');
      }
    } catch (err) {
      setError(err.message || 'Error de red al conectar con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // Función para reservar un lugar en un evento
  const handleRegistro = async (evento_id) => {
    try {
      setMensajeTx(`Registrando en el evento ${evento_id}...`);
      const token = localStorage.getItem('token');

      const response = await axios.post(API_URL, {
        nombreMetodo: 'reservar_lugar',
        datos: { evento_id },
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });
      
      if (response.data.success) {
        setMensajeTx(`✅ ${response.data.mensaje || 'Reserva confirmada'}`);
      } else {
        setMensajeTx(`❌ Error al registrar: ${response.data.error || 'Inténtelo de nuevo.'}`);
      }
    } catch (err) {
      setMensajeTx(`❌ Error de red/servidor: ${err.response?.data?.error || err.message}`);
    }
  };

  if (loading) {
    return <div className="text-center"><ProgressSpinner style={{width: '40px', height: '40px'}} /></div>;
  }

  if (error) {
    return <div className="alert alert-error">Error: {error}</div>;
  }

  return (
    <div className="event-list-container">
      {mensajeTx && <div className={`alert ${mensajeTx.includes('❌') ? 'alert-error' : 'alert-success'}`}>{mensajeTx}</div>}

      {eventos.length === 0 ? (
        <p>No hay eventos activos disponibles en este momento.</p>
      ) : (
        <div className="grid">
          {eventos.map((evento) => (
            <div key={evento.id} className="col-12 md:col-6">
              <Card title={evento.titulo} className="event-card">
                <p><strong>Ubicación:</strong> {evento.ubicacion}</p>
                <p><strong>Inicio:</strong> {new Date(evento.fecha_inicio).toLocaleDateString()}</p>
                <p><strong>Capacidad:</strong> {evento.capacidad}</p>
                
                <Button 
                  label="Reservar Lugar"
                  icon="pi pi-ticket"
                  className="mt-3 p-button-sm primary-button"
                  onClick={() => handleRegistro(evento.id)}
                />
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;