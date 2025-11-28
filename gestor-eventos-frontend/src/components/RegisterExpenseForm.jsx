import React, { useState } from 'react';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const API_URL = 'http://localhost:3000/api/metodo'; 

const initialFormData = {
  descripcion: '',
  monto: null,
  evento_id: null,
};

const RegisterExpenseForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

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
    
    // Validaciones básicas
    if (!formData.monto || parseFloat(formData.monto) <= 0 || !formData.evento_id) {
      setMensaje('❌ El monto y el ID del evento son requeridos y deben ser válidos.');
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(API_URL, {
        nombreMetodo: 'registrar_gasto', 
        datos: { 
          descripcion: formData.descripcion,
          monto: parseFloat(formData.monto), 
          evento_id: parseInt(formData.evento_id, 10), 
        },
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });

      const data = response.data;
      
      if (data.success) {
        setMensaje(`✅ Gasto de $${parseFloat(formData.monto).toFixed(2)} registrado con éxito. ID: ${data.id}`);
        setIsSuccess(true);
        setFormData(initialFormData); 
      } else {
        const errorText = data.error || 'Error desconocido al registrar el gasto.';
        setMensaje(`❌ Error: ${errorText}`);
        setIsSuccess(false);
      }
    } catch (err) {
      setMensaje(`❌ Error de red/servidor: ${err.response?.data?.error || err.message}`);
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
        
        {/* ID del Evento */}
        <div className="field mb-3">
          <span className="p-float-label">
            <InputNumber 
              id="evento_id"
              name="evento_id"
              value={formData.evento_id}
              onValueChange={(e) => handleNumberChange('evento_id', e.value)}
              min={1}
              required
            />
            <label htmlFor="evento_id">ID del Evento</label>
          </span>
        </div>

        {/* Monto */}
        <div className="field mb-3">
          <span className="p-float-label">
            <InputNumber
              id="monto"
              name="monto"
              value={formData.monto}
              onValueChange={(e) => handleNumberChange('monto', e.value)}
              mode="currency"
              currency="USD"
              locale="en-US"
              min={0.01}
              required
            />
            <label htmlFor="monto">Monto ($)</label>
          </span>
        </div>
        
        {/* Descripción */}
        <div className="field mb-4">
          <span className="p-float-label">
            <InputTextarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              rows={3}
              required
            />
            <label htmlFor="descripcion">Descripción / Concepto</label>
          </span>
        </div>

        <Button type="submit" label="Registrar Gasto" icon="pi pi-dollar" loading={loading} className="w-full primary-button" />
      </form>
    </div>
  );
};

export default RegisterExpenseForm;