/**
 * Verifica si hay un token en localStorage y realiza una petición al backend
 * Si el token no existe o es inválido, redirige al login
 */
export default function verificarToken() {
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
      Authorization: `Bearer ${token}`, // Enviar token en la cabecera
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        localStorage.removeItem("token"); // Eliminar token inválido
        window.location.href = "../index.html"; // Redirigir al login
        throw new Error("Token inválido o expirado");
      }
      return response.json();
    })
    .catch(() => {
      localStorage.removeItem("token"); // Eliminar token si falla la petición
      window.location.href = "../index.html"; // Redirigir al login
    });
}
