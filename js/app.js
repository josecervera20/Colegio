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

  // Valida y envía credenciales
  async function validarCredenciales() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    if (!usuario || !password) {
      mostrarMensaje(
        "¡Por favor, introduce tu usuario y contraseña!",
        "danger"
      );
      return;
    }

    const spinner = crearSpinner();
    formulario.insertBefore(spinner, botonEnviar);

    try {
      const respuesta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      await new Promise((resolve) => setTimeout(resolve, 500)); // Retraso del spinner
      spinner.remove();
      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Inicio de sesión exitoso
        mostrarMensaje("¡Bienvenido! Inicio de sesión exitoso.", "success");
        // Almacenar el token JWT recibido del backend
        localStorage.setItem("token", datos.token); // Guardar el token en localStorage
        setTimeout(() => {
          window.location.href = "pages/panel.html";
        }, 2000); // Retraso de redirección
      } else {
        mostrarMensaje(datos.error, "danger"); // Usando directamente datos.error
      }
    } catch (error) {
      await new Promise((resolve) => setTimeout(resolve, 500)); // Retraso del spinner
      spinner.remove();
      console.error("Error al conectar:", error);
      mostrarMensaje("¡Error al conectar con el servidor!", "danger");
    }
  }

  // Crea el spinner
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

  // Muestra mensaje de alerta
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
