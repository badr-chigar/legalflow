import "server-only";

import { cookies } from "next/headers";

/**
 * Session = deux tokens JWT stockés dans des cookies httpOnly (jamais
 * localStorage). Posés / effacés uniquement depuis une route handler ou
 * une server action — `cookies().set()` est interdit pendant le rendu RSC.
 */
export const ACCESS_COOKIE = "lf_access";
export const REFRESH_COOKIE = "lf_refresh";

// Aligné sur config/settings.py → SIMPLE_JWT.
const ACCESS_MAX_AGE = 30 * 60; // 30 min
const REFRESH_MAX_AGE = 24 * 60 * 60; // 1 jour

const baseCookie = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getAccessToken(): Promise<string | undefined> {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

export async function getRefreshToken(): Promise<string | undefined> {
  return (await cookies()).get(REFRESH_COOKIE)?.value;
}

export async function hasSession(): Promise<boolean> {
  return Boolean(await getRefreshToken());
}

export async function setAccessToken(access: string): Promise<void> {
  (await cookies()).set(ACCESS_COOKIE, access, {
    ...baseCookie,
    maxAge: ACCESS_MAX_AGE,
  });
}

export async function setSession(tokens: {
  access: string;
  refresh: string;
}): Promise<void> {
  const store = await cookies();
  store.set(ACCESS_COOKIE, tokens.access, {
    ...baseCookie,
    maxAge: ACCESS_MAX_AGE,
  });
  store.set(REFRESH_COOKIE, tokens.refresh, {
    ...baseCookie,
    maxAge: REFRESH_MAX_AGE,
  });
}

export async function clearSession(): Promise<void> {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  store.delete(REFRESH_COOKIE);
}
