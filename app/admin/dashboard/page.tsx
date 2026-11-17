"use client";

import { useState, useEffect } from "react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    revenue: "Rp 0",
    activePercentage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [todayFormatted, setTodayFormatted] = useState("");

  useEffect(() => {
    const formatted = new Date().toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    setTodayFormatted(formatted);

    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStats(json.data);
        }
      })
      .catch((err) => console.error("Gagal memuat statistik:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 text-xs text-slate-700 font-sans">
      {/* Header Page */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Dashboard, Admin</h1>
          <p className="text-slate-500 text-[11px]">Ringkasan eksekutif operasional dan keuangan Gym 88.</p>
        </div>
        <div className="text-xs bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium shadow-2xs">
          <i className="fa-regular fa-calendar mr-2 text-blue-600"></i> {todayFormatted || "Memuat tanggal..."}
        </div>
      </div>

      {/* Grid Kartu Statistik (Member, Aktif, Tidak Aktif, Pendapatan) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard 
          title="Total Member" 
          value={loading ? "..." : stats.total.toString()} 
          badge="Terdaftar di database" 
          icon="fa-users" 
          color="text-blue-600" 
        />
        <StatCard 
          title="Member Aktif" 
          value={loading ? "..." : stats.active.toString()} 
          badge="Status Aktif" 
          icon="fa-circle-check" 
          color="text-emerald-600" 
        />
        <StatCard 
          title="Member Tidak Aktif" 
          value={loading ? "..." : stats.inactive.toString()} 
          badge="Status Kadaluarsa" 
          icon="fa-circle-xmark" 
          color="text-rose-600" 
        />
        <StatCard 
          title="Total Pendapatan" 
          value={loading ? "..." : stats.revenue} 
          badge="Transaksi Lunas" 
          icon="fa-wallet" 
          color="text-indigo-600" 
        />
      </div>

      {/* Grid Grafik & Rasio */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grafik Tren Pendapatan Bulanan */}
        <div className="md:col-span-2 bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-2xs">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Grafik Tren Pendapatan Bulanan</h3>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200/60">Tahun 2026</span>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 text-[10px] text-slate-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
              <div key={m} className="w-full flex flex-col items-center justify-end h-full group">
                <div 
                  style={{ height: `${25 + (i * 7) % 65}%` }} 
                  className="w-full bg-indigo-600 rounded-t transition-all group-hover:bg-indigo-500"
                  title={`Bulan ${m}`}
                ></div>
                <span className="mt-2 font-medium text-slate-600">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Status Keaktifan */}
        <div className="bg-white border border-slate-200/80 p-6 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-2xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 self-start">Rasio Keaktifan Member</h3>
          <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex flex-col items-center justify-center text-center shadow-inner">
            <span className="text-xl font-black text-slate-900">{loading ? "..." : `${stats.activePercentage}%`}</span>
            <span className="text-[9px] text-slate-500 font-medium">Aktif</span>
          </div>
          <div className="w-full space-y-1.5 text-[11px] font-medium pt-2">
            <div className="flex justify-between"><span className="text-emerald-600 font-bold">■ Aktif</span> <span className="text-slate-900 font-bold">{stats.active}</span></div>
            <div className="flex justify-between"><span className="text-rose-600 font-bold">■ Tidak Aktif</span> <span className="text-slate-900 font-bold">{stats.inactive}</span></div>
          </div>
        </div>
      </div>

      {/* Bagian Penjelasan Tentang Sistem */}
      <div className="bg-white border border-slate-200/80 p-6 rounded-3xl space-y-4 shadow-2xs">
        <div className="flex items-center space-x-3 pb-3 border-b border-slate-100">
          <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center text-base font-black">
            <i className="fa-solid fa-circle-info"></i>
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Tentang Sistem Manajemen Gym 88</h3>
            <p className="text-slate-500 text-[11px]">Arsitektur dan fungsionalitas utama aplikasi pusat kebugaran.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 leading-relaxed text-[11px]">
          <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-database text-blue-600"></i>
              <span>1. Database MySQL & Prisma 5</span>
            </h4>
            <p>Seluruh data operasional, mulai dari profil akun member, paket langganan, log kehadiran, hingga riwayat transaksi keuangan tersimpan aman secara terstruktur dan terelasi menggunakan Prisma ORM.</p>
          </div>

          <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-users-gear text-emerald-600"></i>
              <span>2. Manajemen Member & Paket</span>
            </h4>
            <p>Admin dapat mengelola data anggota secara dinamis (tambah, edit, hapus) serta mengatur master paket bulanan/harian yang terhubung langsung dengan masa aktif (*membership*) secara otomatis.</p>
          </div>

          <div className="space-y-1.5 bg-slate-50/60 p-4 rounded-2xl border border-slate-100">
            <h4 className="font-bold text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-receipt text-indigo-600"></i>
              <span>3. Sistem Transaksi & Keuangan</span>
            </h4>
            <p>Pencatatan pembayaran berlangganan melalui berbagai metode (QRIS, Transfer, Kasir) diverifikasi secara real-time untuk memperbarui status keuangan dan laporan dashboard admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, badge, icon, color }: { title: string; value: string; badge: string; icon: string; color: string }) {
  return (
    <div className="bg-white border border-slate-200/80 p-5 rounded-3xl space-y-2 shadow-2xs hover:shadow-md transition">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{title}</span>
        <div className={`w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center ${color}`}>
          <i className={`fa-solid ${icon} text-sm`}></i>
        </div>
      </div>
      <div className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{value}</div>
      <span className="text-[10px] text-emerald-600 font-bold block">{badge}</span>
    </div>
  );
}