import { NextResponse } from "next/server";

import { refreshAccessToken } from "@/lib/api";
import { clearSession } from "@/lib/auth";

/**
 * POST /api/auth/refresh
 * Rejoue le refresh token contre Django. Appelé par le client quand une
 * requête revient en 401. En cas d'échec, la session est purgée.
 */
export async function POST() {
  const access = await refreshAccessToken();
  if (!access) {
    await clearSession();
    return NextResponse.json({ detail: "Session expirée." }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
