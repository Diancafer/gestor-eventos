import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';

export function validar(datos) {
  validarCampos(['titulo', 'fecha_inicio', 'fecha_fin', 'ubicacion', 'capacidad'], datos);
}

export default async function crear_evento(usuarioId, datos) {
  const query = getQuery('insertEvento');
  const result = await db.query(query, [
    datos.titulo, datos.descripcion, datos.fecha_inicio,
    datos.fecha_fin, datos.ubicacion, datos.capacidad, usuarioId
  ]);
  return { success: true, id: result.rows[0].id };
}