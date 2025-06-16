import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mostrar un indicador de carga mientras se verifica la autenticación
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Redirigir al login si no está autenticado
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;