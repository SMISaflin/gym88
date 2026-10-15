"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const initialPackages = [
  { id: 1, title: "Basic", price: "Rp 150.000", desc: ["Akses gym", "Locker", "1x Trainer (opsional)"], popular: false },
  { id: 2, title: "Regular", price: "Rp 250.000", desc: ["Akses gym", "Locker", "2x Trainer (opsional)", "Kelas grup"], popular: true },
  { id: 3, title: "Premium", price: "Rp 400.000", desc: ["Akses gym sepuasnya", "Locker VIP", "Unlimited trainer", "Body composition"], popular: false },
];

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState(initialPackages);

  useEffect(() => {
    const saved = localStorage.getItem("gym_packages");
    if (saved) {
      try {
        setPackages(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveToStorage = (updated: typeof initialPackages) => {
    setPackages(updated);
    localStorage.setItem("gym_packages", JSON.stringify(updated));
  };

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus paket membership ini?")) {
      const updated = packages.filter((p) => p.id !== id);
      saveToStorage(updated);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Paket Membership</h1>
          <p className="text-xs text-slate-500">Atur paket langganan dan fasilitas gym.</p>
        </div>
        <Link 
          href="/admin/packages/form?mode=add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-sm flex items-center space-x-2"
        >
          <i className="fa-solid fa-plus mr-1"></i>
          <span>Tambah Paket</span>
        </Link>
      </div>

      {/* Grid Paket Membership - Light Theme */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div 
            key={pkg.id} 
            className={`bg-white border ${
              pkg.popular ? 'border-blue-600 shadow-md ring-1 ring-blue-600/20' : 'border-slate-200'
            } p-6 rounded-2xl flex flex-col justify-between space-y-6 shadow-sm transition`}
          >
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-black text-slate-900">{pkg.title}</h3>
                  {pkg.popular && (
                    <span className="bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                      Populer
                    </span>
                  )}
                </div>
                <div className="text-2xl font-black mt-2 text-slate-900">
                  {pkg.price} <span className="text-[10px] font-normal text-slate-500">/ bulan</span>
                </div>
              </div>
              <ul className="space-y-2 text-xs text-slate-600">
                {pkg.desc.map((d, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <i className="fa-solid fa-check text-blue-600 text-[10px]"></i>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Aksi Card (Edit & Hapus) */}
            <div className="flex space-x-2 pt-2 border-t border-slate-100">
              <Link 
                href={`/admin/packages/form?mode=edit&id=${pkg.id}`}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold transition border border-slate-200 flex items-center justify-center space-x-1"
              >
                <i className="fa-solid fa-pen-to-square"></i>
                <span>Edit</span>
              </Link>
              <button 
                onClick={() => handleDelete(pkg.id)}
                className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-2 rounded-xl text-xs font-bold transition border border-rose-200"
                title="Hapus Paket"
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}