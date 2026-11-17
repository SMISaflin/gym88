"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface Transaction {
  id: string;
  invoiceNumber: string;
  memberName: string;
  packageTitle: string;
  amount: string;
  paymentMethod: string;
  paymentStatus: string;
  paidAt: string;
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<"daftar" | "tambah">("daftar");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Data master untuk form pilihan
  const [members, setMembers] = useState<any[]>([]);
  const [packages, setPackages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    memberProfileId: "",
    packageId: "",
    paymentMethod: "QRIS",
    paymentStatus: "SUCCESS",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/transactions");
      const json = await res.json();
      if (json.success) {
        setTransactions(json.data);
        if (json.data.length > 0 && (!selectedId || !json.data.some((t: Transaction) => t.id === selectedId))) {
          setSelectedId(json.data[0].id);
        }
      } else {
        showToast("Gagal memuat data transaksi.", "error");
      }
    } catch (error) {
      showToast("Kesalahan koneksi database.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Ambil daftar member dan paket untuk dropdown form
  const fetchMasterData = async () => {
    try {
      const [resMembers, resPackages] = await Promise.all([
        fetch("/api/admin/members"),
        fetch("/api/admin/packages")
      ]);
      const jsonM = await resMembers.json();
      const jsonP = await resPackages.json();

      if (jsonM.success) setMembers(jsonM.data);
      if (jsonP.success) setPackages(jsonP.data);
    } catch (error) {
      console.error("Gagal memuat master data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchMasterData();
  }, []);

  const handleOpenTambah = () => {
    setFormData({
      memberProfileId: members.length > 0 ? members[0].id : "",
      packageId: packages.length > 0 ? packages[0].id : "",
      paymentMethod: "QRIS",
      paymentStatus: "SUCCESS",
    });
    setMode("tambah");
  };

  const handleHapus = async () => {
    if (!selectedId) {
      showToast("Pilih transaksi yang ingin dihapus!", "warning");
      return;
    }

    if (window.confirm("Apakah Anda yakin ingin menghapus data transaksi ini?")) {
      try {
        const res = await fetch(`/api/admin/transactions?id=${selectedId}`, {
          method: "DELETE",
        });
        const json = await res.json();
        if (json.success) {
          showToast("Transaksi berhasil dihapus!", "success");
          fetchData();
          setSelectedId(null);
        } else {
          showToast(`Gagal: ${json.message}`, "error");
        }
      } catch (error) {
        showToast("Terjadi kesalahan sistem.", "error");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.memberProfileId || !formData.packageId) {
      showToast("Pilih member dan paket membership terlebih dahulu!", "warning");
      return;
    }

    try {
      const res = await fetch("/api/admin/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (json.success) {
        showToast("Transaksi pembayaran berhasil dicatat!", "success");
        fetchData();
        setMode("daftar");
      } else {
        showToast(`Gagal: ${json.message}`, "error");
      }
    } catch (error) {
      showToast("Kesalahan koneksi ke server.", "error");
    }
  };

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header / Breadcrumb Style */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center">
        <h2 className="text-xl font-bold text-blue-600">Manajemen Transaksi & Pembayaran</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs p-6 space-y-6">
        {/* Title & Top Action Buttons */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              Riwayat Pembayaran Gym 88
            </h1>
            <p className="text-slate-500 text-[11px]">Kelola pencatatan tagihan, metode pembayaran, dan status lunas.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-bold uppercase text-[11px]">
            <button 
              onClick={handleOpenTambah}
              className={`px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition text-white ${mode === 'tambah' ? 'bg-blue-700 ring-2 ring-blue-300' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              <i className="fa-solid fa-plus text-xs"></i>
              <span>Catat Transaksi Baru</span>
            </button>
            <button 
              onClick={() => setMode("daftar")}
              className={`px-3.5 py-2.5 rounded-xl shadow-xs flex items-center space-x-1.5 transition text-white ${mode === 'daftar' ? 'bg-emerald-700 ring-2 ring-emerald-300' : 'bg-emerald-600 hover:bg-emerald-700'}`}
            >
              <i className="fa-solid fa-list text-xs"></i>
              <span>Daftar Transaksi</span>
            </button>
          </div>
        </div>

        {/* Info Banner Box */}
        <div className="bg-blue-50/70 border border-blue-100 text-blue-900 px-4 py-3 rounded-2xl flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
            <i className="fa-solid fa-receipt text-sm"></i>
          </div>
          <span className="text-[11px] sm:text-xs font-medium">
            {mode === "daftar" && "Seluruh transaksi pembayaran paket membership tercatat secara real-time dari database MySQL."}
            {mode === "tambah" && "Formulir pencatatan transaksi manual kasir atau validasi pembayaran QRIS/Transfer."}
          </span>
        </div>

        {/* KONTEN UTAMA: MODE DAFTAR (TABEL) */}
        {mode === "daftar" && (
          <div className="space-y-4">
            <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-2xs">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase tracking-wider text-[10px] font-black">
                    <th className="p-3.5 text-center w-14">Pilih</th>
                    <th className="p-3.5 w-12">No</th>
                    <th className="p-3.5">No. Invoice</th>
                    <th className="p-3.5">Nama Member</th>
                    <th className="p-3.5">Paket Gym</th>
                    <th className="p-3.5">Nominal</th>
                    <th className="p-3.5">Metode</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Tanggal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  {loading ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        <i className="fa-solid fa-spinner animate-spin text-xl text-blue-600 mr-2"></i> Memuat data transaksi...
                      </td>
                    </tr>
                  ) : transactions.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="p-8 text-center text-slate-400">
                        Belum ada riwayat transaksi pembayaran di database.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx, idx) => (
                      <tr 
                        key={tx.id} 
                        onClick={() => setSelectedId(tx.id)}
                        className={`cursor-pointer transition-colors ${selectedId === tx.id ? 'bg-blue-50/60 font-semibold' : 'hover:bg-slate-50/80'}`}
                      >
                        <td className="p-3.5 text-center">
                          <input 
                            type="radio" 
                            name="selectedTx" 
                            checked={selectedId === tx.id} 
                            onChange={() => setSelectedId(tx.id)}
                            className="accent-blue-600 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="p-3.5 text-slate-400 font-mono">{idx + 1}</td>
                        <td className="p-3.5 font-bold font-mono text-blue-700">{tx.invoiceNumber}</td>
                        <td className="p-3.5 font-bold text-slate-900">{tx.memberName}</td>
                        <td className="p-3.5 text-slate-700">{tx.packageTitle}</td>
                        <td className="p-3.5 font-mono font-bold text-slate-900">{tx.amount}</td>
                        <td className="p-3.5 font-semibold text-slate-600">{tx.paymentMethod}</td>
                        <td className="p-3.5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center space-x-1 ${
                            tx.paymentStatus === 'SUCCESS' 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60' 
                              : tx.paymentStatus === 'PENDING'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                              : 'bg-rose-50 text-rose-700 border border-rose-200/60'
                          }`}>
                            <span>{tx.paymentStatus}</span>
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">{tx.createdAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400 text-[11px]">Total Transaksi: {transactions.length} data</span>
              <button 
                onClick={handleHapus}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs transition flex items-center space-x-2"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>Hapus Transaksi Terpilih</span>
              </button>
            </div>
          </div>
        )}

        {/* KONTEN UTAMA: MODE TAMBAH (FORMULIR) */}
        {mode === "tambah" && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 text-xs">
              {/* Pilih Member */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Pilih Anggota (Member) <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.memberProfileId}
                  onChange={(e) => setFormData({ ...formData, memberProfileId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="">-- Pilih Member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.nim})
                    </option>
                  ))}
                </select>
              </div>

              {/* Pilih Paket */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">
                  Pilih Paket Membership <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.packageId}
                  onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="">-- Pilih Paket --</option>
                  {packages.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title} ({p.price})
                    </option>
                  ))}
                </select>
              </div>

              {/* Metode Pembayaran */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Metode Pembayaran</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="QRIS">QRIS</option>
                  <option value="TRANSFER">Transfer Bank</option>
                  <option value="CASHIER">Kasir Tunai</option>
                </select>
              </div>

              {/* Status Pembayaran */}
              <div className="space-y-1">
                <label className="font-bold text-slate-700">Status Pembayaran</label>
                <select
                  value={formData.paymentStatus}
                  onChange={(e) => setFormData({ ...formData, paymentStatus: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="SUCCESS">SUCCESS (Lunas / Aktifkan)</option>
                  <option value="PENDING">PENDING (Menunggu)</option>
                  <option value="FAILED">FAILED (Gagal)</option>
                </select>
              </div>
            </div>

            {/* Tombol Simpan Form */}
            <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMode("daftar")}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-5 py-2.5 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-xs transition"
              >
                Simpan & Catat Transaksi
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}