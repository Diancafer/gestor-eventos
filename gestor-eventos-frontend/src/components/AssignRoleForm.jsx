import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';

const API_TX_URL = 'http://localhost:3000/api/metodo'; 
const API_AUTH_URL = 'http://localhost:3000/api/auth'; 

const initialFormData = {
  usuario_target_id: null,
  nuevo_rol_id: null,
};

const AssignRoleForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingRoles, setLoadingRoles] = useState(true);
  const [mensaje, setMensaje] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Cargar la lista de roles
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(`${API_AUTH_URL}/roles`); 
        const opciones = response.data.map((rol) => ({
          label: `${rol.nombre} (ID: ${rol.id})`,
          value: rol.id,
        }));
        setRoles(opciones);
      } catch (err) {
        setMensaje('❌ Error al cargar la lista de roles.');
      } finally {
        setLoadingRoles(false);
      }
    };
    fetchRoles();
  }, []);

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
    
    const { usuario_target_id, nuevo_rol_id } = formData;
    const token = localStorage.getItem('token');

    try {
      const response = await axios.post(API_TX_URL, {
        nombreMetodo: 'asignar_roles', 
        datos: { 
          usuario_target_id,
          nuevo_rol_id,
        },
      }, {
        headers: { 'Authorization': `Bearer ${token}` },
        withCredentials: true,
      });

      const data = response.data;
      
      if (data.success) {
        setMensaje(`✅ Rol actualizado para el usuario ${usuario_target_id}.`);
        setIsSuccess(true);
        setFormData(initialFormData); 
      } else {
        const errorText = data.error || 'Error desconocido al asignar el rol.';
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
        
        {/* ID del Usuario a Modificar */}
        <div className="field mb-3">
          <span className="p-float-label">
            <InputNumber 
              id="usuario_target_id"
              name="usuario_target_id"
              value={formData.usuario_target_id}
              onValueChange={(e) => handleNumberChange('usuario_target_id', e.value)}
              min={1}
              required
            />
            <label htmlFor="usuario_target_id">ID del Usuario a Modificar</label>
          </span>
        </div>

        {/* Selección de Nuevo Rol */}
        <div className="field mb-4">
          <span className="p-float-label">
            <Dropdown
              id="nuevo_rol_id"
              value={formData.nuevo_rol_id}
              options={roles}
              onChange={(e) => setFormData(prev => ({ ...prev, nuevo_rol_id: e.value }))}
              disabled={loading || loadingRoles || roles.length === 0}
              placeholder={loadingRoles ? "Cargando roles..." : "Seleccione un rol"}
              required
            />
            <label htmlFor="nuevo_rol_id">Nuevo Rol</label>
          </span>
        </div>

        <Button type="submit" label="Asignar Rol" icon="pi pi-user-edit" loading={loading} className="w-full primary-button" />
      </form>
    </div>
  );
};

export default AssignRoleForm;