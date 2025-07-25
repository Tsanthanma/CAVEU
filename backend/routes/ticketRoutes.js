// backend/routes/ticketRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Ticket = require('../models/Ticket');
const Usuario = require('../models/Usuario');
const verifyToken = require("../middlewares/verifyToken");
const { Op } = require('sequelize');

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

// RUTA POST: Crear un nuevo ticket
router.post('/', verifyToken, upload.single('archivo'), async (req, res) => {
  try {
    const { pregunta } = req.body;
    const archivoUrl = req.file ? req.file.filename : null;
    if (!pregunta && !archivoUrl) {
      return res.status(400).json({ msg: 'Debe escribir una pregunta o adjuntar un archivo.' });
    }
    const nuevoTicket = await Ticket.create({
      usuarioId: req.usuarioId,
      pregunta,
      archivo: archivoUrl,
      estado: 'pendiente'
    });
    res.status(201).json({ msg: 'Ticket creado exitosamente', ticket: nuevoTicket });
  } catch (error) {
    res.status(500).json({ msg: 'Error al crear el ticket' });
  }
});

// RUTA GET: Obtener todos los tickets (Admin)
router.get('/admin', verifyToken, async (req, res) => {
  try {
    const tickets = await Ticket.findAll({
      include: [
        { model: Usuario, as: 'usuario', attributes: ['nombres', 'apellidos'] },
        { model: Usuario, as: 'asesor', attributes: ['nombres', 'apellidos'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ msg: 'Error interno del servidor.' });
  }
});

// **RUTA CORREGIDA PARA EL CLIENTE**
router.get('/usuario/:usuarioId', verifyToken, async (req, res) => {
    try {
        const { usuarioId } = req.params;
        const tickets = await Ticket.findAll({
            where: { usuarioId },
            // AÑADIMOS LA INFORMACIÓN DEL ASESOR
            include: [{ model: Usuario, as: 'asesor', attributes: ['nombres', 'apellidos'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ tickets });
    } catch (error) {
        console.error("Error al obtener tickets del usuario:", error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

// **RUTA CORREGIDA PARA EL ASESOR**
router.get('/asesor/:asesorId', verifyToken, async (req, res) => {
    try {
        const { asesorId } = req.params;
        const tickets = await Ticket.findAll({
            where: { asesorId },
            // AÑADIMOS LA INFORMACIÓN DEL CLIENTE (USUARIO)
            include: [{ model: Usuario, as: 'usuario', attributes: ['nombres', 'apellidos', 'email'] }],
            order: [['createdAt', 'DESC']]
        });
        res.json({ tickets });
    } catch (error) {
        console.error("Error al obtener tickets del asesor:", error);
        res.status(500).json({ msg: 'Error interno del servidor.' });
    }
});

// RUTA PUT: Asignar por área
router.put('/:ticketId/asignar-area', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { area } = req.body;
    const asesoresDisponibles = await Usuario.findAll({ where: { rol: 'asesor', area: area }, attributes: ['id'] });

    if (asesoresDisponibles.length === 0) {
      return res.status(404).json({ msg: `No se encontraron asesores para el área de ${area}.` });
    }
    const asesorAleatorio = asesoresDisponibles[Math.floor(Math.random() * asesoresDisponibles.length)];
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado.' });
    
    ticket.area = area;
    ticket.asesorId = asesorAleatorio.id;
    ticket.estado = 'en proceso';
    await ticket.save();
    res.json({ msg: `Ticket asignado al área de ${area} y a un asesor.`, ticket });
  } catch (error) {
    res.status(500).json({ msg: 'Error interno del servidor.' });
  }
});

// RUTA PUT: Actualizar estado de ticket (Asesor)
router.put('/:ticketId/estado', verifyToken, async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { estado } = req.body;
    if (!['en proceso', 'resuelto'].includes(estado)) {
      return res.status(400).json({ msg: 'Estado no válido.' });
    }
    const ticket = await Ticket.findByPk(ticketId);
    if (!ticket) return res.status(404).json({ msg: 'Ticket no encontrado.' });
    
    // Un asesor solo puede modificar los tickets que tiene asignados
    if (ticket.asesorId !== req.usuarioId) {
        return res.status(403).json({ msg: 'No tienes permiso para modificar este ticket.' });
    }

    ticket.estado = estado;
    await ticket.save();
    res.json({ msg: `Ticket actualizado a "${estado}"`, ticket });
  } catch (error) {
    res.status(500).json({ msg: 'Error interno del servidor.' });
  }
});

module.exports = router;