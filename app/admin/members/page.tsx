"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminMembersPage() {
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [searchQuery, setSearchQuery] = useState("");

  const members = [
    { id: 1, name: "Ahmad Fauzi", nim: "20231001", phone: "081234567890", gender: "Laki-laki", package: "Regular", status: "Aktif" },
    { id: 2, name: "Budi Santoso", nim: "20231003", phone: "081234567892", gender: "Laki-laki", package: "Basic", status: "Kurang Aktif" },
  ];

  return (
    <div className="space-y-4 max-w-6xl mx-auto p-2 sm:p-4 text-slate-700 font-sans text-xs">
      {/* Header Bar */}
      <div className="border-b border-sky-400 pb-2 flex justify-between items-center">
        <h2 className="text-base sm:text-xl font-bold text-sky-500">Membership Gym 88</h2>
        <Link href="/admin/dashboard" className="text-[11px] font-bold text-slate-400 hover:text-sky-600">
          <i className="fa-solid fa-house mr-1"></i> Dashboard
        </Link>
      </div>

      {/* Main Container Card */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-xs p-4 sm:p-6 space-y-4 sm:space-y-6">
        {/* Title & Top Action Buttons (Responsive Wrap) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <h1 className="text-lg sm:text-xl font-extrabold text-sky-600 tracking-tight">
            Pengelolaan Data Anggota (Member)
          </h1>

          {/* Tombol Aksi Terpadu */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2 text-[11px] font-bold uppercase">
            <Link href="/admin/members/form?mode=add" className="bg-sky-400 hover:bg-sky-500 text-white px-3 py-2 rounded shadow-xs flex items-center justify-center space-x-1">
              <i className="fa-solid fa-plus text-xs mr-1"></i>
              <span>TAMBAH</span>
            </Link>
            <Link href={`/admin/members/form?mode=edit&id=${selectedId}`} className="bg-amber-400 hover:bg-amber-500 text-white px-3 py-2 rounded shadow-xs flex items-center justify-center space-x-1">
              <i className="fa-solid fa-pen text-xs mr-1"></i>
              <span>UBAH</span>
            </Link>
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-2 rounded shadow-xs flex items-center justify-center space-x-1">
              <i className="fa-solid fa-trash-can text-xs mr-1"></i>
              <span>HAPUS</span>
            </button>
            <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded shadow-xs flex items-center justify-center space-x-1">
              <i className="fa-solid fa-list text-xs mr-1"></i>
              <span>DAFTAR</span>
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-sky-400 text-white text-[11px] sm:text-xs px-3.5 py-2.5 rounded-xl font-medium shadow-inner flex items-center space-x-2">
          <i className="fa-solid fa-circle-info text-sm shrink-0"></i>
          <span>Menampilkan seluruh daftar rekapitulasi anggota Gym 88. Pilih salah satu baris untuk dikelola.</span>
        </div>

        {/* Search Bar Mobile */}
        <div className="relative w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau NIM member..."
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:border-sky-500"
          />
        </div>

        {/* Responsive Horizontal Scroll Table */}
        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="p-3 text-center w-12">Pilih</th>
                <th className="p-3 w-12">No</th>
                <th className="p-3">Nama Member</th>
                <th className="p-3">NIM / ID</th>
                <th className="p-3">No. HP</th>
                <th className="p-3">Jenis Kelamin</th>
                <th className="p-3">Paket</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {members.map((m, idx) => (
                <tr
                  key={m.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`cursor-pointer transition ${selectedId === m.id ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="radio"
                      name="selectedMember"
                      checked={selectedId === m.id}
                      onChange={() => setSelectedId(m.id)}
                      className="accent-sky-500"
                    />
                  </td>
                  <td className="p-3 text-slate-500">{idx + 1}</td>
                  <td className="p-3 font-bold text-sky-700">{m.name}</td>
                  <td className="p-3 font-mono">{m.nim}</td>
                  <td className="p-3">{m.phone}</td>
                  <td className="p-3">{m.gender}</td>
                  <td className="p-3 font-bold text-slate-900">{m.package}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {m.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Edit Action Button */}
        <div className="flex justify-end pt-2">
          <Link
            href={`/admin/members/form?mode=edit&id=${selectedId}`}
            className="w-full sm:w-auto text-center bg-amber-400 hover:bg-amber-500 text-white font-bold px-4 py-2.5 rounded text-xs shadow-xs transition"
          >
            <i className="fa-solid fa-pen mr-1"></i> Edit Data Terpilih
          </Link>
        </div>
      </div>
    </div>
  );
}