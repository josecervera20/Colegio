const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// Ruta pública: obtener todos los usuarios
router.get("/usuarios", userController.getAllUsers);

// Ruta protegida: requiere token JWT para acceder al panel
router.get("/panel", authMiddleware.verificarToken, userController.getPanel);

module.exports = router;
