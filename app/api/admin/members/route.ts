import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Handler GET (Sudah ada sebelumnya)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const members = await prisma.memberProfile.findMany({
      where: {
        AND: [
          search ? {
            OR: [
              { name: { contains: search } },
              { memberCode: { contains: search } },
              { phone: { contains: search } },
            ],
          } : {},
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

    const formattedMembers = members.map((m) => ({
      id: m.id,
      name: m.name || "Tanpa Nama",
      nim: m.memberCode || "-",
      phone: m.phone || "-",
      gender: m.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
      status: m.status === "ACTIVE" ? "Aktif" : "Tidak Aktif",
      package: "Regular Membership",
    }));

    return NextResponse.json({ success: true, data: formattedMembers }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Members API Error:", error);
    return NextResponse.json({ success: false, message: error.message, data: [] }, { status: 500 });
  }
}

// Handler POST (Untuk Tambah Member Baru)
// Handler POST (Untuk Tambah Member Baru)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, nim, phone, gender, status, packageId } = body;

    if (!name || !nim) {
      return NextResponse.json({ success: false, message: "Nama dan NIM wajib diisi!" }, { status: 400 });
    }

    // Buat email otomatis dari NIM atau nama untuk data login User
    const generatedEmail = `${nim.toLowerCase().replace(/[^a-z0-9]/g, "")}@gym88.com`;

    // Simpan data user dan memberProfile secara bersamaan menggunakan relasi Prisma
    const newMember = await prisma.memberProfile.create({
      data: {
        name,
        memberCode: nim,
        phone,
        gender: gender === "Perempuan" ? "FEMALE" : "MALE",
        status: status === "Aktif" ? "ACTIVE" : "INACTIVE",
        // Hubungkan/Buat data User secara otomatis karena bersifat wajib (required)
        user: {
          create: {
            email: generatedEmail,
            name: name,
            role: "MEMBER", // Role standar untuk member baru
            password: "$2a$10$DefaultHashedPasswordExamplePlaceholder", // Password default sementara (bisa diubah nanti)
          },
        },
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json({ success: true, data: newMember }, { status: 201 });
  } catch (error: any) {
    console.error("POST Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Handler PUT (Untuk Ubah/Edit Member)
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, nim, phone, gender, status } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Member tidak ditemukan!" }, { status: 400 });
    }

    const updatedMember = await prisma.memberProfile.update({
      where: { id },
      data: {
        name,
        memberCode: nim,
        phone,
        gender: gender === "Perempuan" ? "FEMALE" : "MALE",
        status: status === "Aktif" ? "ACTIVE" : "INACTIVE",
      },
    });

    return NextResponse.json({ success: true, data: updatedMember }, { status: 200 });
  } catch (error: any) {
    console.error("PUT Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// Handler DELETE (Untuk Hapus Member)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Member tidak valid!" }, { status: 400 });
    }

    await prisma.memberProfile.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Member berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}