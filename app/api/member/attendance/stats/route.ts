// app/api/member/attendance/stats/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberCode = searchParams.get("memberCode");

    if (!memberCode) {
      return NextResponse.json(
        { success: false, message: "Kode member wajib disertakan!" },
        { status: 400 }
      );
    }

    const memberProfile = await prisma.memberProfile.findUnique({
      where: { memberCode },
      include: {
        attendances: true,
      },
    });

    if (!memberProfile) {
      return NextResponse.json(
        { success: false, message: "Profil member tidak ditemukan." },
        { status: 404 }
      );
    }

    // Hitung absensi bulan ini
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyCount = memberProfile.attendances.filter(
      (att) => new Date(att.date) >= firstDayOfMonth
    ).length;

    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    return NextResponse.json(
      {
        success: true,
        data: {
          totalAttendance: memberProfile.attendances.length,
          monthlyAttendance: monthlyCount,
          daysInMonth: daysInMonth,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Member Attendance Stats Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}