// backend/controllers/authController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registro = async (req, res) => {
  try {
    const {
      documento,
      email,
      password,
      nombres,
      apellidos,
      tipo,
      tipoDocumento,
      pais,
      prefijo,
      telefono,
      direccion,
      rol = 'cliente', // Por defecto es 'cliente' si no se especifica
      area 
    } = req.body;

    // Validaciones de existencia
    const usuarioExistente = await Usuario.findOne({ where: { documento } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "Ya existe un usuario con ese documento." });
    }
    const emailExistente = await Usuario.findOne({ where: { email } });
    if (emailExistente) {
      return res.status(400).json({ msg: "Ya existe un usuario con ese correo electrónico." });
    }

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario en la base de datos
    await Usuario.create({
      tipo,
      nombres,
      apellidos,
      tipoDocumento,
      documento,
      email,
      pais,
      prefijo,
      telefono,
      direccion,
      password: hashedPassword, // Guardamos la contraseña encriptada
      rol,
      area: rol === 'asesor' ? area : null
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return res.status(500).json({ msg: "Error en el servidor durante el registro." });
  }
};

const login = async (req, res) => {
  try {
    const { documento, password } = req.body;

    const usuario = await Usuario.findOne({ where: { documento } });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos." });
    }

    // Comparamos la contraseña enviada con la encriptada en la BD
    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ msg: "Usuario o contraseña incorrectos." });
    }

    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "2h" }
    );
    
    // Extraemos los datos del usuario sin la contraseña para enviarlos al frontend
    const usuarioSinPassword = { ...usuario.get({ plain: true }) };
    delete usuarioSinPassword.password;

    res.json({
      token,
      usuario: usuarioSinPassword,
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ msg: "Error en el servidor durante el login." });
  }
};

module.exports = { registro, login };