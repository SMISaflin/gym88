// app/api/admin/stats/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const totalMembers = await prisma.memberProfile.count();
    const activeMembers = await prisma.memberProfile.count({ where: { status: 'ACTIVE' } });
    const inactiveMembers = await prisma.memberProfile.count({ where: { status: 'INACTIVE' } });

    // Hitung total pendapatan dari transaksi yang sukses
    const successTransactions = await prisma.transaction.findMany({
      where: { paymentStatus: 'SUCCESS' },
      select: { amount: true }
    });

    const totalRevenue = successTransactions.reduce((acc, tx) => acc + Number(tx.amount), 0);
    const formattedRevenue = `Rp ${totalRevenue.toLocaleString("id-ID")}`;

    const activePercentage = totalMembers > 0 ? Math.round((activeMembers / totalMembers) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        total: totalMembers,
        active: activeMembers,
        inactive: inactiveMembers,
        revenue: formattedRevenue,
        activePercentage,
      },
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}