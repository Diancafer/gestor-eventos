export function validarCampos(campos, datos) {
  for (const campo of campos) {
    if (!datos[campo]) {
      throw new Error(`Campo requerido faltante: ${campo}`);
    }
  }
}