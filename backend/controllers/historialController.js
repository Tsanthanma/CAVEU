// backend/controllers/historialController.js
const HistorialTicket = require('../models/HistorialTicket');
const Usuario = require('../models/Usuario');
const Ticket = require('../models/Ticket');
const transporter = require('../config/mailer'); // Importamos nuestro servicio de correo

// Crear un nuevo registro en el historial Y ENVIAR CORREO SI ES UNA RESPUESTA
exports.crearRegistroHistorial = async (req, res) => {
    try {
        const { ticketId, accion, detalle } = req.body;
        const asesorId = req.usuarioId;

        const nuevoRegistro = await HistorialTicket.create({
            ticketId,
            asesorId,
            accion,
            detalle
        });

        // --- LÓGICA PARA ENVIAR EL CORREO ---
        if (accion === 'Respuesta de asesor') {
            // Buscamos el ticket y la información del cliente y asesor
            const ticket = await Ticket.findByPk(ticketId, {
                include: [
                    { model: Usuario, as: 'usuario', attributes: ['email', 'nombres'] },
                    { model: Usuario, as: 'asesor', attributes: ['nombres', 'apellidos'] }
                ]
            });

            if (ticket && ticket.usuario) {
                const asesorNombre = `${ticket.asesor.nombres} ${ticket.asesor.apellidos}`;
                
                // Enviamos el correo
                await transporter.sendMail({
                    from: `"CAVE-U" <${process.env.EMAIL_USER}>`,
                    to: ticket.usuario.email,
                    subject: `Nueva respuesta a tu ticket #${ticket.id}`,
                    html: `
                        <h2>Hola, ${ticket.usuario.nombres}</h2>
                        <p>Tu asesor, <strong>${asesorNombre}</strong>, ha respondido a tu consulta:</p>
                        <blockquote style="border-left: 2px solid #ccc; padding-left: 15px; margin-left: 10px;">
                            <p>${detalle}</p>
                        </blockquote>
                        <p>Puedes ver el historial completo de tu caso en la plataforma.</p>
                        <br>
                        <p>Atentamente,</p>
                        <p>El equipo de CAVE-U</p>
                    `
                });
                console.log(`Correo de respuesta enviado a ${ticket.usuario.email}`);
            }
        }
        
        res.status(201).json({ msg: "Registro de historial creado y correo enviado.", registro: nuevoRegistro });

    } catch (error) {
        console.error("Error al crear registro de historial:", error);
        res.status(500).json({ msg: "Error en el servidor." });
    }
};

// Obtener el historial de un ticket específico
exports.obtenerHistorialPorTicket = async (req, res) => {
    try {
        const { ticketId } = req.params;
        const historial = await HistorialTicket.findAll({
            where: { ticketId },
            include: [{
                model: Usuario,
                attributes: ['nombres', 'apellidos']
            }],
            order: [['createdAt', 'ASC']]
        });
        res.json(historial);
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor al obtener historial." });
    }
};