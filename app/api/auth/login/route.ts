// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 1. Validasi Input Kredensial
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email dan password wajib diisi." },
        { status: 400 }
      );
    }

    // 2. Cari Pengguna Berdasarkan Email
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true, // Sertakan data profil member jika ada
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email tidak terdaftar dalam sistem." },
        { status: 401 }
      );
    }

    // 3. Verifikasi Password menggunakan bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Password yang Anda masukkan salah." },
        { status: 401 }
      );
    }

    // 4. Tentukan URL Tujuan Berdasarkan Role Pengguna
    const redirectUrl =
      user.role === "ADMIN" ? "/admin/dashboard" : "/member/dashboard";

    // 5. Buat Response dan Set Cookie Sesi (Token) agar Middleware membaca akses
    const response = NextResponse.json(
      {
        success: true,
        message: "Autentikasi berhasil!",
        data: {
          userId: user.id,
          email: user.email,
          role: user.role,
          name: user.profile?.name || "Pengguna Gym 88",
          memberCode: user.profile?.memberCode || null,
          redirectUrl,
        },
      },
      { status: 200 }
    );

    // Set cookie token berdurasi 1 hari (atau sesuaikan)
    // Cookie inilah yang bertindak sebagai "tiket" agar lolos dari Middleware route guard
    response.cookies.set({
      name: "token",
      value: user.id, // Menyimpan ID user atau token sesi
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24, // 1 Hari
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Kesalahan API Auth Login:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server saat proses autentikasi.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}