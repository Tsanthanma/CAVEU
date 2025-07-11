const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registro = async (req, res) => {
  try {
    const { documento, password, nombres, apellidos, ...otros } = req.body;

    const usuarioExistente = await Usuario.findOne({ where: { documento } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "Ya existe ese documento." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await Usuario.create({
      documento,
      password: hashedPassword,
      nombres,
      apellidos,
      ...otros,
    });

    res.status(201).json({ msg: "Usuario registrado correctamente." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Error en el registro" });
  }
};

module.exports = { registro };
