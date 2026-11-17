// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Mendapatkan token sesi dari cookie (mendukung token standar maupun NextAuth)
  const token = 
    request.cookies.get("token")?.value || 
    request.cookies.get("next-auth.session-token")?.value;

  // 1. Perlindungan Rute Member & Admin
  // Jika belum login (tidak ada token) tapi memaksa mengetik URL /member atau /admin, tendang ke /login
  if (pathname.startsWith("/member") || pathname.startsWith("/admin")) {
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      // Opsional: Simpan URL asal agar bisa di-redirect kembali setelah login
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Pencegahan Akses Ganda Auth
  // Jika sudah login, cegah user membuka halaman /login atau /register lewat URL
  if ((pathname.startsWith("/login") || pathname.startsWith("/register")) && token) {
    return NextResponse.redirect(new URL("/member/dashboard", request.url));
  }

  return NextResponse.next();
}

// Tentukan rute path mana saja yang dipantau oleh Middleware
export const config = {
  matcher: ["/member/:path*", "/admin/:path*", "/login", "/register"],
};