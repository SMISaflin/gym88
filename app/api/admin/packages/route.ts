// app/api/admin/packages/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Mengambil daftar master paket membership dari database MySQL
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { price: 'asc' },
    });

    const formatted = packages.map((pkg) => ({
      id: pkg.id,
      title: pkg.title,
      price: `Rp ${Number(pkg.price).toLocaleString("id-ID")}`,
      desc: pkg.description ? pkg.description.split(",").map(d => d.trim()).filter(Boolean) : [],
      popular: pkg.isPopular,
    }));

    return NextResponse.json({ success: true, data: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Menambahkan paket membership baru ke database MySQL
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, price, descString, popular } = body;

    if (!title || !price) {
      return NextResponse.json({ success: false, message: "Nama paket dan harga wajib diisi!" }, { status: 400 });
    }

    // Konversi string harga (misal: "Rp 350.000") menjadi angka desimal murni
    const numericPrice = Number(price.toString().replace(/[^0-9]/g, '')) || 0;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const newPackage = await prisma.package.create({
      data: {
        title,
        slug,
        price: numericPrice,
        durationDays: 30, // Default durasi 30 hari
        description: descString || "",
        isPopular: popular || false,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, message: "Paket berhasil ditambahkan!", data: newPackage }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Memperbarui data paket membership yang sudah ada
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, price, descString, popular } = body;

    if (!id || !title || !price) {
      return NextResponse.json({ success: false, message: "ID, Nama Paket, dan Harga diperlukan!" }, { status: 400 });
    }

    const numericPrice = Number(price.toString().replace(/[^0-9]/g, '')) || 0;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

    const updatedPackage = await prisma.package.update({
      where: { id },
      data: {
        title,
        slug,
        price: numericPrice,
        description: descString || "",
        isPopular: popular || false,
      },
    });

    return NextResponse.json({ success: true, message: "Paket berhasil diperbarui!", data: updatedPackage }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Menghapus paket membership berdasarkan ID dari database MySQL
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Paket diperlukan" }, { status: 400 });
    }

    await prisma.package.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Paket berhasil dihapus dari database" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}