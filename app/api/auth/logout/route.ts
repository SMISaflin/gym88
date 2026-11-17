// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Berhasil keluar" },
      { status: 200 }
    );

    // Hapus cookie sesi yang digunakan oleh middleware
    response.cookies.set({
      name: "token",
      value: "",
      maxAge: 0,
      path: "/",
    });
    
    response.cookies.set({
      name: "next-auth.session-token",
      value: "",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}