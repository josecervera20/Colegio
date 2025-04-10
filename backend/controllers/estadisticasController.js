const pool = require("../config/database");

const obtenerEntradasPorDia = async (req, res) => {
  try {
    const query = `
            SELECT DATE(fecha) AS dia, COUNT(*) AS total
            FROM registros_entrada
            GROUP BY DATE(fecha)
            ORDER BY DATE(fecha) DESC;
        `;
    const [resultados] = await pool.execute(query);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener las entradas por día:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

const obtenerTiposVisitante = async (req, res) => {
  try {
    const query = `
            SELECT tipo_visita, COUNT(*) AS total
            FROM registros_entrada
            GROUP BY tipo_visita
            ORDER BY total DESC;
        `;
    const [resultados] = await pool.execute(query);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener los tipos de visitante:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

const obtenerDepartamentosVisitados = async (req, res) => {
  try {
    const query = `
            SELECT departamento, COUNT(*) AS total
            FROM registros_entrada
            GROUP BY departamento
            ORDER BY total DESC
            LIMIT 5; -- Limitar a los 5 departamentos más visitados
        `;
    const [resultados] = await pool.execute(query);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener los departamentos más visitados:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

module.exports = {
  obtenerEntradasPorDia,
  obtenerTiposVisitante,
  obtenerDepartamentosVisitados,
};
