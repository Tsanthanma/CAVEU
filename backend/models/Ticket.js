// models/Ticket.js
const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    usuario: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    pregunta: {
      type: String,
      required: true,
    },
    archivo: {
      type: String, // Nombre del archivo guardado (ej: uploads/archivo.pdf)
    },
    estado: {
      type: String,
      enum: ["pendiente", "en proceso", "resuelto"],
      default: "pendiente",
    },
    area: {
      type: String, // Área asignada (medicina, ingenierías, etc.)
    },
    asesor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario", // En caso de asignación a un asesor
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);
