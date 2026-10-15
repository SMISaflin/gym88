"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const initialPackages = [
  { id: 1, title: "Basic", price: "Rp 150.000", desc: ["Akses gym", "Locker", "1x Trainer (opsional)"], popular: false },
  { id: 2, title: "Regular", price: "Rp 250.000", desc: ["Akses gym", "Locker", "2x Trainer (opsional)", "Kelas grup"], popular: true },
  { id: 3, title: "Premium", price: "Rp 400.000", desc: ["Akses gym sepuasnya", "Locker VIP", "Unlimited trainer", "Body composition"], popular: false },
];

export default function AdminPackagesManagePage() {
  const [packages, setPackages] = useState(initialPackages);
  const [mode, setMode] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [selectedId, setSelectedId] = useState<number | null>(1);

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    descString: "",
    popular: false,
  });

  // Sinkronisasi data ke localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gym88_packages_manage");
    if (saved) {
      try {
        setPackages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToStorage = (updated: typeof initialPackages) => {
    setPackages(updated);
    localStorage.setItem("gym88_packages_manage", JSON.stringify(updated));
  };

  // Tombol Aksi: Ubah mode ke Tambah
  const handleOpenTambah = () => {
    setFormData({ title: "", price: "", descString: "", popular: false });
    setMode("tambah");
  };

  // Tombol Aksi: Ubah mode ke Ubah
  const handleOpenUbah = () => {
    const current = packages.find((p) => p.id === selectedId);
    if (current) {
      setFormData({
        title: current.title,
        price: current.price,
        descString: current.desc.join(", "),
        popular: current.popular || false,
      });
      setMode("ubah");
    } else {
      alert("Pilih paket terlebih dahulu pada menu Daftar!");
    }
  };

  // Tombol Aksi: Hapus data
  const handleHapus = () => {
    if (!selectedId) {
      alert("Pilih paket yang ingin dihapus!");
      return;
    }
    if (confirm("Apakah Anda yakin ingin menghapus paket membership ini?")) {
      const updated = packages.filter((p) => p.id !== selectedId);
      saveToStorage(updated);
      setSelectedId(updated.length > 0 ? updated[0].id : null);
      setMode("daftar");
    }
  };

  // Submit Simpan Tambah / Ubah
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert("Nama paket dan harga wajib diisi!");
      return;
    }

    const descArray = formData.descString
      ? formData.descString.split(",").map((item) => item.trim()).filter(Boolean)
      : [];

    if (mode === "tambah") {
      const newId = packages.length > 0 ? Math.max(...packages.map((p) => p.id)) + 1 : 1;
      const newPkg = {
        id: newId,
        title: formData.title,
        price: formData.price,
        desc: descArray,
        popular: formData.popular,
      };
      const updated = [...packages, newPkg];
      saveToStorage(updated);
      setSelectedId(newId);
      alert("Paket baru berhasil ditambahkan!");
    } else if (mode === "ubah" && selectedId !== null) {
      const updated = packages.map((p) =>
        p.id === selectedId
          ? {
              ...p,
              title: formData.title,
              price: formData.price,
              desc: descArray,
              popular: formData.popular,
            }
          : p
      );
      saveToStorage(updated);
      alert("Paket berhasil diperbarui!");
    }
    setMode("daftar");
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4 text-slate-700 font-sans">
      {/* Top Header / Breadcrumb Style */}
      <div className="border-b border-sky-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-sky-500">Membership Gym 88</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-sky-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 space-y-6">
        {/* Title & Top Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="text-xl font-extrabold text-sky-600 tracking-tight">
            Pengelolaan Paket Membership
          </h1>

          {/* Button Group: TAMBAH, UBAH, HAPUS, DAFTAR */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase">
            <button 
              onClick={handleOpenTambah}
              className={`px-3.5 py-2 rounded shadow-sm flex items-center space-x-1 transition text-white ${mode === 'tambah' ? 'bg-sky-600 ring-2 ring-sky-300' : 'bg-sky-400 hover:bg-sky-500'}`}
            >
              <i className="fa-solid fa-plus text-sm mr-1"></i>
              <span>TAMBAH</span>
            </button>
            <button 
              onClick={handleOpenUbah}
              className={`px-3.5 py-2 rounded shadow-sm flex items-center space-x-1 transition text-white ${mode === 'ubah' ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-amber-400 hover:bg-amber-500'}`}
            >
              <i className="fa-solid fa-pen text-sm mr-1"></i>
              <span>UBAH</span>
            </button>
            <button 
              onClick={handleHapus}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2 rounded shadow-sm flex items-center space-x-1 transition"
            >
              <i className="fa-solid fa-trash-can text-sm mr-1"></i>
              <span>HAPUS</span>
            </button>
            <button 
              onClick={() => setMode("daftar")}
              className={`px-3.5 py-2 rounded shadow-sm flex items-center space-x-1 transition text-white ${mode === 'daftar' ? 'bg-emerald-600 ring-2 ring-emerald-300' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              <i className="fa-solid fa-list text-sm mr-1"></i>
              <span>DAFTAR</span>
            </button>
          </div>
        </div>

        {/* Info Banner Box */}
        <div className="bg-sky-400 text-white text-xs px-4 py-3 rounded-xl font-medium shadow-inner flex items-center space-x-2">
          <i className="fa-solid fa-circle-info text-sm"></i>
          <span>
            {mode === "daftar" && "Menampilkan seluruh daftar paket membership Gym 88. Pilih salah satu baris untuk dikelola."}
            {mode === "tambah" && "Formulir penambahan paket membership baru Gym 88."}
            {mode === "ubah" && "Formulir pembaruan informasi dan fasilitas paket membership terpilih."}
          </span>
        </div>

        {/* KONTEN UTAMA: MODE DAFTAR (TABEL DENGAN TOMBOL RADIO) */}
        {mode === "daftar" && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th className="p-3 text-center w-16">Pilih</th>
                    <th className="p-3 w-16">No</th>
                    <th className="p-3">Nama Paket</th>
                    <th className="p-3">Harga per Bulan</th>
                    <th className="p-3">Fasilitas / Deskripsi</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {packages.map((pkg, idx) => (
                    <tr 
                      key={pkg.id} 
                      onClick={() => setSelectedId(pkg.id)}
                      className={`cursor-pointer transition ${selectedId === pkg.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-3 text-center">
                        <input 
                          type="radio" 
                          name="selectedPackage" 
                          checked={selectedId === pkg.id} 
                          onChange={() => setSelectedId(pkg.id)}
                          className="accent-sky-500"
                        />
                      </td>
                      <td className="p-3 text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-sky-700">{pkg.title}</td>
                      <td className="p-3 font-mono font-bold text-slate-900">{pkg.price}</td>
                      <td className="p-3 text-slate-600">{pkg.desc.join(", ")}</td>
                      <td className="p-3">
                        {pkg.popular ? (
                          <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-[10px] font-bold">
                            Populer
                          </span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button 
                onClick={handleOpenUbah}
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2 rounded text-xs shadow-sm transition"
              >
                <i className="fa-solid fa-pen mr-1"></i> Edit Data Terpilih
              </button>
            </div>
          </div>
        )}

        {/* KONTEN UTAMA: MODE TAMBAH & UBAH (FORMULIR DUA KOLOM) */}
        {(mode === "tambah" || mode === "ubah") && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {/* Nama Paket */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Nama Paket <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Contoh: VIP / Gold"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Harga */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Harga per Bulan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="Contoh: Rp 350.000"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Fasilitas */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">
                  Fasilitas / Deskripsi (pisahkan dengan koma) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.descString}
                  onChange={(e) => setFormData({ ...formData, descString: e.target.value })}
                  placeholder="Contoh: Akses gym, Locker, 3x Trainer"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium resize-none"
                />
              </div>

              {/* Checkbox Populer */}
              <div className="space-y-1 md:col-span-2 flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="popularCheckbox"
                  checked={formData.popular}
                  onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                  className="w-4 h-4 accent-sky-500 rounded"
                />
                <label htmlFor="popularCheckbox" className="font-bold text-slate-700 cursor-pointer">
                  Tandai sebagai Paket Populer (Unggulan)
                </label>
              </div>
            </div>

            {/* Tombol Simpan Form */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMode("daftar")}
                className="bg-slate-300 hover:bg-slate-400 text-slate-800 font-bold px-5 py-2 rounded text-xs transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-6 py-2 rounded text-xs shadow-sm transition"
              >
                {mode === "tambah" ? "Simpan Paket Baru" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}