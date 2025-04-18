// Importa la conexión a la base de datos
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
 * Genera dinámicamente una consulta SQL basada en las opciones proporcionadas.
 * @param {Object} opciones - Opciones para construir la consulta.
 * @param {string} opciones.campo - Campo a seleccionar (por ejemplo, 'tipo_visita').
 * @param {string} opciones.alias - Alias para el campo seleccionado.
 * @param {string} opciones.agrupador - Campo para agrupar los resultados.
 * @param {string} [opciones.filtroFecha] - Fecha opcional para filtrar los registros.
 * @param {number} [opciones.limite] - Límite de resultados (opcional).
 * @returns {Object} Un objeto con la consulta SQL y sus parámetros.
 */
const generarConsulta = ({ campo, alias, agrupador, filtroFecha, limite }) => {
  const condicion = filtroFecha ? "WHERE DATE(fecha) = ?" : "";
  const parametros = filtroFecha ? [filtroFecha] : [];

  const query = `
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
 * @returns {Promise<Array>} Lista de días con el total de entradas.
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
 * @returns {Promise<Array>} Tipos de visitantes y su cantidad.
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
 * Obtiene los 5 departamentos más visitados.
 * @param {string} fecha - Fecha opcional para filtrar.
 * @returns {Promise<Array>} Departamentos y su cantidad de visitas.
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
