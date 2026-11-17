"use client";

import { useState, useEffect } from "react";

export default function MemberDashboardPage() {
  const [chartView, setChartView] = useState<"weekly" | "monthly">("weekly");
  
  // State Data dari Database
  const [memberInfo, setMemberInfo] = useState({
    name: "Memuat...",
    memberCode: "GYM88-0000",
    phone: "-",
    email: "-",
    status: "ACTIVE",
  });

  const [stats, setStats] = useState({
    monthlyAttendance: 0,
    daysInMonth: 30,
  });

  const [weeklyTrendData, setWeeklyTrendData] = useState<any[]>([]);
  const [activePoint, setActivePoint] = useState<any>(null);

  // Ambil data lengkap dashboard dari API Database
  useEffect(() => {
    async function loadDashboardData() {
      let targetCode = "";
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

      try {
        const query = targetEmail ? `email=${targetEmail}` : targetCode ? `memberCode=${targetCode}` : "";
        const res = await fetch(`/api/member/dashboard?${query}`);
        const json = await res.json();

        if (json.success && json.data) {
          setMemberInfo(json.data.profile);
          setStats(json.data.stats);
          setWeeklyTrendData(json.data.weeklyTrend);
          
          // Set default titik aktif ke hari ini (index terakhir)
          if (json.data.weeklyTrend.length > 0) {
            const todayItem = json.data.weeklyTrend.find((item: any) => item.isToday) || json.data.weeklyTrend[json.data.weeklyTrend.length - 1];
            setActivePoint(todayItem);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data dashboard dari database:", error);
      }
    }

    loadDashboardData();
  }, []);

  // Inisial untuk avatar lingkaran
  const getInitials = (name: string) => {
    return name && name !== "Memuat..."
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()
      : "AF";
  };

  const attendancePercentage = Math.round((stats.monthlyAttendance / stats.daysInMonth) * 100) || 0;

  return (
    <div className="space-y-4 md:space-y-6 text-xs text-slate-800 w-full pb-10 font-sans">
      {/* Header Member Responsif */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-black tracking-tight text-slate-900">
            Halo, {memberInfo.name} 👋
          </h1>
          <p className="text-[11px] md:text-xs text-slate-500">Semangat terus untuk hidup lebih sehat di Gym 88!</p>
        </div>
        <div className="bg-white border border-slate-200 px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs">
          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-extrabold">
            {getInitials(memberInfo.name)}
          </div>
          <span className="text-slate-800 truncate max-w-[120px]">{memberInfo.name}</span>
        </div>
      </div>

      {/* Grid Kartu Informasi Member */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Status Keaktifan</div>
          <div className="flex items-center space-x-2">
            <span className={`w-2.5 h-2.5 rounded-full ${memberInfo.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}></span>
            <span className={`text-base md:text-lg font-black ${memberInfo.status === "ACTIVE" ? "text-emerald-600" : "text-amber-600"}`}>
              {memberInfo.status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}
            </span>
          </div>
          <span className="text-[10px] text-slate-400 block font-mono">ID: {memberInfo.memberCode}</span>
        </div>

        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-3xl space-y-2 shadow-xs">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Target Latihan</div>
          <div className="text-base md:text-lg font-black text-slate-900">{stats.monthlyAttendance} Sesi Tercatat</div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full rounded-full" style={{ width: `${Math.min(100, attendancePercentage)}%` }}></div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 md:p-5 rounded-3xl space-y-2 shadow-xs sm:col-span-2 lg:col-span-1">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Kehadiran Bulan Ini</div>
          <div className="text-base md:text-lg font-black text-slate-900">
            {stats.monthlyAttendance} / {stats.daysInMonth} Hari
          </div>
          <span className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
            <span>{attendancePercentage}% Konsisten</span>
            <span>🟢</span>
          </span>
        </div>
      </div>

      {/* GRAFIK KEHADIRAN & TREN LATIHAN */}
      <div className="bg-white border border-slate-200 p-4 md:p-6 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center space-x-2">
              <i className="fa-solid fa-chart-line text-blue-600"></i>
              <span>Statistik Tren Kehadiran 7 Hari Terakhir</span>
            </h3>
            <p className="text-[11px] md:text-xs text-slate-500">Data bersumber langsung dari log presensi database MySQL.</p>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setChartView("weekly")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                chartView === "weekly" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Tren 7 Hari
            </button>
            <button
              onClick={() => setChartView("monthly")}
              className={`flex-1 sm:flex-none px-4 py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
                chartView === "monthly" ? "bg-white text-blue-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Ringkasan Bulan Ini
            </button>
          </div>
        </div>

        {chartView === "weekly" ? (
          <div className="space-y-6">
            <div className="relative bg-gradient-to-b from-blue-50/50 to-transparent p-4 rounded-2xl border border-blue-100/60">
              <div className="flex justify-between items-center mb-4">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-100/80 px-3 py-1 rounded-full">
                  Aktivitas Latihan Harian
                </span>
                <span className="text-[11px] text-slate-400 font-medium">Ketuk grafik untuk melihat detail</span>
              </div>

              {weeklyTrendData.length === 0 ? (
                <div className="text-center py-10 text-slate-400">Memuat data grafik...</div>
              ) : (
                <div className="grid grid-cols-7 gap-2 items-end pt-6 pb-2 h-36 md:h-44">
                  {weeklyTrendData.map((item, idx) => {
                    const isActive = activePoint?.day === item.day;
                    const heightPercent = item.duration > 0 ? 100 : 15;

                    return (
                      <div
                        key={idx}
                        onClick={() => setActivePoint(item)}
                        className="flex flex-col items-center cursor-pointer group h-full justify-end relative"
                      >
                        <div className={`text-[10px] font-bold mb-2 transition ${isActive ? "text-blue-600 font-extrabold scale-110" : "text-slate-400"}`}>
                          {item.duration > 0 ? "Hadir" : "Absen"}
                        </div>

                        <div className="w-full flex justify-center items-end h-28">
                          <div className="relative w-1.5 bg-blue-200 rounded-full h-full flex items-end">
                            <div
                              className={`w-full rounded-full transition-all duration-300 ${
                                item.duration > 0 ? "bg-blue-600" : "bg-slate-300"
                              }`}
                              style={{ height: `${heightPercent}%` }}
                            ></div>
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

                        <span className={`text-xs mt-3 font-bold transition ${item.isToday ? "text-blue-600" : "text-slate-600"}`}>
                          {item.day}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {activePoint && (
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
                      Keterangan: <strong className="text-slate-800">{activePoint.duration > 0 ? "Tercatat Hadir Berlatih" : "Tidak Ada Catatan Masuk"}</strong>
                    </div>
                  </div>
                </div>

                <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${activePoint.duration > 0 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {activePoint.duration > 0 ? "✓ Sesi Selesai" : "Belum Absen"}
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl text-blue-900 text-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="space-y-1">
                <strong>Akumulasi Kehadiran Bulan Ini:</strong>
                <p className="text-slate-600">Anda telah mencatatkan total <strong>{stats.monthlyAttendance} hari kehadiran</strong> dari sistem presensi database MySQL.</p>
              </div>
              <span className="font-black text-blue-600 text-base">{attendancePercentage}% Tingkat Kehadiran</span>
            </div>
          </div>
        )}
      </div>

      {/* Motivational Banner */}
      <div className="bg-white border border-slate-200 p-5 md:p-6 rounded-3xl flex justify-between items-center shadow-xs">
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