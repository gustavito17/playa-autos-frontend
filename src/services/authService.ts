const API_URL = import.meta.env.VITE_API_URL;

export interface LoginCredentials {
  username: string;
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
  rol: 'admin' | 'superadmin';
  concesionaria_id: number;
}

const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        username: credentials.username,
        password: credentials.password
      }),
    });

    if (!response.ok) {
      throw new Error('Error de autenticación');
    }

    const data = await response.json();
    // Guardar el token en localStorage
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
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token expirado o inválido
          localStorage.removeItem('token');
          return null;
        }
        throw new Error('Error al obtener datos del usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
      return null;
    }
  },
};

export default authService;