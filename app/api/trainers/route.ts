// app/api/trainers/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil data personal trainer aktif dari database
    const trainers = await prisma.trainer.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, data: trainers }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Trainers Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data personal trainer." },
      { status: 500 }
    );
  }
}