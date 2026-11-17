// app/api/auth/register/send-otp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();

    if (!name || !email || !phone || !password) {
      return NextResponse.json(
        { success: false, message: "Semua kolom wajib diisi!" },
        { status: 400 }
      );
    }

    // 1. Validasi Keamanan Password
    const passwordRules = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };

    if (!Object.values(passwordRules).every(Boolean)) {
      return NextResponse.json(
        { success: false, message: "Password belum memenuhi kriteria keamanan!" },
        { status: 400 }
      );
    }

    // 2. Cek Email Terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar. Silakan login." },
        { status: 400 }
      );
    }

    // 3. Cek Nomor WhatsApp Terdaftar
    const existingPhone = await prisma.memberProfile.findFirst({
      where: { phone },
      select: { id: true, phone: true },
    });

    if (existingPhone) {
      return NextResponse.json(
        { success: false, message: "Nomor WhatsApp sudah terdaftar." },
        { status: 400 }
      );
    }

    // 4. Generate Kode OTP 6 Digit
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    // 5. Format Nomor HP (Pastikan bersih dari spasi / strip)
    let formattedPhone = phone.trim().replace(/[^0-9]/g, "");

    // 6. Ambil Token Fonnte
    const fonnteToken = process.env.FONNTE_TOKEN;
    if (!fonnteToken) {
      return NextResponse.json(
        { success: false, message: "FONNTE_TOKEN belum diset di .env!" },
        { status: 500 }
      );
    }

    // 7. Kirim Request ke API Fonnte via FormData / URLSearchParams
    const formData = new URLSearchParams();
    formData.append("target", formattedPhone);
    formData.append(
      "message",
      `*Gym 88 Verification*\n\nHalo *${name}*,\nKode OTP verifikasi pendaftaran akun Gym 88 Anda adalah: *${otpCode}*\n\nJangan bagikan kode ini kepada siapa pun!`
    );
    formData.append("countryCode", "62"); // Default Kode Negara Indonesia

    const fonnteResponse = await fetch("https://api.fonnte.com/send", {
      method: "POST",
      headers: {
        Authorization: fonnteToken,
      },
      body: formData,
    });

    const fonnteResult = await fonnteResponse.json();
    console.log("=== DETAIL DEBUG RESPONS FONNTE ===", fonnteResult);

    if (!fonnteResult.status) {
      return NextResponse.json(
        {
          success: false,
          message: `Fonnte WhatsApp Gagal: ${fonnteResult.reason || fonnteResult.detail || "Nomor tidak terdaftar / Token salah"}`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `Kode OTP resmi telah dikirim ke WhatsApp ${phone}`,
        serverOtp: otpCode,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Send OTP Exception:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan internal server" },
      { status: 500 }
    );
  }
}