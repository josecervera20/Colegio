const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

/**
 * Autentica a un usuario validando su contraseña y generando un token JWT.
 * @param {string} usuario - Nombre del usuario.
 * @param {string} password - Contraseña sin encriptar ingresada por el usuario.
 * @returns {string} token - Token JWT generado para el usuario autenticado.
 * @throws {Object} error - Contiene el código de estado y mensaje de error si la autenticación falla.
 */
const autenticarUsuario = async (usuario, password) => {
  const [rows] = await pool.query("SELECT * FROM usuarios WHERE usuario = ?", [
    usuario,
  ]);

  if (rows.length === 0) {
    throw { status: 401, message: "¡Usuario o contraseña incorrectos!" };
  }

  const user = rows[0];
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw { status: 401, message: "¡Usuario o contraseña incorrectos!" };
  }

  // Genera un token válido por 1 hora
  const token = jwt.sign(
    { usuario: user.usuario },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "1h" }
  );

  return token;
};

/**
 * Registra un nuevo usuario con contraseña encriptada.
 * @param {string} usuario - Nombre de usuario.
 * @param {string} password - Contraseña sin encriptar.
 * @throws {Object} error - Contiene el código de estado y mensaje si el usuario ya existe.
 */
const registrarUsuario = async (usuario, password) => {
  const [existingUser] = await pool.query(
    "SELECT usuario FROM usuarios WHERE usuario = ?",
    [usuario]
  );

  if (existingUser.length > 0) {
    throw { status: 409, message: "El nombre de usuario ya está registrado." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await pool.query("INSERT INTO usuarios (usuario, password) VALUES (?, ?)", [
    usuario,
    hashedPassword,
  ]);
};

// Exporta las funciones de servicio para autenticación
module.exports = {
  autenticarUsuario,
  registrarUsuario,
};
