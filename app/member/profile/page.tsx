"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function MemberProfilePage() {
  const [profile, setProfile] = useState({
    name: "Ahmad Fauzi",
    nim: "20231001",
    phone: "081234567890",
    email: "ahmad.fauzi@gmail.com",
    gender: "Laki-laki",
    joinedDate: "15 Jan 2025",
    status: "AKTIF",
  });

  // Load data profil terbaru dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gym88_member_profile");
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Inisial untuk avatar lingkaran
  const getInitials = (name: string) => {
    return name ? name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase() : "AF";
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Profil Saya</h1>
        <p className="text-xs text-slate-500">Informasi akun dan status member Gym 88.</p>
      </div>

      {/* Main Full-Width Grid Layout (3 Kolom) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 & 2: Informasi Utama Profil */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-6 text-xs">
          <div className="flex items-center space-x-4 border-b border-slate-100 pb-5">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-sm">
              {getInitials(profile.name)}
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-slate-900">{profile.name}</h3>
              <p className="text-slate-500 text-xs">ID: GYM88-0012</p>
              <span className="text-[10px] bg-emerald-50 text-emerald-600 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold inline-block">
                🟢 {profile.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">NIM / ID Anggota</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{profile.nim}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">Jenis Kelamin</span>
                <span className="font-bold text-slate-900 text-sm">{profile.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">No. Handphone</span>
                <span className="font-bold text-slate-900 text-sm">{profile.phone}</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">Email</span>
                <span className="font-bold text-slate-900 text-sm">{profile.email}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">Tanggal Bergabung</span>
                <span className="font-bold text-slate-900 text-sm">{profile.joinedDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block mb-0.5 font-medium">Status Akun</span>
                <span className="font-bold text-emerald-600 text-sm">Terverifikasi</span>
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
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4 text-xs">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">Paket Aktif</h3>
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-700 text-sm">Regular Membership</span>
                <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-[10px] font-bold">Aktif</span>
              </div>
              <p className="text-slate-600">Berlaku sampai: <strong>15 Feb 2026</strong></p>
            </div>
            <div className="space-y-2 text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Sisa Sesi / Hari:</span>
                <span className="font-bold text-slate-900">22 Hari</span>
              </div>
              <div className="flex justify-between">
                <span>Total Kehadiran:</span>
                <span className="font-bold text-slate-900">22 / 30 Hari</span>
              </div>
            </div>
          </div>

          {/* Keamanan Akun Card */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-3 text-xs">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3">Keamanan Akun</h3>
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