/**
 * Muestra un mensaje de alerta (éxito o error)
 * @param {string} mensaje - Texto del mensaje
 * @param {string} tipo - 'success' o 'danger'
 * @param {HTMLFormElement} formulario - Formulario donde insertar el mensaje
 * @param {HTMLElement} botonEnviar - Elemento de referencia para insertar el mensaje
 */
export default function mostrarMensaje(mensaje, tipo, formulario, botonEnviar) {
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
