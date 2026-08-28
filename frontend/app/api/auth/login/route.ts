import { NextResponse } from "next/server";

import { ApiError, authenticate } from "@/lib/api";
import { setSession } from "@/lib/auth";

/**
 * POST /api/auth/login
 * Body : { email, password }. Authentifie auprès de Django puis pose les
 * tokens dans des cookies httpOnly. Le navigateur ne reçoit jamais les JWT.
 */
export async function POST(request: Request) {
  let email = "";
  let password = "";
  try {
    const body = (await request.json()) as Record<string, unknown>;
    email = typeof body.email === "string" ? body.email.trim() : "";
    password = typeof body.password === "string" ? body.password : "";
  } catch {
    return NextResponse.json({ detail: "Requête invalide." }, { status: 400 });
  }

  if (!email || !password) {
    return NextResponse.json(
      { detail: "Renseignez votre e-mail et votre mot de passe." },
      { status: 400 },
    );
  }

  try {
    const tokens = await authenticate(email, password);
    await setSession(tokens);
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { detail: "E-mail ou mot de passe incorrect." },
        { status: 401 },
      );
    }
    return NextResponse.json(
      { detail: "Service d'authentification injoignable. Réessayez." },
      { status: 502 },
    );
  }
}
