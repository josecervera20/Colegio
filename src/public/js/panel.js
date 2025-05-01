// Importaciones de funciones para verificación de token y cierre de sesión
import verificarToken from "./modules/auth/verificarToken.js";
import cerrarSesion from "./modules/auth/cerrarSesion.js";

// Ejecutar funciones principales una vez que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
  verificarToken();
  cerrarSesion();
});
