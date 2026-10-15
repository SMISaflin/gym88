import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex overflow-hidden min-h-screen">
      {/* Sidebar - Theme Background Putih */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col space-y-1.5 shrink-0 shadow-sm">
        {/* Brand Logo & Title */}
        <div className="px-3 py-2 flex items-center space-x-3 mb-2">
          <div className="bg-blue-600 text-white font-black px-2.5 py-1 rounded-lg text-base tracking-wider shadow-sm">
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
        <NavLink href="/admin/packages" icon="fa-tags" label="Paket Membership" />
        <NavLink href="/admin/classification" icon="fa-filter-circle-dollar" label="Klasifikasi Member" />
        <NavLink href="/admin/reports" icon="fa-file-invoice-dollar" label="Laporan" />
        <NavLink href="/admin/settings" icon="fa-gear" label="Pengaturan" />

        {/* User Info & Logout Footer */}
        <div className="pt-6 mt-auto border-t border-slate-100">
          <div className="px-3 py-2 text-xs font-bold text-slate-700 flex items-center space-x-2">
            <i className="fa-solid fa-user-shield text-blue-600"></i>
            <span>Admin Administrator</span>
          </div>
          <Link 
            href="/" 
            className="mt-2 w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition"
          >
            <i className="fa-solid fa-right-from-bracket w-4"></i>
            <span>Keluar</span>
          </Link>
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