export default function AdminClassificationPage() {
  const items = [
    { no: 1, name: "Ahmad Fauzi", nim: "20231001", klasifikasi: "Aktif", hari: 22 },
    { no: 2, name: "Siti Nurhaliza", nim: "20231002", klasifikasi: "Aktif", hari: 20 },
    { no: 3, name: "Budi Santoso", nim: "20231003", klasifikasi: "Kurang Aktif", hari: 12 },
    { no: 4, name: "Rina Agustina", nim: "20231004", klasifikasi: "Aktif", hari: 18 },
    { no: 5, name: "Dedi Lesmana", nim: "20231005", klasifikasi: "Tidak Aktif", hari: 5 },
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Klasifikasi Member</h1>
          <p className="text-xs text-slate-500">Analisis keaktifan anggota berdasarkan frekuensi kehadiran.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm">
          Proses Klasifikasi
        </button>
      </div>

      {/* Summary Cards - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm">
          <div className="text-emerald-700 font-bold text-xs">Aktif</div>
          <div className="text-3xl font-black mt-2 text-slate-900">164 Member</div>
          <span className="text-[10px] text-slate-500 font-medium">(66%)</span>
        </div>
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl shadow-sm">
          <div className="text-amber-700 font-bold text-xs">Kurang Aktif</div>
          <div className="text-3xl font-black mt-2 text-slate-900">52 Member</div>
          <span className="text-[10px] text-slate-500 font-medium">(21%)</span>
        </div>
        <div className="bg-rose-50 border border-rose-200 p-5 rounded-2xl shadow-sm">
          <div className="text-rose-700 font-bold text-xs">Tidak Aktif</div>
          <div className="text-3xl font-black mt-2 text-slate-900">32 Member</div>
          <span className="text-[10px] text-slate-500 font-medium">(13%)</span>
        </div>
      </div>

      {/* Table Container - Light Theme */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden text-xs shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500 bg-slate-50/50">
              <th className="p-4">No</th>
              <th className="p-4">Nama Member</th>
              <th className="p-4">NIM</th>
              <th className="p-4">Klasifikasi</th>
              <th className="p-4">Hari Hadir</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {items.map((it) => (
              <tr key={it.no} className="hover:bg-slate-50 transition">
                <td className="p-4 text-slate-500">{it.no}</td>
                <td className="p-4 font-bold text-slate-900">{it.name}</td>
                <td className="p-4 font-mono text-slate-500">{it.nim}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                    it.klasifikasi === 'Aktif' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                      : it.klasifikasi === 'Kurang Aktif' 
                      ? 'bg-amber-50 text-amber-600 border border-amber-200' 
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {it.klasifikasi}
                  </span>
                </td>
                <td className="p-4 text-slate-700">{it.hari} hari</td>
                <td className="p-4 text-right text-slate-400">
                  <button className="hover:text-slate-900 transition">
                    <i className="fa-solid fa-ellipsis-vertical"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}