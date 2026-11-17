"use client";

import { useState, useEffect, Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

interface AttendanceDetailItem {
  id: string;
  date: string;
  checkInTime: string;
  status: string;
  notes: string;
}

interface MemberDetailData {
  id: string;
  name: string;
  memberCode: string;
  phone: string;
  email: string;
  joinedDate: string;
  status: string;
  totalPresent: number;
  totalAbsent: number;
  attendances: AttendanceDetailItem[];
  absentDays: string[];
}

// 1. Komponen Konten Utama (Berisi semua hook useParams & useSearchParams)
function AttendanceDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { showToast } = useToast();

  const memberId = params.id as string;
  const month = searchParams.get("month") || "10";
  const year = searchParams.get("year") || "2026";

  const [memberData, setMemberData] = useState<MemberDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMemberDetail() {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/attendance/${memberId}?month=${month}&year=${year}`);
        const json = await res.json();

        if (json.success) {
          setMemberData(json.data);
        } else {
          showToast(json.message || "Gagal memuat detail kehadiran member.", "error");
        }
      } catch (error) {
        showToast("Terjadi kesalahan koneksi ke server.", "error");
      } finally {
        setLoading(false);
      }
    }

    if (memberId) {
      fetchMemberDetail();
    }
  }, [memberId, month, year, showToast]);

  const monthsList: Record<string, string> = {
    "01": "Januari", "02": "Februari", "03": "Maret", "04": "April",
    "05": "Mei", "06": "Juni", "07": "Juli", "08": "Agustus",
    "09": "September", "10": "Oktober", "11": "November", "12": "Desember"
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4 text-slate-700 font-sans text-xs">
      {/* Header Navigasi & Judul */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <Link 
            href={`/admin/attendance`}
            className="w-9 h-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 transition shadow-xs"
          >
            <i className="fa-solid fa-arrow-left"></i>
          </Link>
          <div>
            <h2 className="text-xl font-black text-slate-900">Detail Kehadiran Member</h2>
            <p className="text-slate-500 text-[11px]">
              Periode: <strong className="text-blue-600">{monthsList[month]} {year}</strong>
            </p>
          </div>
        </div>

        <Link 
          href="/admin/attendance"
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl transition"
        >
          Kembali ke Rekapitulasi
        </Link>
      </div>

      {loading ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400 space-y-2">
          <i className="fa-solid fa-spinner animate-spin text-2xl text-blue-600"></i>
          <p>Memuat data detail kehadiran dari database...</p>
        </div>
      ) : memberData ? (
        <div className="space-y-6">
          
          {/* Kartu Profil Singkat & Statistik */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="space-y-1 md:col-span-2">
              <span className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full font-bold">
                {memberData.memberCode}
              </span>
              <h3 className="text-lg font-black text-slate-900">{memberData.name}</h3>
              <p className="text-slate-500 text-[11px]">No. HP / WA: <strong className="text-slate-800">{memberData.phone}</strong></p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center space-y-0.5">
              <span className="text-[10px] text-emerald-700 font-bold uppercase block">Total Hadir</span>
              <span className="text-xl font-black text-emerald-600">{memberData.totalPresent} Hari</span>
            </div>

            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl text-center space-y-0.5">
              <span className="text-[10px] text-rose-700 font-bold uppercase block">Tidak Hadir (Alpa)</span>
              <span className="text-xl font-black text-rose-600">{memberData.totalAbsent} Hari</span>
            </div>
          </div>

          {/* Grid 2 Kolom: Riwayat Kehadiran vs Daftar Hari Alpa */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Tabel Log Kehadiran Masuk */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Log Kehadiran Masuk ({monthsList[month]} {year})</span>
                <i className="fa-solid fa-calendar-check text-blue-500"></i>
              </h3>

              <div className="overflow-x-auto border border-slate-200/80 rounded-2xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200/80 uppercase text-[10px] font-black">
                      <th className="p-3">Tanggal</th>
                      <th className="p-3">Jam Masuk</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                    {memberData.attendances.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-slate-400">
                          Tidak ada catatan kehadiran pada periode ini.
                        </td>
                      </tr>
                    ) : (
                      memberData.attendances.map((att) => (
                        <tr key={att.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{att.date}</td>
                          <td className="p-3 font-mono text-slate-600">{att.checkInTime} WIB</td>
                          <td className="p-3">
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 rounded-full text-[10px] font-bold">
                              {att.status}
                            </span>
                          </td>
                          <td className="p-3 text-slate-500">{att.notes}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Daftar Hari Tidak Hadir / Alpa */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                <span>Daftar Hari Tidak Hadir (Alpa)</span>
                <i className="fa-solid fa-calendar-xmark text-rose-500"></i>
              </h3>

              {memberData.absentDays.length === 0 ? (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl text-center space-y-2">
                  <i className="fa-solid fa-circle-check text-2xl text-emerald-600"></i>
                  <p className="font-bold">Luar Biasa! Member ini selalu hadir penuh pada bulan ini.</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-2 pr-1">
                  {memberData.absentDays.map((day, idx) => (
                    <div key={idx} className="bg-rose-50 border border-rose-200 text-rose-900 p-3 rounded-2xl flex items-center justify-between font-mono">
                      <span className="font-bold text-xs">{day}</span>
                      <span className="text-[10px] bg-rose-200 text-rose-800 px-2.5 py-1 rounded-lg font-bold">Tidak Hadir</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-3xl p-16 text-center text-slate-400">
          Data member tidak ditemukan.
        </div>
      )}
    </div>
  );
}

// 2. Export Default Komponen yang Dibungkus Suspense (Wajib untuk Next.js App Router)
export default function AdminMemberAttendanceDetailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center text-slate-400 space-x-2">
        <i className="fa-solid fa-spinner animate-spin text-xl text-blue-600"></i>
        <span>Memuat halaman detail...</span>
      </div>
    }>
      <AttendanceDetailContent />
    </Suspense>
  );
}