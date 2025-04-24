// Importa las funciones del servicio de estadísticas
const {
  obtenerEntradasPorDia,
  obtenerTiposVisitante,
  obtenerDepartamentosVisitados,
} = require("../services/estadisticasService");

/**
 * Controlador para obtener estadísticas de entradas por día.
 */
const getEntradasPorDia = async (req, res) => {
  try {
    const { fecha } = req.query;
    const resultados = await obtenerEntradasPorDia(fecha);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener las entradas por día:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

/**
 * Controlador para obtener estadísticas de tipos de visitante.
 */
const getTiposVisitante = async (req, res) => {
  try {
    const { fecha } = req.query;
    const resultados = await obtenerTiposVisitante(fecha);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener los tipos de visitante:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

/**
 * Controlador para obtener los departamentos más visitados.
 */
const getDepartamentosVisitados = async (req, res) => {
  try {
    const { fecha } = req.query;
    const resultados = await obtenerDepartamentosVisitados(fecha);
    res.status(200).json(resultados);
  } catch (error) {
    console.error("Error al obtener los departamentos más visitados:", error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

module.exports = {
  getEntradasPorDia,
  getTiposVisitante,
  getDepartamentosVisitados,
};
