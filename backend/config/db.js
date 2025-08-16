const { Sequelize } = require('sequelize');
require('dotenv').config(); // Carga las variables de .env para desarrollo local

// Esta configuración funcionará tanto en tu PC como en Railway
const sequelize = new Sequelize(
  process.env.MYSQLDATABASE || 'caveu_db',      // Nombre de la DB
  process.env.MYSQLUSER || 'root',              // Usuario
  process.env.MYSQLPASSWORD || '12345678',      // Contraseña
  {
    host: process.env.MYSQLHOST || 'localhost', // Host
    port: process.env.MYSQLPORT || 3306,        // Puerto
    dialect: 'mysql',
    logging: false,
  }
);

module.exports = sequelize;