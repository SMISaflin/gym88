"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface GymPackage {
  id: string;
  title: string;
  price: string;
  desc: string[];
  popular: boolean;
}

export default function AdminPackagesPage() {
  const { showToast } = useToast();
  const [packages, setPackages] = useState<GymPackage[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Modal Hapus Kustom
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Ambil data murni dari API database
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/packages");
      const json = await res.json();
      if (json.success) {
        setPackages(json.data);
      } else {
        showToast("Gagal memuat paket dari server.", "error");
      }
    } catch (error) {
      console.error(error);
      showToast("Terjadi kesalahan koneksi database.", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  // Eksekusi Hapus Paket via API
  const confirmDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(`/api/admin/packages?id=${deleteId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast("Paket membership berhasil dihapus!", "success");
        fetchPackages();
      } else {
        showToast(`Gagal menghapus: ${json.message}`, "error");
      }
    } catch (error) {
      showToast("Gagal menghapus paket dari database.", "error");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6 text-slate-800 font-sans text-xs relative">
      
      {/* MODAL KONFIRMASI HAPUS KUSTOM */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-xl font-bold mx-auto">
              <i className="fa-solid fa-trash-can"></i>
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Hapus Paket Ini?</h3>
              <p className="text-slate-500 text-xs">Paket membership akan dihapus secara permanen dari database.</p>
            </div>
            <div className="flex space-x-2 pt-2">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl transition"
              >
                Batal
              </button>
              <button 
                onClick={confirmDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold py-2.5 rounded-xl shadow-xs transition"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header Section Modern */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-200/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Paket Membership Gym 88</h1>
          <p className="text-slate-500 text-[11px] sm:text-xs">Atur master paket langganan, harga, dan fasilitas gym secara terpusat.</p>
        </div>
        <Link 
          href="/admin/packages/form?mode=add"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-xs flex items-center space-x-2"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Tambah Paket Baru</span>
        </Link>
      </div>

      {/* Grid Paket Membership (Dynamic from Database) */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
          <i className="fa-solid fa-spinner animate-spin text-2xl text-blue-600"></i>
          <span>Memuat data paket dari database...</span>
        </div>
      ) : packages.length === 0 ? (
        <div className="bg-white border border-slate-200/80 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-lg mx-auto">
            <i className="fa-solid fa-box-open"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900">Belum Ada Paket Tersedia</h3>
            <p className="text-xs text-slate-500">Silakan tambahkan paket membership baru ke database.</p>
          </div>
          <Link 
            href="/admin/packages/form?mode=add"
            className="inline-flex items-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition"
          >
            <i className="fa-solid fa-plus text-[10px]"></i>
            <span>Tambah Paket</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <div 
              key={pkg.id} 
              className={`bg-white border ${
                pkg.popular ? 'border-blue-600 shadow-md ring-2 ring-blue-600/10' : 'border-slate-200/80'
              } p-6 rounded-3xl flex flex-col justify-between space-y-6 shadow-xs transition hover:shadow-md`}
            >
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-lg font-black text-slate-900">{pkg.title}</h3>
                    {pkg.popular && (
                      <span className="bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full text-[10px] font-bold">
                        Paling Populer
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-black mt-3 text-slate-900">
                    {pkg.price} <span className="text-[10px] font-normal text-slate-500">/ bulan</span>
                  </div>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
                  {pkg.desc.map((d, i) => (
                    <li key={i} className="flex items-center space-x-2.5">
                      <div className="w-4 h-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                        <i className="fa-solid fa-check text-[9px]"></i>
                      </div>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Aksi Card (Edit & Hapus) */}
              <div className="flex space-x-2 pt-4 border-t border-slate-100">
                <Link 
                  href={`/admin/packages/form?mode=edit&id=${pkg.id}`}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 py-2.5 rounded-xl text-xs font-bold transition border border-slate-200/60 flex items-center justify-center space-x-1.5"
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                  <span>Edit</span>
                </Link>
                <button 
                  onClick={() => {
                    setDeleteId(pkg.id);
                    setShowDeleteModal(true);
                  }}
                  className="bg-rose-50 hover:bg-rose-100 text-rose-600 px-4 py-2.5 rounded-xl text-xs font-bold transition border border-rose-200/60 flex items-center justify-center"
                  title="Hapus Paket"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}