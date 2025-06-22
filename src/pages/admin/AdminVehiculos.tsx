import React from 'react';
import { useAuth } from '../../context/AuthContext';

const AdminVehiculos: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="admin-vehiculos-container">
      <h1>Administración de Vehículos</h1>
      <div className="vehiculos-content">
        {/* Aquí irá el contenido de la administración de vehículos */}
      </div>
    </div>
  );
};

export default AdminVehiculos;