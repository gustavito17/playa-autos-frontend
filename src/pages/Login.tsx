import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: email, // El backend espera 'username' aunque sea un email
          password: password
        }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const data = await response.json();
      // Guardar el token en localStorage
      localStorage.setItem('token', data.access_token);
      
      // Redirigir a la ruta de administración
      navigate('/admin');
    } catch (err) {
      setError('Credenciales inválidas. Por favor, intenta de nuevo.');
      console.error('Error de login:', err);
    } finally {
      setIsLoading(false);
    }
  };

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