"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportNav from "@/components/ReportNav";
import { useToast } from "@/components/ToastProvider";

export default function ReportPackagesPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/reports?type=packages")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else showToast("Gagal memuat data paket", "error");
      })
      .catch(() => showToast("Kesalahan server", "error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">Pusat Laporan (Report Center)</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Laporan Paket Membership</h1>
          <p className="text-slate-500 text-[11px]">Analisis statistik popularitas master paket harian dan bulanan gym.</p>
        </div>

        {/* Navigasi Sejajar 4 Kategori */}
        <ReportNav />

        {/* Tabel Data */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800">Statistik Penggunaan Paket</h3>
            <button onClick={() => window.print()} className="bg-slate-900 text-white font-bold px-3.5 py-2 rounded-xl">
              <i className="fa-solid fa-print mr-1"></i> Cetak
            </button>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-black">
                  <th className="p-3.5">No</th>
                  <th className="p-3.5">Nama Paket</th>
                  <th className="p-3.5">Tipe</th>
                  <th className="p-3.5">Harga</th>
                  <th className="p-3.5">Durasi</th>
                  <th className="p-3.5 text-center">Total Berlangganan</th>
                  <th className="p-3.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={7} className="p-8 text-center text-slate-400">Tidak ada data paket.</td></tr>
                ) : (
                  data.map((p, idx) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{p.title}</td>
                      <td className="p-3.5 font-semibold text-blue-600">{p.type}</td>
                      <td className="p-3.5 font-mono font-bold">{p.price}</td>
                      <td className="p-3.5">{p.durationDays}</td>
                      <td className="p-3.5 font-bold text-center">{p.totalSubscribers} Orang</td>
                      <td className="p-3.5"><span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full font-bold">{p.isActive}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRAFIK MASING-MASING LAPORAN */}
        <div className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">Grafik Analitik: Distribusi Peminat Paket Membership</h3>
          <div className="h-36 flex items-end justify-between gap-4 pt-4 px-4 border-b border-slate-200 text-[10px] text-slate-400">
            {data.map((p, i) => (
              <div key={p.id} className="w-full flex flex-col items-center justify-end h-full">
                <div style={{ height: `${Math.max(25, (p.totalSubscribers * 15))}%` }} className="w-full bg-indigo-600 rounded-t"></div>
                <span className="mt-2 font-bold text-slate-700 truncate max-w-[80px] text-center">{p.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}