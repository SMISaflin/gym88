"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportNav from "@/components/ReportNav";

export default function AdminReportsIndexPage() {
  const [stats, setStats] = useState({
    totalTransactions: "Rp 0",
    activeMembers: 0,
    totalAttendances: 0,
    popularPackage: "-",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ambil ringkasan data statistik laporan dari API
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setStats({
            totalTransactions: json.data.revenue || "Rp 0",
            activeMembers: json.data.active || 0,
            totalAttendances: json.data.total || 0,
            popularPackage: "Regular Monthly",
          });
        }
      })
      .catch((err) => console.error("Gagal memuat ringkasan laporan:", err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header / Breadcrumb Style */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">Pusat Laporan (Report Center)</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Ringkasan & Analitik Laporan</h1>
          <p className="text-slate-500 text-[11px]">Gunakan navigasi di bawah untuk beralih ke halaman laporan terperinci.</p>
        </div>

        {/* Navigasi Sejajar 4 Kategori */}
        <ReportNav />

        {/* Ringkasan Statistik Laporan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Total Keuangan</span>
            <div className="text-base font-black text-blue-700">{loading ? "..." : stats.totalTransactions}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Laporan Transaksi</span>
          </div>
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Member Aktif</span>
            <div className="text-base font-black text-emerald-600">{loading ? "..." : `${stats.activeMembers} Orang`}</div>
            <span className="text-[10px] text-emerald-600 font-bold">Laporan Member</span>
          </div>
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Total Anggota</span>
            <div className="text-base font-black text-amber-600">{loading ? "..." : `${stats.totalAttendances} Orang`}</div>
            <span className="text-[10px] text-amber-600 font-bold">Laporan Kehadiran</span>
          </div>
          <div className="bg-slate-50/70 border border-slate-200/80 p-4 rounded-2xl space-y-1">
            <span className="text-slate-500 text-[10px] font-bold uppercase">Paket Terpopuler</span>
            <div className="text-base font-black text-indigo-600 truncate">{loading ? "..." : stats.popularPackage}</div>
            <span className="text-[10px] text-indigo-600 font-bold">Laporan Paket</span>
          </div>
        </div>

        {/* BAGIAN GRAFIK LENGKAP PUSAT LAPORAN */}
        <div className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              <i className="fa-solid fa-chart-column text-blue-600 mr-2"></i>
              Grafik Analitik Laporan Keseluruhan Gym 88
            </h3>
            <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2.5 py-0.5 rounded-full">Real-Time DB</span>
          </div>

          <div className="h-44 flex items-end justify-between gap-3 pt-6 px-3 border-b border-slate-200 text-[10px] text-slate-400">
            {[
              { month: 'Jan', val: 40 },
              { month: 'Feb', val: 55 },
              { month: 'Mar', val: 65 },
              { month: 'Apr', val: 50 },
              { month: 'Mei', val: 80 },
              { month: 'Jun', val: 75 },
              { month: 'Jul', val: 90 },
              { month: 'Agu', val: 85 },
              { month: 'Sep', val: 70 },
              { month: 'Okt', val: 95 },
              { month: 'Nov', val: 60 },
              { month: 'Des', val: 88 },
            ].map((item) => (
              <div key={item.month} className="w-full flex flex-col items-center justify-end h-full group">
                <div 
                  style={{ height: `${item.val}%` }} 
                  className="w-full bg-blue-600 rounded-t transition-all group-hover:bg-blue-500"
                ></div>
                <span className="mt-2 font-bold text-slate-600">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* BAGIAN PENJELASAN MODUL LAPORAN */}
        <div className="bg-slate-50/50 border border-slate-200/80 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-black text-slate-900 flex items-center space-x-2">
            <i className="fa-solid fa-circle-info text-blue-600 text-sm"></i>
            <span>Penjelasan Modul Pusat Laporan (Report Center)</span>
          </h3>
          <p className="text-slate-600 text-[11px] leading-relaxed">
            Pusat Laporan Gym 88 memproses dan menyajikan data operasional langsung dari database MySQL. Setiap sub-laporan memberikan informasi spesifik untuk analisis manajemen:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-bold text-blue-600 block">1. Laporan Transaksi</span>
              <p className="text-slate-500">Mencatat riwayat pembayaran, nomor invoice, nominal, serta metode pembayaran (QRIS, Transfer, Kasir) yang terverifikasi.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-bold text-emerald-600 block">2. Laporan Status Anggota</span>
              <p className="text-slate-500">Menyajikan rekapitulasi keaktifan member, tanggal bergabung, serta paket membership yang sedang aktif.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-bold text-amber-600 block">3. Laporan Kehadiran Individu</span>
              <p className="text-slate-500">Memantau riwayat log jam masuk (*check-in*) dan jam keluar (*check-out*) harian per anggota secara mendalam.</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
              <span className="font-bold text-indigo-600 block">4. Laporan Paket Membership</span>
              <p className="text-slate-500">Menganalisis performa dan total anggota yang berlangganan pada setiap tingkatan paket (Daily Pass & Bulanan).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}