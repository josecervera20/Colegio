require("dotenv").config(); // Carga las variables de entorno desde .env

const mysql = require("mysql2");

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: process.env.DB_CONNECTION_LIMIT
    ? parseInt(process.env.DB_CONNECTION_LIMIT)
    : 10,
};

const pool = mysql.createPool(dbConfig);

module.exports = pool.promise();
