document.addEventListener("DOMContentLoaded", () => {
  // Referencias al formulario y campos
  const formulario = document.querySelector("form");
  const usuarioInput = document.getElementById("usuario");
  const passwordInput = document.getElementById("password");
  const botonEnviar = formulario.querySelector('button[type="submit"]');

  // Evento para manejar el envío del formulario
  formulario.addEventListener("submit", (e) => {
    e.preventDefault();
    validarCredenciales();
  });

  /**
   * Valida los campos del formulario y realiza la petición al backend
   */
  async function validarCredenciales() {
    const usuario = usuarioInput.value.trim();
    const password = passwordInput.value.trim();

    // Validación de campos vacíos
    if (!usuario || !password) {
      mostrarMensaje(
        "¡Por favor, introduce tu usuario y contraseña!",
        "danger"
      );
      return;
    }

    // Crear y mostrar spinner de carga
    const spinner = crearSpinner();
    formulario.insertBefore(spinner, botonEnviar);

    try {
      const respuesta = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario, password }),
      });

      await new Promise((resolve) => setTimeout(resolve, 500)); // Simula tiempo de carga
      spinner.remove();

      const datos = await respuesta.json();

      if (respuesta.ok) {
        // Inicio de sesión exitoso
        mostrarMensaje("¡Bienvenido! Inicio de sesión exitoso.", "success");

        // Guardar token JWT en localStorage
        localStorage.setItem("token", datos.token);

        // Redirigir al panel después de 2 segundos
        setTimeout(() => {
          window.location.href = "pages/panel.html";
        }, 2000);
      } else {
        // Credenciales incorrectas
        mostrarMensaje(datos.error, "danger");
      }
    } catch {
      // Error de conexión o fallo inesperado
      await new Promise((resolve) => setTimeout(resolve, 500));
      spinner.remove();
      mostrarMensaje("¡Error al conectar con el servidor!", "danger");
    }
  }

  /**
   * Crea y devuelve un spinner de carga con clases de Bootstrap
   */
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

  /**
   * Muestra un mensaje de alerta (éxito o error)
   * @param {string} mensaje - Texto del mensaje
   * @param {string} tipo - 'success' o 'danger'
   */
  function mostrarMensaje(mensaje, tipo) {
    const clasesMensaje = {
      success: "alert-success",
      danger: "alert-danger",
    };

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

    // Eliminar el mensaje después de 3 segundos
    setTimeout(() => {
      mensajeDiv.remove();
    }, 3000);
  }
});
