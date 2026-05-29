import type { ICredenciaisLogin, IFormularioCadastro, TipoUsuario } from "../types/IProduto";
import { apiFetch, readApiErro } from "./apiFetch";

export interface IUsuarioSessao {
  id: string;
  nomeCompleto: string;
  email: string;
  tipoUsuario: TipoUsuario;
}

function mapUsuario(raw: Record<string, unknown>): IUsuarioSessao {
  return {
    id: String(raw.id ?? ""),
    nomeCompleto: String(raw.nomeCompleto ?? ""),
    email: String(raw.email ?? ""),
    tipoUsuario: raw.tipoUsuario === "admin" ? "admin" : "normal",
  };
}

export async function buscarSessao(): Promise<IUsuarioSessao | null> {
  const res = await apiFetch("/api/auth/me");
  if (res.status === 204) return null;
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  return mapUsuario(data);
}

export async function fazerLogin(dados: ICredenciaisLogin): Promise<IUsuarioSessao> {
  const res = await apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await readApiErro(res));
  const data = (await res.json()) as Record<string, unknown>;
  return mapUsuario(data);
}

export async function fazerCadastro(dados: IFormularioCadastro): Promise<IUsuarioSessao> {
  const res = await apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(dados),
  });
  if (!res.ok) throw new Error(await readApiErro(res));
  const data = (await res.json()) as Record<string, unknown>;
  return mapUsuario(data);
}

export async function fazerLogout(): Promise<void> {
  await apiFetch("/api/auth/logout", { method: "POST" });
}
