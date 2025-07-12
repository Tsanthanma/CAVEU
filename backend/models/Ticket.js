const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Ticket = sequelize.define('Ticket', {
  pregunta: {
    type: DataTypes.STRING,
    allowNull: false
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
  }
}, {
  timestamps: true
});

// Relaciones con Usuario
Ticket.belongsTo(Usuario, {
  as: 'usuario',          // Quien creó el ticket
  foreignKey: 'usuarioId',
  onDelete: 'CASCADE'
});

Ticket.belongsTo(Usuario, {
  as: 'asesor',           // Asesor asignado
  foreignKey: 'asesorId',
  allowNull: true
});

module.exports = Ticket;
