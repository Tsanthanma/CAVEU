const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registro = async (req, res) => {
  try {
    console.log("📩 Datos recibidos:", req.body);

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
    } = req.body;

    // Validación: documento único
    const usuarioExistente = await Usuario.findOne({ where: { documento } });
    if (usuarioExistente) {
      return res.status(400).json({ msg: "Ya existe ese documento." });
    }

    // Hash de la contraseña
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      tipo,
      nombres,
      apellidos,
      tipoDocumento,
      documento,
      email, // ✅ aquí ya no estará undefined
      pais,
      prefijo,
      telefono,
      direccion,
      password: hashedPassword,
      rol: "cliente",
    });

    return res.status(201).json({ msg: "Usuario registrado correctamente." });
  } catch (error) {
    console.error("❌ Error en el registro:", error);
    return res.status(500).json({ msg: "Error en el registro." });
  }
};

const login = async (req, res) => {
  try {
    const { documento, password } = req.body;

    const usuario = await Usuario.findOne({ where: { documento } });
    if (!usuario) {
      return res.status(400).json({ msg: "Usuario no encontrado." });
    }

    const passwordValida = bcrypt.compareSync(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ msg: "Contraseña incorrecta." });
    }

    const token = jwt.sign(
      { id: usuario.id, documento: usuario.documento },
      process.env.JWT_SECRET || "secreto123",
      { expiresIn: "2h" }
    );

    res.json({
      token,
      usuario: {
        id: usuario.id,
        documento: usuario.documento,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        tipo: usuario.tipo,
        tipoDocumento: usuario.tipoDocumento,
        pais: usuario.pais,
        telefono: usuario.telefono,
        direccion: usuario.direccion,
        rol: usuario.rol,
        email: usuario.email, // opcional para el frontend
      },
    });
  } catch (error) {
    console.error("❌ Error en el login:", error);
    res.status(500).json({ msg: "Error en el login." });
  }
};

module.exports = { registro, login };
