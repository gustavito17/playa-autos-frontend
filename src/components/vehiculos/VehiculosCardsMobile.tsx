import React from 'react';
import type { Vehiculo } from '../../types/vehiculos';
import '../../styles/AdminVehiculos.css';

interface VehiculosCardsMobileProps {
  vehiculos: Vehiculo[];
  onEditar: (vehiculo: Vehiculo) => void;
  onEliminar: (id: number) => void;
  onSetFormData: (formData: any) => void;
  onSetModalOpen: (open: boolean) => void;
}

const VehiculosCardsMobile: React.FC<VehiculosCardsMobileProps> = ({
  vehiculos,
  onEditar,
  onEliminar,
  onSetFormData,
  onSetModalOpen
}) => {
  return (
    <div className="vehiculos-cards">
      {vehiculos.map((vehiculo) => (
        <div className="vehiculo-card" key={vehiculo.id}>
          <div className="vehiculo-card-header">
            <span className="vehiculo-card-title">{vehiculo.modelo}</span>
            <span className="vehiculo-card-precio">${vehiculo.precio.toLocaleString()}</span>
          </div>
          <div className="vehiculo-card-info">
            <div><b>Marca:</b> {vehiculo.marca?.nombre || 'Sin marca'}</div>
            <div><b>Año:</b> {vehiculo.anio}</div>
            <div><b>Estado:</b> {vehiculo.estado}</div>
            <div><b>Color:</b> {vehiculo.color}</div>
          </div>
          <div className="imagenes-preview">
            {vehiculo.imagenes.map((imagen) => (
              <img key={imagen.id} src={imagen.url} alt={vehiculo.modelo} />
            ))}
          </div>
          <div className="vehiculo-card-actions">
            {/* Botones Anterior y Siguiente removidos para mobile */}
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
            >Editar</button>
            <button
              className="btn-eliminar"
              onClick={() => onEliminar(vehiculo.id)}
            >Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VehiculosCardsMobile;
