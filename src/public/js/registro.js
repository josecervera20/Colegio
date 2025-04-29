// Importa la función principal para registrar usuario desde el módulo
import { registrarUsuario } from "./modules/auth/registroUsuario.js";

// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Referencias a elementos del formulario
  const registroForm = document.getElementById("registroForm");
  const nuevoUsuarioInput = document.getElementById("nuevoUsuario");
  const nuevaPasswordInput = document.getElementById("nuevaPassword");
  const confirmarPasswordInput = document.getElementById("confirmarPassword");
  const botonRegistrar = registroForm.querySelector('button[type="submit"]');

  // Asignar evento al formulario para manejar el envío
  registroForm.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevenir recarga de la página

    // Ejecutar lógica de validación y solicitud de registro
    registrarUsuario(
      registroForm,
      {
        usuario: nuevoUsuarioInput.value.trim(),
        password: nuevaPasswordInput.value.trim(),
        confirmarPassword: confirmarPasswordInput.value.trim(),
      },
      botonRegistrar
    );
  });
});
