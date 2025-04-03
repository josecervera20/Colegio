document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const registroForm = document.getElementById("registroForm");
  const nuevoUsuarioInput = document.getElementById("nuevoUsuario");
  const nuevaPasswordInput = document.getElementById("nuevaPassword");
  const botonRegistrar = registroForm.querySelector('button[type="submit"]');

  // Evento de envío del formulario de registro
  registroForm.addEventListener("submit", manejarEnvioRegistro);

  // Maneja el envío del formulario de registro
  function manejarEnvioRegistro(event) {
    event.preventDefault();
    registrarUsuario();
  }

  // Realiza la petición de registro
  async function registrarUsuario() {
    const usuario = nuevoUsuarioInput.value.trim();
    const password = nuevaPasswordInput.value.trim();

    if (!usuario || !password) {
      mostrarMensajeRegistro(
        "Por favor, ingrese un nombre de usuario y una contraseña.",
        "danger"
      );
      return;
    }

    const spinner = crearSpinnerRegistro();
    registroForm.insertBefore(spinner, botonRegistrar);

    try {
      const respuesta = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      await new Promise((resolve) => setTimeout(resolve, 500)); // Retraso del spinner
      spinner.remove();
      const datos = await respuesta.json();

      if (respuesta.ok) {
        mostrarMensajeRegistro(datos.message, "success");
        registroForm.reset(); // Limpiar el formulario
      } else {
        mostrarMensajeRegistro(
          datos.error || "Error al registrar el usuario.",
          "danger"
        );
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Retraso del spinner en caso de error
      spinner.remove();
      console.error("Error al conectar con el servidor:", error);
      mostrarMensajeRegistro("Error al conectar con el servidor.", "danger");
    }
  }

  // Crea el spinner de carga
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

  // Muestra mensajes de alerta
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
    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }
});
