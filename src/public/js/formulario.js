// Autenticación
import verificarToken from "./modules/auth/verificarToken.js";

// Interfaz (UI)
import { actualizarFechaHoraInputs } from "./modules/ui/fechaHora.js";
import { llenarModalConfirmacion, toggleModal, gestionarFocoModal } from "./modules/ui/modal.js";
import { limpiarError } from "./modules/ui/errores.js";

// Lógica de formulario
import { validarFormulario } from "./modules/form/validacionFormulario.js";
import { enviarDatosFormulario, limpiarFormulario } from "./modules/form/formularioFunctions.js";

document.addEventListener("DOMContentLoaded", () => {
  // Verificar token antes de cualquier acción
  verificarToken();

  // Referencias a campos del formulario
  const form = document.querySelector("form");
  const fechaInput = document.getElementById("fecha");
  const horaInput = document.getElementById("hora");
  const nombreInput = document.getElementById("nombre");
  const tipoVisitaSelect = document.getElementById("tipoVisita");
  const companiaInput = document.getElementById("compania");
  const motivoVisitaInput = document.getElementById("motivoVisita");
  const visitaAInput = document.getElementById("visitaA");
  const departamentoSelect = document.getElementById("departamento");
  const limpiarDatosBtn = document.getElementById("limpiarDatos");
  const registrarEntradaBtn = document.querySelector('button[type="submit"]');
  const mensajeElemento = document.getElementById("mensajeRespuesta");

  // Modal y sus elementos
  const confirmacionModalElement = document.getElementById("confirmacionModal");
  const confirmacionModal = new bootstrap.Modal(confirmacionModalElement);
  const confirmarRegistroBtn = document.getElementById("confirmarRegistroBtn");
  const modalCloseButton = document.getElementById("modalCloseButton");
  const editButton = confirmacionModalElement.querySelector(
    '.btn-secondary[data-bs-dismiss="modal"]'
  );
  const confirmButton = confirmarRegistroBtn;

  // Elementos del modal
  const elementosModal = {
    nombreInput,
    tipoVisitaSelect,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    departamentoSelect,
    confirmacionFechaSpan: document.getElementById("confirmacion-fecha"),
    confirmacionHoraSpan: document.getElementById("confirmacion-hora"),
    confirmacionNombreSpan: document.getElementById("confirmacion-nombre"),
    confirmacionTipoVisitaSpan: document.getElementById(
      "confirmacion-tipoVisita"
    ),
    confirmacionCompaniaSpan: document.getElementById("confirmacion-compania"),
    confirmacionMotivoVisitaSpan: document.getElementById(
      "confirmacion-motivoVisita"
    ),
    confirmacionVisitaASpan: document.getElementById("confirmacion-visitaA"),
    confirmacionDepartamentoSpan: document.getElementById(
      "confirmacion-departamento"
    ),
  };

  // Agrupar elementos de formulario para validaciones/envío
  const elementosFormulario = {
    fechaInput,
    horaInput,
    nombreInput,
    tipoVisitaSelect,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    departamentoSelect,
  };

  // Accesibilidad: gestionar foco del modal
  gestionarFocoModal(
    confirmacionModalElement,
    editButton,
    confirmButton,
    registrarEntradaBtn
  );

  // Actualizar fecha y hora cada segundo
  actualizarFechaHoraInputs(fechaInput, horaInput);
  setInterval(() => actualizarFechaHoraInputs(fechaInput, horaInput), 1000);

  // Al hacer clic en Registrar Entrada
  registrarEntradaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validarFormulario(elementosFormulario)) {
      llenarModalConfirmacion(elementosModal);
      toggleModal(confirmacionModalElement, confirmacionModal);
    }
  });

  // Al confirmar en el modal, enviar formulario al backend
  confirmarRegistroBtn.addEventListener("click", () => {
    enviarDatosFormulario(
      elementosFormulario,
      form,
      confirmacionModal,
      mensajeElemento
    );
  });

  // Al hacer clic en Limpiar datos
  limpiarDatosBtn.addEventListener("click", () => {
    limpiarFormulario(elementosFormulario, form);
  });

  // Eliminar errores al editar campos
  [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
    (input) => input.addEventListener("input", () => limpiarError(input))
  );
  [tipoVisitaSelect, departamentoSelect].forEach((select) =>
    select.addEventListener("change", () => limpiarError(select))
  );

  // Al cerrar modal, devolver foco
  modalCloseButton?.addEventListener("click", () => {
    modalCloseButton.blur();
    registrarEntradaBtn?.focus();
  });
});
