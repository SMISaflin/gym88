"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function MemberAttendancePage() {
  const { showToast } = useToast();

  // State Data Member Dinamis
  const [memberInfo, setMemberInfo] = useState({
    name: "Memuat Nama...",
    memberCode: "GYM88-0000",
    phone: "-",
    email: "-",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkInResult, setCheckInResult] = useState<any>(null);

  const [stats, setStats] = useState({
    monthlyAttendance: 0,
    daysInMonth: 30,
  });

  // 1. Load Data Profil & Statistik Absensi dari Database
  useEffect(() => {
    async function loadMemberData() {
      let targetCode = "GYM88-0012";
      let targetEmail = "";

      const saved = localStorage.getItem("gym88_member_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.nim) targetCode = `GYM88-${parsed.nim}`;
          if (parsed.email) targetEmail = parsed.email;
        } catch (e) {
          console.error("Gagal memparsing localStorage:", e);
        }
      }

      try {
        const query = targetEmail ? `email=${targetEmail}` : `memberCode=${targetCode}`;
        const res = await fetch(`/api/member/profile?${query}`);
        const json = await res.json();

        if (json.success && json.data) {
          setMemberInfo(json.data);
          fetchAttendanceStats(json.data.memberCode);
        } else {
          setMemberInfo({
            name: "Ahmad Fauzi",
            memberCode: "GYM88-0012",
            phone: "081234567890",
            email: "ahmad.fauzi@gmail.com",
          });
          fetchAttendanceStats("GYM88-0012");
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      }
    }

    loadMemberData();
  }, []);

  // Fetch Statistik Absensi
  const fetchAttendanceStats = async (code: string) => {
    try {
      const res = await fetch(`/api/member/attendance/stats?memberCode=${code}`);
      const json = await res.json();
      if (json.success) {
        setStats({
          monthlyAttendance: json.data.monthlyAttendance,
          daysInMonth: json.data.daysInMonth,
        });
      }
    } catch (error) {
      console.error("Gagal mengambil statistik absensi:", error);
    }
  };

  // 2. Kirim Absensi Mandiri (Check-in Biasa)
  const handleCheckIn = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/member/attendance/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberCode: memberInfo.memberCode,
        }),
      });

      const json = await res.json();

      if (json.success) {
        showToast(json.message, "success");
        setCheckInResult(json.data);
        fetchAttendanceStats(memberInfo.memberCode);
      } else {
        showToast(json.message, "error");
      }
    } catch (error) {
      showToast("Gagal terhubung ke server presensi.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetCheckIn = () => {
    setCheckInResult(null);
  };

  return (
    <div className="space-y-6 w-full pb-10 text-xs text-slate-700 font-sans">
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Presensi Member Gym 88
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Absen Kehadiran Latihan 📋</h1>
          <p className="text-blue-100 text-xs md:text-sm">
            Catat kehadiran sesi latihan Anda hari ini langsung melalui tombol di bawah ini.
          </p>
        </div>
        <Link 
          href="/member/history"
          className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 py-2.5 rounded-2xl text-xs transition border border-white/20 backdrop-blur-md flex items-center space-x-2"
        >
          <i className="fa-solid fa-clock-rotate-left"></i>
          <span>Lihat Riwayat Log</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Panel Check-in Utama */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xs flex flex-col items-center justify-center space-y-6 text-center">
          
          {/* Ringkasan Data Member yang Sedang Login */}
          <div className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Nama Lengkap</span>
              <strong className="text-slate-900 text-xs truncate block">{memberInfo.name}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Member Code</span>
              <strong className="text-blue-600 font-mono text-xs">{memberInfo.memberCode}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">No. WhatsApp</span>
              <strong className="text-slate-900 font-mono text-xs">{memberInfo.phone}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Email</span>
              <strong className="text-slate-900 text-xs truncate block">{memberInfo.email}</strong>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-bold inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span>
              <span>AKUN SIAP ABSEN</span>
            </span>
            <h2 className="text-lg font-black text-slate-900">Konfirmasi Kehadiran Gym 88</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              Pastikan Anda sudah berada di lokasi Gym 88 sebelum mencatat kehadiran latihan Anda.
            </p>
          </div>

          {/* Area Tombol Check-in Biasa */}
          <div className="w-full max-w-sm mx-auto space-y-4">
            {checkInResult ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-xs">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-black text-slate-900">Absensi Berhasil Tercatat!</h3>
                  <p className="text-slate-600 font-medium">{checkInResult.memberName}</p>
                  <p className="text-slate-500 text-[11px]">
                    Jam Masuk: <strong className="text-slate-900">{checkInResult.checkInTime} WIB</strong>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleResetCheckIn}
                    className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold py-2.5 rounded-xl transition cursor-pointer"
                  >
                    Tutup
                  </button>
                  <Link
                    href="/member/dashboard"
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 rounded-xl transition text-center flex items-center justify-center"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={handleCheckIn}
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 px-6 rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center space-x-2 text-sm cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Menyimpan ke Database...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check-to-slot text-base"></i>
                      <span>Check-In Sekarang (Absen)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Kolom Kanan: Statistik & Petunjuk */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Status Presensi Bulan Ini</span>
              <i className="fa-solid fa-chart-pie text-blue-500"></i>
            </h3>

            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-emerald-700 font-bold block">Status Sesi Aktif</span>
                  <span className="text-xl font-black text-emerald-600">{stats.monthlyAttendance} Hari</span>
                </div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-lg font-black">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-blue-700 font-bold block">Total Kehadiran</span>
                  <span className="text-xl font-black text-blue-900">{stats.monthlyAttendance} / {stats.daysInMonth} Hari</span>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-lg font-black">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Petunjuk Presensi Member</span>
              <i className="fa-solid fa-circle-question text-slate-400"></i>
            </h3>

            <ol className="space-y-3 text-slate-600 list-decimal pl-4 leading-relaxed">
              <li>
                Pastikan Anda telah login menggunakan akun member Gym 88 Anda.
              </li>
              <li>
                Kunjungi halaman menu <strong>Absen Kehadiran</strong> saat tiba di lokasi gym.
              </li>
              <li>
                Tekan tombol <strong>Check-In Sekarang</strong> untuk mencatat kehadiran ke database secara otomatis.
              </li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
}