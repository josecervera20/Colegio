document.addEventListener("DOMContentLoaded", () => {
  // Espera carga completa del DOM
  const token = localStorage.getItem("token"); // Obtiene el token

  if (!token) {
    // Si no hay token, redirige a login
    window.location.href = "../index.html";
    return; // Detiene ejecución
  }

  // Formulario y campos
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

  // Modal de confirmación
  const confirmacionModalElement = document.getElementById("confirmacionModal");
  const confirmacionModal = new bootstrap.Modal(confirmacionModalElement);
  const confirmarRegistroBtn = document.getElementById("confirmarRegistroBtn");
  const mensajeExitoDiv = document.getElementById("mensajeExito");
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
  const modalCloseButton = document.getElementById("modalCloseButton");
  const editButton = confirmacionModalElement.querySelector(
    '.btn-secondary[data-bs-dismiss="modal"]'
  );
  const confirmButton = document.getElementById("confirmarRegistroBtn");

  // Formateo de fecha: DD/MM/YYYY
  const formatDate = (date) =>
    `${String(date.getDate()).padStart(2, "0")}/${String(
      date.getMonth() + 1
    ).padStart(2, "0")}/${date.getFullYear()}`;

  // Formateo de hora: HH:MM AM/PM
  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12 || 12;
    return `${String(hours).padStart(1, " ")}:${String(minutes).padStart(
      2,
      "0"
    )} ${ampm}`;
  };

  // Obtener hora: HH:MM (24 horas)
  const get24HourTime = (date) =>
    `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;

  // Actualizar inputs de fecha y hora
  const actualizarFechaHoraInputs = () => {
    const ahora = new Date();
    fechaInput.value = ahora.toISOString().split("T")[0];
    horaInput.value = get24HourTime(ahora);
  };

  // Mostrar mensaje de error
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

  // Limpiar mensaje de error
  const limpiarError = (input) => {
    const errorDiv = document.getElementById(`${input.id}-error`);
    if (errorDiv) {
      errorDiv.remove();
      input.classList.remove("is-invalid");
      input.removeAttribute("aria-describedby");
    }
  };

  // Validar campo de texto
  const validarCampo = (input, mensajeError) =>
    input.value.trim() === ""
      ? (mostrarError(input, mensajeError), false)
      : (limpiarError(input), true);

  // Validar select
  const validarSelect = (select, mensajeError) =>
    select.value === "Selecciona..."
      ? (mostrarError(select, mensajeError), false)
      : (limpiarError(select), true);

  // Validar formulario
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

  // Llenar datos en modal de confirmación
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

  // Registrar Entrada: Validar y mostrar modal
  registrarEntradaBtn.addEventListener("click", (event) => {
    event.preventDefault();
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

  // Antes de ocultar el modal: Quitar foco de botones
  confirmacionModalElement.addEventListener("hide.bs.modal", () => {
    [editButton, confirmButton].forEach(
      (btn) => document.activeElement === btn && btn.blur()
    );
  });

  // Al cerrar el modal: Devolver foco al botón Registrar Entrada
  confirmacionModalElement.addEventListener("closed.bs.modal", () => {
    if (
      registrarEntradaBtn &&
      !confirmacionModalElement.classList.contains("show")
    ) {
      registrarEntradaBtn.focus();
    }
  });

  // Confirmar Registro: Ocultar modal, enviar datos al backend, mostrar éxito y resetear form
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

    const token = localStorage.getItem("token"); // Obtiene el token del localStorage

    fetch("http://localhost:3000/api/registrar-entrada", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Agrega la cabecera Authorization con el token
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensaje) {
          mensajeExitoDiv.textContent = data.mensaje;
          mensajeExitoDiv.classList.remove("d-none");
          form.reset();
          form.classList.remove("was-validated");
          setTimeout(() => mensajeExitoDiv.classList.add("d-none"), 3000);
        } else if (data.error) {
          alert(`Error al registrar la entrada: ${data.error}`);
        }
      })
      .catch((error) => {
        console.error("Error al enviar los datos:", error);
        alert("Ocurrió un error al intentar registrar la entrada.");
      });
  });

  // Limpiar Datos: Resetear campos y errores
  limpiarDatosBtn.addEventListener("click", () => {
    [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
      (input) => (input.value = "")
    );
    [tipoVisitaSelect, departamentoSelect].forEach(
      (select) => (select.value = "Selecciona...")
    );
    [
      nombreInput,
      tipoVisitaSelect,
      companiaInput,
      motivoVisitaInput,
      visitaAInput,
      departamentoSelect,
    ].forEach(limpiarError);
    form.classList.remove("was-validated");
  });

  // Limpiar error al cambiar input
  [nombreInput, companiaInput, motivoVisitaInput, visitaAInput].forEach(
    (input) => input.addEventListener("input", () => limpiarError(input))
  );
  [tipoVisitaSelect, departamentoSelect].forEach((select) =>
    select.addEventListener("change", () => limpiarError(select))
  );

  // Inicializar fecha y hora, y actualizar cada segundo
  actualizarFechaHoraInputs();
  setInterval(actualizarFechaHoraInputs, 1000);

  // Botón cerrar modal: Quitar foco y devolverlo a Registrar Entrada
  if (modalCloseButton) {
    modalCloseButton.addEventListener("click", () => {
      modalCloseButton.blur();
      registrarEntradaBtn && registrarEntradaBtn.focus();
    });
  }
});
