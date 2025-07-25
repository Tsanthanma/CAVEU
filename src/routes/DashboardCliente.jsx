// frontend/src/routes/DashboardCliente.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../components/Perfil";

const ClienteDashboard = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [vista, setVista] = useState('tickets');
  const [pregunta, setPregunta] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const obtenerMisTickets = useCallback(async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/usuario/${usuario.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        throw new Error(data.msg || "Error al obtener tickets");
      }
    } catch (err) {
      alert(`Error al obtener tickets: ${err.message}`);
      handleLogout();
    }
  }, [usuario, token, handleLogout]);

  useEffect(() => {
    if (vista === 'tickets') {
      obtenerMisTickets();
    }
  }, [vista, obtenerMisTickets]);

  const handleCrearTicket = async (e) => {
    e.preventDefault();
    if (!pregunta.trim() && !archivo) {
      alert("Por favor escribe tu consulta o adjunta un archivo.");
      return;
    }
    const formData = new FormData();
    formData.append("pregunta", pregunta);
    if (archivo) formData.append("archivo", archivo);
    
    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/api/tickets", {
        method: "POST",
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error desconocido");
      alert("Consulta enviada correctamente.");
      setPregunta("");
      setArchivo(null);
      if(document.getElementById("archivo")) {
        document.getElementById("archivo").value = null;
      }
      obtenerMisTickets();
    } catch (error) {
      alert(`Error al enviar la consulta: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <header><h1>Consultorio Académico Virtual Empresarial Uniminuto</h1></header>
      <div className="container" style={{ marginTop: "150px", maxWidth: '900px' }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2>Bienvenido, {usuario?.nombres}</h2>
          <button onClick={handleLogout} className="btn logout">Cerrar sesión</button>
        </div>
        
        <nav className="dashboard-nav">
          <button onClick={() => setVista('tickets')} className={vista === 'tickets' ? 'active' : ''}>Mis Consultas</button>
          <button onClick={() => setVista('perfil')} className={vista === 'perfil' ? 'active' : ''}>Mi Perfil</button>
        </nav>

        {vista === 'tickets' && (
          <section>
            <h3>Crear Nueva Consulta</h3>
            <form className="form-box" onSubmit={handleCrearTicket}>
              <label htmlFor="pregunta">Describe tu consulta:</label>
              <textarea id="pregunta" value={pregunta} onChange={(e) => setPregunta(e.target.value)} rows={4} placeholder="Ej: Tengo problemas con mi proyecto..."/>
              <label htmlFor="archivo">Adjuntar archivo (opcional):</label>
              <input id="archivo" type="file" onChange={(e) => setArchivo(e.target.files[0])} />
              <button type="submit" className="btn primary" disabled={cargando}>
                {cargando ? "Enviando..." : "Enviar Consulta"}
              </button>
            </form>
            <hr style={{ margin: '30px 0' }}/>
            <h3>Historial de Consultas</h3>
            {tickets.length > 0 ? (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {tickets.map(ticket => (
                    <li key={ticket.id} className="ticket-item" style={{ background: '#f9f9f9', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                        <p><strong>Consulta:</strong> {ticket.pregunta}</p>
                        <p><strong>Fecha:</strong> {new Date(ticket.createdAt).toLocaleDateString()}</p>
                        <p><strong>Estado:</strong> {ticket.estado}</p>
                        {/* LÍNEA MODIFICADA PARA MOSTRAR EL ASESOR */}
                        <p><strong>Asesor:</strong> {ticket.asesor ? `${ticket.asesor.nombres} ${ticket.asesor.apellidos}` : 'Aún no asignado'}</p>
                        {ticket.archivo && <p><strong>Archivo:</strong> <a href={`http://localhost:5000/uploads/${ticket.archivo}`} target="_blank" rel="noopener noreferrer">Ver archivo</a></p>}
                    </li>
                    ))}
                </ul>
            ) : <p>No has enviado ninguna consulta aún.</p>}
          </section>
        )}
        
        {vista === 'perfil' && <Perfil />}
      </div>
      <footer className="footer"><p>&copy; 2025 CAVE-U. Todos los derechos Reservados. UNIMINUTO ©2025</p></footer>
    </>
  );
};

export default ClienteDashboard;