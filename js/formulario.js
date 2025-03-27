document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const fechaInput = document.getElementById('fecha');
    const horaInput = document.getElementById('hora');
    const nombreInput = document.getElementById('nombre');
    const tipoVisitaSelect = document.getElementById('tipoVisita');
    const companiaInput = document.getElementById('compania');
    const motivoVisitaInput = document.getElementById('motivoVisita');
    const visitaAInput = document.getElementById('visitaA');
    const departamentoSelect = document.getElementById('departamento');
    const limpiarDatosBtn = document.getElementById('limpiarDatos');
    const registrarEntradaBtn = document.querySelector('button[type="submit"]');
    const confirmacionModalElement = document.getElementById('confirmacionModal');
    const confirmacionModal = new bootstrap.Modal(confirmacionModalElement);
    const confirmarRegistroBtn = document.getElementById('confirmarRegistroBtn');
    const mensajeExitoDiv = document.getElementById('mensajeExito');
    const confirmacionFechaSpan = document.getElementById('confirmacion-fecha');
    const confirmacionHoraSpan = document.getElementById('confirmacion-hora');
    const confirmacionNombreSpan = document.getElementById('confirmacion-nombre');
    const confirmacionTipoVisitaSpan = document.getElementById('confirmacion-tipoVisita');
    const confirmacionCompaniaSpan = document.getElementById('confirmacion-compania');
    const confirmacionMotivoVisitaSpan = document.getElementById('confirmacion-motivoVisita');
    const confirmacionVisitaASpan = document.getElementById('confirmacion-visitaA');
    const confirmacionDepartamentoSpan = document.getElementById('confirmacion-departamento');
    const modalElement = document.getElementById('confirmacionModal'); // Asegurar que modalElement esté definido

    // Función para formatear la fecha a DD/MM/YYYY
    const formatDate = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Función para formatear la hora a HH:MM AM/PM
    const formatTime = (date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'p. m.' : 'a. m.';
        hours = hours % 12;
        hours = hours ? hours : 12; // La hora '0' debe ser '12'
        return `${String(hours).padStart(1, ' ')}:${String(minutes).padStart(2, '0')} ${ampm}`;
    };

    // Función para obtener la hora en formato HH:MM (24 horas)
    const get24HourTime = (date) => {
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Función para actualizar la fecha y hora en los inputs
    const actualizarFechaHoraInputs = () => {
        const ahora = new Date();
        fechaInput.value = ahora.toISOString().split('T')[0];
        horaInput.value = get24HourTime(ahora); // Usar el formato de 24 horas para el input time
    };

    // Función para mostrar mensajes de error personalizados
    const mostrarError = (input, mensaje) => {
        const errorDiv = document.getElementById(`${input.id}-error`) || document.createElement('div');
        errorDiv.id = `${input.id}-error`;
        errorDiv.className = 'text-danger';
        errorDiv.textContent = mensaje;
        input.classList.add('is-invalid');
        input.parentNode.appendChild(errorDiv);
        input.setAttribute('aria-describedby', `${input.id}-error`);
    };

    // Función para limpiar mensajes de error
    const limpiarError = (input) => {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.remove();
            input.classList.remove('is-invalid');
            input.removeAttribute('aria-describedby');
        }
    };

    // Función para validar el formulario
    const validarFormulario = () => {
        let valido = true;
        valido = validarCampo(nombreInput, 'El nombre es requerido.') && valido;
        valido = validarSelect(tipoVisitaSelect, 'Selecciona un tipo de visita.') && valido;
        valido = validarCampo(companiaInput, 'El nombre de la compañía es requerido.') && valido;
        valido = validarCampo(motivoVisitaInput, 'El motivo de la visita es requerido.') && valido;
        valido = validarCampo(visitaAInput, 'El nombre de la persona a visitar es requerido.') && valido;
        valido = validarSelect(departamentoSelect, 'Selecciona un departamento.') && valido;
        return valido;
    };

    // Función auxiliar para validar campos de texto
    const validarCampo = (input, mensajeError) => {
        if (input.value.trim() === '') {
            mostrarError(input, mensajeError);
            return false;
        } else {
            limpiarError(input);
            return true;
        }
    };

    // Función auxiliar para validar selects
    const validarSelect = (select, mensajeError) => {
        if (select.value === 'Selecciona...') {
            mostrarError(select, mensajeError);
            return false;
        } else {
            limpiarError(select);
            return true;
        }
    };

    // Función para llenar los datos en el modal de confirmación
    const llenarModalConfirmacion = () => {
        const ahora = new Date();
        confirmacionFechaSpan.textContent = formatDate(ahora);
        confirmacionHoraSpan.textContent = formatTime(ahora);
        confirmacionNombreSpan.textContent = nombreInput.value;
        confirmacionTipoVisitaSpan.textContent = tipoVisitaSelect.options[tipoVisitaSelect.selectedIndex].text;
        confirmacionCompaniaSpan.textContent = companiaInput.value;
        confirmacionMotivoVisitaSpan.textContent = motivoVisitaInput.value;
        confirmacionVisitaASpan.textContent = visitaAInput.value;
        confirmacionDepartamentoSpan.textContent = departamentoSelect.options[departamentoSelect.selectedIndex].text;
    };

    // Evento al hacer clic en el botón "Registrar Entrada"
    registrarEntradaBtn.addEventListener('click', function (event) {
        event.preventDefault();
        if (validarFormulario()) {
            llenarModalConfirmacion();
            confirmacionModal.show();
        }
    });

    // Evento al cerrar el modal
    modalElement.addEventListener('hide.bs.modal', function (event) {
        // No es necesario realizar ninguna acción específica al cerrar el modal para edición
    });

    // Evento al confirmar el registro en el modal
    confirmarRegistroBtn.addEventListener('click', function () {
        confirmacionModal.hide();
        mensajeExitoDiv.classList.remove('d-none');
        form.reset();
        form.classList.remove('was-validated');
        setTimeout(() => {
            mensajeExitoDiv.classList.add('d-none');
        }, 3000);
    });

    // Evento al hacer clic en el botón "Limpiar Datos"
    limpiarDatosBtn.addEventListener('click', function() {
        nombreInput.value = '';
        tipoVisitaSelect.value = 'Selecciona...';
        companiaInput.value = '';
        motivoVisitaInput.value = '';
        visitaAInput.value = '';
        departamentoSelect.value = 'Selecciona...';

        // Limpiar mensajes de error explícitamente
        limpiarError(nombreInput);
        limpiarError(tipoVisitaSelect);
        limpiarError(companiaInput);
        limpiarError(motivoVisitaInput);
        limpiarError(visitaAInput);
        limpiarError(departamentoSelect);

        form.classList.remove('was-validated');
    });

    // Limpiar errores al cambiar los inputs
    nombreInput.addEventListener('input', () => limpiarError(nombreInput));
    tipoVisitaSelect.addEventListener('change', () => limpiarError(tipoVisitaSelect));
    companiaInput.addEventListener('input', () => limpiarError(companiaInput));
    motivoVisitaInput.addEventListener('input', () => limpiarError(motivoVisitaInput));
    visitaAInput.addEventListener('input', () => limpiarError(visitaAInput));
    departamentoSelect.addEventListener('change', () => limpiarError(departamentoSelect));

    // Inicializar la fecha y hora en los inputs
    actualizarFechaHoraInputs();
    setInterval(actualizarFechaHoraInputs, 1000);
});