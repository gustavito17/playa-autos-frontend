import React from 'react';
import type { Vehiculo } from '../../types/vehiculos';
import VehiculoCard from './VehiculoCard';
import type { Marca } from '../../types/vehiculos';

interface VehiculoListProps {
  vehiculosFiltrados: Vehiculo[];
  setVehiculoEditar: (vehiculo: Vehiculo) => void;
  setFormData: (formData: any) => void;
  setModalOpen: (open: boolean) => void;
  eliminarVehiculo: (id: number) => void;
  marcas: Marca[];
}

const VehiculoList: React.FC<VehiculoListProps> = ({
  vehiculosFiltrados,
  setVehiculoEditar,
  setFormData,
  setModalOpen,
  eliminarVehiculo,
  marcas
}) => {
  // Función para obtener el nombre de la marca por id
  const getMarcaNombre = (vehiculo: Vehiculo) => {
    if (vehiculo.marca && vehiculo.marca.nombre) return vehiculo.marca.nombre;
    const marca = marcas.find(m => m.id === vehiculo.marca_id);
    return marca ? marca.nombre : 'Sin marca';
  };
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
              marcaNombre={getMarcaNombre(vehiculo)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VehiculoList;
