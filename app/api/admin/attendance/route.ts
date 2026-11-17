import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const monthParam = searchParams.get("month"); // Contoh: "10" (Oktober)
    const yearParam = searchParams.get("year");   // Contoh: "2026"

    const now = new Date();
    const targetYear = yearParam ? parseInt(yearParam) : now.getFullYear();
    const targetMonth = monthParam ? parseInt(monthParam) - 1 : now.getMonth(); // JavaScript bulan 0-11

    // 1. Tentukan Rentang Waktu (Start & End Date) Berdasarkan Bulan & Tahun yang Dipilih
    const startDate = new Date(targetYear, targetMonth, 1, 0, 0, 0, 0);
    const endDate = new Date(targetYear, targetMonth + 1, 1, 0, 0, 0, 0); // Awal bulan berikutnya

    // 2. Ambil data absen hari ini (untuk tabel "Member yang Absen Hari Ini")
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const todayAttendances = await prisma.attendance.findMany({
      where: {
        date: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
      include: {
        memberProfile: true,
      },
      orderBy: { checkInTime: "desc" },
    });

    const todayLogs = todayAttendances.map((att, idx) => ({
      id: att.id || idx + 1,
      memberName: att.memberProfile?.name || "Member Gym",
      memberCode: att.memberProfile?.memberCode || "GYM88-0000",
      date: new Date(att.date).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
      checkInTime: new Date(att.checkInTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      status: att.status === "HADIR" || att.status === "Hadir" ? "Hadir" : att.status,
      notes: att.notes || "-",
    }));

    // 3. Ambil seluruh data member terdaftar
    const members = await prisma.memberProfile.findMany({
      include: {
        attendances: {
          where: {
            date: {
              gte: startDate,
              lt: endDate,
            },
          },
        },
      },
      orderBy: { name: "asc" },
    });

    // 4. Hitung Total Hadir & Cari Tanggal Alpa (Tidak Hadir) dalam Bulan Tersebut
    // Hitung jumlah hari dalam bulan terpilih (misal: 30 atau 31 hari, atau sampai hari ini jika bulan berjalan)
    const isCurrentMonth = now.getFullYear() === targetYear && now.getMonth() === targetMonth;
    const daysInMonthCount = isCurrentMonth 
      ? now.getDate() // Jika bulan aktif, hitung sampai hari ini
      : new Date(targetYear, targetMonth + 1, 0).getDate(); // Jika bulan lalu, hitung penuh sebulan

    // Buat daftar tanggal lengkap dalam bulan tersebut (format "DD MMM YYYY")
    const allDatesInPeriod: string[] = [];
    for (let d = 1; d <= daysInMonthCount; d++) {
      const dateObj = new Date(targetYear, targetMonth, d);
      const formattedStr = dateObj.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      allDatesInPeriod.push(formattedStr);
    }

    const membersSummary = members.map((m) => {
      // Kumpulan tanggal di mana member ini tercatat hadir pada bulan/tahun tersebut
      const presentDatesSet = new Set(
        m.attendances.map((att) =>
          new Date(att.date).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })
        )
      );

      // Tanggal-tanggal di mana member tidak hadir (Alpa)
      const absentDays = allDatesInPeriod.filter((dateStr) => !presentDatesSet.has(dateStr));

      return {
        id: m.id,
        name: m.name || "Tanpa Nama",
        memberCode: m.memberCode || "GYM88-0000",
        phone: m.phone || "-",
        totalPresent: m.attendances.length,
        joinedDate: new Date(m.createdAt).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        absentDays: absentDays,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          todayLogs,
          membersSummary,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Admin Attendance API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data rekapitulasi." },
      { status: 500 }
    );
  }
}