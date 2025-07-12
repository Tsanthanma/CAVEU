// backend/config/db.js

const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('caveu_db', 'root', '12345678', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, // Opcional: desactiva los logs SQL en consola
});

module.exports = sequelize;
