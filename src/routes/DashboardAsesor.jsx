import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const DashboardAsesor = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    obtenerTicketsAsignados();
  }, []);

  const obtenerTicketsAsignados = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/asesor/${usuario.id}`);
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        alert("Error al obtener tickets.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("No se pudo conectar con el servidor.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  const enviarCorreo = (emailCliente, pregunta) => {
    const asunto = encodeURIComponent("Respuesta a tu consulta en CAVE-U");
    const cuerpo = encodeURIComponent(
      `Hola,\n\nEn respuesta a tu consulta: "${pregunta}"\n\n[Escribe tu respuesta aquí...]\n\nSaludos,\nTu asesor de CAVE-U`
    );
    window.location.href = `mailto:${emailCliente}?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <>
      {/* NAV */}
      <header>
        <h1>Consultorio Académico Virtual Empresarial Uniminuto</h1>
      </header>

      <div className="container" style={{ marginTop: "200px" }}>
        {/* Bienvenida + Logout */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Bienvenido, {usuario.nombres}</h2>
          <button onClick={handleLogout} className="btn logout">Cerrar sesión</button>
        </div>

        <h3>📥 Tickets asignados a ti</h3>

        {tickets.length === 0 ? (
          <p>No tienes tickets asignados aún.</p>
        ) : (
          <ul>
            {tickets.map((ticket) => (
              <li key={ticket.id} className="ticket-item">
                <p><strong>Cliente:</strong> {ticket.usuario?.nombres || "Desconocido"}</p>
                <p><strong>Correo:</strong> {ticket.usuario?.email}</p>
                <p><strong>Consulta:</strong> {ticket.pregunta}</p>
                <p><strong>Fecha:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
                <p><strong>Estado:</strong> {ticket.estado}</p>
                {ticket.archivo && (
                  <p>
                    <strong>Archivo:</strong>{" "}
                    <a
                      href={`http://localhost:5000/uploads/${ticket.archivo}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Ver archivo
                    </a>
                  </p>
                )}

                <button
                  className="btn primary"
                  onClick={() =>
                    enviarCorreo(ticket.usuario?.email, ticket.pregunta)
                  }
                >
                  Responder por correo
                </button>
                <hr />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2025 CAVE-U Todos los derechos Reservados. UNIMINUTO ©2025</p>
      </footer>
    </>
  );
};

export default DashboardAsesor;
