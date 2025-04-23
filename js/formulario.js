document.addEventListener("DOMContentLoaded", () => {
  // Verifica si hay un token en localStorage; si no existe, redirige a login
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "../index.html";
    return;
  }

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

  // Elemento reutilizable para mostrar mensajes de éxito o error
  const mensajeRespuesta = document.getElementById("mensajeRespuesta");

  // Modal de confirmación y sus elementos
  const confirmacionModalElement = document.getElementById("confirmacionModal");
  const confirmacionModal = new bootstrap.Modal(confirmacionModalElement);
  const confirmarRegistroBtn = document.getElementById("confirmarRegistroBtn");
  const modalCloseButton = document.getElementById("modalCloseButton");
  const editButton = confirmacionModalElement.querySelector(
    '.btn-secondary[data-bs-dismiss="modal"]'
  );
  const confirmButton = confirmarRegistroBtn;

  // Elementos del resumen dentro del modal
  const confirmacionFechaSpan = document.getElementById("confirmacion-fecha");
  const confirmacionHoraSpan = document.getElementById("confirmacion-hora");
  const confirmacionNombreSpan = document.getElementById("confirmacion-nombre");
  const confirmacionTipoVisitaSpan = document.getElementById(
    "confirmacion-tipoVisita"
  );
  const confirmacionCompaniaSpan = document.getElementById(
    "confirmacion-compania"
  );
  const confirmacionMotivoVisitaSpan = document.getElementById(
    "confirmacion-motivoVisita"
  );
  const confirmacionVisitaASpan = document.getElementById(
    "confirmacion-visitaA"
  );
  const confirmacionDepartamentoSpan = document.getElementById(
    "confirmacion-departamento"
  );

  /**
   * Actualiza los campos de fecha y hora en el formulario cada segundo
   */
  const actualizarFechaHoraInputs = () => {
    const ahora = new Date();
    fechaInput.value = ahora.toISOString().split("T")[0];
    horaInput.value = `${String(ahora.getHours()).padStart(2, "0")}:${String(
      ahora.getMinutes()
    ).padStart(2, "0")}`;
  };

  /**
   * Devuelve la fecha en formato DD/MM/YYYY
   */
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  /**
   * Devuelve la hora en formato 12 horas con AM/PM
   */
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12 || 12;
    return `${hours}:${String(minutes).padStart(2, "0")} ${ampm}`;
  };

  /**
   * Muestra un mensaje visual debajo del formulario
   * @param {string} mensaje - Texto a mostrar
   * @param {string} tipo - success | danger
   */
  const mostrarMensajeRespuesta = (mensaje, tipo) => {
    mensajeRespuesta.textContent = mensaje;
    mensajeRespuesta.className = `alert alert-${
      tipo === "danger" ? "danger" : "success"
    } text-center col-md-8`;
    mensajeRespuesta.classList.remove("d-none");
    setTimeout(() => mensajeRespuesta.classList.add("d-none"), 3000);
  };

  /**
   * Muestra un mensaje de error accesible junto al input
   */
  const mostrarError = (input, mensaje) => {
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
  };

  /**
   * Limpia los errores de validación del campo
   */
  const limpiarError = (input) => {
    const errorDiv = document.getElementById(`${input.id}-error`);
    if (errorDiv) errorDiv.remove();
    input.classList.remove("is-invalid");
    input.removeAttribute("aria-describedby");
  };

  const validarCampo = (input, mensaje) =>
    input.value.trim() === ""
      ? (mostrarError(input, mensaje), false)
      : (limpiarError(input), true);
  const validarSelect = (select, mensaje) =>
    select.value === "Selecciona..."
      ? (mostrarError(select, mensaje), false)
      : (limpiarError(select), true);

  /**
   * Valida todo el formulario antes de mostrar el modal
   */
  const validarFormulario = () =>
    validarCampo(nombreInput, "El nombre es requerido.") &&
    validarSelect(tipoVisitaSelect, "Selecciona un tipo de visita.") &&
    validarCampo(companiaInput, "El nombre de la compañía es requerido.") &&
    validarCampo(motivoVisitaInput, "El motivo de la visita es requerido.") &&
    validarCampo(
      visitaAInput,
      "El nombre de la persona a visitar es requerido."
    ) &&
    validarSelect(departamentoSelect, "Selecciona un departamento.");

  /**
   * Llena los campos del modal con los datos ingresados en el formulario
   */
  const llenarModalConfirmacion = () => {
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
  };

  // Al hacer clic en Registrar Entrada, valida y muestra el modal
  registrarEntradaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (validarFormulario()) {
      llenarModalConfirmacion();
      confirmacionModalElement.classList.contains("show")
        ? (confirmacionModalElement.addEventListener(
            "hidden.bs.modal",
            function onHidden() {
              confirmacionModal.show();
              confirmacionModalElement.removeEventListener(
                "hidden.bs.modal",
                onHidden
              );
            }
          ),
          confirmacionModal.hide())
        : confirmacionModal.show();
    }
  });

  // Accesibilidad: quitar el foco de los botones al cerrar el modal
  confirmacionModalElement.addEventListener("hide.bs.modal", () => {
    [editButton, confirmButton].forEach(
      (btn) => document.activeElement === btn && btn.blur()
    );
  });

  // Devuelve el foco al botón principal al cerrar el modal completamente
  confirmacionModalElement.addEventListener("closed.bs.modal", () => {
    registrarEntradaBtn?.focus();
  });

  // Enviar datos al backend al confirmar desde el modal
  confirmarRegistroBtn.addEventListener("click", () => {
    confirmacionModal.hide();

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
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensaje) {
          mostrarMensajeRespuesta(data.mensaje, "success");
          form.reset();
        } else {
          mostrarMensajeRespuesta(
            data.error || "Error al registrar la entrada.",
            "danger"
          );
        }
      })
      .catch(() => {
        mostrarMensajeRespuesta(
          "Ocurrió un error al intentar registrar la entrada.",
          "danger"
        );
      });
  });

  // Restablece los campos y errores del formulario al hacer clic en Limpiar
  limpiarDatosBtn.addEventListener("click", () => {
    [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
      (input) => {
        input.value = "";
        limpiarError(input);
      }
    );
    [tipoVisitaSelect, departamentoSelect].forEach((select) => {
      select.value = "Selecciona...";
      limpiarError(select);
    });
    form.classList.remove("was-validated");
  });

  // Remueve errores al escribir o cambiar selección
  [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
    (input) => input.addEventListener("input", () => limpiarError(input))
  );
  [tipoVisitaSelect, departamentoSelect].forEach((select) =>
    select.addEventListener("change", () => limpiarError(select))
  );

  // Inicializa y actualiza hora actual automáticamente
  actualizarFechaHoraInputs();
  setInterval(actualizarFechaHoraInputs, 1000);

  // Accesibilidad: devuelve foco al cerrar modal con botón
  modalCloseButton?.addEventListener("click", () => {
    modalCloseButton.blur();
    registrarEntradaBtn?.focus();
  });
});
