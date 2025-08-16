// backend/config/db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.MYSQLDATABASE, // En producción, siempre usará la variable de entorno
  process.env.MYSQLUSER,
  process.env.MYSQLPASSWORD,
  {
    host: process.env.MYSQLHOST,
    port: process.env.MYSQLPORT,
    dialect: 'mysql',
    logging: false, // Es buena práctica desactivar los logs de SQL en producción
    
    // ESTA ES LA PARTE QUE FALTA Y ES FUNDAMENTAL PARA RAILWAY Y RENDER
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false // Esta línea permite la conexión sin un certificado CA específico
      }
    }
  }
);

module.exports = sequelize;