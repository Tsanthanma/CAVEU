// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { getAsesores, getUsuarios } = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken"); // Middleware de autenticación

// Ruta para obtener todos los usuarios (protegida)
router.get("/", verifyToken, getUsuarios);

// Ruta para obtener solo los asesores (protegida)
router.get("/asesores", verifyToken, getAsesores);

module.exports = router; 