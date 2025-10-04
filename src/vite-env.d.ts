/// <reference types="vite/client" />

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // Agrega otras variables de entorno que estés utilizando
  // readonly VITE_ALGUNA_CLAVE: string;
  // ...
}