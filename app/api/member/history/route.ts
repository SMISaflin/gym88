import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberCode = searchParams.get("memberCode");
    const email = searchParams.get("email");

    let memberProfile = null;

    // 1. Cari profil member berdasarkan memberCode atau email
    if (memberCode && memberCode !== "undefined") {
      memberProfile = await prisma.memberProfile.findUnique({
        where: { memberCode },
      });
    } else if (email && email !== "undefined") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });
      memberProfile = user?.profile;
    }

    // ⚠️ FALLBACK: Jika parameter kosong atau tidak ditemukan, ambil member terbaru
    if (!memberProfile) {
      memberProfile = await prisma.memberProfile.findFirst({
        orderBy: { createdAt: "desc" },
      });
    }

    if (!memberProfile) {
      return NextResponse.json(
        { success: true, data: [] },
        { status: 200 }
      );
    }

    // 2. Ambil seluruh riwayat absensi member dari tabel Attendance MySQL
    const attendances = await prisma.attendance.findMany({
      where: { memberProfileId: memberProfile.id },
      orderBy: { date: "desc" },
    });

    // 3. Format data agar sesuai dengan interface tabel frontend
    const formattedHistory = attendances.map((att, idx) => {
      const dateObj = new Date(att.date);
      const timeObj = new Date(att.checkInTime);

      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      const formattedTime = timeObj.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WITA";

      return {
        id: att.id || idx + 1,
        date: formattedDate,
        checkInTime: formattedTime,
        checkOutTime: "-", // Bisa disesuaikan jika kolom checkOut tersedia di database
        status: att.status === "HADIR" ? "Hadir" : "Tidak Hadir",
        ket: att.notes || "Sesi Latihan Gym 88",
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: formattedHistory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Member History API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message, data: [] },
      { status: 500 }
    );
  }
}