import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberCode } = body;

    if (!memberCode) {
      return NextResponse.json(
        { success: false, message: "Kode Member wajib disertakan!" },
        { status: 400 }
      );
    }

    // 1. Cari profil member berdasarkan memberCode di database MySQL
    const memberProfile = await prisma.memberProfile.findUnique({
      where: { memberCode },
      include: { user: true },
    });

    if (!memberProfile) {
      return NextResponse.json(
        { success: false, message: `Member dengan kode ${memberCode} tidak ditemukan di database!` },
        { status: 404 }
      );
    }

    // 2. Validasi status keaktifan member
    if (memberProfile.status !== "ACTIVE" && memberProfile.status !== "Aktif") {
      return NextResponse.json(
        { success: false, message: `Status keaktifan ${memberProfile.name} sedang tidak aktif!` },
        { status: 400 }
      );
    }

    // 3. Cek apakah member sudah melakukan absensi pada hari ini
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existingAttendance = await prisma.attendance.findFirst({
      where: {
        memberProfileId: memberProfile.id,
        date: { gte: today },
      },
    });

    if (existingAttendance) {
      const timeStr = new Date(existingAttendance.checkInTime).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return NextResponse.json(
        {
          success: false,
          message: `${memberProfile.name} sudah melakukan absensi hari ini pada pukul ${timeStr} WIB!`,
        },
        { status: 400 }
      );
    }

    // 4. Simpan data presensi baru ke tabel Attendance MySQL
    const newAttendance = await prisma.attendance.create({
      data: {
        memberProfileId: memberProfile.id,
        date: new Date(),
        checkInTime: new Date(),
        status: "HADIR",
        notes: "Absensi Mandiri oleh Member",
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: `Absensi Berhasil! Selamat berlatih, ${memberProfile.name}.`,
        data: {
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
    console.error("Check-in API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Terjadi kesalahan pada server!" },
      { status: 500 }
    );
  }
}