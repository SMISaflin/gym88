"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportNav from "@/components/ReportNav";
import ReportExportToolbar from "@/components/ReportExportToolbar";
import { useToast } from "@/components/ToastProvider";

export default function ReportAttendancePage() {
  const { showToast } = useToast();
  const [memberList, setMemberList] = useState<any[]>([]);
  const [selectedMember, setSelectedMember] = useState("");
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/admin/reports?type=attendance")
      .then(res => res.json())
      .then(json => {
        if (json.success) {
          setMemberList(json.data.memberList);
          if (json.data.memberList.length > 0) {
            setSelectedMember(json.data.memberList[0].id);
            fetchRecords(json.data.memberList[0].id);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const fetchRecords = (memId: string) => {
    fetch(`/api/admin/reports?type=attendance&memberId=${memId}`)
      .then(res => res.json())
      .then(json => {
        if (json.success) setRecords(json.data.attendanceRecords);
      });
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedMember(e.target.value);
    fetchRecords(e.target.value);
  };

  // Filter data berdasarkan status kehadiran
  const filteredRecords = records.filter(a => {
    if (statusFilter === "ALL") return true;
    return a.status === statusFilter;
  });

  // Data sampel untuk Line Chart tren kunjungan per hari (Senin - Minggu)
  const linePoints = "0,110 100,85 200,95 300,50 400,65 500,30 600,75";
  const daysOfWeek = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

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
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Laporan Kehadiran Individu</h1>
            <p className="text-slate-500 text-[11px]">Periksa log check-in dan check-out kunjungan gym per anggota.</p>
          </div>

          {/* Tombol Ekspor Excel & PDF */}
          <ReportExportToolbar data={filteredRecords} filename="Laporan_Kehadiran_Gym88" title="Laporan Kehadiran Individu" />
        </div>

        {/* Navigasi Sejajar 4 Kategori (Disembunyikan saat Print PDF) */}
        <div className="print:hidden">
          <ReportNav />
        </div>

        {/* Filter Toolbar (Member & Status) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden">
          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Pilih Anggota</label>
            <select
              value={selectedMember}
              onChange={handleMemberChange}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-600"
            >
              {memberList.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.memberCode})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-700 block">Filter Status Kehadiran</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-600"
            >
              <option value="ALL">Semua Status</option>
              <option value="HADIR">HADIR</option>
              <option value="TIDAK_HADIR">TIDAK HADIR</option>
            </select>
          </div>
        </div>

        {/* Tabel Data */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800">
              Riwayat Kunjungan {statusFilter !== "ALL" ? `(Status: ${statusFilter})` : ""}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Menampilkan {filteredRecords.length} dari {records.length} data</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-black">
                  <th className="p-3.5">No</th>
                  <th className="p-3.5">Tanggal Kunjungan</th>
                  <th className="p-3.5">Waktu Check-In</th>
                  <th className="p-3.5">Waktu Check-Out</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Keterangan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : filteredRecords.length === 0 ? (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-400">Belum ada riwayat kehadiran dengan filter ini.</td></tr>
                ) : (
                  filteredRecords.map((a, idx) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-bold">{a.date}</td>
                      <td className="p-3.5 font-mono text-emerald-600"><i className="fa-solid fa-arrow-right-to-bracket mr-1"></i> {a.checkIn}</td>
                      <td className="p-3.5 font-mono text-rose-600"><i className="fa-solid fa-arrow-right-from-bracket mr-1"></i> {a.checkOut}</td>
                      <td className="p-3.5"><span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full font-bold">{a.status}</span></td>
                      <td className="p-3.5 text-slate-600">{a.notes}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* GRAFIK LINE CHART & PENJELASAN LAPORAN */}
        <div className="bg-slate-50/70 border border-slate-200/80 p-5 rounded-2xl space-y-4 print:hidden">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              <i className="fa-solid fa-chart-line text-amber-600 mr-2"></i>
              Grafik Analitik: Tren Frekuensi Kunjungan Mingguan (Line Chart)
            </h3>
            <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full">Statistik Kehadiran</span>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6">
            {/* SVG Line Chart Container */}
            <div className="relative w-full h-40 pt-2">
              <svg viewBox="0 0 600 150" className="w-full h-full overflow-visible">
                {/* Garis Grid Horizontal Latar Belakang */}
                <line x1="0" y1="30" x2="600" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="75" x2="600" y2="75" stroke="#f1f5f9" strokeWidth="1" />
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f1f5f9" strokeWidth="1" />

                {/* Garis Tren (Line Path) */}
                <polyline
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={linePoints}
                />

                {/* Titik Koordinat Data (Dots) */}
                {[
                  { cx: 0, cy: 110 },
                  { cx: 100, cy: 85 },
                  { cx: 200, cy: 95 },
                  { cx: 300, cy: 50 },
                  { cx: 400, cy: 65 },
                  { cx: 500, cy: 30 },
                  { cx: 600, cy: 75 },
                ].map((pt, i) => (
                  <circle
                    key={i}
                    cx={pt.cx}
                    cy={pt.cy}
                    r="5"
                    className="fill-white stroke-amber-600 stroke-[3px] transition-transform hover:scale-125 cursor-pointer"
                  />
                ))}
              </svg>
            </div>

            {/* Label Sumbu X (Hari) */}
            <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-500 pt-2 border-t border-slate-100">
              {daysOfWeek.map((day, idx) => (
                <span key={idx}>{day}</span>
              ))}
            </div>

            {/* Penjelasan Laporan Kehadiran */}
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <h4 className="font-black text-slate-900 text-[11px]">Penjelasan Analisis Kehadiran Anggota:</h4>
              <p className="text-slate-500 text-[11px] leading-relaxed">
                Grafik garis (*Line Chart*) di atas memvisualisasikan fluktuasi tingkat kunjungan atau aktivitas latihan anggota berdasarkan hari dalam satu pekan. Puncak kurva menunjukkan hari dengan intensitas kunjungan tertinggi (seperti hari Jumat atau akhir pekan), yang membantu pengelola Gym 88 dalam mengatur ketersediaan fasilitas dan penjadwalan pelatih secara optimal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}