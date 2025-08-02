// backend/routes/historialRoutes.js
const express = require('express');
const router = express.Router();
const { crearRegistroHistorial, obtenerHistorialPorTicket } = require('../controllers/historialController');
const verifyToken = require('../middlewares/verifyToken');

// POST para crear un nuevo registro en el historial
router.post('/', verifyToken, crearRegistroHistorial);

// GET para obtener el historial de un ticket
router.get('/:ticketId', verifyToken, obtenerHistorialPorTicket);

module.exports = router;