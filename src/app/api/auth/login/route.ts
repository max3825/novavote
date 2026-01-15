import { NextRequest, NextResponse } from "next/server";

// In Docker: use internal service name 'api', otherwise use localhost:8001
const API_URL = process.env.NEXT_PUBLIC_API_URL || 
  (process.env.NODE_ENV === "production" 
    ? "http://api:8000/api/v1"  // Internal Docker network
    : "http://localhost:8001/api/v1");  // Dev/localhost

/**
 * Route API pour le login qui :
 * 1. Envoie les credentials à l'API backend
 * 2. Récupère le token JWT
 * 3. DÉFINIT le cookie côté serveur (accessible au middleware)
 * 4. Retourne le token au frontend
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et password requis" },
        { status: 400 }
      );
    }

    // 1. Appeler l'API backend
    const backendResponse = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.detail || "Login failed" },
        { status: backendResponse.status }
      );
    }

    // 2. Récupérer le token
    const { access_token, token_type } = await backendResponse.json();

    // 3. Créer la réponse avec cookie défini côté serveur
    const response = NextResponse.json({
      access_token,
      token_type,
    });

    // 4. Définir le cookie CÔTÉ SERVEUR (accessible au middleware)
    response.cookies.set("access_token", access_token, {
      httpOnly: false, // Frontend peut accéder via JS
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 86400 * 7, // 7 jours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
