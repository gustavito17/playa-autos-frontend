import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Páginas públicas
import Home from './pages/Home';
import Login from './pages/Login';

// Páginas privadas (admin)
import Dashboard from './pages/admin/Dashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          
          {/* Rutas privadas (admin) */}
          <Route path="/admin" element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            {/* Aquí puedes agregar más rutas admin protegidas */}
          </Route>
          
          {/* Ruta para manejar páginas no encontradas */}
          <Route path="*" element={<div>Página no encontrada</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
