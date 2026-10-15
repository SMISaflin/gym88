"use client";

import { useState } from "react";

// Data dummy untuk grafik tren mingguan (Durasi latihan dalam menit)
const weeklyTrendData = [
  { day: "Sen", duration: 60, visits: 1, status: "Hadir", date: "02 Feb" },
  { day: "Sel", duration: 75, visits: 1, status: "Hadir", date: "03 Feb" },
  { day: "Rab", duration: 0, visits: 0, status: "Absen", date: "04 Feb" },
  { day: "Kam", duration: 90, visits: 1, status: "Hadir", date: "05 Feb" },
  { day: "Jum", duration: 45, visits: 1, status: "Hadir", date: "06 Feb", isToday: true },
  { day: "Sab", duration: 0, visits: 0, status: "Rencana", date: "07 Feb" },
  { day: "Min", duration: 0, visits: 0, status: "Rencana", date: "08 Feb" },
];

const monthlyMilestones = [
  { week: "Minggu ke-1", total: 4, target: 5, percentage: 80 },
  { week: "Minggu ke-2", total: 5, target: 5, percentage: 100 },
  { week: "Minggu ke-3", total: 5, target: 5, percentage: 100 },
  { week: "Minggu ke-4", total: 4, target: 5, percentage: 80 },
];

export default function MemberDashboardPage() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  const [activePoint, setActivePoint] = useState(weeklyTrendData[4]); // Default Jumat

  return (
    <div className="space-y-4 md:space-y-6 text-xs text-slate-800 w-full pb-10">
      {/* Header Member Responsif */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">Halo, Ahmad Fauzi 👋</h1>
          <p className="text-[11px] md:text-xs text-slate-500">Semangat terus untuk hidup lebih sehat!</p>
        </div>
        <div className="bg-white border border-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold">AF</div>
          <span className="text-slate-800">Ahmad Fauzi</span>
        </div>
      </div>

      {/* Grid Kartu Informasi Member */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Status Keaktifan</div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-base md:text-lg font-black text-emerald-600">Aktif</span>
          </div>
          <span className="text-[10px] text-slate-400 block">(Berdasarkan kehadiran 22 hari terakhir)</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="text-xs text-slate-500 font-bold">Target Mingguan</div>
          <div className="text-base md:text-lg font-black text-slate-900">4 / 7 hari</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 w-[60%] h-full rounded-full"></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-2xl space-y-2 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-500 font-bold">Kehadiran Bulan Ini</div>
          <div className="text-base md:text-lg font-black text-slate-900">18 / 20 hari</div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
            <span>90% Konsisten</span>
            <span>🟢</span>
          </span>
        </div>
      </div>

      {/* GRAFIK KEHADIRAN ALTERNATIF (SVG LINE & TREND CHART) */}
      <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-3xl shadow-xs space-y-6">
        {/* Header Grafik & Control Switcher */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-chart-line text-blue-600"></i>
              <span>Statistik Tren Durasi Latihan</span>
            </h3>
            <p className="text-[11px] md:text-xs text-slate-500">Visualisasi performa waktu latihan fisik Anda.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setChartView("weekly")}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                chartView === "weekly" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tren Mingguan
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                chartView === "monthly" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Target Bulanan
            </button>
          </div>
        </div>

        {/* Tampilan Tren Mingguan (SVG Line & Area Style) */}
        {chartView === "weekly" ? (
          <div className="space-y-6">
            {/* SVG Line Graphic Container */}
            <div className="relative bg-gradient-to-b from-blue-50/50 to-transparent p-4 rounded-2xl border border-blue-100/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-full">
                  Durasi Latihan (Menit)
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Ketuk titik grafik untuk detail</span>
              </div>

              {/* Garis Grafik & Titik Interaktif */}
              <div className="grid grid-cols-7 gap-2 items-end pt-6 pb-2 h-36 md:h-44">
                {weeklyTrendData.map((item, idx) => {
                  const isActive = activePoint.day === item.day;
                  // Hitung tinggi proporsional dari 90 menit maks
                  const heightPercent = Math.max(15, (item.duration / 90) * 100);

                  return (
                    <div
                      key={idx}
                      onClick={() => setActivePoint(item)}
                      className="flex flex-col items-center cursor-pointer group h-full justify-end relative"
                    >
                      {/* Nilai Menit di atas titik */}
                      <div className={`text-[10px] font-bold mb-2 transition ${isActive ? "text-blue-600 font-extrabold scale-110" : "text-slate-400"}`}>
                        {item.duration}m
                      </div>

                      {/* Pilar Garis & Titik Indikator */}
                      <div className="w-full flex justify-center items-end h-28">
                        <div className="relative w-1.5 bg-blue-200 rounded-full h-full flex items-end">
                          <div
                            className={`w-full rounded-full transition-all duration-300 ${
                              item.duration > 0 ? "bg-blue-600" : "bg-slate-300"
                            }`}
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                          {/* Titik Lingkaran */}
                          <div
                            className={`absolute -left-1.5 w-4 h-4 rounded-full border-2 transition-all ${
                              isActive
                                ? "bg-blue-600 border-white ring-4 ring-blue-600/30 scale-125"
                                : item.duration > 0
                                ? "bg-white border-blue-600"
                                : "bg-white border-slate-300"
                            }`}
                            style={{ bottom: `calc(${heightPercent}% - 8px)` }}
                          ></div>
                        </div>
                      </div>

                      {/* Label Hari */}
                      <span className={`text-xs mt-3 font-bold transition ${item.isToday ? "text-blue-600" : "text-slate-600"}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detail Informasi Hari yang Dipilih */}
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-base ${activePoint.duration > 0 ? "bg-blue-100 text-blue-600" : "bg-slate-200 text-slate-500"}`}>
                  <i className={`fa-solid ${activePoint.duration > 0 ? "fa-bolt" : "fa-bed"}`}></i>
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-xs sm:text-sm">
                    Hari {activePoint.day} ({activePoint.date}) - Status: <span className="text-blue-600">{activePoint.status}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    Total waktu latihan fisik: <strong className="text-slate-800">{activePoint.duration} Menit</strong>
                  </div>
                </div>
              </div>

              <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${activePoint.duration > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                {activePoint.duration > 0 ? "✓ Sesi Selesai" : "Hari Istirahat"}
              </span>
            </div>
          </div>
        ) : (
          /* Tampilan Milestone Target Bulanan */
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monthlyMilestones.map((m, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200/80 p-4 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-900">{m.week}</span>
                    <span className="font-bold text-blue-600">{m.total} / {m.target} Hari</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${m.percentage}%` }}></div>
                  </div>
                  <div className="text-[10px] text-slate-400 text-right">{m.percentage}% Tercapai</div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl text-blue-900 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <strong>Akumulasi Bulan Ini:</strong> 18 Hari Kehadiran dari Target 20 Hari.
              </div>
              <span className="font-black text-blue-600 text-sm">90% Sangat Baik</span>
            </div>
          </div>
        )}
      </div>

      {/* Motivational Banner */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-2xl flex justify-between items-center shadow-xs">
        <div className="space-y-1">
          <h3 className="text-sm md:text-base font-black text-slate-900">
            Jaga konsistensi, karena hasil besar datang dari kebiasaan kecil yang rutin.
          </h3>
          <p className="text-xs text-slate-500">Gym 88 Stronger Together</p>
        </div>
      </div>
    </div>
  );
}