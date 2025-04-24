// Importación de módulos principales
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

// Importación de rutas y controladores
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const registroRoutes = require("./routes/registroRoutes");
const estadisticasRoutes = require("./routes/estadisticasRoutes");

dotenv.config();

const app = express();
const port = 3000;

// Middlewares
app.use(bodyParser.json());
app.use(cors());

// Rutas
app.use("/api/auth", authRoutes); // Rutas de autenticación
app.use("/api", userRoutes); // Rutas de usuarios
app.use("/api", registroRoutes); // Ruta para registros de entrada
app.use("/api/estadisticas", estadisticasRoutes); // Rutas de estadísticas

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Hola desde la API del Colegio!");
});

// Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
