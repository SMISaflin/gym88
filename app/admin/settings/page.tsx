export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Pengaturan</h1>
        <p className="text-xs text-slate-500">Konfigurasi kriteria klasifikasi dan profil gym.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation / Sidebar Menu Settings */}
        <div className="bg-white border border-slate-200 p-3 rounded-2xl space-y-1 text-xs font-bold shadow-sm">
          <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer transition">
            Profil Gym
          </div>
          <div className="p-3 text-blue-600 bg-blue-50 rounded-xl cursor-pointer transition">
            Kriteria Klasifikasi
          </div>
          <div className="p-3 text-slate-600 hover:bg-slate-50 rounded-xl cursor-pointer transition">
            Notifikasi
          </div>
        </div>

        {/* Form Container - Light Theme */}
        <div className="md:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl space-y-5 text-xs shadow-sm">
          <h3 className="font-bold text-sm text-slate-900">Pengaturan Kriteria Klasifikasi</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Aktif (hari)</label>
              <input 
                type="text" 
                defaultValue="> 20" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition" 
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Kurang Aktif (hari)</label>
              <input 
                type="text" 
                defaultValue="7 - 20" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition" 
              />
            </div>
            <div>
              <label className="block text-slate-700 mb-1.5 font-bold">Tidak Aktif (hari)</label>
              <input 
                type="text" 
                defaultValue="≤ 7" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white transition" 
              />
            </div>
          </div>

          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm">
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}