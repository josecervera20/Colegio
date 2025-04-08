const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/usuarios", userController.getAllUsers);
router.get("/panel", authMiddleware.verificarToken, userController.getPanel);

module.exports = router;