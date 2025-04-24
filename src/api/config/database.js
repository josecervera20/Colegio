// Carga las variables de entorno desde el archivo .env
require("dotenv").config();

const mysql = require("mysql2");

// Configuración del pool de conexiones a la base de datos
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT)
    : 10, // Usa 10 como valor por defecto si no se especifica
};

// Crea el pool de conexiones con soporte para Promesas
const pool = mysql.createPool(dbConfig);

// Exporta el pool para poder usarlo con async/await
module.exports = pool.promise();
