// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario
  const registroForm = document.getElementById("registroForm");
  const nuevoUsuarioInput = document.getElementById("nuevoUsuario");
  const nuevaPasswordInput = document.getElementById("nuevaPassword");
  const confirmarPasswordInput = document.getElementById("confirmarPassword");
  const botonRegistrar = registroForm.querySelector('button[type="submit"]');

  // Asignar evento al formulario para manejar el envío
  registroForm.addEventListener("submit", manejarEnvioRegistro);

  /**
   * Función que maneja el evento submit del formulario
   * Previene la recarga de página y ejecuta la lógica de registro
   */
  function manejarEnvioRegistro(event) {
    event.preventDefault();
    registrarUsuario();
  }

  /**
   * Función principal que realiza la validación de datos
   * y envía la petición de registro al backend
   */
  async function registrarUsuario() {
    const usuario = nuevoUsuarioInput.value.trim();
    const password = nuevaPasswordInput.value.trim();
    const confirmarPassword = confirmarPasswordInput.value.trim();

    // Validación de campos vacíos
    if (!usuario || !password || !confirmarPassword) {
      mostrarMensajeRegistro("¡Completa todos los campos!", "danger");
      return;
    }

    // Validación de coincidencia entre contraseñas
    if (password !== confirmarPassword) {
      mostrarMensajeRegistro("¡Las contraseñas no coinciden!", "danger");
      return;
    }

    // Mostrar spinner mientras se envía la solicitud
    const spinner = crearSpinnerRegistro();
    registroForm.insertBefore(spinner, botonRegistrar);

    try {
      // Enviar solicitud al servidor para registrar al usuario
      const respuesta = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      // Esperar un breve retraso para mostrar el spinner de forma visible
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.remove();
      const datos = await respuesta.json();

      // Si la respuesta es exitosa
      if (respuesta.ok) {
        mostrarMensajeRegistro(datos.message, "success");
        registroForm.reset(); // Limpiar campos del formulario
      } else {
        // Mostrar mensaje de error devuelto por el servidor
        mostrarMensajeRegistro(
          datos.error || "¡No se pudo registrar el usuario!",
          "danger"
        );
      }
    } catch (error) {
      // En caso de error de red o servidor
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.remove();
      mostrarMensajeRegistro("¡Error al conectar con el servidor!", "danger");
    }
  }

  /**
   * Crea un spinner de carga con clases de Bootstrap
   * @returns {HTMLElement} Spinner
   */
  function crearSpinnerRegistro() {
    const spinner = document.createElement("div");
    spinner.classList.add(
      "spinner-border",
      "text-secondary",
      "mx-auto",
      "my-3",
      "d-flex",
      "justify-content-center"
    );
    spinner.setAttribute("role", "status");
    spinner.innerHTML = '<span class="visually-hidden">Cargando...</span>';
    return spinner;
  }

  /**
   * Muestra un mensaje de alerta debajo del botón de registro
   * @param {string} mensaje - Texto del mensaje a mostrar
   * @param {string} tipo - Tipo de alerta (success o danger)
   */
  function mostrarMensajeRegistro(mensaje, tipo) {
    const clasesMensaje = { success: "alert-success", danger: "alert-danger" };
    const mensajeDiv = document.createElement("div");
    mensajeDiv.classList.add(
      "alert",
      clasesMensaje[tipo],
      "fade",
      "show",
      "text-center"
    );
    mensajeDiv.textContent = mensaje;
    registroForm.insertBefore(mensajeDiv, botonRegistrar);

    // Ocultar mensaje automáticamente después de 3 segundos
    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }
});
