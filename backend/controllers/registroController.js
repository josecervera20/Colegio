// Importa la conexión a la base de datos
const pool = require("../config/database");

// Función para registrar la entrada
const registrarEntrada = async (req, res) => {
  try {
    // Accede a los datos del formulario que vienen en req.body
    const {
      fecha,
      hora,
      nombre,
      tipoVisita,
      compania,
      motivoVisita,
      visitaA,
      departamento,
    } = req.body;

    // **Validación de datos en el backend (¡Importante!)**
    if (
      !fecha ||
      !hora ||
      !nombre ||
      !tipoVisita ||
      !motivoVisita ||
      !visitaA ||
      !departamento
    ) {
      return res
        .status(400)
        .json({
          error: "Todos los campos obligatorios deben ser proporcionados.",
        });
    }

    // Prepara la consulta SQL para insertar los datos en la tabla
    const query = `
            INSERT INTO registros_entrada (fecha, hora, nombre, tipo_visita, compania, motivo_visita, visita_a, departamento)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    // Ejecuta la consulta a la base de datos
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

    // Verifica si la inserción fue exitosa
    if (result.affectedRows > 0) {
      res.status(201).json({ mensaje: "Registro de entrada exitoso." });
    } else {
      res
        .status(500)
        .json({ error: "Error al registrar la entrada en la base de datos." });
    }
  } catch (error) {
    console.error("Error al procesar el registro:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor al registrar la entrada." });
  }
};

// Exporta la función del controlador
module.exports = { registrarEntrada };
