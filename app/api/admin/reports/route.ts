// app/api/admin/reports/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get("type") || "transactions";
    const memberId = url.searchParams.get("memberId") || "";

    // 1. LAPORAN TRANSAKSI
    if (type === "transactions") {
      const transactions = await prisma.transaction.findMany({
        include: {
          user: { include: { profile: true } },
          membership: { include: { package: true } }
        },
        orderBy: { createdAt: 'desc' }
      });

      const data = transactions.map(tx => ({
        id: tx.id,
        invoiceNumber: tx.invoiceNumber,
        memberName: tx.user?.profile?.name || tx.user?.email || 'Unknown',
        packageTitle: tx.membership?.package?.title || 'Paket Gym',
        amount: `Rp ${Number(tx.amount).toLocaleString("id-ID")}`,
        paymentMethod: tx.paymentMethod,
        paymentStatus: tx.paymentStatus,
        date: new Date(tx.createdAt).toLocaleDateString("id-ID")
      }));

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // 2. LAPORAN MEMBER AKTIF & TIDAK AKTIF
    if (type === "members") {
      const members = await prisma.memberProfile.findMany({
        include: {
          memberships: {
            include: { package: true },
            where: { status: 'ACTIVE' },
            take: 1
          }
        },
        orderBy: { name: 'asc' }
      });

      const data = members.map(m => ({
        id: m.id,
        name: m.name,
        nim: m.memberCode,
        phone: m.phone,
        gender: m.gender === 'MALE' ? 'Laki-laki' : 'Perempuan',
        status: m.status === 'ACTIVE' ? 'Aktif' : 'Tidak Aktif',
        package: m.memberships[0]?.package?.title || 'Tanpa Paket',
        joinedDate: new Date(m.joinedDate).toLocaleDateString("id-ID")
      }));

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    // 3. LAPORAN KEHADIRAN INDIVIDU
    if (type === "attendance") {
      const memberList = await prisma.memberProfile.findMany({
        select: { id: true, name: true, memberCode: true },
        orderBy: { name: 'asc' }
      });

      let attendanceRecords: any[] = [];
      if (memberId) {
        const records = await prisma.attendance.findMany({
          where: { memberProfileId: memberId },
          orderBy: { date: 'desc' }
        });
        attendanceRecords = records.map(a => ({
          id: a.id,
          date: new Date(a.date).toLocaleDateString("id-ID"),
          checkIn: new Date(a.checkInTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
          checkOut: a.checkOutTime ? new Date(a.checkOutTime).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : '-',
          status: a.status,
          notes: a.notes || 'Latihan Reguler'
        }));
      }

      return NextResponse.json({ success: true, data: { memberList, attendanceRecords } }, { status: 200 });
    }

    // 4. LAPORAN MASTER PACKAGE
    if (type === "packages") {
      const packages = await prisma.package.findMany({
        include: {
          _count: { select: { memberships: true } }
        },
        orderBy: { price: 'asc' }
      });

      const data = packages.map(p => ({
        id: p.id,
        title: p.title,
        type: p.type,
        price: `Rp ${Number(p.price).toLocaleString("id-ID")}`,
        durationDays: `${p.durationDays} Hari`,
        totalSubscribers: p._count.memberships,
        isActive: p.isActive ? 'Aktif' : 'Non-Aktif'
      }));

      return NextResponse.json({ success: true, data }, { status: 200 });
    }

    return NextResponse.json({ success: false, message: "Tipe laporan tidak valid" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}