import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService, { type User, type LoginCredentials } from '../services/authService';
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

    // En el useEffect de AuthProvider
    useEffect(() => {
      // Verificar autenticación al cargar la aplicación
      const checkAuth = async () => {
        try {
          console.log('Verificando autenticación...');
          if (authService.isAuthenticated()) {
            console.log('Token encontrado, obteniendo datos del usuario...');
            const userData = await authService.getCurrentUser();
            console.log('Datos del usuario obtenidos:', userData);
            setUser(userData);
          }
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
        } finally {
          setIsLoading(false);
        }
      };
    
      checkAuth();
    }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      // Crear un objeto que cumpla con la interfaz LoginCredentials
      const credentials: LoginCredentials = { username, password };
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
