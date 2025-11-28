import React, { useState } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const API_URL = 'http://localhost:3000/api/metodo'; 

const initialFormData = {
  monto: null,
  referencia: '',
};

const PaymentForm = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje(null);
    
    const montoNumerico = parseFloat(formData.monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      setMensaje('❌ El monto debe ser un número positivo.');
      setIsSuccess(false);
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('token');
    
    try {
      const response = await axios.post(API_URL, {
        nombreMetodo: 'pagar', 
        datos: { 
          monto: montoNumerico, 
          referencia: formData.referencia 
        },
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });

      const data = response.data;
      
      if (data.success) {
        setMensaje(`✅ Pago por $${montoNumerico.toFixed(2)} registrado con éxito. ID de Pago: ${data.id}`);
        setIsSuccess(true);
        setFormData(initialFormData); 
      } else {
        const errorText = data.error || 'Error desconocido al procesar el pago.';
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
      {mensaje && (
        <div className={`alert ${isSuccess ? 'alert-success' : 'alert-error'}`}>
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-fluid">
        
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
            <label htmlFor="monto">Monto a Pagar ($)</label>
          </span>
        </div>
        
        {/* Referencia */}
        <div className="field mb-4">
          <span className="p-float-label">
            <InputText
              id="referencia"
              name="referencia"
              value={formData.referencia}
              onChange={handleChange}
              required
              maxLength="100"
            />
            <label htmlFor="referencia">Referencia de Transacción</label>
          </span>
        </div>

        <Button type="submit" label="Pagar" icon="pi pi-credit-card" loading={loading} className="w-full primary-button" />
      </form>
    </div>
  );
};

export default PaymentForm;