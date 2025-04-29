/**
 * Muestra un mensaje de alerta (éxito o error)
 * @param {HTMLFormElement} formulario - Formulario donde se insertará el mensaje
 * @param {HTMLButtonElement} botonEnviar - Botón de envío, antes del cual se insertará el mensaje
 * @param {string} mensaje - Texto del mensaje
 * @param {string} tipo - Tipo de mensaje: 'success' o 'danger'
 */
export function mostrarMensaje(formulario, botonEnviar, mensaje, tipo) {
  const clasesMensaje = {
    success: "alert-success",
    danger: "alert-danger",
  };

  const mensajeDiv = document.createElement("div");
  mensajeDiv.classList.add(
    "alert",
    clasesMensaje[tipo],
    "fade",
    "show",
    "text-center"
  );
  mensajeDiv.textContent = mensaje;

  formulario.insertBefore(mensajeDiv, botonEnviar);

  // Eliminar el mensaje después de 3 segundos
  setTimeout(() => {
    mensajeDiv.remove();
  }, 3000);
}
