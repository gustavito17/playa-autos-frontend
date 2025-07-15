import { useEffect, useState, useMemo } from 'react';
import { useConcesionaria } from '../context/ConcesionariaContext';
import TarjetaVehiculo from '../components/vehiculos/TarjetaVehiculo';
import type { Vehiculo } from '../types/vehiculos';

const API_URL = import.meta.env.VITE_API_URL;
const CONCESIONARIA_ID = 1; // O el valor dinámico si tu app es multi-concesionaria
const CANTIDAD_POR_PAGINA = 6;

const Catalogo = () => {
  const { color_principal, nombre, loading } = useConcesionaria();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);

  useEffect(() => {
    setLoadingVehiculos(true);
    setError(null);
    fetch(`${API_URL}/vehiculos?concesionaria_id=${CONCESIONARIA_ID}`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`Error ${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setVehiculos(data);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      })
      .catch((err) => {
        console.error('Error cargando vehículos:', err);
        setError('No se pudieron cargar los vehículos.');
      })
      .finally(() => setLoadingVehiculos(false));
  }, []);

  // Calcular paginación
  const totalPaginas = Math.ceil(vehiculos.length / CANTIDAD_POR_PAGINA);
  const vehiculosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * CANTIDAD_POR_PAGINA;
    return vehiculos.slice(inicio, inicio + CANTIDAD_POR_PAGINA);
  }, [vehiculos, paginaActual]);

  const irAPagina = (pagina: number) => {
    if (pagina < 1 || pagina > totalPaginas) return;
    setPaginaActual(pagina);
  };

  // Resetear página al cambiar la lista de vehículos
  useEffect(() => {
    setPaginaActual(1);
  }, [vehiculos.length]);

  if (loading || loadingVehiculos) {
    return null;
  }

  return (
    <div className="home-container" style={{ paddingTop: 0 }}>
      {/* Logo removido */}
      <h1
        style={{
          color: color_principal,
          marginTop: '32px',
          marginBottom: '12px',
        }}
      >
        {nombre || 'Playa Autos'} - Catálogo
      </h1>
      <p
        className="home-bienvenida"
        style={{ marginBottom: '18px' }}
      >
        Explora todos nuestros vehículos disponibles.
      </p>

      <section className="home-vehiculos-section">
        <h2 className="home-vehiculos-titulo">Todos los vehículos disponibles</h2>
        {error ? (
          <div className="home-vehiculos-error">
            {error}
            <br />
            <span style={{ color: '#888', fontSize: '0.95em' }}>
              Si ves este mensaje, puede que el servidor esté despertando o haya un problema temporal. Intenta recargar en unos segundos.<br />
              Si el problema persiste, contacta a la concesionaria.
            </span>
          </div>
        ) : (
          <>
            <div className="home-vehiculos-lista">
              {vehiculosPaginados.length === 0 ? (
                <div className="home-vehiculos-vacio">
                  No hay vehículos disponibles en el catálogo.
                  <br />
                  <span style={{ color: '#888', fontSize: '0.95em' }}>
                    Vuelve más tarde o contacta a la concesionaria para más información.
                  </span>
                </div>
              ) : (
                vehiculosPaginados.map(vehiculo => (
                  <div className="home-vehiculo-card" key={vehiculo.id}>
                    <TarjetaVehiculo vehiculo={vehiculo} />
                  </div>
                ))
              )}
            </div>
            {/* Paginación */}
            {totalPaginas > 1 && (
              <div className="paginacion-container" style={{ marginTop: 32, textAlign: 'center' }}>
                <button
                  className="btn-paginacion"
                  onClick={() => irAPagina(paginaActual - 1)}
                  disabled={paginaActual === 1}
                >Anterior</button>
                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map(num => (
                  <button
                    key={num}
                    className={`btn-paginacion${paginaActual === num ? ' activa' : ''}`}
                    onClick={() => irAPagina(num)}
                  >{num}</button>
                ))}
                <button
                  className="btn-paginacion"
                  onClick={() => irAPagina(paginaActual + 1)}
                  disabled={paginaActual === totalPaginas}
                >Siguiente</button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Catalogo; 