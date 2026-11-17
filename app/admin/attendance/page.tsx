"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface AttendanceRecord {
  id: string;
  memberName: string;
  memberCode: string;
  date: string;
  checkInTime: string;
  status: string;
  notes: string;
}

interface MemberSummary {
  id: string;
  name: string;
  memberCode: string;
  phone: string;
  totalPresent: number;
  joinedDate: string;
  absentDays: string[];
}

export default function AdminAttendancePage() {
  const { showToast } = useToast();

  // Inisialisasi state filter bulan & tahun secara aman di client
  const [selectedMonth, setSelectedMonth] = useState<string>("10");
  const [selectedYear, setSelectedYear] = useState<string>("2026");

  const [todayLogs, setTodayLogs] = useState<AttendanceRecord[]>([]);
  const [membersSummary, setMembersSummary] = useState<MemberSummary[]>([]);
  const [loading, setLoading] = useState(true);

  // Set tanggal waktu saat ini secara aman saat komponen dimuat
  useEffect(() => {
    const now = new Date();
    setSelectedYear(now.getFullYear().toString());
    setSelectedMonth((now.getMonth() + 1).toString().padStart(2, "0"));
  }, []);

  // Ambil data rekapitulasi presensi dari API Admin berdasarkan bulan & tahun yang dipilih
  const fetchAttendanceData = async () => {
    if (!selectedMonth || !selectedYear) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/admin/attendance?month=${selectedMonth}&year=${selectedYear}`);
      const json = await res.json();

      if (json.success) {
        setTodayLogs(json.data.todayLogs || []);
        setMembersSummary(json.data.membersSummary || []);
      } else {
        showToast("Gagal memuat rekapitulasi presensi.", "error");
      }
    } catch (error) {
      showToast("Kesalahan koneksi ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedYear]);

  // Daftar pilihan bulan
  const monthsList = [
    { value: "01", label: "Januari" },
    { value: "02", label: "Februari" },
    { value: "03", label: "Maret" },
    { value: "04", label: "April" },
    { value: "05", label: "Mei" },
    { value: "06", label: "Juni" },
    { value: "07", label: "Juli" },
    { value: "08", label: "Agustus" },
    { value: "09", label: "September" },
    { value: "10", label: "Oktober" },
    { value: "11", label: "November" },
    { value: "12", label: "Desember" },
  ];

  // Daftar pilihan tahun
  const yearsList = ["2024", "2025", "2026", "2027"];

  // Hitung Statistik & Progress Bulanan
  const totalRegisteredMembers = membersSummary.length;
  const totalSesiLatihanBulanIni = membersSummary.reduce((acc, m) => acc + m.totalPresent, 0);
  
  // Asumsi rata-rata target ideal kehadiran (misal 15 sesi per member dalam sebulan)
  const targetIdealSesi = totalRegisteredMembers * 15 || 1;
  const progressPersentase = Math.min(Math.round((totalSesiLatihanBulanIni / targetIdealSesi) * 100), 100);

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Header Page & Filter Periode Bulan / Tahun */}
      <div className="border-b border-blue-400 pb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-black text-blue-600">Rekapitulasi Presensi & Kehadiran Member</h2>
          <p className="text-slate-500 text-[11px]">Monitoring aktivitas latihan harian, total absensi bulanan, dan data hari alpa.</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Dropdown Bulan */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
          >
            {monthsList.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>

          {/* Dropdown Tahun */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-blue-600 cursor-pointer shadow-xs"
          >
            {yearsList.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600 ml-2">
            <i className="fa-solid fa-house mr-1"></i> Dashboard
          </Link>
        </div>
      </div>

      {/* Grid 2 Kolom Utama (2/3 Kiri & 1/3 Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (2/3): Tabel Presensi Hari Ini & Total Absensi Bulanan */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Presensi Hari Ini */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-black text-slate-900">Member yang Absen Hari Ini</h3>
                <p className="text-[11px] text-slate-500">Daftar member yang berhasil check-in hari ini.</p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full font-bold text-[10px]">
                <i className="fa-solid fa-circle text-[8px] mr-1.5 animate-pulse text-emerald-500"></i>
                {todayLogs.length} Member Hadir
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase text-[10px] font-black">
                    <th className="p-3">No</th>
                    <th className="p-3">Kode Member</th>
                    <th className="p-3">Nama Member</th>
                    <th className="p-3">Jam Check-In</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        <i className="fa-solid fa-spinner animate-spin text-lg text-blue-600 mr-2"></i> Memuat data...
                      </td>
                    </tr>
                  ) : todayLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        Belum ada member yang melakukan absensi hari ini.
                      </td>
                    </tr>
                  ) : (
                    todayLogs.map((log, idx) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                        <td className="p-3 font-mono font-bold text-blue-600">{log.memberCode}</td>
                        <td className="p-3 font-bold text-slate-900">{log.memberName}</td>
                        <td className="p-3 font-mono font-bold text-slate-700">{log.checkInTime} WIB</td>
                        <td className="p-3">
                          <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 2: Ringkasan Total Absensi Bulanan Member */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-black text-slate-900">Total Absensi Bulanan Member</h3>
                <p className="text-[11px] text-slate-500">
                  Rekap untuk periode: <strong className="text-blue-600">{monthsList.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase text-[10px] font-black">
                    <th className="p-3">Kode</th>
                    <th className="p-3">Nama Member</th>
                    <th className="p-3">No. HP</th>
                    <th className="p-3 text-center">Total Hadir</th>
                    <th className="p-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        <i className="fa-solid fa-spinner animate-spin text-lg text-blue-600 mr-2"></i> Memuat rekapitulasi...
                      </td>
                    </tr>
                  ) : membersSummary.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-400">
                        Belum ada data member terdaftar di database.
                      </td>
                    </tr>
                  ) : (
                    membersSummary.map((m) => (
                      <tr key={m.id} className="hover:bg-slate-50 transition">
                        <td className="p-3 font-mono font-bold text-blue-600">{m.memberCode}</td>
                        <td className="p-3 font-bold text-slate-900">{m.name}</td>
                        <td className="p-3 text-slate-600">{m.phone}</td>
                        <td className="p-3 text-center">
                          <span className="bg-blue-100 text-blue-800 font-black px-3 py-1 rounded-full text-[11px]">
                            {m.totalPresent} Hari
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <Link
                            href={`/admin/attendance/${m.id}?month=${selectedMonth}&year=${selectedYear}`}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-[10px] transition inline-flex items-center space-x-1 shadow-xs cursor-pointer"
                          >
                            <i className="fa-solid fa-eye"></i>
                            <span>Cek Detail</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* KOLOM KANAN (1/3): Widget Progress & Statistik Kehadiran Bulanan */}
        <div className="space-y-6">
          
          {/* Card 1: Progress Kehadiran Bulanan */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Progress Kehadiran Bulanan</span>
              <i className="fa-solid fa-chart-line text-blue-500"></i>
            </h3>

            <div className="space-y-4">
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-slate-700 font-bold">
                  <span>Target Aktivitas Gym</span>
                  <span className="text-blue-600">{progressPersentase}%</span>
                </div>
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPersentase}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-slate-500 pt-1">
                  Akumulasi total sesi latihan seluruh member pada periode <strong className="text-slate-800">{monthsList.find(m => m.value === selectedMonth)?.label} {selectedYear}</strong>.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Member</span>
                  <span className="text-base font-black text-slate-900">{totalRegisteredMembers} Orang</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Sesi Latihan</span>
                  <span className="text-base font-black text-blue-600">{totalSesiLatihanBulanIni} Sesi</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Aksi Administratif Cepat */}
          {/* <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Aksi Administratif</span>
              <i className="fa-solid fa-bolt text-amber-500"></i>
            </h3> */}

            {/* <div className="space-y-2.5">
              <button 
                onClick={() => alert("Fitur unduh laporan rekapitulasi sedang disiapkan.")}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-2xl transition flex items-center justify-center space-x-2 cursor-pointer text-xs"
              >
                <i className="fa-solid fa-file-arrow-down text-emerald-400"></i>
                <span>Unduh Laporan Bulan Ini</span>
              </button>
            </div> */}
          {/* </div> */}

        </div>

      </div>
    </div>
  );
}