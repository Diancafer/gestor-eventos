import React, { useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const API_URL = 'http://localhost:3000/api/metodo'; 

const initialFormData = {
  titulo: '',
  descripcion: '',
  fecha_inicio: '',
  fecha_fin: '',
  ubicacion: '',
  capacidad: 0,
};

const CreateEventForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleNumberChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    
    // Convertir capacidad a número y manejar el 0
    const capacidadNumerica = parseInt(formData.capacidad, 10) || 0;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(API_URL, {
        nombreMetodo: 'CREAR_EVENTO', 
        datos: { 
          ...formData,
          capacidad: capacidadNumerica
        },
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });

      const data = response.data;
      
      if (data.success) {
        setMensaje(` Evento "${formData.titulo}" creado con éxito. `);
        setIsSuccess(true);
        setFormData(initialFormData); 
      } else {
        const errorText = data.error || 'Error desconocido al crear el evento.';
        setMensaje(` Error: ${errorText}`);
        setIsSuccess(false);
      }
    } catch (err) {
      setMensaje(` Error de red/servidor: ${err.response?.data?.error || err.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {/* Mensajes de feedback */}
      {mensaje && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-fluid">
        
        <div className="field mb-3">
          <span className="p-float-label">
            <InputText id="titulo" name="titulo" value={formData.titulo} onChange={handleChange} required maxLength="255" />
            <label htmlFor="titulo">Título del Evento</label>
          </span>
        </div>

        <div className="field mb-3">
          <span className="p-float-label">
            <InputTextarea id="descripcion" name="descripcion" value={formData.descripcion} onChange={handleChange} rows={3} />
            <label htmlFor="descripcion">Descripción</label>
          </span>
        </div>

        <div className="field mb-3">
          <span className="p-float-label">
            <InputText type="datetime-local" id="fecha_inicio" name="fecha_inicio" value={formData.fecha_inicio} onChange={handleChange} required />
            <label htmlFor="fecha_inicio">Fecha y Hora de Inicio</label>
          </span>
        </div>

        <div className="field mb-3">
          <span className="p-float-label">
            <InputText type="datetime-local" id="fecha_fin" name="fecha_fin" value={formData.fecha_fin} onChange={handleChange} required />
            <label htmlFor="fecha_fin">Fecha y Hora de Fin</label>
          </span>
        </div>

        <div className="field mb-3">
          <span className="p-float-label">
            <InputText id="ubicacion" name="ubicacion" value={formData.ubicacion} onChange={handleChange} required maxLength="255" />
            <label htmlFor="ubicacion">Ubicación</label>
          </span>
        </div>

        <div className="field mb-4">
          <span className="p-float-label">
            <InputNumber 
              id="capacidad" 
              name="capacidad" 
              value={formData.capacidad} 
              onValueChange={(e) => handleNumberChange('capacidad', e.value)}
              mode="decimal"
              min={0}
              required 
            />
            <label htmlFor="capacidad">Capacidad Máxima</label>
          </span>
        </div>

        <Button type="submit" label="Crear Evento" icon="pi pi-calendar-plus" loading={loading} className="w-full primary-button" />
      </form>
    </div>
  );
};

export default CreateEventForm;