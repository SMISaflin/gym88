"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const availablePackages = [
  { id: "daily", title: "Daily Pass", price: 35000, formattedPrice: "Rp 35.000", desc: ["Akses gym 1 hari", "Locker harian", "Cocok untuk kunjungan singkat"], popular: false, isDaily: true },
  { id: "basic", title: "Basic", price: 150000, formattedPrice: "Rp 150.000", desc: ["Akses gym standar", "Locker harian", "1x Trainer (opsional)"], popular: false, isDaily: false },
  { id: "regular", title: "Regular", price: 250000, formattedPrice: "Rp 250.000", desc: ["Akses gym sepuasnya", "Locker harian", "2x Trainer (opsional)", "Gratis kelas grup"], popular: true, isDaily: false },
  { id: "premium", title: "Premium", price: 400000, formattedPrice: "Rp 400.000", desc: ["Akses gym 24/7", "Locker VIP khusus", "Unlimited Trainer consultation", "Analisis Body Composition"], popular: false, isDaily: false },
];

export default function MemberRegisterPage() {
  const [currentStep, setCurrentStep] = useState(1); // 1: Data Diri, 2: Pilih Paket, 3: Konfirmasi, 4: Selesai

  // Step 1: Form Data Diri
  const [formData, setFormData] = useState({
    name: "Ahmad Fauzi",
    nim: "20231001",
    phone: "081234567890",
    email: "ahmad.fauzi@gmail.com",
    gender: "Laki-laki",
  });

  // Step 2: Paket & Durasi (Bisa hari atau bulan tergantung jenis paket)
  const [selectedPackageId, setSelectedPackageId] = useState("regular");
  const [duration, setDuration] = useState(1);

  // Step 3: Pembayaran
  const [paymentMethod, setPaymentMethod] = useState("qris");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load data profil terkini jika ada di localStorage
  useEffect(() => {
    const saved = localStorage.getItem("gym88_member_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFormData((prev) => ({
          ...prev,
          name: parsed.name || prev.name,
          nim: parsed.nim || prev.nim,
          phone: parsed.phone || prev.phone,
          email: parsed.email || prev.email,
          gender: parsed.gender || prev.gender,
        }));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const selectedPkg = availablePackages.find((p) => p.id === selectedPackageId) || availablePackages[1];
  const totalPrice = selectedPkg.price * duration;
  const formattedTotalPrice = `Rp ${totalPrice.toLocaleString("id-ID")}`;

  // Reset durasi ke 1 ketika mengganti tipe paket
  const handleSelectPackage = (pkgId) => {
    setSelectedPackageId(pkgId);
    setDuration(1);
  };

  // Handler Submit Pembayaran (Step 3 -> Step 4)
  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const durationUnit = selectedPkg.isDaily ? "Hari" : "Bulan";
      const timeMultiplier = selectedPkg.isDaily ? duration * 24 * 60 * 60 * 1000 : duration * 30 * 24 * 60 * 60 * 1000;

      // Simpan status paket baru ke localStorage
      const activePackageData = {
        packageName: selectedPkg.title + (selectedPkg.isDaily ? " Pass" : " Membership"),
        price: formattedTotalPrice,
        durationText: `${duration} ${durationUnit}`,
        paymentMethod: paymentMethod.toUpperCase(),
        startDate: new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        endDate: new Date(Date.now() + timeMultiplier).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        status: "Aktif",
      };

      localStorage.setItem("gym88_active_package", JSON.stringify(activePackageData));
      setIsProcessing(false);
      setCurrentStep(4);
    }, 1200);
  };

  return (
    <div className="space-y-6 w-full pb-10 text-xs">
      {/* Top Hero Banner Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Pendaftaran Gym 88
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Pendaftaran Member & Harian 💳</h1>
          <p className="text-blue-100 text-xs md:text-sm">
            Daftarkan akun atau pilih paket harian / langganan latihan Anda secara mudah.
          </p>
        </div>
      </div>

      {/* Main Full-Width Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Kolom): Form Multi-step */}
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-sm space-y-6">
          {/* Step Progress Indicator Bar */}
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-6 text-center font-bold">
            <div className={`flex flex-col md:flex-row items-center justify-center space-x-2 pb-2 transition ${currentStep >= 1 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>1</span>
              <span>Data Diri</span>
            </div>
            <div className={`flex flex-col md:flex-row items-center justify-center space-x-2 pb-2 transition ${currentStep >= 2 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>2</span>
              <span>Pilih Paket</span>
            </div>
            <div className={`flex flex-col md:flex-row items-center justify-center space-x-2 pb-2 transition ${currentStep >= 3 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>3</span>
              <span>Konfirmasi</span>
            </div>
          </div>

          {/* STEP 1: FORM DATA DIRI */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">Konfirmasi Data Diri Pengunjung / Member</h3>
                <p className="text-slate-500 text-xs">Pastikan informasi di bawah ini sudah sesuai sebelum memilih paket.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">NIM / ID Anggota <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.nim}
                    onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-mono font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">No. Handphone / WhatsApp <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alamat Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-blue-600 transition font-medium"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition shadow-sm flex items-center space-x-2"
                >
                  <span>Lanjut Pilih Paket</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: PILIH PAKET & DURASI */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">Pilih Paket Harian atau Membership Gym 88</h3>
                <p className="text-slate-500 text-xs">Pilih Daily Pass untuk kunjungan harian atau paket bulanan sesuai kebutuhan latihan Anda.</p>
              </div>

              {/* Grid Kartu Opsi Paket */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {availablePackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    onClick={() => handleSelectPackage(pkg.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition flex flex-col justify-between space-y-4 relative ${
                      selectedPackageId === pkg.id
                        ? "bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-sm"
                        : "bg-white border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {pkg.popular && (
                      <span className="absolute -top-2.5 right-4 bg-blue-600 text-white text-[9px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                        Paling Populer
                      </span>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="font-black text-sm text-slate-900">{pkg.title}</h4>
                        <input
                          type="radio"
                          name="packageOption"
                          checked={selectedPackageId === pkg.id}
                          onChange={() => handleSelectPackage(pkg.id)}
                          className="accent-blue-600 w-4 h-4"
                        />
                      </div>
                      <div className="text-lg font-black text-slate-900">
                        {pkg.formattedPrice} <span className="text-[10px] font-medium text-slate-500">{pkg.isDaily ? "/ hari" : "/ bln"}</span>
                      </div>
                      <ul className="space-y-1.5 pt-2 text-[11px] text-slate-600">
                        {pkg.desc.map((d, i) => (
                          <li key={i} className="flex items-center space-x-1.5">
                            <i className="fa-solid fa-check text-blue-600 text-[10px]"></i>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Opsi Durasi Langganan / Hari */}
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <label className="block text-slate-800 font-bold">
                  {selectedPkg.isDaily ? "Pilih Jumlah Hari Kunjungan:" : "Pilih Durasi Langganan:"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedPkg.isDaily ? (
                    [1, 3, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDuration(days)}
                        className={`py-2.5 rounded-xl font-bold transition border ${
                          duration === days
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {days} Hari {days > 1 && `(Hemat)`}
                      </button>
                    ))
                  ) : (
                    [1, 3, 6].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setDuration(months)}
                        className={`py-2.5 rounded-xl font-bold transition border ${
                          duration === months
                            ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                            : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {months} Bulan {months > 1 && `(Hemat)`}
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl transition"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition shadow-sm flex items-center space-x-2"
                >
                  <span>Lanjut Konfirmasi</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: KONFIRMASI & PEMBAYARAN */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">Konfirmasi Pembayaran</h3>
                <p className="text-slate-500 text-xs">Periksa kembali pesanan paket dan pilih metode pembayaran.</p>
              </div>

              {/* Pilih Metode Pembayaran */}
              <div className="space-y-3">
                <label className="block text-slate-800 font-bold">Metode Pembayaran:</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setPaymentMethod("qris")}
                    className={`cursor-pointer p-4 rounded-2xl border flex items-center space-x-3 transition ${
                      paymentMethod === "qris" ? "bg-blue-50 border-blue-600 ring-2 ring-blue-600/20" : "bg-white border-slate-200"
                    }`}
                  >
                    <i className="fa-solid fa-qrcode text-2xl text-blue-600"></i>
                    <div>
                      <div className="font-bold text-slate-900">QRIS Instant</div>
                      <div className="text-[10px] text-slate-500">BCA, Mandiri, GoPay, OVO</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("transfer")}
                    className={`cursor-pointer p-4 rounded-2xl border flex items-center space-x-3 transition ${
                      paymentMethod === "transfer" ? "bg-blue-50 border-blue-600 ring-2 ring-blue-600/20" : "bg-white border-slate-200"
                    }`}
                  >
                    <i className="fa-solid fa-building-columns text-2xl text-blue-600"></i>
                    <div>
                      <div className="font-bold text-slate-900">Transfer Bank</div>
                      <div className="text-[10px] text-slate-500">Virtual Account Automatic</div>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod("cashier")}
                    className={`cursor-pointer p-4 rounded-2xl border flex items-center space-x-3 transition ${
                      paymentMethod === "cashier" ? "bg-blue-50 border-blue-600 ring-2 ring-blue-600/20" : "bg-white border-slate-200"
                    }`}
                  >
                    <i className="fa-solid fa-cash-register text-2xl text-blue-600"></i>
                    <div>
                      <div className="font-bold text-slate-900">Kasir Gym</div>
                      <div className="text-[10px] text-slate-500">Bayar Tunai / EDC Gym 88</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tampilan QRIS Mockup Jika Dipilih */}
              {paymentMethod === "qris" && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl text-center space-y-3">
                  <span className="text-slate-500 block">Scan QRIS untuk melakukan pembayaran instan:</span>
                  <div className="w-40 h-40 bg-white border border-slate-200 rounded-2xl mx-auto flex items-center justify-center p-3 shadow-inner">
                    <i className="fa-solid fa-qrcode text-8xl text-slate-800"></i>
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-700">NMID: ID102938475611</div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl transition"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl transition shadow-sm flex items-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Memproses Pembayaran...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock"></i>
                      <span>Bayar & Aktifkan Paket</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 4: SELESAI / SUKSES */}
          {currentStep === 4 && (
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">Pembayaran Berhasil!</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Selamat, paket <strong>{selectedPkg.title} ({duration} {selectedPkg.isDaily ? "Hari" : "Bulan"})</strong> Anda telah berhasil diaktifkan.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl max-w-md mx-auto text-left space-y-2 text-slate-600">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Nama Member/Pengunjung:</span>
                  <strong className="text-slate-900">{formData.name}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Jenis Paket:</span>
                  <strong className="text-blue-600">{selectedPkg.title}</strong>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span>Durasi:</span>
                  <strong className="text-emerald-600">{duration} {selectedPkg.isDaily ? "Hari" : "Bulan"}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Total Pembayaran:</span>
                  <strong className="text-slate-900">{formattedTotalPrice}</strong>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <Link
                  href="/member/attendance"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2"
                >
                  <i className="fa-solid fa-qrcode"></i>
                  <span>Buka QR Presensi</span>
                </Link>
                <Link
                  href="/member/profile"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl transition flex items-center justify-center space-x-2"
                >
                  <span>Lihat Profil Saya</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Right Column (1 Kolom): Widget Rincian Tagihan & Informasi */}
        <div className="space-y-6">
          {/* Card Ringkasan Tagihan */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Ringkasan Pesanan</span>
              <i className="fa-solid fa-receipt text-blue-500"></i>
            </h3>

            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Paket Dipilih:</span>
                <strong className="text-slate-900">{selectedPkg.title}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Harga per {selectedPkg.isDaily ? "Hari" : "Bulan"}:</span>
                <span className="font-mono font-bold text-slate-900">{selectedPkg.formattedPrice}</span>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Durasi:</span>
                <strong className="text-slate-900">{duration} {selectedPkg.isDaily ? "Hari" : "Bulan"}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Biaya Admin:</span>
                <span className="font-bold text-emerald-600">Gratis (Rp 0)</span>
              </div>

              <div className="pt-2 flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">Total Pembayaran:</span>
                <span className="font-black text-blue-600 text-base">{formattedTotalPrice}</span>
              </div>
            </div>
          </div>

          {/* Card Bantuan Pendaftaran */}
          <div className="bg-blue-50 border border-blue-200 p-5 rounded-3xl space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center space-x-2">
              <i className="fa-solid fa-headset text-blue-600"></i>
              <span>Butuh Bantuan Pendaftaran?</span>
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Jika terjadi kendala saat konfirmasi atau pembayaran, Anda dapat menghubungi staf resepsionis Gym 88 secara langsung di meja pendaftaran.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
