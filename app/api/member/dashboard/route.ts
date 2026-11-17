import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberCode = searchParams.get("memberCode");
    const email = searchParams.get("email");

    let memberProfile = null;
    let memberEmail = "-";

    if (memberCode) {
      memberProfile = await prisma.memberProfile.findUnique({
        where: { memberCode },
        include: { user: true },
      });
      memberEmail = memberProfile?.user?.email || "-";
    } else if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: true },
      });
      memberProfile = user?.profile;
      memberEmail = user?.email || "-";
    }

    if (!memberProfile) {
      return NextResponse.json({ success: false, message: "Member tidak ditemukan" }, { status: 404 });
    }

    // Ambil data absensi member ini dari tabel Attendance
    const attendances = await prisma.attendance.findMany({
      where: { memberProfileId: memberProfile.id },
      orderBy: { date: "desc" },
    });

    const totalAttendance = attendances.length;

    // Hitung tren 7 hari terakhir secara dinamis dari database
    const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const today = new Date();
    
    const weeklyData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);

      const nextD = new Date(d);
      nextD.setDate(d.getDate() + 1);

      // Cek apakah ada record absensi pada tanggal tersebut
      const found = attendances.find((att) => {
        const attDate = new Date(att.date);
        return attDate >= d && attDate < nextD;
      });

      const dayName = daysOfWeek[d.getDay()];
      const dateStr = d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" });
      const isToday = i === 0;

      weeklyData.push({
        day: dayName,
        duration: found ? 60 : 0, // Asumsi durasi standar latihan 60 menit jika hadir
        visits: found ? 1 : 0,
        status: found ? "Hadir" : isToday ? "Rencana" : "Absen",
        date: dateStr,
        isToday,
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          profile: {
            name: memberProfile.name,
            memberCode: memberProfile.memberCode,
            phone: memberProfile.phone,
            email: memberEmail,
            status: memberProfile.status,
          },
          stats: {
            monthlyAttendance: totalAttendance,
            daysInMonth: 30,
          },
          weeklyTrend: weeklyData,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}