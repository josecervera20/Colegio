// Importar funciones auxiliares
import crearSpinner from "../ui/crearSpinner.js";
import mostrarMensaje from "../ui/mostrarMensaje.js";

/**
 * Valida los campos del formulario y realiza la petición al backend
 */
export default async function validarCredenciales({
  formulario,
  usuarioInput,
  passwordInput,
  botonEnviar,
}) {
  const usuario = usuarioInput.value.trim();
  const password = passwordInput.value.trim();

  // Validación de campos vacíos
  if (!usuario || !password) {
    mostrarMensaje(
      "¡Por favor, introduce tu usuario y contraseña!",
      "danger",
      formulario,
      botonEnviar
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
        "¡Bienvenido! Inicio de sesión exitoso.",
        "success",
        formulario,
        botonEnviar
      );

      // Guardar token JWT en localStorage
      localStorage.setItem("token", datos.token);

      // Redirigir al panel después de 2 segundos
      setTimeout(() => {
        window.location.href = "pages/panel.html";
      }, 2000);
    } else {
      // Credenciales incorrectas
      mostrarMensaje(datos.error, "danger", formulario, botonEnviar);
    }
  } catch {
    // Error de conexión o fallo inesperado
    await new Promise((resolve) => setTimeout(resolve, 500));
    spinner.remove();
    mostrarMensaje(
      "¡Error al conectar con el servidor!",
      "danger",
      formulario,
      botonEnviar
    );
  }
}
