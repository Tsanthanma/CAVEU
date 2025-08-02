// backend/config/mailer.js
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Configuración del "transporter" que usará Nodemailer para enviar correos
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Usamos el servidor SMTP de Gmail
    port: 465,
    secure: true, // true para el puerto 465, false para otros
    auth: {
        user: process.env.EMAIL_USER, // Tu correo desde .env
        pass: process.env.EMAIL_PASS, // Tu contraseña de aplicación desde .env
    },
});

transporter.verify().then(() => {
    console.log('✅ Servicio de correo listo para enviar mensajes.');
}).catch(console.error);

module.exports = transporter;