const pool = require("../config/database");

const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    console.error("Error al consultar la base de datos:", error);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

const getPanel = (req, res) => {
  res.json({
    message: `¡Bienvenido al panel, ${req.user.usuario}! Esta es un área protegida.`,
  });
};

module.exports = { getAllUsers, getPanel };
