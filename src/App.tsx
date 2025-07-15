import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { ConcesionariaProvider, useConcesionaria } from './context/ConcesionariaContext';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';
import Catalogo from './pages/Catalogo';
import Contacto from './pages/Contacto';
import DetalleVehiculo from './pages/DetalleVehiculo';
import PoliticasPrivacidad from './pages/PoliticasPrivacidad';
import TerminosCondiciones from './pages/TerminosCondiciones';

// Páginas privadas (admin)
import Dashboard from './pages/admin/DashboardAdmin';
import AdminVehiculos from './pages/admin/AdminVehiculos';
import AdminMarcas from './pages/admin/AdminMarcas';
import AdminConcesionarias from './pages/admin/AdminConcesionarias';

// Crear una instancia del cliente de consulta
const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const { loading } = useConcesionaria();
  return (
    <div className="app-wrapper">
      <Header />
      <div className="content-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/politicas-de-privacidad" element={<PoliticasPrivacidad />} />
          <Route path="/terminos-y-condiciones" element={<TerminosCondiciones />} />
          <Route path="/vehiculo/:id" element={<DetalleVehiculo />} />
          {/* Rutas privadas (admin) */}
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/vehiculos" element={
            <PrivateRoute>
              <AdminVehiculos />
            </PrivateRoute>
          } />
          <Route path="/admin/marcas" element={
            <PrivateRoute>
              <AdminMarcas />
            </PrivateRoute>
          } />
          <Route path="/admin/concesionaria" element={
            <PrivateRoute>
              <AdminConcesionarias />
            </PrivateRoute>
          } />
          <Route path="/admin/politicas-de-privacidad" element={
            <PrivateRoute>
              <PoliticasPrivacidad />
            </PrivateRoute>
          } />
          <Route path="/admin/terminos-y-condiciones" element={
            <PrivateRoute>
              <TerminosCondiciones />
            </PrivateRoute>
          } />
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
      {/* Renderizar el Footer solo si no está cargando la concesionaria y no es login */}
      {location.pathname !== '/login' && !loading && <Footer />}
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ConcesionariaProvider>
          <Router>
            <AppContent />
          </Router>
        </ConcesionariaProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
