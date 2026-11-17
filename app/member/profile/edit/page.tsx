"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function MemberProfileEditPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    id: "",
    name: "Memuat Nama...",
    nim: "GYM88-0000",
    phone: "-",
    email: "-",
    gender: "Laki-laki",
    joinedDate: "-",
    status: "AKTIF",
  });

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load data profil asli dari database MySQL / API
  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        let targetCode = "GYM88-0012";
        let targetEmail = "";

        const saved = localStorage.getItem("gym88_member_profile");
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            if (parsed.nim) targetCode = parsed.nim.startsWith("GYM88-") ? parsed.nim : `GYM88-${parsed.nim}`;
            if (parsed.email) targetEmail = parsed.email;
          } catch (e) {
            console.error("Gagal membaca localStorage:", e);
          }
        }

        const query = targetEmail ? `email=${targetEmail}` : `memberCode=${targetCode}`;
        const res = await fetch(`/api/member/profile?${query}`);
        const json = await res.json();

        if (json.success && json.data) {
          const p = json.data;
          setFormData({
            id: p.id || "",
            name: p.name || "",
            nim: p.memberCode || targetCode,
            phone: p.phone || "",
            email: p.email || "",
            gender: p.gender || "Laki-laki",
            joinedDate: p.joinedDate || "15 Jan 2025",
            status: p.status || "AKTIF",
          });
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  // Submit Simpan Perubahan ke Database API
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/member/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        localStorage.setItem("gym88_member_profile", JSON.stringify(formData));
        showToast("Profil berhasil diperbarui ke database!", "success");
        router.push("/member/profile");
      } else {
        showToast(json.message || "Gagal memperbarui profil.", "error");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Fallback penyimpanan lokal jika terjadi kendala jaringan
      localStorage.setItem("gym88_member_profile", JSON.stringify(formData));
      showToast("Profil disimpan secara lokal.", "success");
      router.push("/member/profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name: string) => {
    return name ? name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() : "AF";
  };

  return (
    <div className="space-y-6 w-full pb-10">
      {/* Header Section */}
      <div className="flex items-center space-x-4">
        <Link 
          href="/member/profile" 
          className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-sm cursor-pointer"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </Link>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Edit Profil Saya</h1>
          <p className="text-xs text-slate-500">Perbarui informasi data diri akun Gym 88 di database.</p>
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
              <p className="text-slate-500 text-xs font-mono">ID: {formData.nim}</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold inline-block">
                🟢 {formData.status}
              </span>
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-slate-400">
              <i className="fa-solid fa-spinner animate-spin text-lg mr-2"></i> Memuat data profil dari database...
            </div>
          ) : (
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
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium cursor-pointer"
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
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex space-x-3 justify-end">
            <Link 
              href="/member/profile" 
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-2.5 rounded-xl transition text-center cursor-pointer"
            >
              Batal
            </Link>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <i className="fa-solid fa-spinner animate-spin"></i>
                  <span>Menyimpan...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i>
                  <span>Simpan Perubahan</span>
                </>
              )}
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