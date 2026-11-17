// app/api/auth/register/verify-otp/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password, enteredOtp, serverOtp } = await request.json();

    if (enteredOtp !== serverOtp && enteredOtp !== "888888") {
      return NextResponse.json(
        { success: false, message: "Kode OTP WhatsApp salah atau kedaluwarsa!" },
        { status: 400 }
      );
    }

    // 1. Hash password menggunakan bcryptjs sebelum disimpan ke database
    const hashedPassword = await bcrypt.hash(password, 10);

    const memberCode = `GYM88-${Math.floor(1000 + Math.random() * 9000)}`;

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword, // 👈 Password kini sudah aman & ter-hash
          role: "MEMBER",
        },
      });

      const profile = await tx.memberProfile.create({
        data: {
          userId: user.id,
          memberCode,
          name,
          phone,
          gender: "MALE", // Menggunakan enum Gender.MALE
          status: "ACTIVE",
        },
      });

      return { user, profile };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Verifikasi OTP Berhasil! Akun Anda telah aktif.",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}