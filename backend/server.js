const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const registroController = require("./controllers/registroController");
const authMiddleware = require("./middleware/authMiddleware");
const estadisticasRoutes = require("./routes/estadisticasRoutes");

dotenv.config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

// Ruta para registrar la entrada del formulario
app.post("/api/registrar-entrada", authMiddleware.verificarToken, registroController.registrarEntrada);

// Usamos el archivo de rutas de estadísticas
app.use("/api/estadisticas", estadisticasRoutes);

// Ruta principal
app.get("/", (req, res) => {
  res.send("¡Hola desde la API del Colegio!");
});

app.listen(port, () => {
  console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
