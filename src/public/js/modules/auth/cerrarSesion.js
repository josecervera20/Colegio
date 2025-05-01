/**
 * Configura el botón de cierre de sesión para eliminar el token
 * y redirigir al usuario a la página de inicio de sesión.
 */
export default function cerrarSesion() {
  // Lógica para cerrar la sesión
  const logoutButton = document.querySelector(".logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Evitar comportamiento por defecto
      localStorage.removeItem("token"); // Eliminar token almacenado
      window.location.href = "../index.html"; // Redirigir al login
    });
  }
}
