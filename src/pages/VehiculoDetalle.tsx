import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Vehiculo } from '../types/vehiculos';
import '../styles/index.css';

const NUMERO_WPP = '595991123456'; // Cambia por el número real de la concesionaria

const VehiculoDetalle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVehiculo = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/vehiculos/${id}`);
        if (!res.ok) throw new Error('Error al cargar el vehículo');
        const data = await res.json();
        setVehiculo(data);
      } catch (e) {
        setError('No se pudo cargar el vehículo.');
      } finally {
        setLoading(false);
      }
    };
    fetchVehiculo();
  }, [id]);

  useEffect(() => {
    if (vehiculo?.concesionaria?.color_principal) {
      document.documentElement.style.setProperty('--primary-color', vehiculo.concesionaria.color_principal);
    }
  }, [vehiculo?.concesionaria?.color_principal]);

  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!vehiculo) return null;

  const imagenPrincipal = vehiculo.imagenes && vehiculo.imagenes.length > 0
    ? vehiculo.imagenes[0].url
    : 'https://via.placeholder.com/600x400?text=Sin+imagen';

  const mensajeWpp = `Hola, me interesa el vehículo ${vehiculo.modelo}, ¿está disponible?`;
  const urlWpp = `https://wa.me/${NUMERO_WPP}?text=${encodeURIComponent(mensajeWpp)}`;

  return (
    <div className="vehiculo-detalle-wrapper">
      <div className="vehiculo-detalle-img-wrapper">
        <img src={imagenPrincipal} alt={vehiculo.modelo} className="vehiculo-detalle-img" />
      </div>
      <div className="vehiculo-detalle-info">
        <h1>{vehiculo.marca?.nombre} {vehiculo.modelo} ({vehiculo.anio})</h1>
        <p className="vehiculo-detalle-precio">Gs. {vehiculo.precio.toLocaleString()}</p>
        <p className="vehiculo-detalle-desc">{vehiculo.descripcion}</p>
        <a
          href={urlWpp}
          target="_blank"
          rel="noopener noreferrer"
          className="vehiculo-detalle-wpp-btn"
        >
          Consultar por WhatsApp
        </a>
      </div>
    </div>
  );
};

export default VehiculoDetalle; 