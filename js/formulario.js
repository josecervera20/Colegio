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
    const confirmacionModal = new bootstrap.Modal(document.getElementById('confirmacionModal'));
    const datosRegistroLista = document.getElementById('datosRegistro');
    const confirmarRegistroBtn = document.getElementById('confirmarRegistroBtn');
    const mensajeExitoDiv = document.getElementById('mensajeExito');

    // Función para actualizar la fecha y hora
    function actualizarFechaHora() {
        const ahora = new Date();
        const fecha = ahora.toISOString().split('T')[0];
        const hora = ahora.toTimeString().split(' ')[0].slice(0, 5); // Obtener HH:MM

        fechaInput.value = fecha;
        horaInput.value = hora;
    }

    // Actualizar fecha y hora al cargar la página y cada segundo
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);

    // Función para mostrar mensajes de error personalizados
    function mostrarError(input, mensaje) {
        const errorDiv = document.getElementById(`${input.id}-error`) || document.createElement('div');
        errorDiv.id = `${input.id}-error`;
        errorDiv.className = 'text-danger';
        errorDiv.textContent = mensaje;
        input.classList.add('is-invalid');
        input.classList.remove('is-valid'); // Asegurarse de que no esté la palomita verde
        input.parentNode.appendChild(errorDiv);
        input.setAttribute('aria-describedby', `${input.id}-error`);
    }

    // Función para limpiar mensajes de error
    function limpiarError(input) {
        const errorDiv = document.getElementById(`${input.id}-error`);
        if (errorDiv) {
            errorDiv.remove();
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid'); // Asegurarse de que no esté la palomita verde
            input.removeAttribute('aria-describedby');
        }
    }

    registrarEntradaBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Evitar el envío automático del formulario
        let valido = true;

        // Realizar validaciones personalizadas y mostrar mensajes de error
        if (nombreInput.value.trim() === '') {
            mostrarError(nombreInput, 'El nombre es requerido.');
            valido = false;
        } else {
            limpiarError(nombreInput);
        }

        if (tipoVisitaSelect.value === 'Selecciona...') {
            mostrarError(tipoVisitaSelect, 'Selecciona un tipo de visita.');
            valido = false;
        } else {
            limpiarError(tipoVisitaSelect);
        }

        if (companiaInput.value.trim() === '') {
            mostrarError(companiaInput, 'El nombre de la compañía es requerido.');
            valido = false;
        } else {
            limpiarError(companiaInput);
        }

        if (motivoVisitaInput.value.trim() === '') {
            mostrarError(motivoVisitaInput, 'El motivo de la visita es requerido.');
            valido = false;
        } else {
            limpiarError(motivoVisitaInput);
        }

        if (visitaAInput.value.trim() === '') {
            mostrarError(visitaAInput, 'El nombre de la persona a visitar es requerido.');
            valido = false;
        } else {
            limpiarError(visitaAInput);
        }

        if (departamentoSelect.value === 'Selecciona...') {
            mostrarError(departamentoSelect, 'Selecciona un departamento.');
            valido = false;
        } else {
            limpiarError(departamentoSelect);
        }

        // Si todos los campos requeridos son válidos, mostrar el modal
        if (valido) {
            // Llenar los datos en el modal
            document.getElementById('confirmacion-fecha').textContent = fechaInput.value;
            document.getElementById('confirmacion-hora').textContent = horaInput.value;
            document.getElementById('confirmacion-nombre').textContent = nombreInput.value;
            document.getElementById('confirmacion-tipoVisita').textContent = tipoVisitaSelect.options[tipoVisitaSelect.selectedIndex].text;
            document.getElementById('confirmacion-compania').textContent = companiaInput.value;
            document.getElementById('confirmacion-motivoVisita').textContent = motivoVisitaInput.value;
            document.getElementById('confirmacion-visitaA').textContent = visitaAInput.value;
            document.getElementById('confirmacion-departamento').textContent = departamentoSelect.options[departamentoSelect.selectedIndex].text;

            // Mostrar el modal
            confirmacionModal.show();
        }
    });

    // Evento para cuando se cierra el modal (si se hace clic en "Editar" o en la "x")
    const modalElement = document.getElementById('confirmacionModal');
    modalElement.addEventListener('hide.bs.modal', function (event) {
        // Permitir al usuario editar, no necesitamos hacer nada aquí, el formulario sigue ahí
    });

    // Evento para cuando se confirma el registro
    confirmarRegistroBtn.addEventListener('click', function () {
        confirmacionModal.hide();
        // Aquí iría la lógica para enviar los datos del formulario al servidor
        // Por ahora, solo mostramos el mensaje de éxito en el frontend
        mensajeExitoDiv.classList.remove('d-none');
        form.reset(); // Opcional: limpiar el formulario después del registro exitoso
        form.classList.remove('was-validated'); // Limpiar la indicación de validación
        // Opcional: ocultar el mensaje de éxito después de un tiempo
        setTimeout(() => {
            mensajeExitoDiv.classList.add('d-none');
        }, 3000);
    });

    limpiarDatosBtn.addEventListener('click', function() {
        // Limpiar solo los campos específicos
        nombreInput.value = '';
        tipoVisitaSelect.value = 'Selecciona...';
        companiaInput.value = '';
        motivoVisitaInput.value = '';
        visitaAInput.value = '';
        departamentoSelect.value = 'Selecciona...';

        // Limpiar cualquier mensaje de error que pudiera estar visible
        const errorDivs = document.querySelectorAll('.text-danger');
        errorDivs.forEach(errorDiv => errorDiv.remove());
        const invalidInputs = document.querySelectorAll('.is-invalid');
        invalidInputs.forEach(input => {
            input.classList.remove('is-invalid');
            input.classList.remove('is-valid'); // Asegurarse de que no esté la palomita verde
        });
        form.classList.remove('was-validated'); // Limpiar la indicación de validación al limpiar el formulario
    });

    // Limpiar errores al cambiar los inputs
    nombreInput.addEventListener('input', () => limpiarError(nombreInput));
    tipoVisitaSelect.addEventListener('change', () => limpiarError(tipoVisitaSelect));
    companiaInput.addEventListener('input', () => limpiarError(companiaInput));
    motivoVisitaInput.addEventListener('input', () => limpiarError(motivoVisitaInput));
    visitaAInput.addEventListener('input', () => limpiarError(visitaAInput));
    departamentoSelect.addEventListener('change', () => limpiarError(departamentoSelect));
});