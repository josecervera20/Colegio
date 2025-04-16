// Importa la conexión a la base de datos
const pool = require("../config/database");

// Servicio encargado de insertar un registro de entrada en la base de datos
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
  // Consulta SQL parametrizada para evitar inyecciones SQL
  const query = `
    INSERT INTO registros_entrada (fecha, hora, nombre, tipo_visita, compania, motivo_visita, visita_a, departamento)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  // Ejecuta la consulta con los valores recibidos
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

// Exporta la función del servicio
module.exports = {
  insertarRegistroEntrada,
};
