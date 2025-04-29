import { crearSpinner } from "../ui/crearSpinner.js";
import { mostrarMensaje } from "../ui/mostrarMensaje.js";

/**
 * Valida los campos del formulario y realiza la petición al backend
 * @param {HTMLFormElement} formulario - Formulario de inicio de sesión
 * @param {HTMLInputElement} usuarioInput - Campo de usuario
 * @param {HTMLInputElement} passwordInput - Campo de contraseña
 * @param {HTMLButtonElement} botonEnviar - Botón de envío
 */
export async function validarCredenciales(
  formulario,
  usuarioInput,
  passwordInput,
  botonEnviar
) {
  const usuario = usuarioInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación de campos vacíos
  if (!usuario || !password) {
    mostrarMensaje(
      formulario,
      botonEnviar,
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
      mostrarMensaje(
        formulario,
        botonEnviar,
        "¡Bienvenido! Inicio de sesión exitoso.",
        "success"
      );

      // Guardar token JWT en localStorage
      localStorage.setItem("token", datos.token);

      // Redirigir al panel después de 2 segundos
      setTimeout(() => {
        window.location.href = "pages/panel.html";
      }, 2000);
    } else {
      // Credenciales incorrectas
      mostrarMensaje(formulario, botonEnviar, datos.error, "danger");
    }
  } catch {
    // Error de conexión o fallo inesperado
    await new Promise((resolve) => setTimeout(resolve, 500));
    spinner.remove();
    mostrarMensaje(
      formulario,
      botonEnviar,
      "¡Error al conectar con el servidor!",
      "danger"
    );
  }
}
