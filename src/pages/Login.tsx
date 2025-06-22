import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Añadir esta importación

// Al inicio del componente Login, añade esto:
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // Usar el hook useAuth

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Usar la función login del contexto en lugar de hacer la llamada directamente
      await login(email, password);
      
      // Redirigir a la ruta de administración
      navigate('/admin/dashboard'); // Cambiar a una ruta específica
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      console.error('Error de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Eliminar el padding-top del contenedor principal cuando estamos en login
  useEffect(() => {
    const contentContainer = document.querySelector('.content-container');
    if (contentContainer) {
      contentContainer.classList.add('login-page-container');
    }
    
    return () => {
      if (contentContainer) {
        contentContainer.classList.remove('login-page-container');
      }
    };
  }, []);

  return (
    <div className="login-page">
      {/* Filtro SVG para el efecto de gota - MEJORADO */}
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" style={{ display: 'none' }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 21 -7" result="goo" />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      
      <div className="login-container">
        {/* Elemento para el efecto de borde lineal */}
        <div className="border-line"></div>
        
        <h1>Iniciar Sesión</h1>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="button-container">
            <button type="submit" disabled={isLoading} className="blob-btn">
              <span className="blob-btn__inner">
                <span className="blob-btn__blobs">
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                  <span className="blob-btn__blob"></span>
                </span>
              </span>
              <span className="blob-btn-text">
                {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;