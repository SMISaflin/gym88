"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function MemberSecurityEditPage() {
  const router = useRouter();

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordData.currentPassword) {
      alert("Masukkan password saat ini!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password baru minimal terdiri dari 6 karakter!");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Konfirmasi password baru tidak cocok!");
      return;
    }

    // Simulasi pembaruan password berhasil
    alert("Password keamanan akun berhasil diperbarui!");
    router.push("/member/profile");
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Keamanan Akun</h1>
          <p className="text-xs text-slate-500">Perbarui kata sandi (password) untuk menjaga keamanan akun Gym 88 Anda.</p>
        </div>
      </div>

      {/* Main Full-Width Grid Layout (3 Kolom) */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Form Utama Ubah Password */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 text-xs">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-sm text-slate-900">Ubah Kata Sandi</h3>
            <p className="text-slate-500 text-xs mt-0.5">Disarankan menggunakan kombinasi huruf, angka, dan karakter khusus.</p>
          </div>

          <div className="space-y-4">
            {/* Password Saat Ini */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Password Saat Ini <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showCurrent ? "text" : "password"}
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Masukkan password saat ini"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <i className={`fa-solid ${showCurrent ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Password Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showNew ? "text" : "password"}
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Masukkan password baru (minimal 6 karakter)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <i className={`fa-solid ${showNew ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
            </div>

            {/* Konfirmasi Password Baru */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Konfirmasi Password Baru <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input 
                  type={showConfirm ? "text" : "password"}
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Ulangi password baru Anda"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-10 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                >
                  <i className={`fa-solid ${showConfirm ? "fa-eye-slash" : "fa-eye"}`}></i>
                </button>
              </div>
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
              <i className="fa-solid fa-key"></i>
              <span>Update Password</span>
            </button>
          </div>
        </div>

        {/* Kolom 3: Info Tambahan & Petunjuk Keamanan */}
        <div className="space-y-6">
          {/* Status Keamanan */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-xs">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">Status Keamanan</h3>
            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Verifikasi 2 Langkah:</span>
                <span className="font-bold text-emerald-600">Aktif</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Sesi Login:</span>
                <span className="font-bold text-slate-900">Perangkat Ini</span>
              </div>
              <div className="flex justify-between">
                <span>Terakhir Diubah:</span>
                <span className="font-bold text-slate-900">3 Bulan Lalu</span>
              </div>
            </div>
          </div>

          {/* Petunjuk Keamanan */}
          <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl text-xs space-y-2">
            <h4 className="font-bold text-amber-900 flex items-center space-x-1.5">
              <i className="fa-solid fa-shield-halved text-amber-600"></i>
              <span>Tips Keamanan Kata Sandi</span>
            </h4>
            <ul className="text-slate-600 leading-relaxed space-y-1.5 list-disc pl-4">
              <li>Gunakan minimal 6 hingga 12 karakter.</li>
              <li>Hindari menggunakan tanggal lahir atau nomor HP.</li>
              <li>Jangan beritahukan kata sandi Anda kepada siapa pun, termasuk staf gym.</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  );
}