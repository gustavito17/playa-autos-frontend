# Playa Autos - Frontend

## 1. Nombre del proyecto
**Playa Autos - Frontend**

## 2. Descripción general
Este proyecto es el frontend de una página web para una concesionaria de vehículos. Permite a los usuarios explorar el catálogo de autos, ver detalles, contactar a la concesionaria y, en el sector privado, administrar vehículos, marcas y concesionarias. Se conecta a un backend mediante una API REST para obtener y gestionar la información.

## 3. Tecnologías usadas
- [React](https://reactjs.org/)
- [React Router](https://reactrouter.com/)
- CSS personalizado (ver carpeta `src/styles/`)
- Variables de entorno con Vite (`VITE_API_URL`)

## 4. Instalación

### Paso 1: Clonar el repositorio
```bash
# Usando HTTPS
git clone https://github.com/gustavito17/playa-autos-frontend.git
cd playa-autos-frontend
```

### Paso 2: Instalar dependencias
```bash
# Con npm
npm install
# o con yarn
yarn install
```

### Paso 3: Configurar variables de entorno
Crea un archivo `.env` en la raíz del proyecto y define la URL de la API backend:
```env
VITE_API_URL=https://tu-backend-api.com/api
```

## 5. Iniciar la aplicación en desarrollo
```bash
npm run dev
# o
yarn dev
```
La app estará disponible normalmente en [http://localhost:5173](http://localhost:5173)

## 6. Estructura general de carpetas
```
playa-autos-frontend/
├── public/
├── src/
│   ├── assets/              # Imágenes y recursos
│   ├── components/          # Componentes reutilizables y de dominio
│   ├── context/             # Contextos globales (Auth, Concesionaria)
│   ├── hooks/               # Custom hooks
│   ├── pages/               # Vistas principales (Home, Catálogo, Admin, etc.)
│   ├── routes/              # (Si aplica) Definición de rutas
│   ├── services/            # Servicios para consumo de API
│   ├── styles/              # Archivos CSS
│   ├── types/               # Tipos TypeScript
│   ├── utils/               # Utilidades generales
│   └── main.tsx             # Entry point
├── package.json
├── vite.config.ts
└── README.md
```

## 7. Rutas y componentes principales

### Rutas públicas
- `/` — **Home**: Página principal, bienvenida y presentación.
- `/catalogo` — **Catálogo**: Lista de vehículos disponibles.
- `/vehiculo/:id` — **DetalleVehiculo**: Detalle de un vehículo específico.
- `/contacto` — **Contacto**: Información de contacto.
- `/politicas-de-privacidad` — **Políticas de Privacidad**
- `/terminos-y-condiciones` — **Términos y Condiciones**

### Rutas privadas (requieren login de admin)
- `/admin/dashboard` — **DashboardAdmin**: Panel principal de administración.
- `/admin/vehiculos` — **AdminVehiculos**: Gestión de vehículos.
- `/admin/marcas` — **AdminMarcas**: Gestión de marcas.
- `/admin/concesionaria` — **AdminConcesionarias**: Gestión de concesionarias.
- `/admin/politicas-de-privacidad` — **Políticas de Privacidad (admin)**
- `/admin/terminos-y-condiciones` — **Términos y Condiciones (admin)**

### Componentes destacados
- **Header** y **Footer**: Navegación y enlaces legales.
- **VehiculoForm**: Formulario para crear/editar vehículos.
- **VehiculoCard** y **TarjetaVehiculo**: Visualización de autos.
- **PrivateRoute**: Protección de rutas privadas.

## 8. Consumo de la API
El frontend consume la API REST definida en `VITE_API_URL` para:
- Listar vehículos: `GET /vehiculos?concesionaria_id=...`
- Ver detalle de vehículo: `GET /vehiculos/:id`
- Crear, editar y eliminar vehículos (sector admin): `POST`, `PUT`, `DELETE` sobre `/vehiculos`
- Autenticación: `POST /auth/login`

Las llamadas se realizan mediante `fetch` o servicios personalizados en `src/services/`.

## 9. Notas y recomendaciones
- Usa variables de entorno para cambiar la URL del backend según el entorno (desarrollo, producción).
- Mantén actualizado el backend para evitar errores de CORS o endpoints.
- Personaliza los estilos en `src/styles/` para adaptar la identidad visual.
- Para producción, compila con:
  ```bash
  npm run build
  # o
  yarn build
  ```
- El despliegue puede hacerse en Vercel, Netlify, o cualquier hosting estático compatible con Vite/React.

## 10. Licencia
Este proyecto está bajo la licencia MIT. Puedes usar, modificar y distribuir el código respetando los términos de la licencia.
