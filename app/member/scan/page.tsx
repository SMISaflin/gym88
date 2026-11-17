"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";
import { Html5QrcodeScanner } from "html5-qrcode";

export default function MemberScanPage() {
  const { showToast } = useToast();
  const [scanning, setScanning] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    // Inisialisasi Scanner Kamera
    if (scanning && !scannerRef.current) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );

      scanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = scanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch((err) => console.error(err));
        scannerRef.current = null;
      }
    };
  }, [scanning]);

  // Handler jika Kamera Berhasil Membaca QR Code
  const onScanSuccess = async (decodedText: string) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setScanning(false);

    // Ambil data member yang sedang login dari localStorage
    let memberEmail = "";
    let memberCode = "";
    const saved = localStorage.getItem("gym88_member_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) memberEmail = parsed.email;
        if (parsed.nim) memberCode = `GYM88-${parsed.nim}`;
      } catch (e) {
        console.error(e);
      }
    }

    try {
      const res = await fetch("/api/attendance/member-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          qrToken: decodedText,
          memberEmail,
          memberCode,
        }),
      });

      const json = await res.json();

      if (json.success) {
        showToast(json.message, "success");
        setScanResult(json.data);
      } else {
        showToast(json.message, "error");
        setScanning(true); // Re-open scanner jika gagal
      }
    } catch (error) {
      showToast("Gagal terhubung ke server presensi.", "error");
      setScanning(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onScanFailure = (error: any) => {
    // Dipanggil terus menerus saat kamera mencari QR, bisa diabaikan
  };

  return (
    <div className="space-y-6 w-full max-w-md mx-auto pb-10 text-xs text-slate-700 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-md space-y-1 text-center">
        <h1 className="text-xl font-black">Scan QR Absensi 📷</h1>
        <p className="text-blue-100 text-xs">
          Arahkan kamera ponsel Anda ke QR Code yang ada di meja resepsionis Admin Gym 88.
        </p>
      </div>

      <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4 text-center">
        {scanResult ? (
          <div className="space-y-4 py-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto shadow-sm">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black text-slate-900">Presensi Berhasil!</h3>
              <p className="text-slate-600 font-medium">{scanResult.memberName}</p>
              <p className="text-slate-400 text-[11px]">
                Waktu Check-in: <strong>{scanResult.checkInTime} WIB</strong>
              </p>
            </div>
            <Link
              href="/member/attendance"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition shadow-xs"
            >
              Kembali ke Menu Presensi
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Box Kamera Scanner */}
            <div id="qr-reader" className="overflow-hidden rounded-2xl border border-slate-200"></div>

            {isSubmitting && (
              <div className="flex items-center justify-center space-x-2 text-blue-600 font-bold">
                <i className="fa-solid fa-spinner animate-spin"></i>
                <span>Memproses data absensi...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}