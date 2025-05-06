// Importar utilidades de fecha y hora
import { formatDate, formatTime } from "./fechaHora.js";

/**
 * Llena los campos del modal con los datos ingresados en el formulario
 * @param {Object} elementos - Objeto con referencias a inputs y spans del modal
 */
export function llenarModalConfirmacion(elementos) {
  const {
    nombreInput,
    tipoVisitaSelect,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    departamentoSelect,
    confirmacionFechaSpan,
    confirmacionHoraSpan,
    confirmacionNombreSpan,
    confirmacionTipoVisitaSpan,
    confirmacionCompaniaSpan,
    confirmacionMotivoVisitaSpan,
    confirmacionVisitaASpan,
    confirmacionDepartamentoSpan,
  } = elementos;

  const ahora = new Date();
  confirmacionFechaSpan.textContent = formatDate(ahora);
  confirmacionHoraSpan.textContent = formatTime(ahora);
  confirmacionNombreSpan.textContent = nombreInput.value;
  confirmacionTipoVisitaSpan.textContent =
    tipoVisitaSelect.options[tipoVisitaSelect.selectedIndex].text;
  confirmacionCompaniaSpan.textContent = companiaInput.value;
  confirmacionMotivoVisitaSpan.textContent = motivoVisitaInput.value;
  confirmacionVisitaASpan.textContent = visitaAInput.value;
  confirmacionDepartamentoSpan.textContent =
    departamentoSelect.options[departamentoSelect.selectedIndex].text;
}

/**
 * Muestra u oculta el modal de confirmación
 * @param {HTMLElement} modalElement - Elemento del modal
 * @param {Object} modalInstance - Instancia de bootstrap.Modal
 */
export function toggleModal(modalElement, modalInstance) {
  if (modalElement.classList.contains("show")) {
    modalInstance.hide();
  } else {
    modalInstance.show();
  }
}

/**
 * Gestiona el foco en los botones al cerrar o abrir el modal (accesibilidad)
 * @param {HTMLElement} modalElement - Elemento del modal
 * @param {HTMLElement} editButton - Botón para editar
 * @param {HTMLElement} confirmButton - Botón para confirmar registro
 * @param {HTMLElement} registrarBtn - Botón principal de registrar
 */
export function gestionarFocoModal(
  modalElement,
  editButton,
  confirmButton,
  registrarBtn
) {
  modalElement.addEventListener("hide.bs.modal", () => {
    [editButton, confirmButton].forEach(
      (btn) => document.activeElement === btn && btn.blur()
    );
  });
  modalElement.addEventListener("hidden.bs.modal", () => {
    registrarBtn?.focus();
  });
}
