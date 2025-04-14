const pool = require("../config/database");

// Función reutilizable para ejecutar consultas
const ejecutarConsulta = async (res, query, params, mensajeError) => {
  try {
    const [resultados] = await pool.execute(query, params);
    res.status(200).json(resultados);
  } catch (error) {
    console.error(`${mensajeError}:`, error);
    res.status(500).json({ error: "Error al obtener las estadísticas." });
  }
};

// Generador de consulta con opción de alias personalizado
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

// Entradas por día
const obtenerEntradasPorDia = async (req, res) => {
  const { fecha } = req.query;
  const query = `
    SELECT DATE(fecha) AS dia, COUNT(*) AS total
    FROM registros_entrada
    ${fecha ? "WHERE DATE(fecha) = ?" : ""}
    GROUP BY DATE(fecha)
    ORDER BY DATE(fecha) DESC;
  `;
  const params = fecha ? [fecha] : [];
  await ejecutarConsulta(
    res,
    query,
    params,
    "Error al obtener las entradas por día"
  );
};

// Tipos de visitante
const obtenerTiposVisitante = async (req, res) => {
  const { fecha } = req.query;
  const { query, parametros } = generarConsulta({
    campo: "tipo_visita",
    alias: "tipo_visita",
    agrupador: "tipo_visita",
    filtroFecha: fecha,
  });

  await ejecutarConsulta(
    res,
    query,
    parametros,
    "Error al obtener los tipos de visitante"
  );
};

// Departamentos más visitados
const obtenerDepartamentosVisitados = async (req, res) => {
  const { fecha } = req.query;
  const { query, parametros } = generarConsulta({
    campo: "departamento",
    alias: "departamento",
    agrupador: "departamento",
    filtroFecha: fecha,
    limite: 5,
  });

  await ejecutarConsulta(
    res,
    query,
    parametros,
    "Error al obtener los departamentos más visitados"
  );
};

module.exports = {
  obtenerEntradasPorDia,
  obtenerTiposVisitante,
  obtenerDepartamentosVisitados,
};
