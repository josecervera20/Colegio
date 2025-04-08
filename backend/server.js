const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();
const port = 3000;

// Middleware para parsear el cuerpo de las peticiones a JSON
app.use(bodyParser.json());
// Middleware para habilitar CORS
app.use(cors());

// Usar las rutas
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes); // Para /api/usuarios y /api/panel

// Ruta principal (se mantiene aquí)
app.get("/", (req, res) => {
  res.send("¡Hola desde la API del Colegio!");
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
