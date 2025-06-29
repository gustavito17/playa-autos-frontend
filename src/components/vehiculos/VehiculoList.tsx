import React from 'react';
import type { Vehiculo } from '../../types/vehiculos';
import VehiculoCard from './VehiculoCard';

interface VehiculoListProps {
  vehiculosFiltrados: Vehiculo[];
  setVehiculoEditar: (vehiculo: Vehiculo) => void;
  setFormData: (formData: any) => void;
  setModalOpen: (open: boolean) => void;
  eliminarVehiculo: (id: number) => void;
}

const VehiculoList: React.FC<VehiculoListProps> = ({
  vehiculosFiltrados,
  setVehiculoEditar,
  setFormData,
  setModalOpen,
  eliminarVehiculo
}) => {
  return (
    <div className="tabla-vehiculos">
      <table>
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Marca</th>
            <th>Año</th>
            <th>Estado</th>
            <th>Precio</th>
            <th>Imágenes</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {vehiculosFiltrados.map((vehiculo) => (
            <VehiculoCard
              key={vehiculo.id}
              vehiculo={vehiculo}
              onEditar={setVehiculoEditar}
              onEliminar={eliminarVehiculo}
              onSetFormData={setFormData}
              onSetModalOpen={setModalOpen}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiculoList;
