import Link from "next/link";

export default function MemberLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex overflow-hidden min-h-screen">
      {/* Sidebar Member - Light Theme */}
      <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col space-y-1.5 shrink-0 shadow-sm">
        {/* Brand Logo & Title */}
        <div className="px-3 py-2 flex items-center space-x-3 mb-2">
          <div className="bg-blue-600 text-white font-black px-2.5 py-1 rounded-lg text-base tracking-wider shadow-sm">
            GYM 88
          </div>
          <span className="text-[10px] font-extrabold text-slate-500 uppercase">Member Portal</span>
        </div>

        {/* Section Title */}
        <div className="text-[9px] font-black text-slate-400 uppercase px-3 mb-1 tracking-widest">
          Navigasi Member
        </div>

        {/* Navigation Links */}
        <NavLink href="/member/dashboard" icon="fa-house" label="Dashboard" />
        <NavLink href="/member/register" icon="fa-cart-plus" label="Pendaftaran" />
        <NavLink href="/member/attendance" icon="fa-qrcode" label="Absen" />
        <NavLink href="/member/history" icon="fa-clock-rotate-left" label="Riwayat Kehadiran" />
        <NavLink href="/member/profile" icon="fa-user" label="Profil" />

        {/* Logout Footer */}
        <div className="pt-6 mt-auto border-t border-slate-100">
          <Link 
            href="/" 
            className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center space-x-2 transition"
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