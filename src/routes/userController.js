// src/controllers/userController.js
const Usuario = require("../models/Usuario");
const { Op } = require("sequelize");

// Obtener todos los usuarios
const getUsuarios = async (req, res) => {
  try {
    // Excluimos la contraseña por seguridad
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password'] }
    });
    res.json({ usuarios });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

// Obtener solo usuarios con rol de "asesor"
const getAsesores = async (req, res) => {
  try {
    const asesores = await Usuario.findAll({
      where: { rol: "asesor" },
      attributes: { exclude: ['password'] }
    });
    res.json({ usuarios: asesores });
  } catch (error) {
    console.error("Error al obtener asesores:", error);
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

module.exports = { getUsuarios, getAsesores };