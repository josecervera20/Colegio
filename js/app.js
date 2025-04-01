document.addEventListener("DOMContentLoaded", () => {
  // Elementos del DOM
  const formulario = document.querySelector("form");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const botonEnviar = formulario.querySelector('button[type="submit"]');

  // Evento de envío del formulario
  formulario.addEventListener("submit", manejarEnvioFormulario);

  // Maneja el envío del formulario
  function manejarEnvioFormulario(evento) {
    evento.preventDefault();
    validarCredenciales();
  }

  // Valida y simula credenciales
  async function validarCredenciales() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!usuario || !password) {
      mostrarMensaje("¡Complete los campos!", "danger");
      return;
    }

    const spinner = crearSpinner();
    formulario.insertBefore(spinner, botonEnviar);

    // SIMULACIÓN DE VERIFICACIÓN
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simula una espera
    spinner.remove();
    if (usuario === "usuario" && password === "contrasena") {
      mostrarMensaje("¡Inicio de sesión exitoso!", "success");
      setTimeout(() => {
        window.location.href = "pages/panel.html";
      }, 1500);
    } else {
      mostrarMensaje("¡Usuario o contraseña incorrectos!", "danger");
    }
    // FIN DE SIMULACIÓN
  }

  // Crea el spinner (indicador de carga)
  function crearSpinner() {
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
  function mostrarMensaje(mensaje, tipo) {
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
    formulario.insertBefore(mensajeDiv, botonEnviar);
    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }
});
