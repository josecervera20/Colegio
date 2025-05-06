/**
 * Actualiza los campos de fecha y hora en el formulario cada segundo
 * @param {HTMLInputElement} fechaInput - Campo de fecha
 * @param {HTMLInputElement} horaInput - Campo de hora
 */
export function actualizarFechaHoraInputs(fechaInput, horaInput) {
  const ahora = new Date();
  fechaInput.value = ahora.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  horaInput.value = `${String(ahora.getHours()).padStart(2, "0")}:${String(
    ahora.getMinutes()
  ).padStart(2, "0")}`; // Formato HH:mm
}

/**
 * Formatea una fecha en formato DD/MM/YYYY
 * @param {Date} date - Fecha a formatear
 * @returns {string} - Fecha formateada
 */
export function formatDate(date) {
  return `${String(date.getDate()).padStart(2, "0")}/${String(
    date.getMonth() + 1
  ).padStart(2, "0")}/${date.getFullYear()}`;
}

/**
 * Formatea una hora en formato de 12 horas con AM/PM
 * @param {Date} date - Hora a formatear
 * @returns {string} - Hora formateada
 */
export function formatTime(date) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "p. m." : "a. m.";
  hours = hours % 12 || 12;
  return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
}
