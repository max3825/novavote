import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Vérifier l'auth pour les routes protégées
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const token = req.cookies.get('access_token')?.value;
    
    if (!token) {
      // Rediriger vers /login si pas de token
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }
  
  return NextResponse.next();
}
