// Importa la función de servicio que maneja la inserción del registro
const { insertarRegistroEntrada } = require("../services/registroService");

// Controlador para manejar el registro de entrada de visitantes
const registrarEntrada = async (req, res) => {
  try {
    // Extrae los datos del cuerpo de la solicitud
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

    // Verifica que los campos obligatorios estén presentes
    if (
      !fecha ||
      !hora ||
      !nombre ||
      !tipoVisita ||
      !motivoVisita ||
      !visitaA ||
      !departamento
    ) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben ser proporcionados.",
      });
    }

    // Llama al servicio que inserta el registro en la base de datos
    const result = await insertarRegistroEntrada({
      fecha,
      hora,
      nombre,
      tipoVisita,
      compania,
      motivoVisita,
      visitaA,
      departamento,
    });

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

// Exporta el controlador
module.exports = { registrarEntrada };
