import React from 'react';
import type { Vehiculo } from '../../types/vehiculos';

interface VehiculoCardProps {
  vehiculo: Vehiculo;
  onEditar: (vehiculo: Vehiculo) => void;
  onEliminar: (id: number) => void;
  onSetFormData: (formData: any) => void;
  onSetModalOpen: (open: boolean) => void;
}

const VehiculoCard: React.FC<VehiculoCardProps> = ({
  vehiculo,
  onEditar,
  onEliminar,
  onSetFormData,
  onSetModalOpen
}) => {
  return (
    <tr key={vehiculo.id}>
      <td>{vehiculo.modelo}</td>
      <td>{vehiculo.marca?.nombre || 'Sin marca'}</td>
      <td>{vehiculo.anio}</td>
      <td>{vehiculo.estado}</td>
      <td>${vehiculo.precio.toLocaleString()}</td>
      <td>
        <div className="imagenes-preview">
          {vehiculo.imagenes.map((imagen) => (
            <img key={imagen.id} src={imagen.url} alt={vehiculo.modelo} />
          ))}
        </div>
      </td>
      <td>
        <button
          className="btn-editar"
          onClick={() => {
            onEditar(vehiculo);
            onSetFormData({
              modelo: vehiculo.modelo,
              anio: vehiculo.anio,
              color: vehiculo.color,
              estado: vehiculo.estado,
              precio: vehiculo.precio,
              descripcion: vehiculo.descripcion,
              marca_id: vehiculo.marca_id,
            });
            onSetModalOpen(true);
          }}
        >
          Editar
        </button>
        <button
          className="btn-eliminar"
          onClick={() => onEliminar(vehiculo.id)}
        >
          Eliminar
        </button>
      </td>
    </tr>
  );
};

export default VehiculoCard;
