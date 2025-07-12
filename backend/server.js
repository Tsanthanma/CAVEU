const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const sequelize = require("./config/db"); // importamos Sequelize

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app = express();

// Middleware CORS para frontend en localhost:3000
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

// Middleware para leer JSON
app.use(express.json());

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/tickets", require("./routes/ticketRoutes"));

// Puerto
const PORT = process.env.PORT || 5000;

// Conexión con MySQL y levantar servidor
sequelize.authenticate()
  .then(() => {
    console.log("✅ Conectado a MySQL con Sequelize");
    return sequelize.sync({ force: false }); // Cambia a true si quieres borrar y recrear las tablas
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🟢 Servidor corriendo en http://localhost:5000`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a MySQL:", err);
  });
