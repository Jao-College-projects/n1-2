import { getApiBase, requireApiBase } from "./apiBase";

export async function readApiErro(res: Response): Promise<string> {
  try {
    const j = (await res.json()) as { erro?: string };
    return j.erro ?? res.statusText;
  } catch {
    return res.statusText;
  }
}

/** fetch com cookie de sessão (auth Java) */
export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const base = requireApiBase();
  const url = path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
  const headers = new Headers(init?.headers);
  if (init?.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, {
    ...init,
    credentials: "include",
    headers,
  });
}

/** Monta URL absoluta para recursos servidos pela API (ex.: uploads) */
export function resolveApiAssetUrl(pathOrUrl: string): string {
  if (!pathOrUrl) return "";
  if (pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")) {
    return pathOrUrl;
  }
  if (typeof window !== "undefined") {
    if (pathOrUrl.startsWith("/")) {
      return `${window.location.origin}${pathOrUrl}`;
    }
    const base = getApiBase();
    if (base.startsWith("http")) {
      return `${base}/${pathOrUrl}`;
    }
    const prefix = base.startsWith("/") ? base : `/${base}`;
    return `${window.location.origin}${prefix}/${pathOrUrl}`;
  }
  const base = getApiBase();
  if (!base) return pathOrUrl;
  if (base.startsWith("http")) {
    const origin = new URL(base).origin;
    return pathOrUrl.startsWith("/") ? `${origin}${pathOrUrl}` : `${base}/${pathOrUrl}`;
  }
  return pathOrUrl;
}
