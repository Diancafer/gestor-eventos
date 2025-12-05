import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';

const API_URL = 'http://localhost:3000/api/metodo'; 

const UserPayments = () => {
  const [pagos, setPagos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Token no disponible');

        const response = await axios.post(API_URL, {
          nombreMetodo: 'VISUALIZAR_PAGOS', 
          datos: {}, 
        }, {
          headers: { 'Authorization': `Bearer ${token}` },
          withCredentials: true,
        });

        if (response.data.success) {
          // Aseguramos que el monto sea un número para el template
          const dataPagos = response.data.pagos.map(p => ({
              ...p,
              monto: parseFloat(p.monto) 
          }));
          setPagos(dataPagos); 
        } else {
          setError(response.data.error || 'Error al cargar pagos.');
        }
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Error de red.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) {
    return <div className="text-center"><ProgressSpinner style={{width: '40px', height: '40px'}} /></div>;
  }

  if (error) {
    return <div className="alert alert-error">❌ Error: {error}</div>;
  }
  
  const formatCurrency = (rowData) => {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(rowData.monto);
  };


  return (
    <div className="payment-history-container">
      {pagos.length === 0 ? (
        <p className="text-center">No has realizado ningún pago registrado en el sistema.</p>
      ) : (
        <DataTable value={pagos} responsiveLayout="scroll" stripedRows emptyMessage="No hay pagos.">
          <Column field="id" header="ID Pago" sortable style={{ width: '20%' }}></Column>
          <Column field="monto" header="Monto" body={formatCurrency} sortable style={{ width: '30%' }}></Column>
          <Column field="referencia" header="Referencia" sortable style={{ width: '50%' }}></Column>
          {/* Note: Fecha y Estado requieren que se modifique la query SQL 'selectPagosPorUsuario' */}
        </DataTable>
      )}
    </div>
  );
};

export default UserPayments;