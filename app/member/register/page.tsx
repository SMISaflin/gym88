"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useToast } from "@/components/ToastProvider";

export default function MemberRegisterPage() {
  const { showToast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);

  // State data diri dari tabel MemberProfile
  const [formData, setFormData] = useState({
    name: "",
    nim: "",
    phone: "",
    email: "",
    gender: "Laki-laki",
  });

  const [availablePackages, setAvailablePackages] = useState<any[]>([]);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("");
  const [duration, setDuration] = useState(1);

  const [availablePT, setAvailablePT] = useState<any[]>([]);
  const [selectedPTId, setSelectedPTId] = useState<string>("");
  const [usePersonalTrainer, setUsePersonalTrainer] = useState(false);

  const [isProcessing, setIsProcessing] = useState(false);

  // Ambil data otomatis dari tabel MemberProfile melalui API backend
  useEffect(() => {
    async function fetchMemberProfileFromDB() {
      let queryParam = "";
      const saved = localStorage.getItem("gym88_member_profile");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.email) queryParam = `email=${encodeURIComponent(parsed.email)}`;
          else if (parsed.nim) queryParam = `memberCode=GYM88-${parsed.nim}`;
        } catch (e) {
          console.error("Gagal membaca localStorage:", e);
        }
      }

      try {
        const res = await fetch(`/api/member/profile?${queryParam}`);
        const json = await res.json();

        if (json.success && json.data) {
          setFormData({
            name: json.data.name || "",
            nim: json.data.memberCode ? json.data.memberCode.replace("GYM88-", "") : "",
            phone: json.data.phone || "",
            email: json.data.email || "",
            gender: json.data.gender === "FEMALE" ? "Perempuan" : "Laki-laki",
          });
        } else {
          showToast("Gagal mengambil data dari MemberProfile.", "error");
        }
      } catch (error) {
        console.error("Koneksi API Error:", error);
        showToast("Terjadi kesalahan saat terhubung ke server.", "error");
      }
    }

    fetchMemberProfileFromDB();

    // Fetch Paket Gym dari database admin
    fetch("/api/packages")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setAvailablePackages(json.data);
          setSelectedPackageId(json.data[0].id);
        }
      })
      .catch(() => {
        showToast("Gagal memuat paket membership dari server.", "error");
      });

    // Fetch Personal Trainer dari database admin
    fetch("/api/trainers")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data.length > 0) {
          setAvailablePT(json.data);
          setSelectedPTId(json.data[0].id);
        }
      })
      .catch(() => {
        setAvailablePT([{ id: "pt-standard", name: "Personal Trainer Profesional", pricePerMonth: 100000 }]);
        setSelectedPTId("pt-standard");
      });
  }, []);

  const selectedPkg =
    availablePackages.find((p) => p.id === selectedPackageId) ||
    availablePackages[0] || { price: 0, title: "-", isDaily: false };

  const selectedPT =
    availablePT.find((pt) => pt.id === selectedPTId) ||
    availablePT[0] || { pricePerMonth: 100000, name: "Personal Trainer" };

  const basePackagePrice = (selectedPkg.price || 0) * duration;
  const ptFeePerMonth = selectedPT.pricePerMonth || selectedPT.price || 100000;
  const ptTotalFee = usePersonalTrainer ? ptFeePerMonth * duration : 0;
  const totalPrice = basePackagePrice + ptTotalFee;
  const formattedTotalPrice = `Rp ${totalPrice.toLocaleString("id-ID")}`;

  const handleSelectPackage = (pkgId: string) => {
    setSelectedPackageId(pkgId);
    setDuration(1);
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch("/api/midtrans/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          packageTitle: `${selectedPkg.title || selectedPkg.name} ${
            usePersonalTrainer ? `+ ${selectedPT.name}` : ""
          }`,
          amount: totalPrice,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        showToast(data.message || "Gagal mendapatkan token pembayaran Midtrans.", "error");
        setIsProcessing(false);
        return;
      }

      if (window.snap) {
        window.snap.pay(data.snapToken, {
          onSuccess: async (result) => {
            showToast("Pembayaran berhasil diverifikasi!", "success");

            try {
              const saveRes = await fetch("/api/member/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: formData.name,
                  nim: formData.nim,
                  phone: formData.phone,
                  email: formData.email,
                  gender: formData.gender,
                  packageId: selectedPkg.id,
                  duration,
                  usePersonalTrainer,
                  personalTrainerId: usePersonalTrainer ? selectedPTId : null,
                  paymentMethod: result.payment_type || "MIDTRANS_SNAP",
                  amount: totalPrice,
                }),
              });

              const saveJson = await saveRes.json();
              if (!saveJson.success) {
                showToast(`Gagal simpan DB: ${saveJson.message}`, "error");
                setIsProcessing(false);
                return;
              }
            } catch (err) {
              console.error("Database Save Error:", err);
              showToast("Terjadi kesalahan saat menyimpan data ke database.", "error");
              setIsProcessing(false);
              return;
            }

            setCurrentStep(3);
            setIsProcessing(false);
          },
          onPending: () => {
            showToast("Menunggu pembayaran diselesaikan...", "warning");
            setIsProcessing(false);
          },
          onError: () => {
            showToast("Pembayaran gagal. Silakan coba lagi.", "error");
            setIsProcessing(false);
          },
          onClose: () => {
            showToast("Anda menutup halaman pembayaran.", "warning");
            setIsProcessing(false);
          },
        });
      } else {
        showToast("Script Midtrans Snap belum siap. Coba muat ulang halaman.", "error");
        setIsProcessing(false);
      }
    } catch (error) {
      showToast("Terjadi kesalahan sistem saat menghubungi Midtrans.", "error");
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 w-full pb-10 text-xs text-slate-700 font-sans">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2">
            Pendaftaran Gym 88
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">Pendaftaran Member & Paket Latihan 💳</h1>
          <p className="text-blue-100 text-xs md:text-sm">
            Pilih paket latihan dan personal trainer, lalu selesaikan pembayaran via Midtrans Snap.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white border border-slate-200 p-6 md:p-8 rounded-3xl shadow-xs space-y-6">
          <div className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-6 text-center font-bold">
            <div className={`flex items-center justify-center space-x-2 pb-2 transition ${currentStep >= 1 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 1 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>1</span>
              <span>Data Diri</span>
            </div>
            <div className={`flex items-center justify-center space-x-2 pb-2 transition ${currentStep >= 2 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 2 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>2</span>
              <span>Pilih Paket & PT</span>
            </div>
            <div className={`flex items-center justify-center space-x-2 pb-2 transition ${currentStep >= 3 ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-400"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${currentStep >= 3 ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"}`}>3</span>
              <span>Selesai</span>
            </div>
          </div>

          {currentStep === 1 && (
            <div className="space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">Konfirmasi Data Diri dari MemberProfile</h3>
                <p className="text-slate-500 text-xs">Data ditarik otomatis dari tabel database MySQL.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Nama Lengkap <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    readOnly
                    value={formData.name}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Member Code <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    readOnly
                    value={`GYM88-${formData.nim}`}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-mono font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">No. Handphone / WhatsApp <span className="text-rose-500">*</span></label>
                  <input
                    type="text"
                    readOnly
                    value={formData.phone}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Alamat Email <span className="text-rose-500">*</span></label>
                  <input
                    type="email"
                    readOnly
                    value={formData.email}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 font-medium cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-2xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  <span>Lanjut Pilih Paket</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-extrabold text-sm text-slate-900">Pilih Paket dari Daftar Admin</h3>
                <p className="text-slate-500 text-xs">Pilih paket membership dan opsi personal training.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availablePackages.map((pkg) => {
                  const isSelected = selectedPackageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => handleSelectPackage(pkg.id)}
                      className={`cursor-pointer p-5 rounded-2xl border transition flex flex-col justify-between space-y-3 relative ${
                        isSelected
                          ? "bg-blue-50/50 border-blue-600 ring-2 ring-blue-600/20 shadow-xs"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-sm text-slate-900">{pkg.title || pkg.name}</h4>
                          <input
                            type="radio"
                            name="packageOption"
                            checked={isSelected}
                            onChange={() => handleSelectPackage(pkg.id)}
                            className="accent-blue-600 w-4 h-4 cursor-pointer"
                          />
                        </div>
                        <div className="text-base font-black text-slate-900">
                          Rp {(pkg.price || 0).toLocaleString("id-ID")} <span className="text-[10px] font-medium text-slate-500">{pkg.isDaily ? "/ hari" : "/ bln"}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">{pkg.description || "Akses fasilitas Gym 88"}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                <label className="block text-slate-800 font-bold">
                  {selectedPkg.isDaily ? "Pilih Jumlah Hari Kunjungan:" : "Pilih Durasi Langganan (Bulan):"}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {selectedPkg.isDaily ? (
                    [1, 3, 7].map((days) => (
                      <button
                        key={days}
                        type="button"
                        onClick={() => setDuration(days)}
                        className={`py-2.5 rounded-xl font-bold transition border cursor-pointer ${
                          duration === days ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {days} Hari
                      </button>
                    ))
                  ) : (
                    [1, 3, 6].map((months) => (
                      <button
                        key={months}
                        type="button"
                        onClick={() => setDuration(months)}
                        className={`py-2.5 rounded-xl font-bold transition border cursor-pointer ${
                          duration === months ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                        }`}
                      >
                        {months} Bulan
                      </button>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <i className="fa-solid fa-dumbbell text-sm"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Tambah Personal Trainer (Opsional)</h4>
                      <p className="text-[10px] text-slate-500">Tarif ditarik langsung dari sistem admin</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={usePersonalTrainer}
                    onChange={(e) => setUsePersonalTrainer(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 cursor-pointer rounded-md"
                  />
                </div>

                {usePersonalTrainer && availablePT.length > 0 && (
                  <div className="pt-2 border-t border-indigo-100 space-y-2">
                    <label className="block text-[11px] font-bold text-slate-700">Pilih Personal Trainer:</label>
                    <select
                      value={selectedPTId}
                      onChange={(e) => setSelectedPTId(e.target.value)}
                      className="w-full bg-white border border-indigo-200 rounded-xl px-3 py-2 text-slate-900 font-medium text-xs focus:outline-none focus:border-indigo-600"
                    >
                      {availablePT.map((pt) => (
                        <option key={pt.id} value={pt.id}>
                          {pt.name} (+Rp {(pt.pricePerMonth || pt.price || 100000).toLocaleString("id-ID")}/bln)
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setCurrentStep(1)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-2xl transition cursor-pointer">
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3 rounded-2xl transition shadow-xs flex items-center space-x-2 cursor-pointer"
                >
                  {isProcessing ? (
                    <>
                      <i className="fa-solid fa-spinner animate-spin"></i>
                      <span>Menghubungkan ke Midtrans...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-lock"></i>
                      <span>Bayar via Midtrans Snap</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="text-center py-8 space-y-5">
              <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-md">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-black text-slate-900">Pembayaran & Pendaftaran Berhasil!</h2>
                <p className="text-slate-500 max-w-md mx-auto">
                  Transaksi pembayaran via Midtrans berhasil diverifikasi dan tercatat di database MySQL. Paket <strong>{selectedPkg.title || selectedPkg.name}</strong> Anda kini aktif.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-3 pt-4">
                <Link href="/member/profile" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-2xl transition shadow-sm flex items-center justify-center space-x-2">
                  <i className="fa-solid fa-user"></i>
                  <span>Lihat Profil & Kartu Anggota</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
              <span>Ringkasan Pesanan</span>
              <i className="fa-solid fa-receipt text-blue-500"></i>
            </h3>

            <div className="space-y-3 text-slate-600">
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Paket Dipilih:</span>
                <strong className="text-slate-900">{selectedPkg.title || selectedPkg.name || "-"}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Durasi:</span>
                <strong className="text-slate-900">{duration} {selectedPkg.isDaily ? "Hari" : "Bulan"}</strong>
              </div>
              <div className="flex justify-between border-b border-slate-50 pb-2">
                <span>Personal Trainer:</span>
                <strong className={usePersonalTrainer ? "text-indigo-600" : "text-slate-400"}>
                  {usePersonalTrainer ? `${selectedPT.name}` : "Tidak"}
                </strong>
              </div>
              <div className="pt-2 flex justify-between items-center text-sm">
                <span className="font-black text-slate-900">Total Tagihan:</span>
                <span className="font-black text-blue-600 text-base">{formattedTotalPrice}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}