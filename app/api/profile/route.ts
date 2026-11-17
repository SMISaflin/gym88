// app/api/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil data profil berdasarkan userId / email query parameter
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    const email = url.searchParams.get("email");

    if (!userId && !email) {
      return NextResponse.json({ success: false, message: "ID User atau Email diperlukan" }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : { email: email! },
      include: {
        profile: {
          include: {
            memberships: {
              include: { package: true },
              orderBy: { createdAt: 'desc' },
              take: 1
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        profileId: user.profile?.id || null,
        name: user.profile?.name || 'Administrator',
        phone: user.profile?.phone || '-',
        address: '-',
        gender: user.profile?.gender || 'MALE',
        memberCode: user.profile?.memberCode || '-',
        status: user.profile?.status || 'INACTIVE',
        joinedDate: user.profile?.joinedDate ? new Date(user.profile.joinedDate).toLocaleDateString("id-ID") : '-',
        activePackage: user.profile?.memberships[0]?.package?.title || 'Tidak Ada Paket'
      }
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Memperbarui informasi profil pengguna
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { userId, name, phone, address, gender } = body;

    if (!userId) {
      return NextResponse.json({ success: false, message: "User ID wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ success: false, message: "User tidak ditemukan" }, { status: 404 });
    }

    if (user.profile) {
      // Update profil yang ada
      await prisma.memberProfile.update({
        where: { id: user.profile.id },
        data: { name, phone, address, gender }
      });
    } else {
      // Buat profil jika belum ada
      const count = await prisma.memberProfile.count();
      await prisma.memberProfile.create({
        data: {
          userId: user.id,
          memberCode: `ADM-${String(count + 1).padStart(3, '0')}`,
          name: name || 'Admin Gym 88',
          phone,
          address,
          gender: gender || 'MALE',
          status: 'ACTIVE'
        }
      });
    }

    return NextResponse.json({ success: true, message: "Profil berhasil diperbarui!" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}