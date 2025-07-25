// frontend/src/routes/DashboardAdmin.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Perfil from "../components/Perfil";

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  const [vista, setVista] = useState('tickets');
  const [tickets, setTickets] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const areasDisponibles = ['Contable', 'Administrativa', 'Empresarial', 'Legal'];

  const handleLogout = useCallback(() => {
    localStorage.clear();
    navigate("/");
  }, [navigate]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [ticketsRes, asesoresRes] = await Promise.all([
        fetch("http://localhost:5000/api/tickets/admin", { headers: { 'Authorization': `Bearer ${token}` } }),
        fetch("http://localhost:5000/api/usuarios/asesores", { headers: { 'Authorization': `Bearer ${token}` } })
      ]);
      if (!ticketsRes.ok || !asesoresRes.ok) throw new Error('Error de autenticación o del servidor.');
      
      const ticketsData = await ticketsRes.json();
      const asesoresData = await asesoresRes.json();
      
      setTickets(ticketsData.tickets || []);
      setAsesores(asesoresData.usuarios || []);
    } catch (error) {
      alert(error.message);
      handleLogout();
    } finally {
      setIsLoading(false);
    }
  }, [token, handleLogout]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAsignarArea = async (ticketId, area) => {
    if (!area) return;
    try {
      const res = await fetch(`http://localhost:5000/api/tickets/${ticketId}/asignar-area`, {
        method: "PUT",
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ area }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error al asignar");
      alert(data.msg);
      fetchData();
    } catch (error) {
      alert(`❌ ${error.message}`);
    }
  };
  
  const abrirModalParaCrear = () => {
    setUsuarioSeleccionado({
        nombres: '', apellidos: '', tipo: 'No aplica', tipoDocumento: 'CC', 
        documento: '', email: '', password: '', rol: 'asesor', area: 'Contable'
    });
    setIsModalOpen(true);
  };

  const abrirModalParaEditar = (asesor) => {
    setUsuarioSeleccionado({ ...asesor, password: '' });
    setIsModalOpen(true);
  };
  
  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    const esNuevo = !usuarioSeleccionado.id;
    const url = esNuevo 
      ? `http://localhost:5000/api/auth/registro`
      : `http://localhost:5000/api/usuarios/${usuarioSeleccionado.id}`;
    const method = esNuevo ? 'POST' : 'PUT';

    const body = { ...usuarioSeleccionado };
    if (!body.password) delete body.password; // No enviar contraseña si está vacía

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg);
      
      alert(`Asesor ${esNuevo ? 'creado' : 'actualizado'} con éxito.`);
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEliminarUsuario = async (asesorId) => {
    if (window.confirm("¿Seguro que quieres eliminar a este asesor?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/usuarios/${asesorId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.msg);
        alert("Asesor eliminado con éxito.");
        fetchData();
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    }
  };

  const handleModalChange = (e) => {
    setUsuarioSeleccionado({ ...usuarioSeleccionado, [e.target.name]: e.target.value });
  };

  return (
    <>
      <header><h1>Consultorio Académico Virtual Empresarial Uniminuto</h1></header>
      <div className="container" style={{ marginTop: "150px", maxWidth: "1200px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: '20px' }}>
          <h2>🎓 Panel de Administrador: {usuario?.nombres}</h2>
          <button onClick={handleLogout} className="btn logout">Cerrar sesión</button>
        </div>

        <nav className="dashboard-nav">
          <button onClick={() => setVista('tickets')} className={vista === 'tickets' ? 'active' : ''}>Gestión de Tickets</button>
          <button onClick={() => setVista('asesores')} className={vista === 'asesores' ? 'active' : ''}>Gestión de Asesores</button>
          <button onClick={() => setVista('perfil')} className={vista === 'perfil' ? 'active' : ''}>Mi Perfil</button>
        </nav>

        {isLoading && <p>Cargando...</p>}
        
        {vista === 'tickets' && !isLoading && (
            <section>
              <h3>📋 Tickets Pendientes y en Proceso</h3>
              <div style={{overflowX: 'auto'}}>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Cliente</th><th>Consulta</th><th>Fecha</th><th>Estado</th>
                      <th>Área</th><th>Asesor Asignado</th><th>Asignar a Área</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id}>
                        <td>{`${t.usuario?.nombres||''} ${t.usuario?.apellidos||''}`.trim()||'N/A'}</td>
                        <td style={{minWidth: '200px'}}>{t.pregunta}</td>
                        <td>{new Date(t.createdAt).toLocaleString()}</td>
                        <td><span className={`estado-${t.estado.replace(' ','-')}`}>{t.estado}</span></td>
                        <td>{t.area || 'N/A'}</td>
                        <td>{`${t.asesor?.nombres||''} ${t.asesor?.apellidos||''}`.trim()||'Sin asignar'}</td>
                        <td>
                          <select onChange={(e) => handleAsignarArea(t.id, e.target.value)} value={t.area || ""} disabled={t.estado !== 'pendiente'} className="registro-select">
                            <option value="">-- Seleccionar --</option>
                            {areasDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
        )}

        {vista === 'asesores' && !isLoading && (
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>👥 Asesores Registrados</h3>
              <button onClick={abrirModalParaCrear} className="btn primary">➕ Crear Asesor</button>
            </div>
            <table className="table">
              <thead><tr><th>Nombre</th><th>Email</th><th>Área</th><th>Acciones</th></tr></thead>
              <tbody>
                {asesores.map(asesor => (
                  <tr key={asesor.id}>
                    <td>{asesor.nombres} {asesor.apellidos}</td>
                    <td>{asesor.email}</td>
                    <td>{asesor.area || 'No asignada'}</td>
                    <td>
                      <button onClick={() => abrirModalParaEditar(asesor)} className="btn secondary">Editar</button>
                      <button onClick={() => handleEliminarUsuario(asesor.id)} className="btn logout">Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {vista === 'perfil' && <Perfil />}

        {isModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <h3>{usuarioSeleccionado?.id ? 'Editar' : 'Crear'} Asesor</h3>
              <form onSubmit={handleGuardarUsuario} className="form-box">
                <label>Nombres:</label> <input name="nombres" value={usuarioSeleccionado.nombres} onChange={handleModalChange} required />
                <label>Apellidos:</label> <input name="apellidos" value={usuarioSeleccionado.apellidos} onChange={handleModalChange} required />
                <label>Documento:</label> <input name="documento" value={usuarioSeleccionado.documento} onChange={handleModalChange} required disabled={!usuarioSeleccionado.id ? false : true}/>
                <label>Email:</label> <input type="email" name="email" value={usuarioSeleccionado.email} onChange={handleModalChange} required />
                <label>Área:</label>
                <select name="area" value={usuarioSeleccionado.area} onChange={handleModalChange} className="registro-select">
                  {areasDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
                </select>
                <label>Contraseña {usuarioSeleccionado.id ? '(dejar en blanco para no cambiar)' : ''}:</label>
                <input type="password" name="password" onChange={handleModalChange} required={!usuarioSeleccionado.id} />
                <hr/>
                <button type="submit" className="btn primary">Guardar</button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn secondary">Cancelar</button>
              </form>
            </div>
          </div>
        )}
      </div>
      <footer className="footer"><p>&copy; 2025 CAVE-U. Todos los derechos Reservados. UNIMINUTO ©2025</p></footer>
    </>
  );
};

export default DashboardAdmin;