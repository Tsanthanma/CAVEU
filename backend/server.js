const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Cargar variables de entorno
dotenv.config();

// Conectar a la base de datos
connectDB();

// Crear la app de Express
const app = express();

// Middleware para permitir solicitudes desde el frontend (localhost:3001)
app.use(cors({
  origin: "http://localhost:3001", // Dirección del frontend
  credentials: true
}));

// Middleware para analizar JSON
app.use(express.json());

// Rutas de autenticación
app.use("/api/auth", require("./routes/authRoutes"));

// Rutas de tickets
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Puerto en el que correrá el servidor (por defecto 5000)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
});
