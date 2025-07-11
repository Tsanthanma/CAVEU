// backend/controllers/ticketController.js
const Ticket = require("../models/Ticket");

const crearTicket = async (req, res) => {
  try {
    const { pregunta } = req.body;
    const archivo = req.file ? req.file.filename : "";
    const clienteId = req.usuario.id;

    const nuevoTicket = new Ticket({
      cliente: clienteId,
      pregunta,
      archivo,
    });

    await nuevoTicket.save();

    res.status(201).json({ msg: "Ticket creado correctamente" });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports = { crearTicket };
