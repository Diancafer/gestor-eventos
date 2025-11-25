import db from '../config/db.js';
import { getQuery } from '../utils/queryLoader.js';
import { validarCampos } from '../utils/validator.js';

export function validar(datos) {
  validarCampos(['nombre', 'apellido', 'email', 'rol_id', 'empresa_id'], datos);
}

export default async function contratar_personal(usuarioId, datos) {
  const queryUsuario = getQuery('insertUsuario');
  const result = await db.query(queryUsuario, [datos.email, datos.rol_id, datos.empresa_id]);
  const nuevoUsuarioId = result.rows[0].id;

  const queryPerfil = getQuery('insertPerfil');
  await db.query(queryPerfil, [nuevoUsuarioId, datos.nombre, datos.apellido]);
  return { success: true, id: nuevoUsuarioId };
}