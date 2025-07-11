const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  tipo: {
    type: String,
    enum: ["estudiante", "empresa", "admin", "asesor"],
    required: true,
  },
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  tipoDocumento: { type: String, required: true },
  documento: { type: String, required: true, unique: true },
  pais: { type: String },
  prefijo: { type: String },
  telefono: { type: String },
  direccion: { type: String },
  password: { type: String, required: true },
  rol: {
    type: String,
    enum: ["cliente", "asesor", "admin"],
    default: "cliente",
  },
}, { timestamps: true });

module.exports = mongoose.model("Usuario", usuarioSchema);
