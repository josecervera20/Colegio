/**
 * Envía una solicitud al backend para registrar un nuevo usuario
 * @param {string} usuario - Nombre del nuevo usuario
 * @param {string} password - Contraseña del nuevo usuario
 * @returns {Promise<{ ok: boolean, mensaje: string }>} Resultado de la solicitud
 */
export default async function registrarUsuario(usuario, password) {
  try {
    // Realizar solicitud POST al backend
    const respuesta = await fetch("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, password }),
    });

    const datos = await respuesta.json();

    // Retornar resultado exitoso o mensaje de error del backend
    if (respuesta.ok) {
      return { ok: true, mensaje: datos.message };
    } else {
      return {
        ok: false,
        mensaje: datos.error || "¡No se pudo registrar el usuario!",
      };
    }
  } catch (error) {
    // Retornar mensaje de error genérico si la solicitud falla
    return { ok: false, mensaje: "¡Error al conectar con el servidor!" };
  }
}
