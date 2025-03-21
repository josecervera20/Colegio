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

  // Valida y verifica credenciales
  async function validarCredenciales() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!usuario || !password) {
      mostrarMensaje("Complete los campos.", "danger");
      return;
    }

    const spinner = crearSpinner();
    formulario.insertBefore(spinner, botonEnviar);

    try {
      const datos = await verificarCredenciales(usuario, password);
      spinner.remove();
      manejarRespuesta(datos);
    } catch (error) {
      spinner.remove();
      manejarError(error);
    }
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

  // Verifica credenciales en el backend
  async function verificarCredenciales(usuario, password) {
    const respuesta = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    if (!respuesta.ok) {
      if (respuesta.status === 401) {
        return respuesta.json(); // Credenciales incorrectas
      }
      throw new Error(`Error HTTP: ${respuesta.status}`); // Otros errores HTTP
    }

    return respuesta.json(); // Inicio de sesión exitoso
  }

  // Maneja la respuesta del backend
  function manejarRespuesta(datos) {
    if (datos.success) {
      mostrarMensaje("Inicio de sesión exitoso. Redirigiendo...", "success");
      setTimeout(() => {
        window.location.href = "pages/panel.html";
      }, 1500);
    } else {
      mostrarMensaje(
        datos.message || "Usuario o contraseña incorrectos.",
        "danger"
      );
    }
  }

  // Maneja errores
  function manejarError(error) {
    console.error("Error al verificar credenciales:", error);
    mostrarMensaje(`Error: ${error.message}`, "danger");
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
