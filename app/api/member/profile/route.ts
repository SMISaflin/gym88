import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Ambil data profil member
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const memberCode = searchParams.get("memberCode");
    const email = searchParams.get("email");

    let memberProfile = null;

    if (memberCode && memberCode !== "undefined") {
      memberProfile = await prisma.memberProfile.findUnique({
        where: { memberCode },
        include: { user: true },
      });
    } else if (email && email !== "undefined") {
      const user = await prisma.user.findUnique({
        where: { email },
        include: { profile: { include: { user: true } } },
      });
      memberProfile = user?.profile;
    }

    // ⚠️ FALLBACK: Jika parameter kosong atau tidak ditemukan, ambil member terbaru
    if (!memberProfile) {
      memberProfile = await prisma.memberProfile.findFirst({
        include: { user: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (!memberProfile) {
      return NextResponse.json(
        { success: false, message: "Profil member tidak ditemukan di database." },
        { status: 404 }
      );
    }

    const formattedData = {
      id: memberProfile.id,
      name: memberProfile.name || "",
      memberCode: memberProfile.memberCode || "-",
      phone: memberProfile.phone || "-",
      email: memberProfile.user?.email || "-",
      gender: memberProfile.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
      joinedDate: new Date(memberProfile.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      status: memberProfile.status === "ACTIVE" ? "AKTIF" : "TIDAK AKTIF",
    };

    return NextResponse.json(
      { success: true, data: formattedData },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

// PUT: Perbarui data profil member ke database MySQL
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, nim, phone, email, gender } = body;

    if (!id || !name || !nim) {
      return NextResponse.json(
        { success: false, message: "ID, Nama, dan NIM/Kode Member wajib diisi!" },
        { status: 400 }
      );
    }

    // 1. Update data pada tabel MemberProfile
    const updatedProfile = await prisma.memberProfile.update({
      where: { id },
      data: {
        name,
        memberCode: nim,
        phone,
        gender: gender === "Perempuan" ? "FEMALE" : "MALE",
      },
      include: { user: true },
    });

    // 2. Update email pada tabel User jika ada relasi user
    if (email && updatedProfile.userId) {
      await prisma.user.update({
        where: { id: updatedProfile.userId },
        data: { email },
      }).catch((err) => console.log("Gagal update email user:", err));
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profil berhasil diperbarui ke database!",
        data: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update Profile API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal memperbarui database." },
      { status: 500 }
    );
  }
}