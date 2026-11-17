import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    // Ambil data member dari database MySQL, KECUALI yang rolenya ADMIN
    const members = await prisma.memberProfile.findMany({
      where: {
        AND: [
          // Filter pencarian teks jika ada
          search ? {
            OR: [
              { name: { contains: search } },
              { memberCode: { contains: search } },
              { phone: { contains: search } },
            ],
          } : {},
          // KECUALI user yang memiliki role ADMIN atau memberCode berawalan ADM-
          {
            NOT: {
              OR: [
                { user: { role: "ADMIN" } },
                { memberCode: { startsWith: "ADM-" } },
              ],
            },
          },
        ],
      },
      include: {
        user: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Format menjadi array agar sesuai dengan ekspektasi frontend (.map)
    const formattedMembers = members.map((m) => ({
      id: m.id,
      name: m.name || "Tanpa Nama",
      nim: m.memberCode || "-",
      phone: m.phone || "-",
      gender: m.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
      status: m.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
      package: "Regular Membership",
    }));

    return NextResponse.json(
      {
        success: true,
        data: formattedMembers, // Berbentuk Array []
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Members API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
}