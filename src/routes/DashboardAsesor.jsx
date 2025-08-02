// frontend/src/routes/DashboardAsesor.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../components/Perfil";
import HistorialModal from "../components/HistorialModal";

const DashboardAsesor = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const usuario = useMemo(() => JSON.parse(localStorage.getItem("usuario")), []);

  const [vista, setVista] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isResponderOpen, setIsResponderOpen] = useState(false);
  const [respuestaTexto, setRespuestaTexto] = useState("");
  const [ticketAResponder, setTicketAResponder] = useState(null);
  
  const [isHistorialOpen, setIsHistorialOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

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

  const registrarAccion = useCallback(async (ticketId, accion, detalle = null) => {
    try {
      await fetch(`http://localhost:5000/api/historial`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ticketId, accion, detalle })
      });
    } catch (error) {
      console.error("No se pudo registrar la acción en el historial:", error);
    }
  }, [token]);

  const handleMarcarResuelto = useCallback(async (ticketId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ estado: 'resuelto' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || 'No se pudo actualizar el ticket.');

      await registrarAccion(ticketId, "Ticket marcado como resuelto");
      alert('Ticket marcado como resuelto.');
      obtenerTicketsAsignados();
    } catch (error) {
      alert(error.message);
    }
  }, [token, obtenerTicketsAsignados, registrarAccion]);

  const abrirModalRespuesta = (ticket) => {
    setTicketAResponder(ticket);
    setIsResponderOpen(true);
  };

  const handleEnviarRespuesta = async (e) => {
    e.preventDefault();
    if (!respuestaTexto.trim()) {
      alert("La respuesta no puede estar vacía.");
      return;
    }
    
    await registrarAccion(ticketAResponder.id, "Respuesta de asesor", respuestaTexto);
    
    alert("Respuesta enviada y guardada en el historial.");
    setIsResponderOpen(false);
    setRespuestaTexto("");
    setTicketAResponder(null);
  };

  const abrirHistorial = (ticketId) => {
    setSelectedTicketId(ticketId);
    setIsHistorialOpen(true);
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
                    tickets.length === 0 ? <p>No tienes tickets asignados en este momento.</p> : (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {tickets.map((ticket) => (
                            <li key={ticket.id} className="ticket-item" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                                <p><strong>Cliente:</strong> {`${ticket.usuario?.nombres || ''} ${ticket.usuario?.apellidos || ''}`.trim() || "Desconocido"}</p>
                                <p><strong>Consulta:</strong> {ticket.pregunta}</p>
                                <p><strong>Estado:</strong> <span className={`estado-${ticket.estado.replace(' ', '-')}`}>{ticket.estado}</span></p>
                                <div style={{marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                                  <button className="btn primary" onClick={() => abrirModalRespuesta(ticket)} disabled={ticket.estado === 'resuelto'}>
                                      Responder
                                  </button>
                                  <button className="btn secondary" onClick={() => handleMarcarResuelto(ticket.id)} disabled={ticket.estado === 'resuelto'}>{ticket.estado === 'resuelto' ? 'Ya Resuelto' : 'Marcar Resuelto'}</button>
                                  <button className="btn" style={{backgroundColor: '#6c757d'}} onClick={() => abrirHistorial(ticket.id)}>Ver Historial</button>
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
      
      {isHistorialOpen && <HistorialModal ticketId={selectedTicketId} token={token} onClose={() => setIsHistorialOpen(false)} />}
      
      {isResponderOpen && (
          <div className="modal-backdrop">
              <div className="modal">
                  <h3>Responder al Ticket #{ticketAResponder.id}</h3>
                  <p><strong>Consulta del cliente:</strong> {ticketAResponder.pregunta}</p>
                  <form onSubmit={handleEnviarRespuesta}>
                      <label htmlFor="respuestaTexto">Tu respuesta:</label>
                      <textarea id="respuestaTexto" rows="6" value={respuestaTexto} onChange={(e) => setRespuestaTexto(e.target.value)} style={{width: '100%', fontSize: '16px', padding: '10px'}} required />
                      <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
                          <button type="submit" className="btn primary">Enviar Respuesta</button>
                          <button type="button" onClick={() => setIsResponderOpen(false)} className="btn secondary">Cancelar</button>
                      </div>
                  </form>
              </div>
          </div>
      )}

      <footer className="footer"><p>&copy; 2025 CAVE-U. UNIMINUTO ©2025</p></footer>
    </>
  );
};

export default DashboardAsesor;