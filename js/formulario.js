document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const fechaInput = document.getElementById("fecha");
    const horaInput = document.getElementById("hora");

    // Cargar fecha y hora automáticamente
    cargarFechaHora();
    setInterval(cargarHora, 1000); // Actualizar la hora cada segundo

    // Evento de envío del formulario
    formulario.addEventListener("submit", manejarEnvioFormulario);

    // Carga la fecha y hora actual en los campos del formulario.
    function cargarFechaHora() {
        const ahora = new Date();
        const fechaActual = ahora.toISOString().slice(0, 10);
        fechaInput.value = fechaActual;
        cargarHora(); // Cargar la hora inicial
    }

    // Carga la hora actual en el campo de hora.
    function cargarHora() {
        const ahora = new Date();
        const horaActual = ahora.toTimeString().slice(0, 5);
        horaInput.value = horaActual;
    }

    // Maneja el envío del formulario.
    function manejarEnvioFormulario(evento) {
        evento.preventDefault();
        validarFormulario();
    }

    // Valida los campos del formulario.
    function validarFormulario() {
        const nombre = document.getElementById("nombre").value.trim();
        const tipoVisita = document.getElementById("tipoVisita").value;
        const visitaA = document.getElementById("visitaA").value.trim();
        const departamento = document.getElementById("departamento").value;

        const errores = [];

        // Validación de nombre
        if (!nombre) {
            errores.push("El nombre es requerido.");
        } else if (nombre.length < 3) {
            errores.push("El nombre debe tener al menos 3 caracteres.");
        }

        // Validación de tipo de visita
        if (tipoVisita === "Selecciona...") {
            errores.push("Selecciona un tipo de visita.");
        }

        // Validación de visita a
        if (!visitaA) {
            errores.push("El nombre de la persona a visitar es requerido.");
        }

        // Validación de departamento
        if (departamento === "Selecciona...") {
            errores.push("Selecciona un departamento.");
        }

        // Mostrar errores o enviar el formulario.
        if (errores.length > 0) {
            mostrarErrores(errores);
        } else {
            formulario.submit();
        }
    }

    // Muestra los mensajes de error en el formulario.
    function mostrarErrores(errores) {
        const contenedorErrores = document.createElement("div");
        contenedorErrores.classList.add("alert", "alert-danger", "mt-3");

        // Limpiar el contenedor de errores antes de agregar nuevos errores.
        contenedorErrores.innerHTML = "";

        errores.forEach((error) => {
            const parrafoError = document.createElement("p");
            parrafoError.textContent = error;
            contenedorErrores.appendChild(parrafoError);
        });

        formulario.insertBefore(
            contenedorErrores,
            formulario.querySelector("button[type='submit']")
        );

        // Eliminar errores después de 5 segundos.
        setTimeout(() => {
            contenedorErrores.remove();
        }, 5000);
    }
});