import React, { useEffect, useState } from "react";

const DashboardAdmin = () => {
  const [tickets, setTickets] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    nombres: "",
    apellidos: "",
    documento: "",
    email: "",
    password: "",
    rol: "asesor",
  });

  // Obtener tickets y usuarios al cargar
  useEffect(() => {
    obtenerTickets();
    obtenerUsuarios();
  }, []);

  const obtenerTickets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/tickets/admin");
      const data = await res.json();
      setTickets(data.tickets);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    }
  };

  const obtenerUsuarios = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/usuarios/asesores");
      const data = await res.json();
      setUsuarios(data.usuarios);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };

  const asignarAsesor = async (ticketId, asesorId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/asignar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ asesorId }),
      });
      if (res.ok) {
        alert("✅ Asesor asignado correctamente");
        obtenerTickets();
      } else {
        alert("❌ Error al asignar asesor");
      }
    } catch (error) {
      console.error("Error al asignar asesor:", error);
    }
  };

  const handleChangeUsuario = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario((prev) => ({ ...prev, [name]: value }));
  };

  const crearUsuario = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/registro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoUsuario),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario creado correctamente");
        setNuevoUsuario({
          nombres: "",
          apellidos: "",
          documento: "",
          email: "",
          password: "",
          rol: "asesor",
        });
        obtenerUsuarios();
      } else {
        alert(data.msg || "❌ Error creando usuario");
      }
    } catch (error) {
      console.error("Error creando usuario:", error);
    }
  };

  return (
    <div className="container">
      <h1>🎓 Panel de Administrador</h1>

      <section>
        <h2>📋 Tickets Recibidos</h2>
        {tickets.length === 0 ? (
          <p>No hay tickets disponibles</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Pregunta</th>
                <th>Cliente</th>
                <th>Fecha</th>
                <th>Estado</th>
                <th>Asesor</th>
                <th>Asignar</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.pregunta}</td>
                  <td>{ticket.usuario?.nombres || "Desconocido"}</td>
                  <td>{new Date(ticket.createdAt).toLocaleString()}</td>
                  <td>{ticket.estado}</td>
                  <td>{ticket.asesor?.nombres || "No asignado"}</td>
                  <td>
                    <select
                      onChange={(e) => asignarAsesor(ticket.id, e.target.value)}
                      defaultValue=""
                    >
                      <option value="">Asignar...</option>
                      {usuarios.map((asesor) => (
                        <option key={asesor.id} value={asesor.id}>
                          {asesor.nombres}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <hr />

      <section>
        <h2>➕ Crear Usuario Asesor/Admin</h2>
        <form onSubmit={crearUsuario} className="form-box">
          <input
            type="text"
            name="nombres"
            placeholder="Nombres"
            value={nuevoUsuario.nombres}
            onChange={handleChangeUsuario}
            required
          />
          <input
            type="text"
            name="apellidos"
            placeholder="Apellidos"
            value={nuevoUsuario.apellidos}
            onChange={handleChangeUsuario}
            required
          />
          <input
            type="text"
            name="documento"
            placeholder="Documento"
            value={nuevoUsuario.documento}
            onChange={handleChangeUsuario}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo"
            value={nuevoUsuario.email}
            onChange={handleChangeUsuario}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={nuevoUsuario.password}
            onChange={handleChangeUsuario}
            required
          />
          <select
            name="rol"
            value={nuevoUsuario.rol}
            onChange={handleChangeUsuario}
            required
          >
            <option value="asesor">Asesor</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" className="btn primary">Crear Usuario</button>
        </form>
      </section>
    </div>
  );
};

export default DashboardAdmin;
