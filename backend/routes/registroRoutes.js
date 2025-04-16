const express = require("express");
const router = express.Router();
const registroController = require("../controllers/registroController");
const authMiddleware = require("../middleware/authMiddleware");

// Ruta protegida para registrar entradas desde el formulario
router.post(
  "/registrar-entrada",
  authMiddleware.verificarToken,
  registroController.registrarEntrada
);

module.exports = router;
