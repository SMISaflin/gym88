"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportNav from "@/components/ReportNav";
import ReportExportToolbar from "@/components/ReportExportToolbar";
import { useToast } from "@/components/ToastProvider";

export default function ReportMembersPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/admin/reports?type=members")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else showToast("Gagal memuat data member", "error");
      })
      .catch(() => showToast("Kesalahan server", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Filter data berdasarkan status yang dipilih
  const filteredData = data.filter(m => {
    if (statusFilter === "ALL") return true;
    return m.status === statusFilter;
  });

  const totalMembers = data.length;
  const activeCount = data.filter(m => m.status === 'Aktif').length;
  const inactiveCount = data.filter(m => m.status === 'Tidak Aktif').length;

  // Hitung persentase untuk sudut conic-gradient Donut Chart (berdasarkan data keseluruhan)
  const activePercentage = totalMembers > 0 ? Math.round((activeCount / totalMembers) * 100) : 0;
  const inactivePercentage = 100 - activePercentage;

  // CSS Conic Gradient untuk Donut Chart
  const conicGradientStyle = {
    background: totalMembers > 0 
      ? `conic-gradient(#10b981 0% ${activePercentage}%, #f43f5e ${activePercentage}% 100%)`
      : `#e2e8f0 0% 100%`,
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header / Breadcrumb Style */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-blue-600">Pusat Laporan (Report Center)</h2>
        <Link href="/admin/reports" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-arrow-left mr-1"></i> Kembali ke Menu Laporan
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Laporan Status Anggota</h1>
            <p className="text-slate-500 text-[11px]">Rekapitulasi lengkap data member aktif dan tidak aktif secara berkala.</p>
          </div>

          {/* Tombol Ekspor Excel & PDF (Menyesuaikan data hasil filter) */}
          <ReportExportToolbar data={filteredData} filename="Laporan_Member_Gym88" title="Laporan Status Anggota" />
        </div>

        {/* Navigasi Sejajar 4 Kategori (Disembunyikan saat Print PDF) */}
        <div className="print:hidden">
          <ReportNav />
        </div>

        {/* Toolbar Filter Berdasarkan Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden">
          <div>
            <h3 className="text-sm font-black text-slate-800">Filter Status Anggota</h3>
            <p className="text-[11px] text-slate-500">Pilih status untuk menyaring data pada tabel dan hasil ekspor.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Semua Status</option>
            <option value="Aktif">Aktif</option>
            <option value="Tidak Aktif">Tidak Aktif</option>
          </select>
        </div>

        {/* Tabel Data */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800">
              Daftar Status Member {statusFilter !== "ALL" ? `(Status: ${statusFilter})` : ""}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Menampilkan {filteredData.length} dari {data.length} data</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-black">
                  <th className="p-3.5">No</th>
                  <th className="p-3.5">Nama Member</th>
                  <th className="p-3.5">NIM / ID</th>
                  <th className="p-3.5">No. HP</th>
                  <th className="p-3.5">Gender</th>
                  <th className="p-3.5">Paket Aktif</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Gabung</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-400">Tidak ada data member dengan status ini.</td></tr>
                ) : (
                  filteredData.map((m, idx) => (
                    <tr key={m.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-slate-900">{m.name}</td>
                      <td className="p-3.5 font-mono">{m.nim}</td>
                      <td className="p-3.5">{m.phone}</td>
                      <td className="p-3.5">{m.gender}</td>
                      <td className="p-3.5 font-bold text-blue-600">{m.package}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${m.status === 'Aktif' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{m.joinedDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRAFIK DONAT & PENJELASAN LAPORAN */}
        <div className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl space-y-4 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              <i className="fa-solid fa-chart-pie text-blue-600 mr-2"></i>
              Grafik Analitik: Rasio Keaktifan Anggota (Donut Chart)
            </h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full">Live Data</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white p-6 rounded-2xl border border-slate-200">
            {/* Visual Donut Chart */}
            <div className="flex justify-center">
              <div 
                className="w-36 h-36 rounded-full flex items-center justify-center relative shadow-inner"
                style={conicGradientStyle}
              >
                {/* Lubang Tengah Donut */}
                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center text-center shadow-xs">
                  <span className="text-sm font-black text-slate-900">{totalMembers}</span>
                  <span className="text-[9px] text-slate-500 font-medium">Total Member</span>
                </div>
              </div>
            </div>

            {/* Keterangan Legenda & Detail */}
            <div className="space-y-3 md:col-span-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
                    <span className="font-bold text-slate-800">Member Aktif</span>
                  </div>
                  <div className="font-black text-emerald-700">{activeCount} Orang ({activePercentage}%)</div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-rose-50/60 border border-rose-100">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500 inline-block"></span>
                    <span className="font-bold text-slate-800">Member Tidak Aktif</span>
                  </div>
                  <div className="font-black text-rose-700">{inactiveCount} Orang ({inactivePercentage}%)</div>
                </div>
              </div>

              {/* Penjelasan Laporan */}
              <div className="pt-2 border-t border-slate-100 space-y-1">
                <h4 className="font-black text-slate-900 text-[11px]">Penjelasan Analisis Status Anggota:</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Grafik donat di atas merepresentasikan perbandingan proporsi antara anggota yang memiliki masa aktif (*membership*) valid dengan anggota yang masa berlakunya telah kedaluwarsa atau non-aktif. Data ini bersumber langsung dari tabel database MySQL untuk membantu pengelola gym mengevaluasi tingkat retensi (*retention rate*) member.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}