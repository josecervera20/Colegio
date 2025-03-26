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

  // Función para mostrar mensajes de error
  function mostrarError(input, mensaje) {
      const errorDiv = document.getElementById(`${input.id}-error`) || document.createElement('div');
      errorDiv.id = `${input.id}-error`;
      errorDiv.className = 'text-danger';
      errorDiv.textContent = mensaje;
      input.classList.add('is-invalid');
      input.parentNode.appendChild(errorDiv);
      input.setAttribute('aria-describedby', `${input.id}-error`);
  }

  // Función para limpiar mensajes de error
  function limpiarError(input) {
      const errorDiv = document.getElementById(`${input.id}-error`);
      if (errorDiv) {
          errorDiv.remove();
          input.classList.remove('is-invalid');
          input.removeAttribute('aria-describedby');
      }
  }

  // Validación del formulario
  form.addEventListener('submit', function (event) {
      let valido = true;

      // Validación del nombre
      if (nombreInput.value.trim() === '') {
          mostrarError(nombreInput, 'El nombre es requerido.');
          valido = false;
      } else {
          limpiarError(nombreInput);
      }

      // Validación del tipo de visita
      if (tipoVisitaSelect.value === 'Selecciona...') {
          mostrarError(tipoVisitaSelect, 'Selecciona un tipo de visita.');
          valido = false;
      } else {
          limpiarError(tipoVisitaSelect);
      }

      // Validación de la compañía
      if (companiaInput.value.trim() === '') {
          mostrarError(companiaInput, 'El nombre de la compañía es requerido.');
          valido = false;
      } else {
          limpiarError(companiaInput);
      }

      // Validación del motivo de la visita
      if (motivoVisitaInput.value.trim() === '') {
          mostrarError(motivoVisitaInput, 'El motivo de la visita es requerido.');
          valido = false;
      } else {
          limpiarError(motivoVisitaInput);
      }

      // Validación de visita a
      if (visitaAInput.value.trim() === '') {
          mostrarError(visitaAInput, 'El nombre de la persona a visitar es requerido.');
          valido = false;
      } else {
          limpiarError(visitaAInput);
      }

      // Validación del departamento
      if (departamentoSelect.value === 'Selecciona...') {
          mostrarError(departamentoSelect, 'Selecciona un departamento.');
          valido = false;
      } else {
          limpiarError(departamentoSelect);
      }

      // Prevenir el envío del formulario si hay errores
      if (!valido) {
          event.preventDefault();
      }
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
      invalidInputs.forEach(input => input.classList.remove('is-invalid'));
  });

  // Limpiar errores al cambiar los inputs
  nombreInput.addEventListener('input', () => limpiarError(nombreInput));
  tipoVisitaSelect.addEventListener('change', () => limpiarError(tipoVisitaSelect));
  companiaInput.addEventListener('input', () => limpiarError(companiaInput));
  motivoVisitaInput.addEventListener('input', () => limpiarError(motivoVisitaInput));
  visitaAInput.addEventListener('input', () => limpiarError(visitaAInput));
  departamentoSelect.addEventListener('change', () => limpiarError(departamentoSelect));
});