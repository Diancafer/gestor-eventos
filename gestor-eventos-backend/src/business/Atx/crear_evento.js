import DBComponent from '../../config/db.js';
import { getQuery } from '../../utils/queryLoader.js';
import { validarCampos } from '../../utils/validator.js';

const db = new DBComponent();

const crearEventoATX = {
  validar(datos) {
    validarCampos(['titulo', 'fecha_inicio', 'fecha_fin', 'ubicacion', 'capacidad'], datos);
  },

  async ejecutar(usuarioId, datos) {
    const query = getQuery('insertEvento');
    const result = await db.executeQuery(query, [
      datos.titulo,
      datos.descripcion,
      datos.fecha_inicio,
      datos.fecha_fin,
      datos.ubicacion,
      datos.capacidad,
      usuarioId
    ]);

    if (result.length === 0) {
      throw new Error('No se pudo crear el evento');
    }

    return { success: true, id: result[0].id };
  }
};

export default crearEventoATX;