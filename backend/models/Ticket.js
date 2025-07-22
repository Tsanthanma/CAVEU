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

// Relaciones
Ticket.belongsTo(Usuario, {
  as: 'usuario',
  foreignKey: 'usuarioId',
  onDelete: 'CASCADE'
});

Ticket.belongsTo(Usuario, {
  as: 'asesor',
  foreignKey: 'asesorId',
  allowNull: true
});

module.exports = Ticket;
