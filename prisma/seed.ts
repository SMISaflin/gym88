// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Memulai proses seeding data admin...");

  // Data akun admin default
  const adminEmail = "admin@gym88.com";
  const adminPasswordPlain = "AdminGym88!"; // Password aman standar
  const hashedPassword = await bcrypt.hash(adminPasswordPlain, 10);

  // Cek apakah admin sudah ada sebelumnya
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log("ℹ️ Akun Admin sudah ada di dalam database. Seeding dilewati.");
    return;
  }

  // Buat User Admin baru
  const adminUser = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`✅ Berhasil membuat akun Admin!`);
  console.log(`   Email    : ${adminEmail}`);
  console.log(`   Password : ${adminPasswordPlain}`);
  console.log(`   User ID  : ${adminUser.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Terjadi kesalahan saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });