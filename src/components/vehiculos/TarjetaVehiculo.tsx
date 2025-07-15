import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Vehiculo } from '../../types/vehiculos';
import '../../styles/index.css';

interface TarjetaVehiculoProps {
  vehiculo: Vehiculo;
}

const TarjetaVehiculo: React.FC<TarjetaVehiculoProps> = ({ vehiculo }) => {
  const navigate = useNavigate();
  // Carrusel de imágenes
  const [imgIndex, setImgIndex] = useState(0);
  const imagenes = vehiculo.imagenes && vehiculo.imagenes.length > 0
    ? vehiculo.imagenes
    : [{ id: 0, url: 'https://via.placeholder.com/400x250?text=Sin+imagen', vehiculo_id: vehiculo.id }];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === 0 ? imagenes.length - 1 : prev - 1));
  };
  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImgIndex((prev) => (prev === imagenes.length - 1 ? 0 : prev + 1));
  };

  // Color principal dinámico
  React.useEffect(() => {
    if (vehiculo.concesionaria?.color_principal) {
      document.documentElement.style.setProperty('--primary-color', vehiculo.concesionaria.color_principal);
    }
    // No limpiamos para no sobreescribir el color global
  }, [vehiculo.concesionaria?.color_principal]);

  return (
    <div className="tarjeta-vehiculo">
      <div className="tarjeta-vehiculo-img-wrapper">
        {imagenes.length > 1 && (
          <button className="carrusel-btn carrusel-btn-prev" onClick={handlePrev} aria-label="Anterior">
            <span className="caret">◀</span>
          </button>
        )}
        <img src={imagenes[imgIndex].url} alt={vehiculo.modelo} className="tarjeta-vehiculo-img" />
        {imagenes.length > 1 && (
          <button className="carrusel-btn carrusel-btn-next" onClick={handleNext} aria-label="Siguiente">
            <span className="caret">▶</span>
          </button>
        )}
      </div>
      <div className="tarjeta-vehiculo-info">
        <div className="tarjeta-vehiculo-marca-modelo">
          <span className="tarjeta-vehiculo-marca">{vehiculo.marca?.nombre}</span>
        </div>
        <span className="tarjeta-vehiculo-modelo">{vehiculo.modelo}</span>
        <span className="tarjeta-vehiculo-anio">Año {vehiculo.anio}</span>
        <span className="tarjeta-vehiculo-precio">Gs. {vehiculo.precio.toLocaleString()}</span>
        <button
          className="tarjeta-vehiculo-vermas btn"
          onClick={() => navigate(`/vehiculo/${vehiculo.id}`)}
        >
          Ver más
        </button>
      </div>
    </div>
  );
};

export default TarjetaVehiculo; 