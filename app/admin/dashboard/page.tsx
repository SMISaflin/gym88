export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Dashboard, Admin</h1>
          <p className="text-xs text-slate-500">Berikut ringkasan data Gym 88 hari ini.</p>
        </div>
        <div className="text-xs bg-white border border-slate-200 px-4 py-2 rounded-xl text-slate-700 font-medium shadow-sm">
          <i className="fa-regular fa-calendar mr-2 text-blue-600"></i> Senin, 21 April 2026
        </div>
      </div>

      {/* Grid Kad Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Member" value="248" badge="+12% dari bulan lalu" icon="fa-users" color="text-blue-600" />
        <StatCard title="Member Aktif" value="164" badge="+3% dari bulan lalu" icon="fa-circle-check" color="text-emerald-600" />
        <StatCard title="Member Kurang Aktif" value="52" badge="-2% dari bulan lalu" icon="fa-triangle-exclamation" color="text-amber-500" />
        <StatCard title="Member Tidak Aktif" value="32" badge="+5% dari bulan lalu" icon="fa-circle-xmark" color="text-rose-600" />
      </div>

      {/* Grid Carta & Keaktifan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carta Tren Keaktifan Member */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Tren Keaktifan Member</h3>
          <div className="h-48 flex items-end justify-between gap-2 pt-6 px-2 border-b border-slate-100 text-[10px] text-slate-400">
            {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].map((m, i) => (
              <div key={m} className="w-full flex flex-col items-center justify-end h-full">
                <div style={{ height: `${40 + (i * 4) % 50}%` }} className="w-full bg-blue-600 rounded-t"></div>
                <span className="mt-2 font-medium text-slate-600">{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Ringkasan Status Keaktifan */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl flex flex-col items-center justify-center space-y-4 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 self-start">Status Keaktifan</h3>
          <div className="w-32 h-32 rounded-full border-8 border-blue-600 flex flex-col items-center justify-center text-center">
            <span className="text-xl font-black text-slate-900">66%</span>
            <span className="text-[9px] text-slate-500 font-medium">Aktif</span>
          </div>
          <div className="w-full space-y-1.5 text-[11px] font-medium">
            <div className="flex justify-between"><span className="text-emerald-600">■ Aktif</span> <span className="text-slate-900 font-bold">164</span></div>
            <div className="flex justify-between"><span className="text-amber-500">■ Kurang Aktif</span> <span className="text-slate-900 font-bold">52</span></div>
            <div className="flex justify-between"><span className="text-rose-600">■ Tidak Aktif</span> <span className="text-slate-900 font-bold">32</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, badge, icon, color }: { title: string; value: string; badge: string; icon: string; color: string }) {
  return (
    <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-500 font-medium">{title}</span>
        <i className={`fa-solid ${icon} ${color}`}></i>
      </div>
      <div className="text-2xl font-black text-slate-900">{value}</div>
      <span className="text-[10px] text-emerald-600 font-bold block">{badge}</span>
    </div>
  );
}