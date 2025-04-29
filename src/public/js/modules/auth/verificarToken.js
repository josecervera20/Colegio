/**
 * Verifica si hay un token en localStorage y realiza una petición al backend
 * Si el token no existe o es inválido, redirige al login
 */
export function verificarToken() {
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
}
