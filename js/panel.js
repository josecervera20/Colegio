// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Verificación de sesión con token
  const token = localStorage.getItem("token"); // Obtener el token JWT almacenado

  // Si no hay token, redirige al login
  if (!token) {
    window.location.href = "../index.html";
    return;
  }

  /**
   * Solicita acceso al panel mediante una ruta protegida
   * Si el token es inválido o expiró, redirige al login
   */
  fetch("http://localhost:3000/api/panel", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Incluir token JWT en la cabecera
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        // Si el token es inválido o expirado
        localStorage.removeItem("token"); // Eliminar token por seguridad
        window.location.href = "../index.html"; // Redirigir al login
        throw new Error("Token inválido o expirado");
      }
      return response.json();
    })
    .catch((error) => {
      // Si ocurre un error con la petición
      localStorage.removeItem("token");
      window.location.href = "../index.html";
    });

  // Lógica para cerrar la sesión
  const logoutButton = document.querySelector(".logout-button");

  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Prevenir comportamiento predeterminado del enlace
      localStorage.removeItem("token"); // Eliminar el token del almacenamiento
      window.location.href = "../index.html"; // Redirigir al login
    });
  }
});
