const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../config/database");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, proporcione usuario y contraseña." });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "¡Usuario o contraseña incorrectos!" });
    }

    const user = rows[0];
    const hashedPasswordFromDatabase = user.password;

    const passwordMatch = await bcrypt.compare(
      password,
      hashedPasswordFromDatabase
    );

    if (passwordMatch) {
      // Generar el token JWT
      const payload = { usuario: user.usuario }; // Datos que se incluirán en el token
      const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      }); // Firma el token, expira en 1 hora // Enviar el token en la respuesta
      return res
        .status(200)
        .json({ message: "Inicio de sesión exitoso.", token: token });
    } else {
      return res
        .status(401)
        .json({ error: "¡Usuario o contraseña incorrectos!" });
    }
  } catch (error) {
    console.error("Error al buscar o verificar el usuario:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al iniciar sesión." });
  }
};

const register = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: "Por favor, proporcione un nombre de usuario y una contraseña.",
    });
  }

  try {
    // Verificar si el usuario ya existe
    const [existingUser] = await pool.query(
      "SELECT usuario FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (existingUser.length > 0) {
      return res
        .status(409)
        .json({ error: "El nombre de usuario ya está registrado." }); // Código 409 Conflict
    } // Hashear la contraseña antes de guardarla

    const hashedPassword = await bcrypt.hash(password, 10); // El segundo argumento es el "salt rounds" (a mayor número, más seguro pero más lento) // Insertar el nuevo usuario en la base de datos con la contraseña hasheada

    await pool.query("INSERT INTO usuarios (usuario, password) VALUES (?, ?)", [
      usuario,
      hashedPassword,
    ]);

    return res
      .status(201)
      .json({ message: "Usuario registrado exitosamente." }); // Código 201 Created
  } catch (error) {
    console.error("Error al registrar el usuario:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al registrar el usuario." });
  }
};

module.exports = { login, register };