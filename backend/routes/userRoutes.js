// backend/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { 
    getAsesores, 
    updateUser, 
    deleteUser 
} = require("../controllers/userController");
const verifyToken = require("../middlewares/verifyToken");

// Obtener todos los usuarios con rol de "asesor"
router.get("/asesores", verifyToken, getAsesores);

// Actualizar un usuario por ID (para Admin o el propio usuario)
router.put("/:id", verifyToken, updateUser);

// Eliminar un usuario por ID (para Admin)
router.delete("/:id", verifyToken, deleteUser);

module.exports = router;