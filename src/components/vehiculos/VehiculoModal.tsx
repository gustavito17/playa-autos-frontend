import React, { useState } from 'react';

interface VehiculoModalProps {
  isOpen: boolean;
  children: React.ReactNode;
}

const VehiculoModal: React.FC<VehiculoModalProps> = ({ isOpen, children }) => {
  const [estado, setEstado] = useState('');

  if (!isOpen) return null;

  const handleEstadoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setEstado(event.target.value);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        {children}
        <div className="estado-section">
          <label htmlFor="estado">Estado del vehículo:</label>
          <select id="estado" value={estado} onChange={handleEstadoChange}>
            <option value="">Seleccione un estado</option>
            <option value="usado">Usado</option>
            <option value="0km">0km</option>
            <option value="importado">Importado</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VehiculoModal;
