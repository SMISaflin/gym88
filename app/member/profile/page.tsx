"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function MemberProfilePage() {
  const { showToast } = useToast();
  
  const [profile, setProfile] = useState({
    name: "Memuat...",
    memberCode: "GYM88-0000",
    nim: "-",
    phone: "-",
    email: "-",
    gender: "Laki-laki",
    joinedDate: "-",
    status: "AKTIF",
  });

  const [loading, setLoading] = useState(true);

  // Ambil data profil terbaru langsung dari tabel database MySQL via API backend
  useEffect(() => {
    async function loadProfileFromDB() {
      let queryParam = "";
      const saved = localStorage.getItem("gym88_member_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) queryParam = `email=${encodeURIComponent(parsed.email)}`;
          else if (parsed.nim) queryParam = `memberCode=GYM88-${parsed.nim}`;
        } catch (e) {
          console.error("Gagal membaca localStorage:", e);
        }
      }

      try {
        setLoading(true);
        const res = await fetch(`/api/member/profile?${queryParam}`);
        const json = await res.json();

        if (json.success && json.data) {
          const data = json.data;
          setProfile({
            name: data.name || "Ahmad Fauzi",
            memberCode: data.memberCode || "GYM88-0012",
            nim: data.memberCode ? data.memberCode.replace("GYM88-", "") : "20231001",
            phone: data.phone || "081234567890",
            email: data.email || "ahmad.fauzi@gmail.com",
            gender: data.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
            joinedDate: data.joinedDate ? new Date(data.joinedDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) : "15 Jan 2025",
            status: data.status || "AKTIF",
          });
        } else {
          showToast("Gagal memuat profil dari database.", "error");
        }
      } catch (error) {
        console.error("Koneksi API Error:", error);
        showToast("Terjadi kesalahan jaringan.", "error");
      } finally {
        setLoading(false);
      }
    }

    loadProfileFromDB();
  }, []);

  // Inisial untuk avatar lingkaran
  const getInitials = (name: string) => {
    return name && name !== "Memuat..." 
      ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() 
      : "AF";
  };

  return (
    <div className="space-y-6 w-full text-xs text-slate-700 font-sans pb-10">
      {/* Header Section */}
      <div className="flex justify-between items-center border-b border-slate-200/60 pb-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Profil Saya</h1>
          <p className="text-slate-500 text-xs">Informasi akun dan status keanggotaan aktif di Gym 88.</p>
        </div>
        <Link 
          href="/member/attendance"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-xs flex items-center space-x-2"
        >
          <i className="fa-solid fa-check-to-slot"></i>
          <span>Menu Absen Kehadiran</span>
        </Link>
      </div>

      {/* Main Full-Width Grid Layout (3 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom 1 & 2: Informasi Utama Profil */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-sm">
              {getInitials(profile.name)}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">{profile.name}</h3>
              <p className="text-blue-600 font-mono font-bold text-xs">{profile.memberCode}</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold inline-block">
                🟢 {profile.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">ID Anggota (Member Code)</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{profile.memberCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">Jenis Kelamin</span>
                <span className="font-bold text-slate-900 text-sm">{profile.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">No. Handphone / WhatsApp</span>
                <span className="font-bold text-slate-900 text-sm">{profile.phone}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">Alamat Email</span>
                <span className="font-bold text-slate-900 text-sm">{profile.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">Tanggal Bergabung</span>
                <span className="font-bold text-slate-900 text-sm">{profile.joinedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium uppercase text-[10px]">Status Akun Database</span>
                <span className="font-bold text-emerald-600 text-sm">Terverifikasi MySQL</span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-end">
            <Link 
              href="/member/profile/edit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-sm flex items-center space-x-2"
            >
              <i className="fa-solid fa-pen-to-square"></i>
              <span>Edit Profil</span>
            </Link>
          </div>
        </div>

        {/* Kolom 3: Ringkasan Paket & Keamanan */}
        <div className="space-y-6">
          {/* Paket Aktif Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Paket Latihan Aktif</span>
              <i className="fa-solid fa-id-card text-blue-500"></i>
            </h3>
            <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-black text-blue-900 text-xs">Regular Membership</span>
                <span className="bg-blue-600 text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold">Aktif</span>
              </div>
              <p className="text-slate-600 text-[11px]">Fasilitas gym lengkap & akses mesin fitness.</p>
            </div>
          </div>

          {/* Keamanan Akun Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-3">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Keamanan Akun</span>
              <i className="fa-solid fa-shield-halved text-slate-400"></i>
            </h3>
            <Link 
              href="/member/profile/security"
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition border border-slate-200 text-center flex items-center justify-center space-x-2"
            >
              <i className="fa-solid fa-lock text-slate-500"></i>
              <span>Ubah Password</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}