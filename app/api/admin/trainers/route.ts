// app/api/admin/trainers/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil daftar seluruh Personal Trainer
export async function GET() {
  try {
    const trainers = await prisma.trainer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const formatted = trainers.map((t) => ({
      id: t.id,
      name: t.name,
      specialty: t.specialty,
      phone: t.phone,
      experience: t.experience || "-",
      status: t.status === "ACTIVE" ? "Aktif" : "Cuti",
    }));

    return NextResponse.json({ success: true, data: formatted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Tambah Personal Trainer Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, specialty, phone, experience, status } = body;

    if (!name || !phone) {
      return NextResponse.json({ success: false, message: "Nama dan No HP wajib diisi!" }, { status: 400 });
    }

    const newTrainer = await prisma.trainer.create({
      data: {
        name,
        specialty: specialty || "General Fitness",
        phone,
        experience: experience || "1 Tahun",
        status: status === "Cuti" ? "INACTIVE" : "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, message: "Trainer berhasil ditambahkan!", data: newTrainer }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// PUT: Perbarui Data Personal Trainer
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, specialty, phone, experience, status } = body;

    if (!id || !name || !phone) {
      return NextResponse.json({ success: false, message: "ID, Nama, dan No HP diperlukan!" }, { status: 400 });
    }

    const updatedTrainer = await prisma.trainer.update({
      where: { id },
      data: {
        name,
        specialty,
        phone,
        experience,
        status: status === "Cuti" ? "INACTIVE" : "ACTIVE",
      },
    });

    return NextResponse.json({ success: true, message: "Data Trainer berhasil diperbarui!", data: updatedTrainer }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// DELETE: Hapus Personal Trainer
export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, message: "ID Trainer diperlukan" }, { status: 400 });
    }

    await prisma.trainer.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Trainer berhasil dihapus dari database" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}