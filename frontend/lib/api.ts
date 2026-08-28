import "server-only";

import { cache } from "react";

import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
} from "@/lib/auth";
import type { AuthTokens, Paginated, User } from "@/lib/types";

/**
 * Client API centralisé — LE seul endroit qui parle à l'API Django REST.
 * Toujours exécuté côté serveur (route handlers, server components, server
 * actions). Le navigateur ne voit jamais l'API directement : il passe par
 * les routes Next, qui portent le token depuis un cookie httpOnly.
 */
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export class ApiError extends Error {
  readonly status: number;
  readonly data: unknown;

  constructor(status: number, data: unknown, message?: string) {
    super(message ?? `API ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }

  /** Message lisible renvoyé par DRF (`detail`, erreurs de champ, ou fallback). */
  get detail(): string {
    const d = this.data;
    if (typeof d === "string" && d) return d;
    if (d && typeof d === "object") {
      const obj = d as Record<string, unknown>;
      if (typeof obj.detail === "string") return obj.detail;
      const first = Object.values(obj)[0];
      if (Array.isArray(first) && typeof first[0] === "string") return first[0];
      if (typeof first === "string") return first;
    }
    return this.message;
  }
}

type Json = Record<string, unknown> | unknown[];

interface RequestOptions extends Omit<RequestInit, "body"> {
  /** Corps JSON ; sérialisé automatiquement. Utiliser `rawBody` pour du multipart. */
  body?: Json;
  rawBody?: BodyInit;
  /** Ne pas tenter de rafraîchir le token sur 401 (évite les boucles). */
  skipRefresh?: boolean;
}

async function parseBody(res: Response): Promise<unknown> {
  if (res.status === 204) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

/** Échange le refresh token contre un nouvel access token auprès de Django. */
export async function refreshAccessToken(): Promise<string | null> {
  const refresh = await getRefreshToken();
  if (!refresh) return null;

  const res = await fetch(`${API_URL}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
    cache: "no-store",
  });
  if (!res.ok) return null;

  const data = (await parseBody(res)) as { access?: string } | null;
  if (!data?.access) return null;

  // Persiste le nouveau token. Impossible pendant un rendu RSC : dans ce
  // cas on l'utilise juste pour la requête en cours, le middleware le
  // réécrira à la prochaine navigation.
  try {
    await setAccessToken(data.access);
  } catch {
    /* rendu RSC : cookies() en lecture seule */
  }
  return data.access;
}

/**
 * Requête authentifiée vers l'API. Rejoue une fois après refresh sur 401.
 * Lève `ApiError` sur toute réponse non 2xx.
 */
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, rawBody, skipRefresh, headers, ...rest } = options;

  const send = async (token: string | undefined): Promise<Response> => {
    const h = new Headers(headers);
    if (token) h.set("Authorization", `Bearer ${token}`);
    if (body !== undefined && !h.has("Content-Type")) {
      h.set("Content-Type", "application/json");
    }
    return fetch(`${API_URL}${path}`, {
      ...rest,
      headers: h,
      body: rawBody ?? (body !== undefined ? JSON.stringify(body) : undefined),
      cache: "no-store",
    });
  };

  let token = await getAccessToken();
  let res = await send(token);

  if (res.status === 401 && !skipRefresh) {
    const fresh = await refreshAccessToken();
    if (fresh) {
      token = fresh;
      res = await send(token);
    }
  }

  const data = await parseBody(res);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as T;
}

export const apiGet = <T>(path: string) => apiRequest<T>(path);

export const apiPost = <T>(path: string, body?: Json) =>
  apiRequest<T>(path, { method: "POST", body });

export const apiPatch = <T>(path: string, body: Json) =>
  apiRequest<T>(path, { method: "PATCH", body });

export const apiDelete = (path: string) =>
  apiRequest<null>(path, { method: "DELETE" });

/**
 * Récupère toutes les pages d'une liste paginée DRF en suivant `next`.
 * (L'API n'expose pas de `page_size` réglable — sinon une seule requête.)
 */
export async function apiGetAll<T>(path: string): Promise<T[]> {
  const out: T[] = [];
  let next: string | null = path;
  while (next) {
    const page: Paginated<T> = await apiRequest<Paginated<T>>(next);
    out.push(...page.results);
    next = page.next
      ? new URL(page.next).pathname + new URL(page.next).search
      : null;
  }
  return out;
}

/**
 * Profil de l'utilisateur connecté (GET /api/auth/me/).
 * `cache()` : dédupliqué le temps d'un rendu (layout + page).
 */
export const getCurrentUser = cache(() => apiGet<User>("/api/auth/me/"));

/**
 * Authentifie un couple e-mail / mot de passe auprès de Django.
 * Utilisé par la route handler /api/auth/login — ne pose pas les cookies
 * lui-même.
 */
export async function authenticate(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await fetch(`${API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
  const data = await parseBody(res);
  if (!res.ok) throw new ApiError(res.status, data);
  return data as AuthTokens;
}
