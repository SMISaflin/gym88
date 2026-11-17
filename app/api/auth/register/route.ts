// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // 1. Validasi Input Kelengkapan Data
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Nama lengkap, email, dan password wajib diisi!" },
        { status: 400 }
      );
    }

    // 2. Validasi Aturan Keamanan Password (Min 8 Karakter, Huruf Besar, Huruf Kecil, Angka, Karakter Spesial)
    const passwordRules = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    const isPasswordSecure = Object.values(passwordRules).every(Boolean);

    if (!isPasswordSecure) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password harus minimal 8 karakter dan mengandung huruf besar, huruf kecil, angka, serta karakter spesial.",
        },
        { status: 400 }
      );
    }

    // 3. Cek Apakah Email Sudah Terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar. Silakan gunakan email lain atau login.",
        },
        { status: 400 }
      );
    }

    // 4. Hash Password Menggunakan bcryptjs (Keamanan Standar)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Generate Member Code Unik
    const memberCode = `GYM88-${Math.floor(1000 + Math.random() * 9000)}`;

    // 6. Simpan Data User dan MemberProfile Menggunakan Transaction
    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword, // Password kini disimpan dalam bentuk ter-hash aman
          role: "MEMBER",
        },
      });

      const profile = await tx.memberProfile.create({
        data: {
          userId: user.id,
          memberCode,
          name,
          phone: phone || `08${Math.floor(100000000 + Math.random() * 900000000)}`,
          status: "ACTIVE",
        },
      });

      return { user, profile };
    });

    // 7. Response Berhasil
    return NextResponse.json(
      {
        success: true,
        message: "Registrasi akun berhasil!",
        data: {
          userId: newUser.user.id,
          email: newUser.user.email,
          name: newUser.profile.name,
          memberCode: newUser.profile.memberCode,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Kesalahan API Auth Register:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan internal pada server saat proses registrasi.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}