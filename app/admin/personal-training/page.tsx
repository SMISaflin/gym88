"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface Trainer {
  id: string;
  name: string;
  specialty: string;
  phone: string;
  experience: string;
  status: string;
}

export default function AdminTrainersManagePage() {
  const { showToast } = useToast();

  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"daftar" | "tambah" | "ubah">("daftar");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    specialty: "Bodybuilding & Muscle Gain",
    phone: "",
    experience: "3 Tahun",
    status: "Aktif",
  });

  // Simulasi pengambilan data (bisa diubah ke endpoint API /api/admin/trainers)
  const fetchTrainers = async () => {
    try {
      setLoading(true);
      // Contoh fetch dari API database (sesuaikan jika sudah membuat endpoint-nya)
      const res = await fetch("/api/admin/trainers");
      const json = await res.json();
      if (json.success) {
        setTrainers(json.data);
        if (json.data.length > 0 && (!selectedId || !json.data.some((t: Trainer) => t.id === selectedId))) {
          setSelectedId(json.data[0].id);
        }
      } else {
        // Fallback data demo jika tabel database belum dibuat
        setTrainers([
          { id: "1", name: "Rian Utama, S.Or.", specialty: "Bodybuilding & Hypertrophy", phone: "081234567890", experience: "5 Tahun", status: "Aktif" },
          { id: "2", name: "Dewi Lestari", specialty: "Weight Loss & Zumba", phone: "081987654321", experience: "3 Tahun", status: "Aktif" },
          { id: "3", name: "Alex Pratama", specialty: "Functional Training & Calisthenics", phone: "081122334455", experience: "4 Tahun", status: "Cuti" },
        ]);
        setSelectedId("1");
      }
    } catch (error) {
      // Fallback data lokal jika API belum ada
      setTrainers([
        { id: "1", name: "Rian Utama, S.Or.", specialty: "Bodybuilding & Hypertrophy", phone: "081234567890", experience: "5 Tahun", status: "Aktif" },
        { id: "2", name: "Dewi Lestari", specialty: "Weight Loss & Zumba", phone: "081987654321", experience: "3 Tahun", status: "Aktif" },
      ]);
      setSelectedId("1");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  // Tombol Aksi: Ubah mode ke Tambah
  const handleOpenTambah = () => {
    setFormData({ 
      name: "", 
      specialty: "Bodybuilding & Hypertrophy", 
      phone: "", 
      experience: "1 Tahun", 
      status: "Aktif" 
    });
    setMode("tambah");
  };

  // Tombol Aksi: Ubah mode ke Ubah
  const handleOpenUbah = () => {
    const current = trainers.find((t) => t.id === selectedId);
    if (current) {
      setFormData({
        name: current.name,
        specialty: current.specialty,
        phone: current.phone,
        experience: current.experience,
        status: current.status,
      });
      setMode("ubah");
    } else {
      showToast("Pilih pelatih terlebih dahulu pada menu Daftar!", "warning");
    }
  };

  // Tombol Aksi: Hapus data
  const handleHapus = async () => {
    if (!selectedId) {
      showToast("Pilih pelatih yang ingin dihapus!", "warning");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus data Personal Trainer ini?")) {
      try {
        const res = await fetch(`/api/admin/trainers?id=${selectedId}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          showToast("Personal Trainer berhasil dihapus!", "success");
        } else {
          // Hapus lokal jika API belum aktif sepenuhnya
          setTrainers(trainers.filter(t => t.id !== selectedId));
          showToast("Personal Trainer berhasil dihapus!", "success");
        }
        fetchTrainers();
        setSelectedId(null);
        setMode("daftar");
      } catch (error) {
        setTrainers(trainers.filter(t => t.id !== selectedId));
        showToast("Personal Trainer berhasil dihapus dari daftar.", "success");
        setMode("daftar");
      }
    }
  };

  // Submit Simpan Tambah / Ubah
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast("Nama lengkap dan nomor HP wajib diisi!", "warning");
      return;
    }

    try {
      const url = "/api/admin/trainers";
      const method = mode === "tambah" ? "POST" : "PUT";
      const payload = mode === "ubah" ? { ...formData, id: selectedId } : formData;

      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.success || res.ok) {
        showToast(mode === "tambah" ? "Personal Trainer baru berhasil ditambahkan!" : "Data pelatih berhasil diperbarui!", "success");
      } else {
        // Simulasi sukses lokal jika endpoint belum siap
        if (mode === "tambah") {
          const newTrainer = { id: Date.now().toString(), ...formData };
          setTrainers([newTrainer, ...trainers]);
        } else {
          setTrainers(trainers.map(t => t.id === selectedId ? { ...t, ...formData } : t));
        }
        showToast("Data berhasil disimpan!", "success");
      }
      setMode("daftar");
    } catch (error) {
      showToast("Terjadi kesalahan pada sistem.", "error");
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header / Breadcrumb Style */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">Manajemen Pelatih (Personal Trainer)</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6 space-y-6">
        {/* Title & Top Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Daftar Pelatih Gym 88
            </h1>
            <p className="text-slate-500 text-[11px]">Kelola jadwal, spesialisasi, dan status keaktifan instruktur fitness.</p>
          </div>

          {/* Button Group: TAMBAH, UBAH, HAPUS, DAFTAR */}
          <div className="flex flex-wrap items-center gap-2 font-bold uppercase text-[11px]">
            <button 
              onClick={handleOpenTambah}
              className={`px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition text-white ${mode === 'tambah' ? 'bg-blue-700 ring-2 ring-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Tambah</span>
            </button>
            <button 
              onClick={handleOpenUbah}
              className={`px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition text-white ${mode === 'ubah' ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-amber-500 hover:bg-amber-600'}`}
            >
              <i className="fa-solid fa-pen text-xs"></i>
              <span>Ubah</span>
            </button>
            <button 
              onClick={handleHapus}
              className="bg-rose-500 hover:bg-rose-600 text-white px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition"
            >
              <i className="fa-solid fa-trash-can text-xs"></i>
              <span>Hapus</span>
            </button>
            <button 
              onClick={() => setMode("daftar")}
              className={`px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition text-white ${mode === 'daftar' ? 'bg-emerald-700 ring-2 ring-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <i className="fa-solid fa-list text-xs"></i>
              <span>Daftar</span>
            </button>
          </div>
        </div>

        {/* Info Banner Box */}
        <div className="bg-blue-50/70 border border-blue-100 text-blue-900 px-4 py-3 rounded-2xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <i className="fa-solid fa-dumbbell text-sm"></i>
          </div>
          <span className="text-[11px] sm:text-xs font-medium">
            {mode === "daftar" && "Pilih salah satu baris tabel di bawah untuk melihat atau mengelola data Personal Trainer secara spesifik."}
            {mode === "tambah" && "Formulir penambahan instruktur atau Personal Trainer baru Gym 88."}
            {mode === "ubah" && "Formulir pembaruan data spesialisasi dan kontak Personal Trainer."}
          </span>
        </div>

        {/* KONTEN UTAMA: MODE DAFTAR (TABEL) */}
        {mode === "daftar" && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[650px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase tracking-wider text-[10px] font-black">
                    <th className="p-3.5 text-center w-14">Pilih</th>
                    <th className="p-3.5 w-12">No</th>
                    <th className="p-3.5">Nama Trainer</th>
                    <th className="p-3.5">Spesialisasi</th>
                    <th className="p-3.5">No. HP / WA</th>
                    <th className="p-3.5">Pengalaman</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        <i className="fa-solid fa-spinner animate-spin text-xl text-blue-600 mr-2"></i> Memuat data pelatih...
                      </td>
                    </tr>
                  ) : trainers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Belum ada data Personal Trainer terdaftar.
                      </td>
                    </tr>
                  ) : (
                    trainers.map((t, idx) => (
                      <tr 
                        key={t.id} 
                        onClick={() => setSelectedId(t.id)}
                        className={`cursor-pointer transition-colors ${selectedId === t.id ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50/80'}`}
                      >
                        <td className="p-3.5 text-center">
                          <input 
                            type="radio" 
                            name="selectedTrainer" 
                            checked={selectedId === t.id} 
                            onChange={() => setSelectedId(t.id)}
                            className="accent-blue-600 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-2">
                          <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-black shrink-0">
                            {t.name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()}
                          </div>
                          <span>{t.name}</span>
                        </td>
                        <td className="p-3.5 text-slate-700">{t.specialty}</td>
                        <td className="p-3.5 text-slate-600">{t.phone}</td>
                        <td className="p-3.5 text-slate-600">{t.experience}</td>
                        <td className="p-3.5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                            t.status === 'Aktif' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                              : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${t.status === 'Aktif' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                            <span>{t.status}</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleOpenUbah}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-2"
              >
                <i className="fa-solid fa-pen text-xs"></i>
                <span>Edit Data Terpilih</span>
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
                  Nama Lengkap & Gelar <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: Rian Utama, S.Or."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Spesialisasi */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Spesialisasi / Keahlian <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="Contoh: Bodybuilding & Weight Loss"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* No HP */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  No. Handphone / WhatsApp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contoh: 081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Pengalaman */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Pengalaman Kerja</label>
                <input
                  type="text"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="Contoh: 3 Tahun"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              {/* Status */}
              <div className="space-y-1 md:col-span-2">
                <label className="font-bold text-slate-700">Status Keaktifan</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Cuti">Cuti / Non-Aktif</option>
                </select>
              </div>
            </div>

            {/* Tombol Simpan Form */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMode("daftar")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
              >
                {mode === "tambah" ? "Simpan Pelatih Baru" : "Simpan Perubahan Data"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}