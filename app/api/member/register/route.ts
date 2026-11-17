// app/api/member/register/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      name, 
      nim, 
      phone, 
      email, 
      gender, 
      packageId, 
      duration, 
      usePersonalTrainer, 
      paymentMethod, 
      amount 
    } = body;

    if (!name || !email || !packageId || !amount) {
      return NextResponse.json(
        { success: false, message: "Data pendaftaran tidak lengkap!" },
        { status: 400 }
      );
    }

    // Mapping paymentMethod dari Midtrans agar sesuai dengan Enum Prisma (QRIS, TRANSFER, CASHIER)
    let mappedPaymentMethod: "QRIS" | "TRANSFER" | "CASHIER" = "QRIS";
    const rawMethod = (paymentMethod || "").toLowerCase();
    if (rawMethod.includes("qris")) {
      mappedPaymentMethod = "QRIS";
    } else if (
      rawMethod.includes("transfer") || 
      rawMethod.includes("bca") || 
      rawMethod.includes("bni") || 
      rawMethod.includes("bri") || 
      rawMethod.includes("mandiri") ||
      rawMethod.includes("bank")
    ) {
      mappedPaymentMethod = "TRANSFER";
    } else {
      mappedPaymentMethod = "CASHIER";
    }

    // Gunakan Prisma Transaction untuk menjaga konsistensi data
    const result = await prisma.$transaction(async (tx) => {
      // 1. Cari atau buat User
      let user = await tx.user.findUnique({ where: { email } });
      if (!user) {
        user = await tx.user.create({
          data: {
            email,
            password: "$2a$10$DefaultHashedPasswordPlaceholder",
            role: "MEMBER",
          },
        });
      }

      // 2. Buat / Update MemberProfile
      const profile = await tx.memberProfile.upsert({
        where: { userId: user.id },
        update: {
          name,
          phone,
          status: "ACTIVE",
        },
        create: {
          userId: user.id,
          memberCode: `GYM88-${nim || Math.floor(1000 + Math.random() * 9000)}`,
          name,
          phone,
          gender: gender === "Laki-laki" ? "MALE" : "FEMALE",
          status: "ACTIVE",
        },
      });

      // 3. Ambil data paket untuk menentukan masa aktif (durationDays)
      const pkg = await tx.package.findUnique({ where: { id: packageId } });
      const days = pkg ? pkg.durationDays * (duration || 1) : 30;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(startDate.getDate() + days);

      // 4. Buat record Membership
      const membership = await tx.membership.create({
        data: {
          memberProfileId: profile.id,
          packageId: packageId,
          startDate,
          endDate,
          status: "ACTIVE",
        },
      });

      // 5. Buat record Transaction yang terikat ke User dan Membership
      const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;
      
      const transaction = await tx.transaction.create({
        data: {
          invoiceNumber,
          userId: user.id,
          membershipId: membership.id,
          amount: parseFloat(amount),
          paymentMethod: mappedPaymentMethod,
          paymentStatus: "SUCCESS", // Langsung sukses karena via Midtrans Snap
          paidAt: new Date(),
        },
      });

      return { profile, membership, transaction };
    });

    return NextResponse.json(
      {
        success: true,
        message: "Pendaftaran dan transaksi berhasil dicatat di database.",
        data: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Member Register API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}