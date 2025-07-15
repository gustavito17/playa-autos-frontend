import { useEffect, useState } from 'react';
import { useConcesionaria } from '../context/ConcesionariaContext';
import TarjetaVehiculo from '../components/vehiculos/TarjetaVehiculo';
import type { Vehiculo } from '../types/vehiculos';

const API_URL = import.meta.env.VITE_API_URL;
const CONCESIONARIA_ID = 1; // O el valor dinámico si tu app es multi-concesionaria
const NUMERO_WPP = '595991123456'; // Cambia por el número real de la concesionaria

const Home = () => {
  const { logo_url, color_principal, nombre, loading } = useConcesionaria();
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loadingVehiculos, setLoadingVehiculos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoadingVehiculos(true);
    setError(null);
    fetch(`${API_URL}/vehiculos?concesionaria_id=${CONCESIONARIA_ID}&limit=3&order=desc`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudieron cargar los vehículos');
        return res.json();
      })
      .then(data => setVehiculos(data))
      .catch(() => setError('No se pudieron cargar los vehículos.'))
      .finally(() => setLoadingVehiculos(false));
  }, []);

  if (loading || loadingVehiculos) {
    return null;
  }

  return (
    <div className="home-container">
      {logo_url && <img src={logo_url} alt="Logo concesionaria" style={{ maxHeight: 100, marginBottom: 24 }} />}
      <h1 style={{ color: color_principal }}>{nombre || 'Bienvenido a Playa Autos'}</h1>
      <p className="home-bienvenida">¡Bienvenido! Descubre los últimos vehículos agregados.</p>

      <section className="home-vehiculos-section">
        <h2 className="home-vehiculos-titulo">Vehículos recién agregados</h2>
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
          <div className="home-vehiculos-lista">
            {vehiculos.length === 0 ? (
              <div className="home-vehiculos-vacio">No hay vehículos disponibles.</div>
            ) : (
              vehiculos.slice(0, 3).map(vehiculo => (
                <div className="home-vehiculo-card" key={vehiculo.id}>
                  <TarjetaVehiculo vehiculo={vehiculo} />
                </div>
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;