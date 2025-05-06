/**
 * Muestra un mensaje de error accesible junto al input
 * @param {HTMLElement} input - El campo de formulario al que se asocia el error
 * @param {string} mensaje - El mensaje de error a mostrar
 */
export function mostrarError(input, mensaje) {
  let errorDiv =
    document.getElementById(`${input.id}-error`) ||
    Object.assign(document.createElement("div"), {
      id: `${input.id}-error`,
      className: "text-danger",
      textContent: mensaje,
    });
  input.parentNode.appendChild(errorDiv);
  input.classList.add("is-invalid");
  input.setAttribute("aria-describedby", `${input.id}-error`);
}

/**
 * Limpia los errores de validación del campo
 * @param {HTMLElement} input - El campo de formulario cuyo error se limpiará
 */
export function limpiarError(input) {
  const errorDiv = document.getElementById(`${input.id}-error`);
  if (errorDiv) errorDiv.remove();
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-describedby");
}

/**
 * Valida un campo de texto
 * @param {HTMLInputElement} input - El campo de texto a validar
 * @param {string} mensaje - Mensaje de error si el campo está vacío
 * @returns {boolean} - true si es válido, false si no lo es
 */
export function validarCampo(input, mensaje) {
  return input.value.trim() === ""
    ? (mostrarError(input, mensaje), false)
    : (limpiarError(input), true);
}

/**
 * Valida un campo select
 * @param {HTMLSelectElement} select - El select a validar
 * @param {string} mensaje - Mensaje de error si no se selecciona opción válida
 * @returns {boolean} - true si es válido, false si no lo es
 */
export function validarSelect(select, mensaje) {
  return select.value === "Selecciona..."
    ? (mostrarError(select, mensaje), false)
    : (limpiarError(select), true);
}
