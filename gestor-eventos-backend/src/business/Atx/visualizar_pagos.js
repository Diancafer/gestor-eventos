// src/atx/visualizar_pagos.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

const db = new DBComponent();
const visualizarPagosATX = {
  validar(datos) {
    
  },

  async ejecutar(usuarioId, datos = {}) {
    const query = getQuery('selectPagosPorUsuario');
    const result = await db.executeQuery(query, [usuarioId]);

    if (result.rows.length === 0) {
      return { success: true, pagos: [] };
    }

    return { success: true, pagos: result.rows };
  }
};

export default visualizarPagosATX;