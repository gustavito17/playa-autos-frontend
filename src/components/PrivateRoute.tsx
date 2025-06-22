import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const location = useLocation();
  const token = localStorage.getItem('token');

  // Si no hay token, redirigir a /login
  if (!token) {
    // Guardamos la ubicación original para poder redirigir de vuelta después del login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si hay token, permitir acceso al contenido protegido
  return <>{children}</>;
};

export default PrivateRoute;