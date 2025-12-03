import DBComponent from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';

export default class CrearEvento {
  validar(datos) {
    validarCampos(['titulo', 'fecha_inicio', 'fecha_fin', 'ubicacion', 'capacidad'], datos);
  }

  async ejecutar(usuarioId, datos) {
    const query = getQuery('insertEvento');
    const result = await db.query(query, [
      datos.titulo, datos.descripcion, datos.fecha_inicio,
      datos.fecha_fin, datos.ubicacion, datos.capacidad, usuarioId
    ]);
    return { success: true, id: result.rows[0].id };
  }
}

