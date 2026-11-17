// app/admin/layout.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ToastProvider, useToast } from "@/components/ToastProvider";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", {
        method: "POST",
      });

      if (res.ok) {
        showToast("Berhasil keluar dari akun.", "success");
        // Redirect ke halaman login dan refresh router agar cache bersih
        setTimeout(() => {
          router.push("/login");
          router.refresh();
        }, 800);
      } else {
        showToast("Gagal melakukan logout.", "error");
      }
    } catch (error) {
      showToast("Terjadi kesalahan pada server.", "error");
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden min-h-screen font-sans">
      {/* Sidebar - Theme Background Putih */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col space-y-1.5 shrink-0 shadow-xs">
        {/* Brand Logo & Title */}
        <div className="px-3 py-2 flex items-center space-x-3 mb-2">
          <div className="bg-blue-600 text-white font-black px-2.5 py-1 rounded-lg text-base tracking-wider shadow-xs">
            GYM 88
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Admin Panel</span>
        </div>

        {/* Section Title */}
        <div className="text-[9px] font-black text-slate-400 uppercase px-3 mb-1 tracking-widest">
          Navigasi Utama
        </div>

        {/* Navigation Links */}
        <NavLink href="/admin/dashboard" icon="fa-chart-pie" label="Dashboard" />
        <NavLink href="/admin/members" icon="fa-users" label="Data Member" />
        <NavLink href="/admin/attendance" icon="fa-calendar-check" label="Absensi & Presensi" />
        <NavLink href="/admin/personal-training" icon="fa-filter-circle-dollar" label="Personal Training" />
        <NavLink href="/admin/packages" icon="fa-tags" label="Paket Membership" />
        <NavLink href="/admin/transactions" icon="fa-exchange-alt" label="Transaksi" />
        <NavLink href="/admin/reports" icon="fa-file-invoice-dollar" label="Laporan" />

        {/* User Info, Profile Link & Logout Footer */}
        <div className="pt-4 mt-auto border-t border-slate-100 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
            Pengaturan Akun
          </div>

          {/* Link Profil Admin */}
          <Link 
            href="/admin/profile" 
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 flex items-center space-x-2.5 transition"
          >
            <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user-shield text-xs"></i>
            </div>
            <div className="truncate">
              <span className="block leading-tight">Profil Saya</span>
              <span className="text-[10px] font-medium text-slate-400 block">Admin Administrator</span>
            </div>
          </Link>

          {/* Tombol Keluar (Logout) Interaktif */}
          <button 
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2.5 transition cursor-pointer"
          >
            <div className="w-6 h-6 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
              <i className="fa-solid fa-right-from-bracket text-xs"></i>
            </div>
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area - Light Background */}
      <main className="flex-1 bg-slate-50 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

function NavLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link 
      href={href} 
      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600"
    >
      <i className={`fa-solid ${icon} w-4 text-center text-blue-600`}></i>
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ToastProvider>
  );
}