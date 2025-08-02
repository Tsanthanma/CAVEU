// backend/models/HistorialTicket.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');
const Ticket = require('./Ticket'); // Importamos Ticket para definir la relación

const HistorialTicket = sequelize.define('HistorialTicket', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'Tickets', key: 'id' }
  },
  asesorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'usuarios', key: 'id' }
  },
  accion: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  detalle: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
}, {
  timestamps: true
});

// **AQUÍ ESTÁ LA CORRECCIÓN CLAVE**
// Definimos todas las relaciones del historial en un solo lugar
Ticket.hasMany(HistorialTicket, { foreignKey: 'ticketId', as: 'historial' });
HistorialTicket.belongsTo(Ticket, { foreignKey: 'ticketId' });
HistorialTicket.belongsTo(Usuario, { foreignKey: 'asesorId' });

module.exports = HistorialTicket;