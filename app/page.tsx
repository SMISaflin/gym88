import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-950 text-slate-100 min-h-screen">
      <div className="max-w-3xl w-full text-center space-y-8">
        
        {/* LOGO & HERO TITLE */}
        <div className="space-y-4">
          <div className="inline-block bg-yellow-500 text-slate-950 font-black px-4 py-2 rounded-xl text-2xl tracking-wider shadow-lg shadow-yellow-500/10">
            GYM 88
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            Sistem Manajemen Gym 88
          </h1>
          <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Platform manajemen gym modern berbasis web dengan fitur otomatis pendeteksi status keaktifan anggota, absensi QR Code, dan pengelolaan paket membership.
          </p>
        </div>

        {/* ROLE SELECTION CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-left">
          
          {/* Admin Portal Card */}
          <Link 
            href="/admin/dashboard" 
            className="bg-slate-900 border border-slate-800 hover:border-yellow-500/50 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition">
                <i className="fa-solid fa-user-shield"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Panel Admin</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kelola data member, paket membership, klasifikasi status keaktifan otomatis, laporan keuangan, dan rekap kunjungan harian.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-yellow-500 group-hover:translate-x-1 transition pt-2">
              <span>Masuk ke Panel Admin</span>
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </div>
          </Link>

          {/* Member Portal Card */}
          <Link 
            href="/member/dashboard" 
            className="bg-slate-900 border border-slate-800 hover:border-yellow-500/50 p-6 rounded-2xl transition group flex flex-col justify-between space-y-4 shadow-xl"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 bg-yellow-500/10 text-yellow-500 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition">
                <i className="fa-solid fa-user"></i>
              </div>
              <h2 className="text-xl font-bold text-slate-100">Panel Member</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cek sisa masa aktif membership, gunakan QR code untuk absen mandiri, tinjau riwayat kunjungan, dan perpanjang paket.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-yellow-500 group-hover:translate-x-1 transition pt-2">
              <span>Masuk ke Panel Member</span>
              <i className="fa-solid fa-arrow-right ml-2"></i>
            </div>
          </Link>

        </div>

        {/* FOOTER TECH STACK INFO */}
        <div className="text-xs text-slate-500 pt-8 border-t border-slate-900">
          Next.js App Router • Tailwind CSS • Prisma ORM • MySQL
        </div>

      </div>
    </main>
  );
}