// frontend/src/components/HistorialModal.jsx
import React, { useState, useEffect } from 'react';

const HistorialModal = ({ ticketId, token, onClose }) => {
  const [historial, setHistorial] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistorial = async () => {
      if (!ticketId) return;
      setIsLoading(true);
      try {
        const res = await fetch(`http://localhost:5000/api/historial/${ticketId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("No se pudo cargar el historial del ticket.");
        const data = await res.json();
        setHistorial(data);
      } catch (error) {
        console.error(error);
        alert(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistorial();
  }, [ticketId, token]);

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Historial del Ticket #{ticketId}</h3>
        {isLoading ? <p>Cargando historial...</p> : (
          <div className="historial-list">
            {historial.length > 0 ? (
              historial.map(registro => (
                <div key={registro.id} className="historial-item">
                  <p><strong>Fecha:</strong> {new Date(registro.createdAt).toLocaleString()}</p>
                  <p><strong>Asesor:</strong> {`${registro.Usuario?.nombres || ''} ${registro.Usuario?.apellidos || ''}`.trim() || 'Sistema'}</p>
                  <p><strong>Acción:</strong> {registro.accion}</p>
                  {registro.detalle && <p><strong>Detalle/Respuesta:</strong> {registro.detalle}</p>}
                </div>
              ))
            ) : <p>No hay registros en el historial para este ticket.</p>}
          </div>
        )}
        <button onClick={onClose} className="btn secondary" style={{marginTop: '20px'}}>Cerrar</button>
      </div>
    </div>
  );
};

export default HistorialModal;