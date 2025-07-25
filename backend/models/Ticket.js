// src/models/Ticket.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Ticket = sequelize.define('Ticket', {
  pregunta: {
    type: DataTypes.STRING,
    allowNull: true // Permitir nulo si solo se envía archivo
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
  // IDs para las relaciones
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