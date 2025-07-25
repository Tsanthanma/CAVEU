// backend/controllers/userController.js
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

// Obtener todos los usuarios con rol de "asesor"
const getAsesores = async (req, res) => {
  try {
    const asesores = await Usuario.findAll({
      where: { rol: "asesor" },
      attributes: { exclude: ['password'] }
    });
    res.json({ usuarios: asesores });
  } catch (error) {
    res.status(500).json({ msg: "Error interno del servidor." });
  }
};

// Actualizar un usuario
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombres, apellidos, email, telefono, direccion, area, password } = req.body;

        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        // Actualizar campos
        usuario.nombres = nombres || usuario.nombres;
        usuario.apellidos = apellidos || usuario.apellidos;
        usuario.email = email || usuario.email;
        usuario.telefono = telefono || usuario.telefono;
        usuario.direccion = direccion || usuario.direccion;
        if (usuario.rol === 'asesor') {
            usuario.area = area || usuario.area;
        }

        // Si se envía una nueva contraseña, encriptarla
        if (password) {
            usuario.password = bcrypt.hashSync(password, 10);
        }

        await usuario.save();
        
        const usuarioSinPassword = { ...usuario.get({ plain: true }) };
        delete usuarioSinPassword.password;

        res.json({ msg: "Usuario actualizado correctamente.", usuario: usuarioSinPassword });

    } catch (error) {
        console.error("Error al actualizar usuario:", error);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};

// Eliminar un usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const usuario = await Usuario.findByPk(id);
        if (!usuario) {
            return res.status(404).json({ msg: "Usuario no encontrado." });
        }

        await usuario.destroy();
        res.json({ msg: "Usuario eliminado correctamente." });

    } catch (error) {
        console.error("Error al eliminar usuario:", error);
        res.status(500).json({ msg: "Error interno del servidor." });
    }
};

module.exports = { getAsesores, updateUser, deleteUser };