/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_ANON_KEY?: string;
  /** URL do WAR Java no Tomcat, sem barra final (ex.: http://localhost:8082/luar-api) */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.png" {
  const value: string;
  return value;
}

declare module "*.jpg" {
  const value: string;
  return value;
}

declare module "*.svg" {
  const value: string;
  return value;
}
