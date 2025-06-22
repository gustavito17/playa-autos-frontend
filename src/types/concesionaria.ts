export interface Concesionaria {
  id: number;
  nombre: string;
  logo_url?: string;
  color_principal?: string;
}

export interface ConcesionariaCreate {
  nombre: string;
  logo_url?: string;
  color_principal?: string;
}