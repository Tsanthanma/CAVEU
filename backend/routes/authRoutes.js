const express = require("express");
const router = express.Router();
const { registro, login } = require("../controllers/authController");

// Ruta para registrar un usuario
router.post("/registro", registro);

// Ruta para login
router.post("/login", login);

module.exports = router;
