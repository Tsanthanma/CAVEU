const Ticket = require("../models/Ticket");

const crearTicket = async (req, res) => {
  try {
    const { pregunta } = req.body;
    const archivo = req.file ? req.file.filename : null;
    const usuarioId = req.body.usuarioId || req.usuario?.id;

    if (!pregunta && !archivo) {
      return res.status(400).json({ msg: "Debe enviar una pregunta o un archivo." });
    }

    const nuevoTicket = await Ticket.create({
      usuarioId,
      pregunta,
      archivo
    });

    res.status(201).json({ msg: "Ticket creado correctamente", ticket: nuevoTicket });
  } catch (error) {
    console.error("Error al crear ticket:", error);
    res.status(500).json({ msg: "Error interno del servidor" });
  }
};

module.exports = { crearTicket };
