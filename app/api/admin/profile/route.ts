import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Mengambil data profil berdasarkan email
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "admin@gym88.com";

    // 1. Cari user berdasarkan email beserta relasi profilnya
    let user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true },
    });

    // 2. Jika user sama sekali belum ada di database, buatkan akun user & profilnya secara otomatis
    if (!user) {
      const count = await prisma.memberProfile.count();
      const newCode = `ADM-${String(count + 1).padStart(3, "0")}`;

      user = await prisma.user.create({
        data: {
          email,
          password: crypto.randomUUID(),
          role: "ADMIN",
          profile: {
            create: {
              name: "Administrator Gym 88",
              phone: "081234567890",
              memberCode: newCode,
              gender: "MALE",
              status: "ACTIVE",
            },
          },
        },
        include: { profile: true },
      });
    }

    // 3. Jika user ada tapi belum memiliki relasi profil (profile bernilai null)
    let profileData = user.profile;
    if (!profileData) {
      const count = await prisma.memberProfile.count();
      const newCode = `ADM-${String(count + 1).padStart(3, "0")}`;

      profileData = await prisma.memberProfile.create({
        data: {
          userId: user.id,
          name: "Administrator Gym 88",
          phone: "081234567890",
          memberCode: newCode,
          gender: "MALE",
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: profileData.name || "Administrator Gym 88",
          phone: profileData.phone || "-",
          address: "Jl. Utama Gym 88 No. 88, Makassar",
          gender: profileData.gender || "MALE",
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Profile GET Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal mengambil data profil." },
      { status: 500 }
    );
  }
}

// PUT: Memperbarui data profil admin ke database MySQL
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, gender } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID tidak valid atau kosong." },
        { status: 400 }
      );
    }

    // Pastikan user pemilik ID tersebut benar-benar ada di database
    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "Data User tidak ditemukan di database." },
        { status: 404 }
      );
    }

    let updatedProfile;

    if (targetUser.profile) {
      // Update jika profil sudah ada
      updatedProfile = await prisma.memberProfile.update({
        where: { userId },
        data: {
          name: name || "Administrator Gym 88",
          phone: phone || "-",
          gender: gender === "FEMALE" ? "FEMALE" : "MALE",
        },
      });
    } else {
      // Buat profil baru jika user ada tapi profilnya belum ada
      const count = await prisma.memberProfile.count();
      const newCode = `ADM-${String(count + 1).padStart(3, "0")}`;

      updatedProfile = await prisma.memberProfile.create({
        data: {
          userId,
          name: name || "Administrator Gym 88",
          phone: phone || "-",
          memberCode: newCode,
          gender: gender === "FEMALE" ? "FEMALE" : "MALE",
          status: "ACTIVE",
        },
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Profil Admin berhasil diperbarui ke database!",
        data: updatedProfile,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("API Profile PUT Error:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Gagal menyimpan perubahan profil ke database." },
      { status: 500 }
    );
  }
}