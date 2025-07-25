// frontend/src/components/Perfil.jsx
import React, { useState, useEffect } from 'react';

const Perfil = () => {
  const [usuario, setUsuario] = useState(() => JSON.parse(localStorage.getItem("usuario")));
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (usuario) {
        setFormData({
            nombres: usuario.nombres || '',
            apellidos: usuario.apellidos || '',
            email: usuario.email || '',
            telefono: usuario.telefono || '',
            direccion: usuario.direccion || '',
            password: ''
        });
    }
  }, [usuario, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    const dataToUpdate = { ...formData };
    if (!dataToUpdate.password) {
      delete dataToUpdate.password;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/usuarios/${usuario.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToUpdate)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.msg || "Error desconocido");

      localStorage.setItem('usuario', JSON.stringify(data.usuario));
      setUsuario(data.usuario);
      alert('Perfil actualizado con éxito');
      setIsEditing(false);

    } catch (error) {
      alert(`Error al actualizar: ${error.message}`);
    }
  };

  if (!usuario) {
    return <p>No se pudo cargar la información del usuario.</p>;
  }

  return (
    <section>
      <h3>Mi Perfil</h3>
      {!isEditing ? (
        <div className="profile-box">
          <p><strong>Nombres:</strong> {usuario.nombres}</p>
          <p><strong>Apellidos:</strong> {usuario.apellidos}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Documento:</strong> {usuario.documento}</p>
          <p><strong>Teléfono:</strong> {usuario.telefono || 'No especificado'}</p>
          <p><strong>Dirección:</strong> {usuario.direccion || 'No especificada'}</p>
          {usuario.rol === 'asesor' && <p><strong>Área:</strong> {usuario.area || 'No asignada'}</p>}
          <button onClick={() => setIsEditing(true)} className="btn primary" style={{marginTop: '20px'}}>Editar Perfil</button>
        </div>
      ) : (
        <form onSubmit={handleUpdate} className="form-box">
          <label>Nombres:</label>
          <input type="text" name="nombres" value={formData.nombres} onChange={handleChange} required />
          
          <label>Apellidos:</label>
          <input type="text" name="apellidos" value={formData.apellidos} onChange={handleChange} required />
          
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          
          <label>Teléfono:</label>
          <input type="text" name="telefono" value={formData.telefono} onChange={handleChange} />
          
          <label>Dirección:</label>
          <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} />
          
          <label>Nueva Contraseña (dejar en blanco para no cambiar):</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Nueva contraseña"/>
          
          <div style={{display: 'flex', gap: '10px', marginTop: '20px'}}>
            <button type="submit" className="btn primary">Guardar Cambios</button>
            <button type="button" onClick={() => setIsEditing(false)} className="btn secondary">Cancelar</button>
          </div>
        </form>
      )}
    </section>
  );
};

export default Perfil;