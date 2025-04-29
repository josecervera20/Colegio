import { verificarToken } from "./modules/auth/verificarToken.js";
import { cerrarSesion } from "./modules/auth/cerrarSesion.js";

// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Verificar que el token sea válido antes de mostrar el panel
  verificarToken();

  // Inicializar botón de cerrar sesión
  cerrarSesion();
});
