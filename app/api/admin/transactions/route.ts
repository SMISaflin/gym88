// app/api/admin/transactions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const transactions = await prisma.transaction.findMany({
      include: {
        user: {
          include: {
            profile: true, // Mengambil data nama member dari profile
          },
        },
        membership: {
          include: {
            package: true, // Mengambil nama paket gym
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedData = transactions.map((t) => ({
      id: t.id,
      invoiceNumber: t.invoiceNumber || `INV-${t.id.slice(0, 6)}`,
      memberName: t.user?.profile?.name || t.user?.email || "Member Umum",
      packageTitle: t.membership?.package?.title || "Paket Membership Gym 88",
      amount: `Rp ${Number(t.amount).toLocaleString("id-ID")}`,
      paymentMethod: t.paymentMethod,
      paymentStatus: t.paymentStatus,
      createdAt: new Date(t.createdAt).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    return NextResponse.json({ success: true, data: formattedData }, { status: 200 });
  } catch (error: any) {
    console.error("Admin Transactions Fetch Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Tambah transaksi manual oleh admin
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { memberProfileId, packageId, paymentMethod, paymentStatus } = body;

    const profile = await prisma.memberProfile.findUnique({
      where: { id: memberProfileId },
    });

    if (!profile) {
      return NextResponse.json({ success: false, message: "Member tidak ditemukan" }, { status: 404 });
    }

    const pkg = await prisma.package.findUnique({ where: { id: packageId } });
    if (!pkg) {
      return NextResponse.json({ success: false, message: "Paket tidak ditemukan" }, { status: 404 });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + pkg.durationDays);

    const membership = await prisma.membership.create({
      data: {
        memberProfileId: profile.id,
        packageId: pkg.id,
        startDate,
        endDate,
        status: "ACTIVE",
      },
    });

    const invoiceNumber = `INV-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(100 + Math.random() * 900)}`;

    const newTransaction = await prisma.transaction.create({
      data: {
        invoiceNumber,
        userId: profile.userId,
        membershipId: membership.id,
        amount: pkg.price,
        paymentMethod: paymentMethod || "CASHIER",
        paymentStatus: paymentStatus || "SUCCESS",
        paidAt: paymentStatus === "SUCCESS" ? new Date() : null,
      },
    });

    return NextResponse.json({ success: true, data: newTransaction }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus transaksi
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID transaksi tidak valid" }, { status: 400 });
    }

    await prisma.transaction.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Transaksi berhasil dihapus" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}