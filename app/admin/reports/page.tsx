export default function AdminReportsPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Laporan</h1>
          <p className="text-xs text-slate-500">Rekapitulasi keuangan dan kehadiran gym.</p>
        </div>
        <button className="bg-white hover:bg-slate-50 text-slate-700 font-bold px-4 py-2 rounded-xl text-xs border border-slate-200 transition shadow-sm flex items-center space-x-2">
          <i className="fa-solid fa-download text-blue-600"></i>
          <span>Export</span>
        </button>
      </div>

      {/* Summary Cards Grid - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Pendapatan</div>
          <div className="text-2xl font-black text-blue-600">Rp 12.450.000</div>
          <span className="text-[10px] text-emerald-600 font-bold block">+12% dari bulan lalu</span>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Member Aktif</div>
          <div className="text-2xl font-black text-slate-900">164</div>
          <span className="text-[10px] text-emerald-600 font-bold block">+8% dari bulan lalu</span>
        </div>
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-1">
          <div className="text-xs text-slate-500 font-medium">Total Kehadiran</div>
          <div className="text-2xl font-black text-slate-900">3.482</div>
          <span className="text-[10px] text-emerald-600 font-bold block">+15% dari bulan lalu</span>
        </div>
      </div>

      {/* Chart and Status Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Monthly Income Chart */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Pendapatan per Bulan</h3>
          <div className="h-40 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 text-[9px] text-slate-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
              <div key={m} className="w-full flex flex-col items-center justify-end h-full">
                <div 
                  style={{ height: `${50 + (i * 3) % 45}%` }} 
                  className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-t"
                ></div>
                <span className="mt-2 font-medium text-slate-600">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Member Status Overview */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 self-start">Status Member</h3>
          <div className="w-28 h-28 rounded-full border-8 border-blue-600 flex items-center justify-center font-black text-lg text-slate-900">
            66%
          </div>
          <div className="w-full text-[11px] font-medium space-y-1.5 pt-2">
            <div className="flex justify-between text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Aktif</span>
              </span>
              <span className="font-bold text-slate-900">164</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Kurang Aktif</span>
              </span>
              <span className="font-bold text-slate-900">52</span>
            </div>
            <div className="flex justify-between text-slate-700">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Tidak Aktif</span>
              </span>
              <span className="font-bold text-slate-900">32</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}