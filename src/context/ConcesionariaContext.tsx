import { createContext, useContext, useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_API_URL;
const CONCESIONARIA_ID = 1; // Cambia este valor si tu app es multi-concesionaria

interface ConcesionariaData {
  id: number;
  nombre: string;
  color_principal: string;
  logo_url: string;
}

interface ConcesionariaContextType extends Partial<ConcesionariaData> {
  loading: boolean;
}

const ConcesionariaContext = createContext<ConcesionariaContextType>({ loading: true });

export const useConcesionaria = () => useContext(ConcesionariaContext);

export const ConcesionariaProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<ConcesionariaData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/concesionarias/${CONCESIONARIA_ID}`)
      .then(res => {
        if (!res.ok) throw new Error('No se pudo obtener la concesionaria');
        return res.json();
      })
      .then(data => {
        setData(data);
        if (data.color_principal) {
          document.documentElement.style.setProperty('--primary-color', data.color_principal);
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <ConcesionariaContext.Provider value={{ ...data, loading }}>
      {children}
    </ConcesionariaContext.Provider>
  );
}; 