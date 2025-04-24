// Importa la conexión a la base de datos
const pool = require("../config/database");

/**
 * Inserta un nuevo registro de entrada en la base de datos.
 * @param {Object} datos - Datos del formulario enviados por el cliente.
 * @param {string} datos.fecha - Fecha de la visita.
 * @param {string} datos.hora - Hora de la visita.
 * @param {string} datos.nombre - Nombre del visitante.
 * @param {string} datos.tipoVisita - Tipo de visita (exalumno, proveedor, etc).
 * @param {string} datos.compania - Compañía del visitante.
 * @param {string} datos.motivoVisita - Motivo de la visita.
 * @param {string} datos.visitaA - Persona a quien se visita.
 * @param {string} datos.departamento - Departamento que recibe la visita.
 * @returns {Object} result - Resultado de la ejecución de la consulta.
 */
const insertarRegistroEntrada = async ({
  fecha,
  hora,
  nombre,
  tipoVisita,
  compania,
  motivoVisita,
  visitaA,
  departamento,
}) => {
  // Consulta SQL parametrizada para prevenir inyecciones SQL
  const query = `
    INSERT INTO registros_entrada (fecha, hora, nombre, tipo_visita, compania, motivo_visita, visita_a, departamento)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecuta la consulta con los valores del formulario
  const [result] = await pool.execute(query, [
    fecha,
    hora,
    nombre,
    tipoVisita,
    compania,
    motivoVisita,
    visitaA,
    departamento,
  ]);

  return result;
};

// Exporta la función para ser utilizada por el controlador
module.exports = {
  insertarRegistroEntrada,
};
