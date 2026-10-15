"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MemberProfileEditPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "Ahmad Fauzi",
    nim: "20231001",
    phone: "081234567890",
    email: "ahmad.fauzi@gmail.com",
    gender: "Laki-laki",
    joinedDate: "15 Jan 2025",
    status: "AKTIF",
  });

  // Load data profil terbaru dari localStorage jika ada
  useEffect(() => {
    const saved = localStorage.getItem("gym88_member_profile");
    if (saved) {
      try {
        setFormData(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("gym88_member_profile", JSON.stringify(formData));
    alert("Profil berhasil diperbarui!");
    router.push("/member/profile");
  };

  const getInitials = (name: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "AF";
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/member/profile" 
          className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Profil Saya</h1>
          <p className="text-xs text-slate-500">Perbarui informasi data diri akun Gym 88.</p>
        </div>
      </div>

      {/* Main Full-Width Grid Layout (3 Kolom) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Form Utama Edit Profil */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 text-xs">
          {/* Header Preview Avatar */}
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-sm">
              {getInitials(formData.name)}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">{formData.name || "Nama Member"}</h3>
              <p className="text-slate-500 text-xs">ID: GYM88-0012</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold inline-block">
                🟢 {formData.status}
              </span>
            </div>
          </div>

          {/* Form Input 2 Kolom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-bold mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">NIM / ID Anggota <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.nim}
                onChange={(e) => setFormData({...formData, nim: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">No. Handphone / WhatsApp <span className="text-rose-500">*</span></label>
              <input 
                type="text" 
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Alamat Email <span className="text-rose-500">*</span></label>
              <input 
                type="email" 
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Jenis Kelamin</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1">Tanggal Bergabung</label>
              <input 
                type="text" 
                disabled
                value={formData.joinedDate}
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-500 font-medium cursor-not-allowed"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex space-x-3 justify-end">
            <Link 
              href="/member/profile" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition text-center"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Perubahan</span>
            </button>
          </div>
        </div>

        {/* Kolom 3: Informasi Sampingan */}
        <div className="space-y-6">
          {/* Card Info Akun */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-xs">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">Informasi Tambahan</h3>
            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Status Akun:</span>
                <span className="font-bold text-emerald-600">Terverifikasi</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Tipe Akun:</span>
                <span className="font-bold text-slate-900">Member Aktif</span>
              </div>
              <div className="flex justify-between">
                <span>Lokasi Gym:</span>
                <span className="font-bold text-slate-900">Gym 88 Central</span>
              </div>
            </div>
          </div>

          {/* Bantuan */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-2xl text-xs space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center space-x-1.5">
              <i className="fa-solid fa-circle-info text-blue-600"></i>
              <span>Petunjuk Perubahan Data</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Pastikan alamat email dan nomor WhatsApp aktif agar Anda tetap menerima notifikasi jadwal masa aktif membership dan riwayat kehadiran.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}