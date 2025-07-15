import { fetchWithAuth } from '../utils/fetchInterceptor';
const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  username: string;  // Mantener username en lugar de email
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface User {
  id: number;
  nombre: string;
  email: string;
  concesionaria_id: number;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const formData = new URLSearchParams();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);

    const response = await fetchWithAuth(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });

    if (!response.ok) {
      if (response.status === 422) {
        throw new Error('Credenciales inválidas o formato incorrecto');
      }
      throw new Error(`Error de autenticación: ${response.status}`);
    }

    const data = await response.json();
    localStorage.setItem('token', data.access_token);
    return data;
  },

  logout: (): void => {
    localStorage.removeItem('token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  // Función para obtener el usuario actual
  getCurrentUser: async (): Promise<User | null> => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const response = await fetchWithAuth(`${API_URL}/api/usuarios/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        // Si hay un error 401, el token no es válido o ha expirado
        if (response.status === 401) {
          localStorage.removeItem('token'); // Eliminar el token inválido
          return null;
        }
        throw new Error('Error al obtener el usuario');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  },
};

export default authService;