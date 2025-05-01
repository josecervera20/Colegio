// Importación de módulos reutilizables para registrar usuario, crear spinner y mostrar mensaje
import registrarUsuario from "./modules/auth/registrarUsuario.js";
import crearSpinner from "./modules/ui/crearSpinner.js";
import mostrarMensaje from "./modules/ui/mostrarMensaje.js";

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
  async function manejarEnvioRegistro(event) {
    event.preventDefault();

    const usuario = nuevoUsuarioInput.value.trim();
    const password = nuevaPasswordInput.value.trim();
    const confirmarPassword = confirmarPasswordInput.value.trim();

    // Validación de campos vacíos
    if (!usuario || !password || !confirmarPassword) {
      mostrarMensaje(
        "¡Completa todos los campos!",
        "danger",
        registroForm,
        botonRegistrar
      );
      return;
    }

    // Validación de coincidencia entre contraseñas
    if (password !== confirmarPassword) {
      mostrarMensaje(
        "¡Las contraseñas no coinciden!",
        "danger",
        registroForm,
        botonRegistrar
      );
      return;
    }

    // Crear y mostrar spinner mientras se procesa el registro
    const spinner = crearSpinner();
    registroForm.insertBefore(spinner, botonRegistrar);

    // Esperar un breve retraso para que el usuario vea el spinner
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Llamar al módulo que realiza el registro
    const resultado = await registrarUsuario(usuario, password);

    // Eliminar el spinner antes de mostrar cualquier mensaje
    spinner.remove();

    // Mostrar el mensaje de resultado (éxito o error)
    mostrarMensaje(
      resultado.mensaje,
      resultado.ok ? "success" : "danger",
      registroForm,
      botonRegistrar
    );

    // Limpiar el formulario si el registro fue exitoso
    if (resultado.ok) {
      registroForm.reset();
    }
  }
});
