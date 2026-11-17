"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function AdminProfilePage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    id: "",
    email: "admin@gym88.com",
    role: "ADMIN",
    name: "Administrator Gym 88",
    phone: "081234567890",
    address: "Jl. Utama Gym 88 No. 88, Makassar",
    gender: "MALE",
  });

  useEffect(() => {
    // Ambil data profil admin dari API
    fetch("/api/profile?email=admin@gym88.com")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) {
          setProfile((prev) => ({
            ...prev,
            id: json.data.id,
            email: json.data.email,
            role: json.data.role,
            name: json.data.name || prev.name,
            phone: json.data.phone !== "-" ? json.data.phone : prev.phone,
            address: json.data.address !== "-" ? json.data.address : prev.address,
            gender: json.data.gender || prev.gender,
          }));
        }
      })
      .catch(() => showToast("Gagal memuat profil admin.", "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: profile.id,
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          gender: profile.gender,
        }),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Profil Admin berhasil diperbarui!", "success");
      } else {
        showToast(`Gagal: ${json.message}`, "error");
      }
    } catch (error) {
      showToast("Kesalahan saat menyimpan data.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">Pengaturan Akun Admin</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ringkasan Kartu Admin */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-2xs text-center flex flex-col items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-4xl font-black shadow-inner">
            <i className="fa-solid fa-user-shield"></i>
          </div>
          <div>
            <h2 className="text-base font-black text-slate-900">{profile.name}</h2>
            <p className="text-slate-500 font-mono text-[11px]">{profile.email}</p>
          </div>
          <span className="bg-blue-50 text-blue-700 border border-blue-200/80 px-3 py-1 rounded-full text-[10px] font-bold">
            <i className="fa-solid fa-key mr-1"></i> Peran: {profile.role}
          </span>
          <div className="w-full pt-4 border-t border-slate-100 text-left space-y-2 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Status Sistem:</span>
              <span className="font-bold text-emerald-600">Terhubung MySQL</span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Akses Hak Istimewa:</span>
              <span className="font-bold text-slate-800">Full Administrator</span>
            </div>
          </div>
        </div>

        {/* Form Edit Profil */}
        <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
          <div>
            <h1 className="text-lg font-black text-slate-900">Ubah Informasi Informasi Admin</h1>
            <p className="text-slate-500 text-[11px]">Perbarui nama lengkap, kontak, dan alamat utama pengelola.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nama Lengkap Admin</label>
                <input
                  type="text"
                  required
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Nomor Telepon / WhatsApp</label>
                <input
                  type="text"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Jenis Kelamin</label>
                <select
                  value={profile.gender}
                  onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-800 focus:outline-none focus:border-blue-600"
                >
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Alamat Email (Akun)</label>
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 font-medium text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-700">Alamat Lengkap Kantor / Lokasi</label>
              <textarea
                rows={3}
                value={profile.address}
                onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-medium text-slate-800 focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <i className="fa-solid fa-spinner animate-spin"></i>
                    <span>Menyimpan...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-floppy-disk"></i>
                    <span>Simpan Perubahan Profil</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}