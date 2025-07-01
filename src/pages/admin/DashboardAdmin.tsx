import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
// Importamos las imágenes
import vehiculosImg from '../../assets/vehiculos.jpg';
import marcasImg from '../../assets/marcas.jpg';
import concesionariaImg from '../../assets/concesionaria.jpg';
import '../../styles/DashboardAdmin.css';

const DashboardAdmin = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-admin-wrapper">
      <div className="dashboard-admin-container">
        <div className="dashboard-header">
          <h1>Panel de Administración</h1>
          <p className="welcome-message">Bienvenido, {user?.nombre || 'Administrador'}</p>
        </div>
        
        <div className="dashboard-cards">
          {/* Tarjeta de Vehículos */}
          <div className="dashboard-card">
            <img src={vehiculosImg} alt="Vehículos" className="card-background-image" />
            <div className="card-content">
              <h2>Vehículos</h2>
              <p>Gestiona el inventario de vehículos, añade nuevos modelos o actualiza la información existente.</p>
              <Link to="/admin/vehiculos" className="card-button">
                Gestionar Vehículos
              </Link>
            </div>
          </div>

          {/* Tarjeta de Marcas */}
          <div className="dashboard-card">
            <img src={marcasImg} alt="Marcas" className="card-background-image" />
            <div className="card-content">
              <h2>Marcas</h2>
              <p>Administra las marcas disponibles en el sistema para una mejor organización del catálogo.</p>
              <Link to="/admin/marcas" className="card-button">
                Gestionar Marcas
              </Link>
            </div>
          </div>

          {/* Tarjeta de Concesionaria */}
          <div className="dashboard-card">
            <img src={concesionariaImg} alt="Concesionaria" className="card-background-image" />
            <div className="card-content">
              <h2>Concesionaria</h2>
              <p>Actualiza la información de tu concesionaria, incluyendo logo y datos de contacto.</p>
              <Link to="/admin/concesionaria" className="card-button">
                Gestionar Concesionaria
              </Link>
            </div>
          </div>
        </div>
        
        {/* Línea de borde animada similar a la del login */}
        <div className="dashboard-border-line"></div>
      </div>
    </div>
  );
};

export default DashboardAdmin;