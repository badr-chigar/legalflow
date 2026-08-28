import { NextResponse, type NextRequest } from "next/server";

/**
 * Garde de session :
 *  - pas de refresh token        → redirection /login (routes protégées)
 *  - refresh sans access valide  → refresh silencieux, cookie réécrit
 *  - session valide sur /login   → redirection /dashboard
 *
 * Ce proxy (ex-« middleware », Next 16) tourne sur le runtime Edge : il ne
 * peut pas utiliser `next/headers`, il fait donc son propre appel à Django.
 */
const ACCESS_COOKIE = "lf_access";
const REFRESH_COOKIE = "lf_refresh";
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

const ACCESS_COOKIE_OPTS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 30 * 60,
};

function isPublic(pathname: string): boolean {
  if (pathname.startsWith("/api/auth/")) return true;
  return pathname === "/login" || pathname.startsWith("/login/");
}

function toLogin(request: NextRequest, withNext: boolean) {
  const url = request.nextUrl.clone();
  const { pathname, search } = request.nextUrl;
  url.pathname = "/login";
  url.search =
    withNext && pathname !== "/"
      ? `?next=${encodeURIComponent(pathname + search)}`
      : "";
  return NextResponse.redirect(url);
}

function toDashboard(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = "/dashboard";
  url.search = "";
  return NextResponse.redirect(url);
}

async function tryRefresh(refresh: string): Promise<string | null> {
  try {
    const res = await fetch(`${API_URL}/api/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { access?: string };
    return data.access ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const publicPath = isPublic(pathname);
  const atEntry = pathname === "/login" || pathname === "/";

  // Aucune session.
  if (!refresh) {
    return publicPath ? NextResponse.next() : toLogin(request, true);
  }

  // Refresh présent mais access absent/expiré → refresh silencieux.
  if (!access) {
    const fresh = await tryRefresh(refresh);
    if (!fresh) {
      const res = publicPath ? NextResponse.next() : toLogin(request, false);
      res.cookies.delete(ACCESS_COOKIE);
      res.cookies.delete(REFRESH_COOKIE);
      return res;
    }
    const res = atEntry ? toDashboard(request) : NextResponse.next();
    res.cookies.set(ACCESS_COOKIE, fresh, ACCESS_COOKIE_OPTS);
    return res;
  }

  // Session valide : on éloigne de /login et de la racine.
  if (atEntry) return toDashboard(request);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
