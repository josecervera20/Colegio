const pool = require("../config/database");

/**
 * Ejecuta una consulta SQL usando el pool de conexión.
 * @param {string} query - Consulta SQL a ejecutar.
 * @param {Array} params - Parámetros para la consulta.
 * @returns {Promise<Array>} Resultados de la consulta.
 */
const ejecutarConsulta = async (query, params) => {
  const [resultados] = await pool.execute(query, params);
  return resultados;
};

/**
 * Genera dinámicamente una consulta SQL para estadísticas.
 * @param {Object} opciones - Opciones para construir la consulta.
 * @returns {Object} Consulta SQL y parámetros.
 */
const generarConsulta = ({ campo, alias, agrupador, filtroFecha, limite }) => {
  const condicion = filtroFecha ? "WHERE DATE(fecha) = ?" : "";
  const parametros = filtroFecha ? [filtroFecha] : [];

  let query = `
    SELECT ${campo} AS ${alias}, COUNT(*) AS total
    FROM registros_entrada
    ${condicion}
    GROUP BY ${agrupador}
    ORDER BY total DESC
    ${limite ? `LIMIT ${limite}` : ""};
  `;

  return { query, parametros };
};

/**
 * Obtiene la cantidad de entradas agrupadas por día.
 * @param {string} fecha - Fecha opcional para filtrar.
 */
const obtenerEntradasPorDia = async (fecha) => {
  const query = `
    SELECT DATE(fecha) AS dia, COUNT(*) AS total
    FROM registros_entrada
    ${fecha ? "WHERE DATE(fecha) = ?" : ""}
    GROUP BY DATE(fecha)
    ORDER BY DATE(fecha) DESC;
  `;
  const params = fecha ? [fecha] : [];
  return await ejecutarConsulta(query, params);
};

/**
 * Obtiene el total de visitantes agrupados por tipo de visita.
 * @param {string} fecha - Fecha opcional para filtrar.
 */
const obtenerTiposVisitante = async (fecha) => {
  const { query, parametros } = generarConsulta({
    campo: "tipo_visita",
    alias: "tipo_visita",
    agrupador: "tipo_visita",
    filtroFecha: fecha,
  });
  return await ejecutarConsulta(query, parametros);
};

/**
 * Obtiene los departamentos más visitados (máx. 5).
 * @param {string} fecha - Fecha opcional para filtrar.
 */
const obtenerDepartamentosVisitados = async (fecha) => {
  const { query, parametros } = generarConsulta({
    campo: "departamento",
    alias: "departamento",
    agrupador: "departamento",
    filtroFecha: fecha,
    limite: 5,
  });
  return await ejecutarConsulta(query, parametros);
};

module.exports = {
  obtenerEntradasPorDia,
  obtenerTiposVisitante,
  obtenerDepartamentosVisitados,
};
