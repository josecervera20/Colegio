// Interfaz: mostrar mensajes de éxito/error y manejar formulario
import { mostrarMensajeRespuesta } from "../ui/mensaje.js";

/**
 * Envía los datos del formulario al backend al confirmar desde el modal
 * @param {Object} elementos - Objeto con referencias a inputs y selects del formulario
 * @param {HTMLElement} form - El elemento <form> para resetearlo después
 * @param {Object} modalInstance - Instancia de bootstrap.Modal para ocultar el modal
 * @param {HTMLElement} mensajeElemento - Elemento donde se muestra el mensaje de respuesta
 */
export function enviarDatosFormulario(
  {
    fechaInput,
    horaInput,
    nombreInput,
    tipoVisitaSelect,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    departamentoSelect,
  },
  form,
  modalInstance,
  mensajeElemento
) {
  modalInstance.hide();

  const formData = {
    fecha: fechaInput.value,
    hora: horaInput.value,
    nombre: nombreInput.value,
    tipoVisita: tipoVisitaSelect.value,
    compania: companiaInput.value,
    motivoVisita: motivoVisitaInput.value,
    visitaA: visitaAInput.value,
    departamento: departamentoSelect.value,
  };

  fetch("http://localhost:3000/api/registrar-entrada", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.mensaje) {
        mostrarMensajeRespuesta(mensajeElemento, data.mensaje, "success");
        form.reset();
      } else {
        mostrarMensajeRespuesta(
          mensajeElemento,
          data.error || "Error al registrar la entrada.",
          "danger"
        );
      }
    })
    .catch(() => {
      mostrarMensajeRespuesta(
        mensajeElemento,
        "Ocurrió un error al intentar registrar la entrada.",
        "danger"
      );
    });
}

/**
 * Resetea el formulario y limpia errores al hacer clic en Limpiar
 * @param {Object} elementos - Objeto con referencias a inputs y selects del formulario
 * @param {HTMLElement} form - El elemento <form> para limpiar clase was-validated
 */
export function limpiarFormulario(elementos, form) {
  const {
    nombreInput,
    companiaInput,
    motivoVisitaInput,
    visitaAInput,
    tipoVisitaSelect,
    departamentoSelect,
  } = elementos;

  [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
    (input) => {
      input.value = "";
    }
  );

  [tipoVisitaSelect, departamentoSelect].forEach((select) => {
    select.value = "Selecciona...";
  });

  form.classList.remove("was-validated");
}
