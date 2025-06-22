const originalFetch = window.fetch.bind(window);

// Función principal de interceptor con autenticación
const fetchWithAuth = async (url: string, options: RequestInit = {}): Promise<Response> => {
  const token = localStorage.getItem('token');
  
  // Eliminar la barra final si existe
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;

  // Verificar si es FormData o URLSearchParams
  const isFormData = options.body instanceof FormData;
  const isURLSearchParams = options.body instanceof URLSearchParams;

  // Crear headers base
  const headers = new Headers(options.headers);
  
  // Agregar headers de autenticación y tipo de contenido
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  headers.set('Accept', 'application/json');
  
  if (!isFormData && !isURLSearchParams && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const defaultOptions: RequestInit = {
    ...options,
    headers
  };

  try {
    const response = await originalFetch(cleanUrl, defaultOptions);
    
    // Manejar errores HTTP
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
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

// Reemplazar el fetch global
window.fetch = fetchWithAuth as typeof window.fetch;
export { fetchWithAuth };
export default {};