document.addEventListener("DOMContentLoaded", () => {
  // Espera carga completa del DOM
  const token = localStorage.getItem("token"); // Obtiene el token

  if (!token) {
    // Si no hay token, redirige a login
    window.location.href = "../index.html";
    return; // Detiene ejecución
  }

  // Petición a ruta protegida
  fetch("http://localhost:3000/api/panel", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // Incluye token en header
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        // Si error (ej: 401), cierra sesión
        console.error("Error al obtener datos:", response.status);
        localStorage.removeItem("token"); // Elimina token
        window.location.href = "../index.html"; // Redirige a login
        throw new Error("No autorizado");
      }
      return response.json(); // Parsea a JSON
    })
    .then((data) => {
      // Procesa datos del panel
      console.log("Mensaje del panel:", data.message);
    })
    .catch((error) => {
      // Maneja errores de petición
      console.error("Error en la petición:", error);
    });

  // Lógica botón cerrar sesión
  const logoutButton = document.querySelector(".logout-button"); // Selecciona botón
  if (logoutButton) {
    logoutButton.addEventListener("click", (event) => {
      event.preventDefault(); // Evita acción predeterminada
      localStorage.removeItem("token"); // Elimina token
      window.location.href = "../index.html"; // Redirige a login
    });
  }
});
