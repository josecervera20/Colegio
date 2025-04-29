/**
 * Agrega el evento al botón de logout
 * Al hacer clic, elimina el token del almacenamiento y redirige al login
 */
export function cerrarSesion() {
  // Lógica para cerrar la sesión
  const logoutButton = document.querySelector(".logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevenir comportamiento predeterminado del enlace
      localStorage.removeItem("token"); // Eliminar el token del almacenamiento
      window.location.href = "../index.html"; // Redirigir al login
    });
  }
}
