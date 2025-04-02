const express = require("express");
const pool = require("./config/database");
const bodyParser = require("body-parser");
const cors = require("cors"); // Importar el paquete cors

const app = express();
const port = 3000; // Puedes cambiar el puerto si lo deseas

// Middleware para parsear el cuerpo de las peticiones como JSON
app.use(bodyParser.json());

// Habilitar CORS usando el paquete cors
app.use(cors()); // Habilita CORS para todos los orígenes por defecto

app.get("/", (req, res) => {
  res.send("¡Hola desde la API del Colegio!");
});

// Ejemplo de una ruta para obtener todos los usuarios (solo para probar la conexión)
app.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

// Ruta para el inicio de sesión
app.post("/api/auth/login", async (req, res) => {
  const { usuario, password } = req.body;

  // Verificar si se proporcionaron usuario y contraseña
  if (!usuario || !password) {
    return res
      .status(400)
      .json({ error: "Por favor, proporcione usuario y contraseña." });
  }

  try {
    // Consultar la base de datos para encontrar al usuario
    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    // Si no se encuentra el usuario
    if (rows.length === 0) {
      return res
        .status(401)
        .json({ error: "Usuario o contraseña incorrectos." });
    }

    const user = rows[0];

    // **IMPORTANTE: Por ahora, estamos comparando contraseñas en texto plano.
    //             EN PRODUCCIÓN NUNCA HAGAS ESTO. DEBERÍAS USAR BCRYPT.**
    if (password === user.password) {
      // Inicio de sesión exitoso
      return res.status(200).json({ message: "Inicio de sesión exitoso." });
    } else {
      // Contraseña incorrecta
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

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
