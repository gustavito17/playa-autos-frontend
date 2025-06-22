import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaEnvelope, FaWhatsapp, FaFacebook, FaInstagram } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
  // Determinar si estamos en una ruta de administración
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Manejar el cierre de sesión
  const handleLogout = () => {
    logout();
    // No es necesario navegar aquí, ya que AuthContext redirigirá automáticamente
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Navegación del footer - Alineada a la izquierda */}
        <div className="footer-nav">
          <ul>
            {isAdminRoute ? (
              // Menú para rutas de administración
              <>
                <li>
                  <Link to="/admin">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/vehiculos">Vehículos</Link>
                </li>
                <li>
                  <Link to="/admin/marcas">Marcas</Link>
                </li>
                <li>
                  <Link to="/admin/concesionarias">Concesionaria</Link>
                </li>
              </>
            ) : (
              // Menú para rutas públicas
              <>
                <li>
                  <Link to="/">Inicio</Link>
                </li>
                <li>
                  <Link to="/catalogo">Catálogo</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        
        {/* Iconos sociales - Centrados */}
        <div className="footer-social">
          <a href="mailto:contacto@concesionariasapp.com" target="_blank" rel="noopener noreferrer" aria-label="Email">
            <FaEnvelope />
          </a>
          <a href="https://wa.me/595991123456" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
            <FaWhatsapp />
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebook />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
        </div>
        
        {/* Enlaces legales - Alineados a la derecha */}
        <div className="footer-legal">
          <Link to="/politicas-de-privacidad">Políticas de privacidad</Link>
          <Link to="/terminos-y-condiciones">Términos y condiciones</Link>
        </div>
      </div>
      
      {/* Línea de borde animada */}
      <div className="footer-border-line"></div>
    </footer>
  );
};

export default Footer;