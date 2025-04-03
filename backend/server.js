const express = require("express");
const pool = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
const port = 3000;

// Para parsear el cuerpo de las peticiones a JSON
app.use(bodyParser.json());
// Para habilitar CORS
app.use(cors());

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
        .json({ error: "Usuario o contraseña incorrectos." });
    }

    const user = rows[0];
    const hashedPasswordFromDatabase = user.password;

    const passwordMatch = await bcrypt.compare(
      password,
      hashedPasswordFromDatabase
    );

    if (passwordMatch) {
      return res.status(200).json({ message: "Inicio de sesión exitoso." });
    } else {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos." });
    }
  } catch (error) {
    console.error("Error al buscar o verificar el usuario:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor al iniciar sesión." });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
