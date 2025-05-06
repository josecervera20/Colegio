/**
 * Muestra un mensaje visual debajo del formulario
 * @param {HTMLElement} elemento - El elemento donde se mostrará el mensaje
 * @param {string} mensaje - Texto a mostrar
 * @param {string} tipo - 'success' | 'danger'
 */
export function mostrarMensajeRespuesta(elemento, mensaje, tipo) {
  elemento.textContent = mensaje;
  elemento.className = `alert alert-${
    tipo === "danger" ? "danger" : "success"
  } text-center col-md-8`;
  elemento.classList.remove("d-none");
  setTimeout(() => elemento.classList.add("d-none"), 3000);
}
