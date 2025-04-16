const pool = require("../config/database");

// Obtener todos los usuarios de la base de datos
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows); // Devuelve la lista de usuarios en formato JSON
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Obtener el mensaje del panel protegido
const getPanel = (req, res) => {
  // req.user se establece en el middleware authMiddleware.verificarToken
  res.json({
    message: `¡Bienvenido al panel, ${req.user.usuario}! Esta es un área protegida.`,
  });
};

module.exports = { getAllUsers, getPanel };
