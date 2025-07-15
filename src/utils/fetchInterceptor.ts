const originalFetch = window.fetch.bind(window);

// Función principal de interceptor con autenticación
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  // Usar la URL original sin modificar
  const cleanUrl = url;
  
  // Verificar si es FormData o URLSearchParams
  const isFormData = options.body instanceof FormData;
  const isURLSearchParams = options.body instanceof URLSearchParams;

  // Crear headers base
  const headers = new Headers(options.headers);
  
  // Agregar headers de autenticación y tipo de contenido
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Accept', '*/*'); // Añadir esta línea para aceptar cualquier tipo de respuesta
  
  // Solo agregar Content-Type cuando no es FormData ni URLSearchParams
  if (!isFormData && !isURLSearchParams && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers,
    mode: 'cors',      // Asegurarnos de que estamos usando modo CORS
    credentials: 'omit' // Esto coincide con allow_credentials=False del backend
  };

  try {
    const response = await originalFetch(cleanUrl, defaultOptions);
    
    // Manejar errores HTTP
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        // Solo redirigir si la URL es privada
        if (
          cleanUrl.includes('/admin') ||
          cleanUrl.includes('/api/usuarios/me') ||
          cleanUrl.includes('/concesionarias/') && cleanUrl.includes('/logo') // ejemplo de endpoint privado
        ) {
          window.location.href = '/login';
        }
        return response;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

// No reemplazar el fetch global
// window.fetch = fetchWithAuth as typeof window.fetch;

export { fetchWithAuth };
export default {};