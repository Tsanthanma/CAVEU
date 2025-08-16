// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const sequelize = require("./config/db");

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// --- SECCIÓN DE CORS MODIFICADA PARA DEPURAR ---
const allowedOrigins = [
  'http://localhost:3000',
  'https://caveu.vercel.app' // Esta es la URL que *creemos* correcta
];

app.use(cors({
  origin: function (origin, callback) {
    // Esta línea nos dirá la verdad en los logs de Render
    console.log('>>> Origen de la petición:', origin); 

    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Acceso CORS no permitido para este origen.'));
    }
  },
  credentials: true
}));
// --- FIN DE LA SECCIÓN DE CORS ---

// Middleware para leer JSON
app.use(express.json());

// Servir archivos estáticos de /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Rutas API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));
app.use("/api/usuarios", require("./routes/userRoutes"));
app.use("/api/historial", require("./routes/historialRoutes"));

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
    return sequelize.sync({ force: false });
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🟢 Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err);
  });