import { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useConcesionaria } from '../context/ConcesionariaContext';
import '../styles/Header.css'; // Corregida la ruta de importación

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { logo_url, loading } = useConcesionaria();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  // Determinar si estamos en una ruta de administración
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Manejar el cierre de sesión
  const handleLogout = () => {
    setIsMenuOpen(false); // Cerrar el menú antes de hacer logout
    logout();
    navigate('/login');
  };

  // Manejar el scroll para cambiar la apariencia del header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Cerrar el menú al cambiar de ruta o cuando se detecta que estamos en la página de login
  useEffect(() => {
    setIsMenuOpen(false);
    
    // Si estamos en la página de login, asegurarse de que el menú esté cerrado
    if (location.pathname === '/login') {
      setIsMenuOpen(false);
    }
  }, [location]);
  
  // Cerrar el menú cuando se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMenuOpen && 
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        menuToggleRef.current && 
        !menuToggleRef.current.contains(event.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  // No renderizar el header en la página de login
  if (location.pathname === '/login') {
    return null;
  }

  if (loading) return null;
  return (
    <header className={`header ${scrolled ? 'header-scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo">
          <Link to={isAdminRoute ? '/admin' : '/'}>
            {logo_url ? (
              <img src={logo_url} alt="Logo concesionaria" style={{ maxHeight: 48, maxWidth: 120, objectFit: 'contain' }} />
            ) : null}
          </Link>
        </div>
        {/* Botón hamburguesa para móvil */}
        <button 
          ref={menuToggleRef}
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menú"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        {/* Navegación */}
        <nav ref={menuRef} className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          <ul>
            {isAdminRoute ? (
              // Menú para rutas de administración
              <>
                <li>
                  <Link to="/admin/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/admin/vehiculos">Vehículos</Link>
                </li>
                <li>
                  <Link to="/admin/marcas">Marcas</Link>
                </li>
                <li>
                  <Link to="/admin/concesionaria">Concesionaria</Link>
                </li>
                <li>
                  <button className="logout-btn" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
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
                <li>
                  <Link to="/contacto">Contacto</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
      {/* Línea de borde animada similar a la del login */}
      <div className="header-border-line"></div>
    </header>
  );
};

export default Header;