"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MemberAttendancePage() {
  const [memberId] = useState("GYM88-0012");
  const [countdown, setCountdown] = useState(30);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Timer refresh otomatis QR Code setiap 30 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setCountdown(30);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  return (
    <div className="space-y-6 w-full pb-10 text-xs">
      {/* Top Banner / Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Presensi Member Gym 88
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Absen Kehadiran 📱</h1>
          <p className="text-blue-100 text-xs md:text-sm">
            Tunjukkan atau scan QR Code Anda pada pemindai resepsionis untuk mencatat presensi latihan hari ini.
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

      {/* Main Full-Width Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Left (1 & 2): Kartu QR Code Utama */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm flex flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2">
            <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full font-bold inline-flex items-center">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse mr-1.5"></span>
              <span>QR CODE AKTIF SEKARANG</span>
            </span>
            <h2 className="text-lg font-black text-slate-900">Digital Member Pass</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              QR Code di bawah diperbarui secara otomatis secara berkala untuk menjaga keamanan data keanggotaan Anda.
            </p>
          </div>

          {/* QR Code Container Box */}
          <div className="relative group">
            <div className={`w-52 h-52 md:w-60 md:h-60 bg-slate-50 border-2 border-dashed border-blue-200 rounded-3xl p-6 flex flex-col items-center justify-center shadow-inner transition transform group-hover:scale-105 ${isRefreshing ? "opacity-50" : "opacity-100"}`}>
              <i className="fa-solid fa-qrcode text-8xl md:text-9xl text-blue-600 drop-shadow-sm"></i>
            </div>
            {isRefreshing && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-xs rounded-3xl">
                <i className="fa-solid fa-arrows-rotate text-3xl text-blue-600 animate-spin"></i>
              </div>
            )}
          </div>

          {/* Member ID Badge */}
          <div className="space-y-2">
            <div className="font-mono text-base font-black text-slate-900 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-xl inline-block tracking-wider">
              {memberId}
            </div>
            <p className="text-[11px] text-slate-400">
              Diperbarui otomatis dalam <strong className="text-blue-600">{countdown} detik</strong>
            </p>
          </div>

          {/* Refresh Action Button */}
          <button 
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2"
          >
            <i className={`fa-solid fa-arrows-rotate ${isRefreshing ? "animate-spin" : ""}`}></i>
            <span>Refresh QR Code</span>
          </button>
        </div>

        {/* Kolom Right (3): Widget Statistik & Petunjuk Presensi */}
        <div className="space-y-6">
          {/* Card Ringkasan Statistik */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Status Presensi Bulan Ini</span>
              <i className="fa-solid fa-chart-pie text-blue-500"></i>
            </h3>

            <div className="space-y-3">
              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-emerald-700 font-bold block">Status Sesi Aktif</span>
                  <span className="text-xl font-black text-emerald-600">22 Hari</span>
                </div>
                <div className="w-10 h-10 bg-emerald-100 text-emerald-700 rounded-xl flex items-center justify-center text-lg font-black">
                  <i className="fa-solid fa-circle-check"></i>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-4 rounded-2xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[11px] text-blue-700 font-bold block">Total Kehadiran</span>
                  <span className="text-xl font-black text-blue-900">22 / 30 Hari</span>
                </div>
                <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center text-lg font-black">
                  <i className="fa-solid fa-calendar-check"></i>
                </div>
              </div>
            </div>
          </div>

          {/* Card Petunjuk Cara Absen */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Petunjuk Presensi</span>
              <i className="fa-solid fa-circle-question text-slate-400"></i>
            </h3>

            <ol className="space-y-3 text-slate-600 list-decimal pl-4 leading-relaxed">
              <li>
                Buka halaman <strong>Absen Kehadiran</strong> ini saat tiba di area Gym 88.
              </li>
              <li>
                Arahkan layar ponsel berisi <strong>QR Code</strong> ke mesin pemindai di meja resepsionis.
              </li>
              <li>
                Tunggu bunyi bip verifikasi hingga lampu status berubah hijau.
              </li>
              <li>
                Sistem akan mencatat log kehadiran jam masuk secara otomatis.
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}