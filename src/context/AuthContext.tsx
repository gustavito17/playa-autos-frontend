import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import authService, { type User, type LoginCredentials } from '../services/authService';
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  concesionariaLogo: string | null;
  setConcesionariaLogo: (logo: string | null) => void;
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
  const [concesionariaLogo, setConcesionariaLogo] = useState<string | null>(null);

    // En el useEffect de AuthProvider
    useEffect(() => {
      // Verificar autenticación al cargar la aplicación
      const checkAuth = async () => {
        try {
          if (authService.isAuthenticated()) {
            const userData = await authService.getCurrentUser();
            setUser(userData);
            // Obtener logo de la concesionaria si hay userData
            if (userData && userData.concesionaria_id) {
              const token = authService.getToken();
              const res = await fetch(`/api/concesionarias/${userData.concesionaria_id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (res.ok) {
                const conc = await res.json();
                setConcesionariaLogo(conc.logo_url || null);
              } else {
                setConcesionariaLogo(null);
              }
            } else {
              setConcesionariaLogo(null);
            }
          } else {
            setConcesionariaLogo(null);
          }
        } catch (error) {
          setConcesionariaLogo(null);
        } finally {
          setIsLoading(false);
        }
      };
      checkAuth();
    }, []);

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      const credentials: LoginCredentials = { username, password };
      await authService.login(credentials);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      // Obtener logo de la concesionaria al hacer login
      if (userData && userData.concesionaria_id) {
        const token = authService.getToken();
        const res = await fetch(`/api/concesionarias/${userData.concesionaria_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const conc = await res.json();
          setConcesionariaLogo(conc.logo_url || null);
        } else {
          setConcesionariaLogo(null);
        }
      } else {
        setConcesionariaLogo(null);
      }
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
    concesionariaLogo,
    setConcesionariaLogo,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
