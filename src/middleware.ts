import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware Authentication - NO LOOPS, NO AGGRESSIVE REDIRECTS
 * 
 * RÈGLES STRICTES :
 * 1. Si l'utilisateur va sur /login → TOUJOURS afficher le formulaire (pas de redirection automatique)
 * 2. Si l'utilisateur va sur /admin SANS token → Rediriger vers /login
 * 3. Toutes les autres pages → Laisser passer
 */
export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token')?.value;
  const { pathname } = req.nextUrl;
  
  // ========================================
  // CAS 1 : PAGE /LOGIN
  // ========================================
  // JAMAIS de redirection automatique depuis /login
  // Même si l'utilisateur a un token, on le laisse voir le formulaire
  // La redirection se fera APRÈS login réussi (dans AuthForm.tsx)
  if (pathname === '/login') {
    return NextResponse.next();
  }
  
  // ========================================
  // CAS 2 : PAGES /ADMIN (PROTÉGÉES)
  // ========================================
  // Si l'utilisateur essaie d'accéder à /admin SANS token → Rediriger vers /login
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    // Token présent → Laisser passer
    return NextResponse.next();
  }
  
  // ========================================
  // CAS 3 : TOUTES LES AUTRES PAGES
  // ========================================
  // Accueil, vote, résultats, etc. → Pas de restriction
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login']
}
