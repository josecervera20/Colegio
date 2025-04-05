const express = require("express");
const pool = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
// Importar la librería dotenv para cargar variables de entorno
require("dotenv").config();
// Importar la librería jsonwebtoken para trabajar con JWT
const jwt = require("jsonwebtoken");

const app = express();
const port = 3000;

// Para parsear el cuerpo de las peticiones a JSON
app.use(bodyParser.json());
// Para habilitar CORS
app.use(cors());

// Clave secreta para firmar los JWT. Debe estar en el archivo .env
const SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!SECRET_KEY) {
  console.error("Error: JWT_SECRET_KEY no está definida en el archivo .env");
  process.exit(1);
}

// Middleware para verificar el token JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (token == null) return res.sendStatus(401); // No hay token

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user; // Guardar la información del usuario en la request
    next(); // Pasar al siguiente middleware o ruta
  });
};

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Hola desde la API del Colegio!");
});

// GET para obtener todos los usuarios
app.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// POST para la autenticación (login)
app.post("/api/auth/login", async (req, res) => {
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
      const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1h" }); // Firma el token, expira en 1 hora // Enviar el token en la respuesta
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
});

// Ruta para el registro de nuevos usuarios
app.post("/api/auth/register", async (req, res) => {
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
});

// [PROTECTED] Ruta que requiere autenticación
app.get("/api/panel", verificarToken, (req, res) => {
  res.json({
    message: `¡Bienvenido al panel, ${req.user.usuario}! Esta es un área protegida.`,
  });
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
