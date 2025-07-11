// backend/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Ticket = require('../models/Ticket');
const verifyToken = require("../middlewares/verifyToken");

// Configuración de almacenamiento para archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Crear un nuevo ticket
router.post('/', verifyToken, upload.single('archivo'), async (req, res) => {
  try {
    const { pregunta } = req.body;
    const archivoUrl = req.file ? req.file.filename : null;

    const nuevoTicket = new Ticket({
      usuario: req.usuarioId,
      pregunta,
      archivo: archivoUrl,
      estado: 'pendiente',
    });

    await nuevoTicket.save();
    res.status(201).json({ msg: 'Ticket creado exitosamente', ticket: nuevoTicket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Error al crear el ticket' });
  }
});

module.exports = router;
