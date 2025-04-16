// Carga las variables de entorno definidas en el archivo .env
require("dotenv").config();

const mysql = require("mysql2");

// Configuración de la base de datos usando variables de entorno
const dbConfig = {
  host: process.env.DB_HOST, // Dirección del servidor de base de datos
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña del usuario
  database: process.env.DB_DATABASE, // Nombre de la base de datos
  connectionLimit: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT) // Límite de conexiones en el pool
    : 10, // Valor por defecto si no está definido
};

// Crear un pool de conexiones para mejorar el rendimiento
const pool = mysql.createPool(dbConfig);

// Exportar el pool de conexiones usando promesas
module.exports = pool.promise();
