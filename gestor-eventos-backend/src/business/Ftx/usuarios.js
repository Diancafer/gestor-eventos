// src/ftx/Usuarios.js
import asignarRolesATX from '../Atx/asignar_roles.js';
import contratarPersonalATX from '../Atx/contratar_personal.js';

export default class Usuarios {
  async asignar_roles(usuarioId, datos) {
    asignarRolesATX.validar(datos);
    return await asignarRolesATX.ejecutar(usuarioId, datos);
  }

  async contratar_personal(usuarioId, datos) {
    contratarPersonalATX.validar(datos);
    return await contratarPersonalATX.ejecutar(usuarioId, datos);
  }
}
