// backend/models/Ticket.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Ticket = sequelize.define('Ticket', {
  pregunta: {
    type: DataTypes.STRING,
    allowNull: true
  },
  archivo: {
    type: DataTypes.STRING
  },
  estado: {
    type: DataTypes.ENUM('pendiente', 'en proceso', 'resuelto'),
    defaultValue: 'pendiente'
  },
  area: {
    type: DataTypes.STRING
  },
  usuarioId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  asesorId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  timestamps: true
});

// Relaciones del Ticket
Ticket.belongsTo(Usuario, { as: 'usuario', foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Ticket.belongsTo(Usuario, { as: 'asesor', foreignKey: 'asesorId' });

module.exports = Ticket;