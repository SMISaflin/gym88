import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month");
    const yearParam = searchParams.get("year");

    const now = new Date();
    const targetYear = yearParam ? parseInt(yearParam) : now.getFullYear();
    const targetMonth = monthParam ? parseInt(monthParam) - 1 : now.getMonth();

    // Tentukan rentang waktu (awal bulan sampai awal bulan berikutnya)
    const startDate = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
    const endDate = new Date(targetYear, targetMonth + 1, 1, 0, 0, 0, 0);

    // Cari profil member beserta kehadirannya pada periode tersebut
    const member = await prisma.memberProfile.findUnique({
      where: { id },
      include: {
        user: true,
        attendances: {
          where: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!member) {
      return NextResponse.json(
        { success: false, message: "Member tidak ditemukan di database." },
        { status: 404 }
      );
    }

    // Format log kehadiran
    const attendances = member.attendances.map((att, idx) => ({
      id: att.id || idx + 1,
      date: new Date(att.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      checkInTime: new Date(att.checkInTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: att.status === "HADIR" ? "Hadir" : att.status,
      notes: att.notes || "Sesi Latihan Gym 88",
    }));

    // Hitung hari alpa (tidak hadir) dalam bulan tersebut
    const isCurrentMonth = now.getFullYear() === targetYear && now.getMonth() === targetMonth;
    const daysInMonthCount = isCurrentMonth
      ? now.getDate() // Jika bulan berjalan, hitung sampai hari ini
      : new Date(targetYear, targetMonth + 1, 0).getDate(); // Jika bulan lalu, hitung penuh

    const allDatesInPeriod: string[] = [];
    for (let d = 1; d <= daysInMonthCount; d++) {
      const dateObj = new Date(targetYear, targetMonth, d);
      allDatesInPeriod.push(
        dateObj.toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      );
    }

    const presentDatesSet = new Set(attendances.map((a) => a.date));
    const absentDays = allDatesInPeriod.filter((dateStr) => !presentDatesSet.has(dateStr));

    return NextResponse.json(
      {
        success: true,
        data: {
          id: member.id,
          name: member.name || "Tanpa Nama",
          memberCode: member.memberCode || "GYM88-0000",
          phone: member.phone || "-",
          email: member.user?.email || "-",
          joinedDate: new Date(member.createdAt).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          status: member.status,
          totalPresent: attendances.length,
          totalAbsent: absentDays.length,
          attendances,
          absentDays,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Member Detail Attendance API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data detail member." },
      { status: 500 }
    );
  }
}