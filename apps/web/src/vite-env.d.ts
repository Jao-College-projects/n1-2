/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL do WAR Java no Tomcat, sem barra final (ex.: http://localhost:8082/luar-api) */
  readonly VITE_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.jpg" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}
