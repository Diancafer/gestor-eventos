// src/atx/visualizar_eventos.js
import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';

const db = new DBComponent();

const visualizarEventosATX = {
  validar(datos) {
   
  },

  async ejecutar(usuarioId, datos = {}) {
  const query = getQuery('selectEventosActivos');
  const result = await db.executeQuery(query, ['cancelado']);

  
  if (!result || result.length === 0) {
    return [];
  }

  return result; // devuelve array directamente
}
};

export default visualizarEventosATX;