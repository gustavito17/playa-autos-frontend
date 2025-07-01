import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import { ConcesionariaProvider } from './context/ConcesionariaContext';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';

// Páginas privadas (admin)
import Dashboard from './pages/admin/DashboardAdmin';
import AdminVehiculos from './pages/admin/AdminVehiculos';
import AdminMarcas from './pages/admin/AdminMarcas';
import AdminConcesionarias from './pages/admin/AdminConcesionarias';


// Crear una instancia del cliente de consulta
const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  return (
    <div className="app-wrapper">
      <Header />
      <div className="content-container">
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
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
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </div>
      {/* Renderizar el Footer usando React Router para que se actualice correctamente */}
      {location.pathname !== '/login' && <Footer />}
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
