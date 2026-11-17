"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface AttendanceRecord {
  id: string;
  date: string;
  checkInTime: string;
  checkOutTime: string;
  status: string;
  ket: string;
}

export default function MemberHistoryPage() {
  const { showToast } = useToast();
  
  const [historyList, setHistoryList] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua");

  // Ambil riwayat absensi dari database MySQL via API
  useEffect(() => {
    async function fetchHistoryData() {
      try {
        setLoading(true);
        let targetCode = "GYM88-0012";
        let targetEmail = "";

        const saved = localStorage.getItem("gym88_member_profile");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.nim) targetCode = `GYM88-${parsed.nim}`;
            if (parsed.email) targetEmail = parsed.email;
          } catch (e) {
            console.error("Gagal membaca localStorage:", e);
          }
        }

        const query = targetEmail ? `email=${targetEmail}` : `memberCode=${targetCode}`;
        const res = await fetch(`/api/member/history?${query}`);
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          setHistoryList(json.data);
        } else {
          setHistoryList([]);
        }
      } catch (error) {
        console.error("Gagal memuat riwayat absensi:", error);
        showToast("Gagal memuat riwayat dari database.", "error");
        setHistoryList([]);
      } finally {
        setLoading(false);
      }
    }

    fetchHistoryData();
  }, [showToast]);

  // Filter Data
  const filteredHistory = Array.isArray(historyList) ? historyList.filter((item) => {
    const matchesSearch = item.date.toLowerCase().includes(searchQuery.toLowerCase()) || item.ket.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "Semua" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) : [];

  // Hitung Ringkasan Statistik
  const totalHadir = Array.isArray(historyList) ? historyList.filter((h) => h.status === "Hadir" || h.status === "HADIR").length : 0;
  const totalTidakHadir = Array.isArray(historyList) ? historyList.filter((h) => h.status === "Tidak Hadir" || h.status === "ABSEN").length : 0;
  const totalSesi = historyList.length;
  const persentaseHadir = totalSesi > 0 ? Math.round((totalHadir / totalSesi) * 100) : 0;

  return (
    <div className="space-y-6 w-full pb-10 text-xs">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Log Aktivitas Gym 88
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Riwayat Kehadiran 🏋️‍♂️</h1>
          <p className="text-blue-100 text-xs md:text-sm">Dokumentasi lengkap log waktu masuk dan sesi latihan bulanan Anda dari database.</p>
        </div>
        <Link 
          href="/member/attendance"
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition border border-white/20 backdrop-blur-md flex items-center space-x-2"
        >
          <i className="fa-solid fa-check-to-slot"></i>
          <span>Absen Hari Ini</span>
        </Link>
      </div>

      {/* Ringkasan Statistik Cards (Grid 3 Kolom) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Total Sesi Latihan</span>
            <span className="text-2xl font-black text-slate-900">{totalHadir} Sesi</span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-dumbbell"></i>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Persentase Kehadiran</span>
            <span className="text-2xl font-black text-emerald-600">{persentaseHadir}%</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-chart-line"></i>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-slate-400 font-medium block">Tidak Hadir / Izin</span>
            <span className="text-2xl font-black text-rose-600">{totalTidakHadir} Sesi</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center text-xl font-black">
            <i className="fa-solid fa-user-xmark"></i>
          </div>
        </div>
      </div>

      {/* Container Main Table - Full Width */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        {/* Search & Filter Bar */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full md:w-80">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"></i>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tanggal atau keterangan..." 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition" 
            />
          </div>

          {/* Filter Status Buttons */}
          <div className="flex items-center space-x-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
            {["Semua", "Hadir", "Tidak Hadir"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-2xl font-bold transition whitespace-nowrap cursor-pointer ${
                  statusFilter === status
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Modern Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 bg-slate-50/50 uppercase text-[10px] tracking-wider font-extrabold">
                <th className="p-4 md:p-5">Tanggal</th>
                <th className="p-4 md:p-5">Jam Masuk</th>
                {/* <th className="p-4 md:p-5">Jam Keluar</th> */}
                <th className="p-4 md:p-5">Status</th>
                <th className="p-4 md:p-5">Keterangan Sesi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <i className="fa-solid fa-spinner animate-spin text-xl text-blue-600"></i>
                      <span>Memuat riwayat dari database MySQL...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredHistory.length > 0 ? (
                filteredHistory.map((h) => (
                  <tr key={h.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-4 md:p-5 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <i className="fa-solid fa-calendar-day text-blue-500"></i>
                        <span>{h.date}</span>
                      </div>
                    </td>
                    <td className="p-4 md:p-5 font-mono text-slate-600">{h.checkInTime}</td>
                    {/* <td className="p-4 md:p-5 font-mono text-slate-600">{h.checkOutTime}</td> */}
                    <td className="p-4 md:p-5">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                          h.status === "Hadir" || h.status === "HADIR"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-rose-50 text-rose-600 border border-rose-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full mr-1 ${h.status === "Hadir" || h.status === "HADIR" ? "bg-emerald-500" : "bg-rose-500"}`}></span>
                        <span>{h.status}</span>
                      </span>
                    </td>
                    <td className="p-4 md:p-5 text-slate-600 font-medium">{h.ket}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <i className="fa-solid fa-folder-open text-2xl text-slate-300"></i>
                      <span>Belum ada riwayat kehadiran tercatat di database.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer / Info */}
        <div className="p-4 md:p-5 border-t border-slate-100 bg-slate-50/30 text-slate-500 text-[11px] flex justify-between items-center">
          <span>Menampilkan {filteredHistory.length} entri log kehadiran</span>
          <span className="font-semibold text-slate-600">Gym 88 Attendance System</span>
        </div>
      </div>
    </div>
  );
}