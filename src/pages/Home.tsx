import { Link } from 'react-router-dom';
import { useConcesionaria } from '../context/ConcesionariaContext';

const Home = () => {
  const { logo_url, color_principal, nombre, loading } = useConcesionaria();
  if (loading) return null;
  return (
    <div className="home-container">
      {logo_url && <img src={logo_url} alt="Logo concesionaria" style={{ maxHeight: 100, marginBottom: 24 }} />}
      <h1 style={{ color: color_principal }}>{nombre || 'Bienvenido a Playa Autos'}</h1>
      <p>Encuentra los mejores vehículos en nuestra plataforma</p>
      <div>
        <Link to="/login">Iniciar sesión</Link>
      </div>
    </div>
  );
};

export default Home;