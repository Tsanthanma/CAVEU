import React, { useState, useEffect } from "react";

const ClienteDashboard = () => {
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const [pregunta, setPregunta] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [cargando, setCargando] = useState(false);

  const handleCrearTicket = async (e) => {
    e.preventDefault();

    if (!pregunta.trim()) {
      alert("Por favor escribe tu consulta.");
      return;
    }

    const formData = new FormData();
    formData.append("pregunta", pregunta);
    formData.append("usuarioId", usuario._id);
    if (archivo) formData.append("archivo", archivo);

    try {
      setCargando(true);
      const res = await fetch("http://localhost:3001/api/tickets", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Consulta enviada correctamente.");
        setPregunta("");
        setArchivo(null);
        obtenerMisTickets();
      } else {
        alert(data.msg || "Error al enviar la consulta.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const obtenerMisTickets = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/tickets/usuario/${usuario._id}`);
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      } else {
        console.error("Error al obtener los tickets");
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  useEffect(() => {
  const obtenerMisTickets = async () => {
    try {
      const res = await fetch(`http://localhost:3001/api/tickets/usuario/${usuario._id}`);
      const data = await res.json();
      if (res.ok) {
        setTickets(data.tickets || []);
      }
    } catch (err) {
      console.error("Error al obtener tickets:", err);
    }
  };

  obtenerMisTickets();
}, [usuario._id]);

  return (
    <div className="container">
      <h2>Bienvenido, {usuario.nombres}</h2>

      <form className="form-box" onSubmit={handleCrearTicket} encType="multipart/form-data">
        <label>Describe tu consulta:</label>
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          required
          rows={4}
          placeholder="Ej: Tengo problemas con mi proyecto de ingeniería..."
        />

        <label>Adjuntar archivo (opcional):</label>
        <input
          type="file"
          onChange={(e) => setArchivo(e.target.files[0])}
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
        />

        <button type="submit" className="btn primary" disabled={cargando}>
          {cargando ? "Enviando..." : "Enviar Consulta"}
        </button>
      </form>

      <hr />

      <h3>Mis Consultas Enviadas</h3>
      {tickets.length === 0 ? (
        <p>No has enviado ninguna consulta aún.</p>
      ) : (
        <ul>
          {tickets.map((ticket) => (
            <li key={ticket._id} className="ticket-item">
              <strong>📩 Consulta:</strong> {ticket.pregunta} <br />
              <strong>📅 Fecha:</strong> {new Date(ticket.createdAt).toLocaleDateString()} <br />
              <strong>📌 Estado:</strong> {ticket.estado} <br />
              {ticket.archivo && (
                <>
                  <strong>📎 Archivo:</strong>{" "}
                  <a href={`http://localhost:3001/uploads/${ticket.archivo}`} target="_blank" rel="noreferrer">
                    Ver archivo
                  </a>
                </>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ClienteDashboard;
