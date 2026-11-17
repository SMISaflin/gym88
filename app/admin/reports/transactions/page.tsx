"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ReportNav from "@/components/ReportNav";
import ReportExportToolbar from "@/components/ReportExportToolbar";
import { useToast } from "@/components/ToastProvider";

export default function ReportTransactionsPage() {
  const { showToast } = useToast();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    fetch("/api/admin/reports?type=transactions")
      .then(res => res.json())
      .then(json => {
        if (json.success) setData(json.data);
        else showToast("Gagal memuat laporan transaksi", "error");
      })
      .catch(() => showToast("Kesalahan server", "error"))
      .finally(() => setLoading(false));
  }, []);

  // Filter data berdasarkan status pembayaran yang dipilih
  const filteredData = data.filter(tx => {
    if (statusFilter === "ALL") return true;
    return tx.paymentStatus === statusFilter;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Top Header */}
      <div className="border-b border-blue-400 pb-1 flex justify-between items-center print:hidden">
        <h2 className="text-xl font-bold text-blue-600">Pusat Laporan (Report Center)</h2>
        <Link href="/admin/dashboard" className="text-xs font-bold text-slate-400 hover:text-blue-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 print:hidden">
          <div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight">Laporan Transaksi Keuangan</h1>
            <p className="text-slate-500 text-[11px]">Tinjau riwayat pembayaran, status lunas, metode QRIS/Transfer/Kasir.</p>
          </div>

          {/* Tombol Ekspor Excel & PDF (Hanya mengekspor data hasil filter) */}
          <ReportExportToolbar data={filteredData} filename="Laporan_Transaksi_Gym88" title="Laporan Transaksi Keuangan" />
        </div>

        {/* Navigasi Sejajar 4 Kategori (Disembunyikan saat Print PDF) */}
        <div className="print:hidden">
          <ReportNav />
        </div>

        {/* Toolbar Filter Berdasarkan Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden">
          <div>
            <h3 className="text-sm font-black text-slate-800">Filter Status Pembayaran</h3>
            <p className="text-[11px] text-slate-500">Pilih status untuk menyaring data pada tabel dan hasil ekspor.</p>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-300 rounded-xl px-4 py-2 font-bold text-slate-800 focus:outline-none focus:border-blue-600"
          >
            <option value="ALL">Semua Status</option>
            <option value="SUCCESS">SUCCESS (Lunas)</option>
            <option value="PENDING">PENDING (Menunggu)</option>
            <option value="FAILED">FAILED (Gagal)</option>
          </select>
        </div>

        {/* Tabel Data */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-black text-slate-800">
              Riwayat Pembayaran {statusFilter !== "ALL" ? `(Status: ${statusFilter})` : ""}
            </h3>
            <span className="text-[11px] text-slate-400 font-medium">Menampilkan {filteredData.length} dari {data.length} data</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-slate-200 uppercase text-[10px] font-black">
                  <th className="p-3.5">No</th>
                  <th className="p-3.5">Invoice</th>
                  <th className="p-3.5">Nama Member</th>
                  <th className="p-3.5">Paket</th>
                  <th className="p-3.5">Nominal</th>
                  <th className="p-3.5">Metode</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tanggal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {loading ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-400">Memuat data...</td></tr>
                ) : filteredData.length === 0 ? (
                  <tr><td colSpan={8} className="p-8 text-center text-slate-400">Tidak ada data transaksi dengan status ini.</td></tr>
                ) : (
                  filteredData.map((tx, idx) => (
                    <tr key={tx.id} className="hover:bg-slate-50">
                      <td className="p-3.5 text-slate-400">{idx + 1}</td>
                      <td className="p-3.5 font-bold font-mono text-blue-600">{tx.invoiceNumber}</td>
                      <td className="p-3.5 font-bold">{tx.memberName}</td>
                      <td className="p-3.5">{tx.packageTitle}</td>
                      <td className="p-3.5 font-mono font-bold">{tx.amount}</td>
                      <td className="p-3.5">{tx.paymentMethod}</td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tx.paymentStatus === 'SUCCESS' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : tx.paymentStatus === 'PENDING'
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}>
                          {tx.paymentStatus}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{tx.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}