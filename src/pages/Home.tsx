import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1>Bienvenido a Playa Autos</h1>
      <p>Encuentra los mejores vehículos en nuestra plataforma</p>
      <div>
        <Link to="/login">Iniciar sesión</Link>
      </div>
    </div>
  );
};

export default Home;