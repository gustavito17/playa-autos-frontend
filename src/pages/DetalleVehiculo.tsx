import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConcesionaria } from '../context/ConcesionariaContext';
import TarjetaVehiculo from '../components/vehiculos/TarjetaVehiculo';
import type { Vehiculo } from '../types/vehiculos';

const API_URL = import.meta.env.VITE_API_URL;
const CONCESIONARIA_ID = 1;
const NUMERO_WPP = '595991123456'; // Cambia por el número real de la concesionaria

const DetalleVehiculo = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { color_principal, nombre, loading } = useConcesionaria();
  
  const [vehiculo, setVehiculo] = useState<Vehiculo | null>(null);
  const [vehiculosRelacionados, setVehiculosRelacionados] = useState<Vehiculo[]>([]);
  const [loadingVehiculo, setLoadingVehiculo] = useState(true);
  const [loadingRelacionados, setLoadingRelacionados] = useState(true);
  const [loadingMarcas, setLoadingMarcas] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgIndex, setImgIndex] = useState(0);
  const [marcas, setMarcas] = useState<{ id: number; nombre: string }[]>([]);

  // Corregir marca para mostrar siempre el nombre usando useMemo para estabilidad
  const marcaNombre = useMemo(() => {
    if (!vehiculo) return 'Marca desconocida';
    
    // Primero intentar usar la marca del vehículo si está disponible
    if (vehiculo.marca?.nombre) {
      return vehiculo.marca.nombre;
    }
    
    // Si no hay marca en el vehículo, buscar por ID en la lista de marcas
    if (vehiculo.marca_id && marcas.length > 0) {
      const marcaEncontrada = marcas.find(m => m.id === vehiculo.marca_id);
      if (marcaEncontrada?.nombre) {
        return marcaEncontrada.nombre;
      }
    }
    
    return 'Marca desconocida';
  }, [vehiculo, marcas]);

  // Cargar vehículo específico
  useEffect(() => {
    if (!id) return;
    
    setLoadingVehiculo(true);
    setError(null);
    
    fetch(`${API_URL}/vehiculos/${id}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Vehículo no encontrado');
          }
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Datos del vehículo recibidos:', data);
        setVehiculo(data);
      })
      .catch((err) => {
        console.error('Error cargando vehículo:', err);
        setError(err.message || 'No se pudo cargar el vehículo.');
      })
      .finally(() => setLoadingVehiculo(false));
  }, [id]);

  // Cargar todas las marcas
  useEffect(() => {
    setLoadingMarcas(true);
    fetch(`${API_URL}/marcas`)
      .then(res => {
        if (!res.ok) throw new Error('Error al cargar marcas');
        return res.json();
      })
      .then(data => {
        console.log('Marcas cargadas:', data);
        setMarcas(data);
      })
      .catch(err => {
        console.error('Error cargando marcas:', err);
      })
      .finally(() => setLoadingMarcas(false));
  }, []);

  // Cargar vehículos relacionados
  useEffect(() => {
    setLoadingRelacionados(true);
    fetch(`${API_URL}/vehiculos?concesionaria_id=${CONCESIONARIA_ID}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los vehículos relacionados');
        return res.json();
      })
      .then(data => {
        // Filtrar el vehículo actual y tomar hasta 4
        const relacionados = data
          .filter((v: Vehiculo) => v.id !== Number(id))
          .slice(0, 4);
        setVehiculosRelacionados(relacionados);
      })
      .catch(() => setVehiculosRelacionados([]))
      .finally(() => setLoadingRelacionados(false));
  }, [id]);

  // Funciones para el carrusel de imágenes
  const handlePrev = () => {
    if (!vehiculo?.imagenes) return;
    setImgIndex((prev) => (prev === 0 ? vehiculo.imagenes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    if (!vehiculo?.imagenes) return;
    setImgIndex((prev) => (prev === vehiculo.imagenes.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setImgIndex(index);
  };

  // Función para WhatsApp
  const handleWhatsApp = () => {
    if (!vehiculo) return;
    // Corregir marca y modelo para el mensaje
    const marcaNombre = vehiculo.marca?.nombre || 'Marca desconocida';
    const mensaje = `Hola! Me interesa el ${marcaNombre} ${vehiculo.modelo} que vi en ${nombre || 'Playa Autos'}. ¿Podrían darme más información?`;
    const url = `https://wa.me/${NUMERO_WPP}?text=${encodeURIComponent(mensaje)}`;
    window.open(url, '_blank');
  };

  if (loading || loadingVehiculo || loadingMarcas) {
    return null;
  }

  if (error) {
    return (
      <div className="home-container" style={{ paddingTop: 0 }}>
        <div className="home-vehiculos-error" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 style={{ color: color_principal, marginBottom: '16px' }}>Vehículo no encontrado</h2>
          <p>{error}</p>
          <button 
            className="btn" 
            onClick={() => navigate('/catalogo')}
            style={{ marginTop: '20px' }}
          >
            Volver al catálogo
          </button>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return null;
  }

  const imagenes = vehiculo.imagenes && vehiculo.imagenes.length > 0
    ? vehiculo.imagenes
    : [{ id: 0, url: 'https://via.placeholder.com/600x400?text=Sin+imagen', vehiculo_id: vehiculo.id }];

  // Debug: mostrar información sobre la marca
  console.log('Información de marca:', {
    vehiculo: vehiculo,
    marcas: marcas,
    marcaEncontrada: vehiculo?.marca_id ? marcas.find(m => m.id === vehiculo.marca_id) : null,
    marcaNombre: marcaNombre,
    loadingMarcas: loadingMarcas
  });

  return (
    <div className="home-container" style={{ paddingTop: 0 }}>
      <h1 className="detalle-vehiculo-titulo">
        {marcaNombre} {vehiculo.modelo}
      </h1>
      <p
        className="home-bienvenida"
        style={{ marginBottom: '18px' }}
      >
        Descubre todos los detalles de este vehículo
      </p>

      {/* Layout en dos columnas en escritorio */}
      <section className="detalle-vehiculo-main">
        <div className="detalle-vehiculo-galeria">
          <div className="detalle-vehiculo-imagen-principal">
            {imagenes.length > 1 && (
              <button className="carrusel-btn carrusel-btn-prev" onClick={handlePrev} aria-label="Anterior">
                <span className="caret">◀</span>
              </button>
            )}
            <img 
              src={imagenes[imgIndex].url} 
              alt={`${marcaNombre} ${vehiculo.modelo}`} 
              className="detalle-vehiculo-img-principal"
            />
            {imagenes.length > 1 && (
              <button className="carrusel-btn carrusel-btn-next" onClick={handleNext} aria-label="Siguiente">
                <span className="caret">▶</span>
              </button>
            )}
          </div>
          {/* Miniaturas */}
          {imagenes.length > 1 && (
            <div className="detalle-vehiculo-miniaturas">
              {imagenes.map((imagen, index) => (
                <img
                  key={imagen.id}
                  src={imagen.url}
                  alt={`${marcaNombre} ${vehiculo.modelo} - Imagen ${index + 1}`}
                  className={`detalle-vehiculo-miniatura ${index === imgIndex ? 'activa' : ''}`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
          )}
          {/* Botón de WhatsApp debajo de las imágenes */}
          <div className="detalle-vehiculo-contacto">
            <button 
              className="btn"
              onClick={handleWhatsApp}
            >
              Consultar por WhatsApp
            </button>
          </div>
        </div>
        <div className="detalle-vehiculo-info">
          <div className="detalle-vehiculo-precio">
            <h2 style={{ color: color_principal, marginBottom: '8px' }}>Precio</h2>
            <span className="detalle-vehiculo-precio-valor">
              Gs. {vehiculo.precio.toLocaleString()}
            </span>
          </div>

          <div className="detalle-vehiculo-especificaciones">
            <h3 style={{ color: color_principal, marginBottom: '16px' }}>Especificaciones</h3>
            <div className="detalle-vehiculo-especificaciones-grid">
              <div className="detalle-vehiculo-especificacion">
                <strong>Marca:</strong> {marcaNombre}
                {marcaNombre === 'Marca desconocida' && (
                  <span style={{ color: '#ff6b6b', fontSize: '0.8em', display: 'block', marginTop: '4px' }}>
                    (ID de marca: {vehiculo?.marca_id})
                  </span>
                )}
              </div>
              <div className="detalle-vehiculo-especificacion">
                <strong>Modelo:</strong> {vehiculo.modelo}
              </div>
              <div className="detalle-vehiculo-especificacion">
                <strong>Año:</strong> {vehiculo.anio}
              </div>
              <div className="detalle-vehiculo-especificacion">
                <strong>Color:</strong> {vehiculo.color}
              </div>
              <div className="detalle-vehiculo-especificacion">
                <strong>Estado:</strong> {vehiculo.estado}
              </div>
            </div>
          </div>

          {vehiculo.descripcion && (
            <div className="detalle-vehiculo-descripcion">
              <h3 style={{ color: color_principal, marginBottom: '16px' }}>Descripción</h3>
              <p>{vehiculo.descripcion}</p>
            </div>
          )}
        </div>
      </section>

      {/* Vehículos relacionados */}
      <section className="home-vehiculos-section">
        <h2 className="home-vehiculos-titulo">También te puede interesar</h2>
        {loadingRelacionados ? (
          <div className="home-vehiculos-vacio">Cargando vehículos relacionados...</div>
        ) : (
          <div className="home-vehiculos-lista">
            {vehiculosRelacionados.length === 0 ? (
              <div className="home-vehiculos-vacio">
                No hay otros vehículos disponibles en este momento.
              </div>
            ) : (
              <>
                {vehiculosRelacionados.slice(0, 2).map(vehiculoRel => (
                  <div className="home-vehiculo-card" key={vehiculoRel.id}>
                    <TarjetaVehiculo vehiculo={vehiculoRel} />
                  </div>
                ))}
                {/* Tarjeta "Ver más" */}
                <div className="home-vehiculo-card ver-mas-card" onClick={() => navigate('/catalogo')}>
                  <div className="ver-mas-content">
                    <h3 style={{ color: color_principal, marginBottom: '12px' }}>Ver más vehículos</h3>
                    <p>Explora nuestro catálogo completo</p>
                    <button
                      className="tarjeta-vehiculo-vermas btn"
                      style={{ marginTop: '16px' }}
                    >
                      Ver catálogo completo
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default DetalleVehiculo; 