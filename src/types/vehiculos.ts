export interface Vehiculo {
  id: number;
  modelo: string;
  anio: number;
  color: string;
  estado: string;
  precio: number;
  descripcion: string;
  marca_id: number;
  concesionaria_id: number;
  imagenes: Imagen[];
  marca: {
    id: number;
    nombre: string;
  };
  concesionaria: {
    id: number;
    nombre: string;
    logo_url?: string;
    color_principal?: string;
  };
}

export interface VehiculoCreate {
  modelo: string;
  anio: number;
  color: string;
  estado: string;
  precio: number;
  descripcion: string;
  marca_id: number;
  concesionaria_id?: number; // Hacerlo opcional
}

export interface Marca {
  id: number;
  nombre: string;
}

export interface Imagen {
  id: number;
  url: string;
  vehiculo_id: number;
}

export interface VehiculosParams {
  skip?: number;
  limit?: number;
  estado?: string;
}