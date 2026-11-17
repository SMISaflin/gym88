
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Circle,
  LoaderCircle,
  ChevronLeft,
  MessageCircle,
  KeyRound,
} from "lucide-react";

import { ToastProvider, useToast } from "@/components/ToastProvider";

function RegisterForm() {
  const { showToast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [otp, setOtp] = useState("");
  const [serverOtp, setServerOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  // Password validation
  const passwordRules = {
    minLength: formData.password.length >= 8,
    hasUppercase: /[A-Z]/.test(formData.password),
    hasLowercase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecial: /[^A-Za-z0-9]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordRules).every(Boolean);

  const updateFormData = (
    field: keyof typeof formData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 1. Request OTP WhatsApp
  const handleRequestOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.password
    ) {
      showToast("Semua kolom wajib diisi!", "warning");
      return;
    }

    if (!isPasswordValid) {
      showToast(
        "Password belum memenuhi standar kriteria keamanan!",
        "warning"
      );
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();

      if (json.success) {
        showToast(json.message, "success");
        setServerOtp(json.serverOtp);
        setStep(2);
      } else {
        showToast(
          json.message || "Gagal mengirim WhatsApp OTP.",
          "error"
        );
      }
    } catch {
      showToast("Terjadi kesalahan koneksi ke server.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP and create account
  const handleVerifyOtpAndRegister = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!otp) {
      showToast("Masukkan 6 digit kode OTP!", "warning");
      return;
    }

    if (otp.length !== 6) {
      showToast("Kode OTP harus terdiri dari 6 digit!", "warning");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          enteredOtp: otp,
          serverOtp,
        }),
      });

      const json = await res.json();

      if (json.success) {
        showToast(
          "Verifikasi WhatsApp Berhasil! Akun Anda telah aktif.",
          "success"
        );

        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        showToast(
          json.message || "Kode OTP WhatsApp salah.",
          "error"
        );
      }
    } catch {
      showToast(
        "Terjadi kesalahan pada server saat pembuatan akun.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const passwordRuleItems = [
    {
      label: "Minimal 8 karakter",
      valid: passwordRules.minLength,
    },
    {
      label: "Huruf besar (A-Z)",
      valid: passwordRules.hasUppercase,
    },
    {
      label: "Huruf kecil (a-z)",
      valid: passwordRules.hasLowercase,
    },
    {
      label: "Angka (0-9)",
      valid: passwordRules.hasNumber,
    },
    {
      label: "Karakter spesial (!@#$%^&*)",
      valid: passwordRules.hasSpecial,
    },
  ];

  return (
    <main className="min-h-screen w-full bg-[#101010] text-white lg:grid lg:grid-cols-2">

      {/* ================================= */}
      {/* LEFT PANEL */}
      {/* ================================= */}

      <section className="relative flex min-h-[600px] flex-col justify-between overflow-hidden bg-black py-7 lg:sticky lg:top-0 lg:h-screen">

        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=1800&auto=format&fit=crop')",
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 px-8 sm:px-12 lg:px-16 xl:px-20">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#ed1c2e]">
            <Dumbbell size={27} strokeWidth={2.5} />
          </div>

          <div>
            <h1 className="text-3xl font-black italic leading-none tracking-tight">
              GYM<span className="text-[#ed1c2e]">88</span>
            </h1>
            <p className="mt-1 text-[9px] font-semibold tracking-[0.35em] text-gray-300">
              FITNESS CENTER
            </p>
          </div>
        </div>

        {/* Hero */}
        <div className="relative z-10 w-full max-w-xl px-8 sm:px-12 lg:px-16 xl:px-20">

          <div className="mb-4 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-[#ed1c2e]" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#ed1c2e]">
              JOIN THE MOVEMENT
            </span>
          </div>

          <h2 className="text-5xl font-black uppercase leading-[1.08] tracking-tight sm:text-6xl xl:text-[60px]">
            START YOUR
            <span className="block text-[#ed1c2e]">
              FITNESS
            </span>
            JOURNEY
            <span className="block text-[#ed1c2e]">
              TODAY.
            </span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-gray-200 sm:text-base">
            Bergabunglah bersama GYM88 dan mulai perjalanan
            transformasi tubuhmu. Bangun kekuatan, tingkatkan
            kesehatan, dan capai versi terbaik dirimu.
          </p>

          {/* Benefits */}
          <div className="mt-8 flex flex-wrap gap-7">

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Dumbbell size={20} className="text-[#ed1c2e]" />
              </div>

              <div>
                <p className="text-xs font-bold">
                  Modern Equipment
                </p>
                <p className="mt-1 text-[10px] text-gray-400">
                  Fasilitas lengkap
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <ShieldCheck size={20} className="text-[#ed1c2e]" />
              </div>

              <div>
                <p className="text-xs font-bold">
                  Professional Trainer
                </p>
                <p className="mt-1 text-[10px] text-gray-400">
                  Pendamping berpengalaman
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 px-8 pt-4 text-[10px] tracking-wider text-gray-400 sm:px-12 lg:px-16 xl:px-20">
          <span>© {year ?? "GYM88"} FITNESS CENTER</span>
          <span className="hidden sm:block">
            TRAIN HARD. STAY STRONG.
          </span>
        </div>
      </section>

      {/* ================================= */}
      {/* RIGHT PANEL */}
      {/* ================================= */}

      <section className="flex min-h-screen items-center justify-center bg-[#101010] px-6 py-12 sm:px-12 lg:px-12 xl:px-20">

        <div className="w-full max-w-md">

          {/* Back Home */}
          <Link
            href="/"
            className="mb-7 inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
          >
            <ChevronLeft size={16} />
            Kembali ke Beranda
          </Link>

          {/* Heading */}
          <div className="mb-7">

            <div className="mb-3 h-1 w-12 rounded-full bg-[#ed1c2e]" />

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#ed1c2e]">
              {step === 1 ? "CREATE YOUR ACCOUNT" : "WHATSAPP VERIFICATION"}
            </p>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              {step === 1 ? (
                <>
                  Buat Akun
                  <span className="block text-[#ed1c2e]">
                    GYM88.
                  </span>
                </>
              ) : (
                <>
                  Verifikasi
                  <span className="block text-[#ed1c2e]">
                    Akun Anda.
                  </span>
                </>
              )}
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              {step === 1
                ? "Lengkapi data diri Anda untuk menjadi bagian dari komunitas GYM88."
                : `Kode OTP telah dikirimkan ke WhatsApp nomor ${formData.phone}. Silakan masukkan kode verifikasi Anda.`}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="mb-7 flex items-center gap-3">

            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 1
                    ? "bg-[#ed1c2e] text-white"
                    : "bg-[#ed1c2e] text-white"
                }`}
              >
                {step === 2 ? <CheckCircle2 size={16} /> : "1"}
              </div>

              <span
                className={`text-xs font-semibold ${
                  step === 1 ? "text-white" : "text-gray-500"
                }`}
              >
                Data Diri
              </span>
            </div>

            <div className="h-px flex-1 bg-white/10" />

            <div className="flex items-center gap-2">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  step === 2
                    ? "bg-[#ed1c2e] text-white"
                    : "border border-white/20 text-gray-500"
                }`}
              >
                2
              </div>

              <span
                className={`text-xs font-semibold ${
                  step === 2 ? "text-white" : "text-gray-500"
                }`}
              >
                Verifikasi
              </span>
            </div>
          </div>

          {/* ================================= */}
          {/* STEP 1 - REGISTER FORM */}
          {/* ================================= */}

          {step === 1 ? (
            <form onSubmit={handleRequestOtp} className="space-y-4">

              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-bold text-gray-200"
                >
                  NAMA LENGKAP
                </label>

                <div className="flex h-13 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
                  <div className="flex w-14 shrink-0 items-center justify-center">
                    <User size={18} className="text-gray-500" />
                  </div>

                  <input
                    id="name"
                    type="text"
                    required
                    placeholder="Nama lengkap Anda"
                    value={formData.name}
                    onChange={(e) =>
                      updateFormData("name", e.target.value)
                    }
                    autoComplete="name"
                    className="h-full min-w-0 flex-1 bg-transparent py-3 pl-2 pr-4 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-bold text-gray-200"
                >
                  ALAMAT EMAIL
                </label>

                <div className="flex h-13 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
                  <div className="flex w-14 shrink-0 items-center justify-center">
                    <Mail size={18} className="text-gray-500" />
                  </div>

                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="nama@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      updateFormData("email", e.target.value)
                    }
                    autoComplete="email"
                    className="h-full min-w-0 flex-1 bg-transparent py-3 pl-2 pr-4 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-bold text-gray-200"
                >
                  NOMOR WHATSAPP
                </label>

                <div className="flex h-13 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
                  <div className="flex w-14 shrink-0 items-center justify-center">
                    <Phone size={18} className="text-gray-500" />
                  </div>

                  <input
                    id="phone"
                    type="tel"
                    required
                    placeholder="081234567890"
                    value={formData.phone}
                    onChange={(e) =>
                      updateFormData("phone", e.target.value)
                    }
                    autoComplete="tel"
                    className="h-full min-w-0 flex-1 bg-transparent py-3 pl-2 pr-4 text-sm text-white outline-none placeholder:text-gray-600"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold text-gray-200"
                >
                  PASSWORD
                </label>

                <div className="flex h-13 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">

                  <div className="flex w-14 shrink-0 items-center justify-center">
                    <Lock size={18} className="text-gray-500" />
                  </div>

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Buat password yang kuat"
                    value={formData.password}
                    onChange={(e) =>
                      updateFormData("password", e.target.value)
                    }
                    autoComplete="new-password"
                    className="h-full min-w-0 flex-1 bg-transparent py-3 pl-2 text-sm text-white outline-none placeholder:text-gray-600"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="flex h-full w-12 shrink-0 items-center justify-center text-gray-500 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>

                {/* Password Rules */}
                <div className="mt-3 rounded-xl border border-white/10 bg-[#181818] p-4">

                  <div className="mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-[#ed1c2e]" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-300">
                      Aturan Keamanan Password
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {passwordRuleItems.map((rule, index) => (
                      <div
                        key={index}
                        className={`flex items-center gap-2 text-[11px] transition ${
                          rule.valid
                            ? "font-semibold text-emerald-500"
                            : "text-gray-500"
                        }`}
                      >
                        {rule.valid ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Circle size={14} />
                        )}

                        <span>{rule.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#ed1c2e] transition-all duration-300"
                      style={{
                        width: `${
                          (Object.values(passwordRules).filter(Boolean)
                            .length /
                            5) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !isPasswordValid}
                className={`flex h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold transition ${
                  isPasswordValid && !loading
                    ? "bg-[#ed1c2e] text-white shadow-lg shadow-red-950/20 hover:bg-red-700"
                    : "cursor-not-allowed bg-white/10 text-gray-500"
                }`}
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Mengirim Kode OTP...
                  </>
                ) : (
                  <>
                    <MessageCircle size={19} />
                    Kirim Kode OTP WhatsApp
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-center text-[11px] leading-5 text-gray-500">
                Dengan mendaftar, Anda akan menerima kode verifikasi
                melalui WhatsApp.
              </p>
            </form>
          ) : (

            /* ================================= */
            /* STEP 2 - OTP VERIFICATION */
            /* ================================= */

            <form
              onSubmit={handleVerifyOtpAndRegister}
              className="space-y-5"
            >

              <div className="rounded-xl border border-white/10 bg-[#1c1c1c] p-5">

                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#ed1c2e]/10">
                  <MessageCircle
                    size={24}
                    className="text-[#ed1c2e]"
                  />
                </div>

                <h3 className="text-base font-bold">
                  Verifikasi Nomor WhatsApp
                </h3>

                <p className="mt-2 text-xs leading-6 text-gray-400">
                  Kami telah mengirimkan kode OTP ke nomor WhatsApp
                  yang Anda daftarkan:
                </p>

                <p className="mt-2 font-bold text-white">
                  {formData.phone}
                </p>
              </div>

              {/* OTP Input */}
              <div>
                <label
                  htmlFor="otp"
                  className="mb-3 block text-xs font-bold text-gray-200"
                >
                  KODE OTP 6 DIGIT
                </label>

                <div className="flex h-16 items-center rounded-xl border border-white/10 bg-[#1c1c1c] px-4 transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
                  <KeyRound
                    size={20}
                    className="mr-4 shrink-0 text-gray-500"
                  />

                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) =>
                      setOtp(
                        e.target.value.replace(/\D/g, "").slice(0, 6)
                      )
                    }
                    className="h-full w-full bg-transparent text-center text-2xl font-black tracking-[0.5em] text-white outline-none placeholder:text-gray-700"
                  />
                </div>

                <p className="mt-2 text-[11px] text-gray-500">
                  Masukkan 6 digit kode yang Anda terima.
                </p>
              </div>

              {/* Verify Button */}
              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className={`flex h-14 w-full items-center justify-center gap-3 rounded-xl text-sm font-bold transition ${
                  !loading && otp.length === 6
                    ? "bg-[#ed1c2e] text-white shadow-lg shadow-red-950/20 hover:bg-red-700"
                    : "cursor-not-allowed bg-white/10 text-gray-500"
                }`}
              >
                {loading ? (
                  <>
                    <LoaderCircle size={19} className="animate-spin" />
                    Memverifikasi...
                  </>
                ) : (
                  <>
                    Konfirmasi OTP & Buat Akun
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Edit Data */}
              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                }}
                className="flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-gray-400 transition hover:text-[#ed1c2e]"
              >
                <ChevronLeft size={15} />
                Ubah Data / Nomor WhatsApp
              </button>

            </form>
          )}

          {/* Login Link */}
          <div className="mt-7 border-t border-white/10 pt-6 text-center">

            <p className="text-sm text-gray-500">
              Sudah memiliki akun?{" "}
              <Link
                href="/login"
                className="font-bold text-white transition hover:text-[#ed1c2e]"
              >
                Login di sini
              </Link>
            </p>

            <div className="mt-4 flex items-center justify-center gap-2 text-[10px] tracking-wider text-gray-600">
              <CheckCircle2 size={13} />
              <span>
                GYM88 FITNESS CENTER · MEMBER PORTAL
              </span>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <ToastProvider>
      <RegisterForm />
    </ToastProvider>
  );
}
