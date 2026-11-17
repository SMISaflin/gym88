// app/api/attendance/scan/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { qrToken } = body;

    if (!qrToken || !qrToken.startsWith("GYM88_ATTENDANCE_")) {
      return NextResponse.json(
        { success: false, message: "QR Code tidak valid atau format salah!" },
        { status: 400 }
      );
    }

    // Parse token: GYM88_ATTENDANCE_{memberCode}_{timestampInterval}
    // Contoh: GYM88_ATTENDANCE_GYM88-0012_59623812
    const tokenParts = qrToken.split("_");
    if (tokenParts.length < 4) {
      return NextResponse.json(
        { success: false, message: "Struktur QR Code rusak!" },
        { status: 400 }
      );
    }

    // Ambil memberCode (contoh: GYM88-0012) dan timestamp interval
    const memberCode = tokenParts[2];
    const tokenInterval = parseInt(tokenParts[3], 10);
    const currentInterval = Math.floor(Date.now() / 30000);

    // Toleransi waktu interval token max 2 siklus (60 detik) untuk mencegah penggunaan QR bekas
    if (Math.abs(currentInterval - tokenInterval) > 2) {
      return NextResponse.json(
        { 
          success: false, 
          message: "QR Code sudah kadaluarsa! Silakan minta member me-refresh QR Code." 
        },
        { status: 400 }
      );
    }

    // Cari profil member di database berdasarkan memberCode
    const memberProfile = await prisma.memberProfile.findUnique({
      where: { memberCode },
      include: {
        memberships: {
          where: { status: "ACTIVE" },
          orderBy: { endDate: "desc" },
          take: 1,
        },
      },
    });

    if (!memberProfile) {
      return NextResponse.json(
        { success: false, message: `Member dengan kode ${memberCode} tidak ditemukan!` },
        { status: 404 }
      );
    }

    // Validasi status member & membership
    if (memberProfile.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, message: `Status member ${memberProfile.name} sedang TIDAK AKTIF!` },
        { status: 400 }
      );
    }

    // Tanggal hari ini tanpa jam (untuk pengecekan absen ganda)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Cek apakah member sudah melakukan absensi hari ini
    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        memberProfileId: memberProfile.id,
        date: {
          gte: today,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json(
        {
          success: false,
          message: `${memberProfile.name} sudah melakukan absensi hari ini pada pukul ${new Date(existingAttendance.checkInTime).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB!`,
        },
        { status: 400 }
      );
    }

    // Simpan log absensi baru ke database MySQL
    const newAttendance = await prisma.attendance.create({
      data: {
        memberProfileId: memberProfile.id,
        date: new Date(),
        checkInTime: new Date(),
        status: "HADIR",
        notes: "Absensi Berhasil via QR Code Scanner",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Absensi Berhasil! Selamat datang, ${memberProfile.name}.`,
        data: {
          attendanceId: newAttendance.id,
          memberName: memberProfile.name,
          memberCode: memberProfile.memberCode,
          checkInTime: new Date(newAttendance.checkInTime).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Attendance Scan API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan server!" },
      { status: 500 }
    );
  }
}