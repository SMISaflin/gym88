// app/api/packages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil seluruh paket membership dari database
    const packages = await prisma.package.findMany({
      orderBy: { price: "asc" },
    });

    return NextResponse.json({ success: true, data: packages }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Packages Error:", error);
    return NextResponse.json(
      { success: false, message: "Gagal mengambil data paket." },
      { status: 500 }
    );
  }
}