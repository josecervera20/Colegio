const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authService = require("../services/authService");

/**
 * Controlador para el inicio de sesión
 */
const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: "Por favor, proporcione usuario y contraseña.",
    });
  }

  try {
    // Llama al servicio para autenticar el usuario
    const token = await authService.autenticarUsuario(usuario, password);
    res.status(200).json({ message: "Inicio de sesión exitoso.", token });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

/**
 * Controlador para registrar un nuevo usuario
 */
const register = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    return res.status(400).json({
      error: "Por favor, proporcione un nombre de usuario y una contraseña.",
    });
  }

  try {
    // Llama al servicio para registrar el usuario
    await authService.registrarUsuario(usuario, password);
    res.status(201).json({ message: "Usuario registrado exitosamente." });
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { login, register };
