"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface Member {
  id: string;
  name: string;
  nim: string;
  phone: string;
  gender: string;
  status: string;
  package: string;
}

export default function GymMemberManagePage() {
  const { showToast } = useToast();
  
  // Daftar data member dari Database MySQL
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  // Mode halaman: 'daftar' (tabel), 'tambah', 'ubah'
  const [mode, setMode] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    phone: "",
    gender: "Laki-laki",
    status: "Aktif",
    packageId: "",
  });

  // Paket membership yang tersedia dari database
  const [packages, setPackages] = useState<any[]>([]);

  // Ambil daftar member murni dari API database
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/members");
      const json = await res.json();
      if (json.success) {
        setMembers(json.data);
        if (json.data.length > 0 && (!selectedId || !json.data.some((m: Member) => m.id === selectedId))) {
          setSelectedId(json.data[0].id);
        }
      } else {
        showToast("Gagal memuat data member dari server.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan koneksi database.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Ambil daftar paket untuk pilihan dropdown
  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const json = await res.json();
      if (json.success) {
        setPackages(json.data);
      }
    } catch (error) {
      console.error("Gagal memuat paket:", error);
    }
  };

  useEffect(() => {
    fetchMembers();
    fetchPackages();
  }, []);

  // Tombol Aksi: Ubah mode ke Tambah
  const handleOpenTambah = () => {
    setFormData({ 
      name: "", 
      nim: "", 
      phone: "", 
      gender: "Laki-laki", 
      status: "Aktif", 
      packageId: packages.length > 0 ? packages[0].id : "" 
    });
    setMode("tambah");
  };

  // Tombol Aksi: Ubah mode ke Ubah
  const handleOpenUbah = () => {
    const current: any = members.find((m) => m.id === selectedId);
    if (current) {
      setFormData({
        name: current.name,
        nim: current.nim,
        phone: current.phone,
        gender: current.gender,
        status: current.status,
        packageId: current.packageId || (packages.length > 0 ? packages[0].id : ""),
      });
      setMode("ubah");
    } else {
      showToast("Pilih data member terlebih dahulu pada menu Daftar!", "warning");
    }
  };

  // Tombol Aksi: Hapus data dari Database via API
  const handleHapus = async () => {
    if (!selectedId) {
      showToast("Pilih data member yang ingin dihapus!", "warning");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus data member ini dari database?")) {
      try {
        const res = await fetch(`/api/admin/members?id=${selectedId}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          showToast("Member berhasil dihapus dari database!", "success");
          fetchMembers();
          setSelectedId(null);
          setMode("daftar");
        } else {
          showToast(`Gagal menghapus: ${json.message}`, "error");
        }
      } catch (error) {
        showToast("Terjadi kesalahan sistem saat menghapus data.", "error");
      }
    }
  };

  // Submit Simpan Tambah / Ubah ke Database API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.nim) {
      showToast("Nama dan NIM/ID wajib diisi!", "warning");
      return;
    }

    try {
      const url = "/api/admin/members";
      const method = mode === "tambah" ? "POST" : "PUT";
      const payload = mode === "ubah" ? { ...formData, id: selectedId } : formData;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        showToast(mode === "tambah" ? "Member baru berhasil disimpan ke database!" : "Data member berhasil diperbarui!", "success");
        fetchMembers();
        setMode("daftar");
      } else {
        showToast(`Gagal: ${json.message}`, "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan koneksi ke server.", "error");
    }
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
            Pengelolaan Data Anggota (Member) Database
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
            {mode === "daftar" && "Menampilkan seluruh daftar rekapitulasi anggota Gym 88 langsung dari database MySQL. Pilih salah satu baris untuk dikelola."}
            {mode === "tambah" && "Formulir penambahan data anggota baru Gym 88 ke dalam sistem database."}
            {mode === "ubah" && "Formulir pembaruan informasi profil dan status keaktifan anggota di database."}
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
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        <i className="fa-solid fa-spinner animate-spin text-lg mr-2"></i> Memuat data dari database...
                      </td>
                    </tr>
                  ) : members.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        Belum ada data member terdaftar di database.
                      </td>
                    </tr>
                  ) : (
                    members.map((m, idx) => (
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
                    ))
                  )}
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

        {/* KONTEN UTAMA: MODE TAMBAH & UBAH (FORMULIR) */}
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
                  placeholder="Contoh: GYM88-0015"
                  className="w-full bg-white border border-slate-300 rounded px-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500 font-medium font-mono"
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
                    value={formData.packageId}
                    onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded px-3 py-2 pr-8 text-slate-800 focus:outline-none focus:border-sky-500 font-medium appearance-none"
                  >
                    <option value="">-- Pilih Paket --</option>
                    {packages.map((pkg) => (
                      <option key={pkg.id} value={pkg.id}>
                        {pkg.title} ({pkg.price})
                      </option>
                    ))}
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
                {mode === "tambah" ? "Simpan Data Baru ke Database" : "Simpan Perubahan Database"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}