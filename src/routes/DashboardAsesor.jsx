// frontend/src/routes/DashboardAsesor.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../components/Perfil";

const DashboardAsesor = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // **CORRECCIÓN CLAVE**: Usamos useMemo para que el objeto de usuario no se cree en cada render.
  // Esto rompe el bucle infinito de "Cargando...".
  const usuario = useMemo(() => JSON.parse(localStorage.getItem("usuario")), []);

  const [vista, setVista] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const obtenerTicketsAsignados = useCallback(async () => {
    if (!usuario?.id) {
        setIsLoading(false);
        return;
    }
    setIsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/asesor/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error("Error de autenticación o del servidor.");
      
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (error) {
      console.error("Error al obtener tickets:", error);
      alert(error.message);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [usuario, token, handleLogout]);

  useEffect(() => {
    if (vista === 'tickets') {
        obtenerTicketsAsignados();
    }
  }, [vista, obtenerTicketsAsignados]);

  const handleMarcarResuelto = async (ticketId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ estado: 'resuelto' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'No se pudo actualizar el ticket.');
      alert('Ticket marcado como resuelto.');
      obtenerTicketsAsignados();
    } catch (error) {
      console.error("Error al marcar como resuelto:", error);
      alert(error.message);
    }
  };
  
  const enviarCorreo = (emailCliente, pregunta) => {
    const asunto = encodeURIComponent(`Respuesta a tu consulta: "${pregunta.substring(0, 20)}..."`);
    const cuerpo = encodeURIComponent(
      `Hola,\n\nEn respuesta a tu consulta: "${pregunta}"\n\n[Escribe tu respuesta aquí...]\n\nSaludos,\n${usuario.nombres}, tu asesor de CAVE-U`
    );
    window.location.href = `mailto:${emailCliente}?subject=${asunto}&body=${cuerpo}`;
  };

  return (
    <>
      <header><h1>Consultorio Académico Virtual Empresarial Uniminuto</h1></header>
      <div className="container" style={{ marginTop: "150px", maxWidth: "900px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Bienvenido, Asesor {usuario?.nombres}</h2>
          <button onClick={handleLogout} className="btn logout">Cerrar sesión</button>
        </div>

        <nav className="dashboard-nav">
          <button onClick={() => setVista('tickets')} className={vista === 'tickets' ? 'active' : ''}>Tickets Asignados</button>
          <button onClick={() => setVista('perfil')} className={vista === 'perfil' ? 'active' : ''}>Mi Perfil</button>
        </nav>
        
        {vista === 'tickets' && (
            <section>
                <h3>📥 Tickets asignados a ti</h3>
                {isLoading ? <p>Cargando tickets...</p> : (
                    tickets.length === 0 ? (
                        <p>No tienes tickets asignados en este momento.</p>
                    ) : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {tickets.map((ticket) => (
                            <li key={ticket.id} className="ticket-item" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                <p><strong>Cliente:</strong> {`${ticket.usuario?.nombres || ''} ${ticket.usuario?.apellidos || ''}`.trim() || "Desconocido"}</p>
                                <p><strong>Correo del Cliente:</strong> {ticket.usuario?.email || "No disponible"}</p>
                                <p><strong>Consulta:</strong> {ticket.pregunta}</p>
                                <p><strong>Fecha de Asignación:</strong> {new Date(ticket.updatedAt).toLocaleString()}</p>
                                <p><strong>Estado:</strong> <span className={`estado-${ticket.estado.replace(' ', '-')}`}>{ticket.estado}</span></p>
                                {ticket.archivo && <p><strong>Archivo Adjunto:</strong> <a href={`http://localhost:5000/uploads/${ticket.archivo}`} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>}
                                <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                                <button className="btn primary" onClick={() => enviarCorreo(ticket.usuario?.email, ticket.pregunta)} disabled={ticket.estado === 'resuelto'}>
                                    Responder por Correo
                                </button>
                                <button className="btn secondary" onClick={() => handleMarcarResuelto(ticket.id)} disabled={ticket.estado === 'resuelto'}>
                                    {ticket.estado === 'resuelto' ? 'Ya Resuelto' : 'Marcar como Resuelto'}
                                </button>
                                </div>
                            </li>
                            ))}
                        </ul>
                    )
                )}
            </section>
        )}

        {vista === 'perfil' && <Perfil />}
      </div>
      <footer className="footer"><p>&copy; 2025 CAVE-U. Todos los derechos Reservados. UNIMINUTO ©2025</p></footer>
    </>
  );
};

export default DashboardAsesor;