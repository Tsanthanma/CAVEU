const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware CORS (ajusta origin si usas otro puerto)
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos de /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("🚀 API CAVE-U funcionando correctamente");
});

// Puerto
const PORT = process.env.PORT || 5000;

// Conexión con base de datos y arranque del servidor
sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado a MySQL con Sequelize");
    return sequelize.sync({ force: false }); // true borra y recrea las tablas
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err);
  });
