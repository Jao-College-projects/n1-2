/** Base URL do WAR no Tomcat, ex.: http://localhost:8082/luar-api (sem barra final) */
export function getApiBase(): string {
  const raw = import.meta.env.VITE_API_BASE_URL?.trim() ?? "";
  return raw.replace(/\/$/, "");
}

export function requireApiBase(): string {
  const base = getApiBase();
  if (!base) {
    throw new Error(
      "Configure VITE_API_BASE_URL no .env.local (ex.: http://localhost:8082/luar-api)"
    );
  }
  return base;
}
