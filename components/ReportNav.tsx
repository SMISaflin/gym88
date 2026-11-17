// components/ReportNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ReportNav() {
  const pathname = usePathname();

  const menus = [
    { title: "Transaksi", icon: "fa-receipt", href: "/admin/reports/transactions" },
    { title: "Status Anggota", icon: "fa-users", href: "/admin/reports/members" },
    { title: "Kehadiran", icon: "fa-user-clock", href: "/admin/reports/attendance" },
    { title: "Paket Gym", icon: "fa-box-archive", href: "/admin/reports/packages" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
      {menus.map((m, idx) => {
        const isActive = pathname === m.href;
        return (
          <Link
            key={idx}
            href={m.href}
            className={`flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl font-bold transition text-xs ${
              isActive 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/60'
            }`}
          >
            <i className={`fa-solid ${m.icon}`}></i>
            <span className="truncate">{m.title}</span>
          </Link>
        );
      })}
    </div>
  );
}