import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <h1>Panel de Administración</h1>
      <p>Bienvenido, {user?.nombre}</p>
      <div className="dashboard-actions">
        <button onClick={logout}>Cerrar sesión</button>
      </div>
    </div>
  );
};

export default Dashboard;