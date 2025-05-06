/**
 * Muestra un mensaje de error accesible junto al input
 * @param {HTMLElement} input - El input al que se le mostrará el error
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
 * @param {HTMLElement} input - El input cuyo error se limpiará
 */
export function limpiarError(input) {
  const errorDiv = document.getElementById(`${input.id}-error`);
  if (errorDiv) errorDiv.remove();
  input.classList.remove("is-invalid");
  input.removeAttribute("aria-describedby");
}

/**
 * Valida un campo de texto
 * @param {HTMLElement} input - El campo a validar
 * @param {string} mensaje - El mensaje a mostrar si está vacío
 * @returns {boolean} - true si es válido, false si no lo es
 */
export function validarCampo(input, mensaje) {
  return input.value.trim() === ""
    ? (mostrarError(input, mensaje), false)
    : (limpiarError(input), true);
}

/**
 * Valida un select
 * @param {HTMLSelectElement} select - El select a validar
 * @param {string} mensaje - El mensaje a mostrar si no se selecciona opción
 * @returns {boolean} - true si es válido, false si no lo es
 */
export function validarSelect(select, mensaje) {
  return select.value === "Selecciona..."
    ? (mostrarError(select, mensaje), false)
    : (limpiarError(select), true);
}

/**
 * Valida todo el formulario antes de mostrar el modal
 * @param {Object} elementos - Objeto con los inputs y selects del formulario
 * @returns {boolean} - true si todos los campos son válidos
 */
export function validarFormulario(elementos) {
  const {
    nombreInput,
    tipoVisitaSelect,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    departamentoSelect,
  } = elementos;

  return (
    validarCampo(nombreInput, "El nombre es requerido.") &&
    validarSelect(tipoVisitaSelect, "Selecciona un tipo de visita.") &&
    validarCampo(companiaInput, "El nombre de la compañía es requerido.") &&
    validarCampo(motivoVisitaInput, "El motivo de la visita es requerido.") &&
    validarCampo(
      visitaAInput,
      "El nombre de la persona a visitar es requerido."
    ) &&
    validarSelect(departamentoSelect, "Selecciona un departamento.")
  );
}
