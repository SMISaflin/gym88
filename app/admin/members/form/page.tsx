"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function GymMemberManagePage() {
  // Daftar data member awal
  const [members, setMembers] = useState([
    { id: 1, name: "Ahmad Fauzi", nim: "20231001", phone: "081234567890", gender: "Laki-laki", status: "Aktif", package: "Regular" },
    { id: 2, name: "Siti Nurhaliza", nim: "20231002", phone: "081234567891", gender: "Perempuan", status: "Aktif", package: "Premium" },
    { id: 3, name: "Budi Santoso", nim: "20231003", phone: "081234567892", gender: "Laki-laki", status: "Kurang Aktif", package: "Basic" },
  ]);

  // Mode halaman: 'daftar' (tabel), 'tambah', 'ubah', 'detail'
  const [mode, setMode] = useState<"daftar" | "tambah" | "ubah" | "detail">("daftar");
  const [selectedId, setSelectedId] = useState<number | null>(1);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    phone: "",
    gender: "Laki-laki",
    status: "Aktif",
    package: "Regular",
  });

  // Sinkronisasi data ke localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gym88_members_manage");
    if (saved) {
      try {
        setMembers(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToStorage = (updated: typeof members) => {
    setMembers(updated);
    localStorage.setItem("gym88_members_manage", JSON.stringify(updated));
  };

  // Handler saat baris tabel dipilih untuk Ubah/Detail
  const handleSelectMember = (m: any) => {
    setSelectedId(m.id);
    setFormData(m);
  };

  // Tombol Aksi: Ubah mode ke Tambah
  const handleOpenTambah = () => {
    setFormData({ name: "", nim: "", phone: "", gender: "Laki-laki", status: "Aktif", package: "Regular" });
    setMode("tambah");
  };

  // Tombol Aksi: Ubah mode ke Ubah
  const handleOpenUbah = () => {
    const current = members.find((m) => m.id === selectedId);
    if (current) {
      setFormData(current);
      setMode("ubah");
    } else {
      alert("Pilih data member terlebih dahulu pada menu Daftar!");
    }
  };

  // Tombol Aksi: Hapus data
  const handleHapus = () => {
    if (!selectedId) {
      alert("Pilih data member yang ingin dihapus!");
      return;
    }
    if (confirm("Apakah Anda yakin ingin menghapus data member ini?")) {
      const updated = members.filter((m) => m.id !== selectedId);
      saveToStorage(updated);
      setSelectedId(updated.length > 0 ? updated[0].id : null);
      setMode("daftar");
    }
  };

  // Submit Simpan Tambah / Ubah
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nim) {
      alert("Nama dan NIM wajib diisi!");
      return;
    }

    if (mode === "tambah") {
      const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
      const newMember = { id: newId, ...formData };
      const updated = [newMember, ...members];
      saveToStorage(updated);
      setSelectedId(newId);
      alert("Member baru berhasil ditambahkan!");
    } else if (mode === "ubah" && selectedId) {
      const updated = members.map((m) => (m.id === selectedId ? { ...m, ...formData } : m));
      saveToStorage(updated);
      alert("Data member berhasil diperbarui!");
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
            Pengelolaan Data Anggota (Member)
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
            {mode === "daftar" && "Menampilkan seluruh daftar rekapitulasi anggota Gym 88. Pilih salah satu baris untuk dikelola."}
            {mode === "tambah" && "Formulir penambahan data anggota baru Gym 88 per periode aktif."}
            {mode === "ubah" && "Formulir pembaruan informasi profil dan status keaktifan anggota."}
            {mode === "detail" && "Tampilan detail informasi lengkap anggota terpilih."}
          </span>
        </div>

        {/* KONTEN UTAMA: MODE DAFTAR (TABEL) */}
        {mode === "daftar" && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                    <th className="p-3">Pilih</th>
                    <th className="p-3">No</th>
                    <th className="p-3">Nama Member</th>
                    <th className="p-3">NIM / ID</th>
                    <th className="p-3">No. HP</th>
                    <th className="p-3">Jenis Kelamin</th>
                    <th className="p-3">Paket</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {members.map((m, idx) => (
                    <tr 
                      key={m.id} 
                      onClick={() => setSelectedId(m.id)}
                      className={`cursor-pointer transition ${selectedId === m.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                    >
                      <td className="p-3 text-center">
                        <input 
                          type="radio" 
                          name="selectedMember" 
                          checked={selectedId === m.id} 
                          onChange={() => setSelectedId(m.id)}
                          className="accent-sky-500"
                        />
                      </td>
                      <td className="p-3 text-slate-500">{idx + 1}</td>
                      <td className="p-3 font-bold text-sky-700">{m.name}</td>
                      <td className="p-3 font-mono">{m.nim}</td>
                      <td className="p-3">{m.phone}</td>
                      <td className="p-3">{m.gender}</td>
                      <td className="p-3 font-bold">{m.package}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          m.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 
                          m.status === 'Kurang Aktif' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {m.status}
                        </span>
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
              {/* Nama Lengkap */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Ahmad Fauzi"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* NIM / ID */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  NIM / ID Anggota <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  placeholder="Contoh: 20231001"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* No. HP */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">No. Handphone / WhatsApp</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium"
                />
              </div>

              {/* Jenis Kelamin */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Jenis Kelamin <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-slate-800 focus:outline-none focus:border-sky-500 font-medium appearance-none"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                  <i className="fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></i>
                </div>
              </div>

              {/* Paket Membership */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Paket Membership <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.package}
                    onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-slate-800 focus:outline-none focus:border-sky-500 font-medium appearance-none"
                  >
                    <option value="Basic">Basic - Rp 150.000</option>
                    <option value="Regular">Regular - Rp 250.000</option>
                    <option value="Premium">Premium - Rp 400.000</option>
                  </select>
                  <i className="fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></i>
                </div>
              </div>

              {/* Status Keaktifan */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Status Keaktifan <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-slate-800 focus:outline-none focus:border-sky-500 font-medium appearance-none"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Kurang Aktif">Kurang Aktif</option>
                    <option value="Tidak Aktif">Tidak Aktif</option>
                  </select>
                  <i className="fa-solid fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"></i>
                </div>
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
                {mode === "tambah" ? "Simpan Data Baru" : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}