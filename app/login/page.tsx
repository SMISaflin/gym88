
"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Dumbbell,
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  LoaderCircle,
  ChevronLeft,
} from "lucide-react";

import { ToastProvider, useToast } from "@/components/ToastProvider";

function LoginContent() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      showToast("Email dan password wajib diisi.", "error");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const json = await response.json();

      if (!response.ok || !json.success) {
        showToast(
          json.message || "Email atau password tidak valid.",
          "error"
        );
        return;
      }

      localStorage.setItem(
        "gym88_session",
        JSON.stringify(json.data)
      );

      showToast("Login berhasil! Selamat datang kembali.", "success");

      setTimeout(() => {
        router.push(json.data.redirectUrl);
      }, 1000);
    } catch {
      showToast("Terjadi kesalahan. Silakan coba kembali.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#101010] text-white lg:grid lg:grid-cols-2">
      {/* LEFT PANEL */}
      <section className="relative flex min-h-[650px] flex-col justify-between overflow-hidden bg-black lg:min-h-screen">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=85&w=1800&auto=format&fit=crop')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/65" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/35 to-black/45" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 ml-6 xl:ml-12">
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

        {/* Hero Content */}
        <div className="relative z-10 ml-6 w-full max-w-xl xl:ml-12">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-[3px] w-10 bg-[#ed1c2e]" />
            <span className="text-xs font-bold tracking-[0.3em] text-[#ed1c2e]">
              WELCOME TO GYM88
            </span>
          </div>

          <h2 className="text-5xl font-black uppercase leading-[1.08] tracking-tight sm:text-6xl xl:text-[60px]">
            BUILD YOUR
            <span className="block text-[#ed1c2e]">STRENGTH.</span>
            OWN YOUR
            <span className="block text-[#ed1c2e]">JOURNEY.</span>
          </h2>

          <p className="mt-5 max-w-lg text-sm leading-7 text-gray-200 sm:text-base">
            Mulai perjalanan hidup sehatmu bersama GYM88. Bangun
            kekuatan, tingkatkan kemampuan, dan jadilah versi terbaik
            dari dirimu.
          </p>

          {/* Features */}
          <div className="mt-8 flex flex-wrap gap-7">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                <Dumbbell size={20} className="text-[#ed1c2e]" />
              </div>
              <div>
                <p className="text-xs font-bold">Modern Equipment</p>
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
                <p className="text-xs font-bold">Professional</p>
                <p className="mt-1 text-[10px] text-gray-400">
                  Trainer berpengalaman
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Left Footer */}
        <div className="relative z-10 flex items-center justify-between border-t border-white/15 pt-4 text-[10px] tracking-wider text-gray-400">
          <span>© {year ?? "GYM88"} FITNESS CENTER</span>
          <span className="hidden sm:block">
            TRAIN HARD. STAY STRONG.
          </span>
        </div>
      </section>

      {/* RIGHT PANEL */}
      <section className="flex min-h-screen items-center justify-center bg-[#101010] px-6 py-12 sm:px-12 lg:px-12 xl:px-20">
        <div className="w-full max-w-md">
          {/* Back Home */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs text-gray-400 transition hover:text-white"
          >
            <ChevronLeft size={16} />
            Kembali ke Beranda
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <div className="mb-3 h-1 w-12 rounded-full bg-[#ed1c2e]" />

            <p className="mb-2 text-xs font-bold tracking-[0.3em] text-[#ed1c2e]">
              MEMBER ACCESS
            </p>

            <h2 className="text-3xl font-black leading-tight sm:text-4xl">
              Selamat Datang
              <span className="block text-[#ed1c2e]">
                Kembali.
              </span>
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-400">
              Silakan masuk menggunakan akun yang sudah terdaftar
              untuk mengakses dashboard GYM88.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
  <label
    htmlFor="email"
    className="mb-2 block text-xs font-bold text-gray-200"
  >
    ALAMAT EMAIL
  </label>

  <div className="flex h-14 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
    <div className="flex w-14 shrink-0 items-center justify-center">
      <Mail size={18} className="text-gray-500" />
    </div>

    <input
      id="email"
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      placeholder="nama@email.com"
      autoComplete="email"
      required
      className="h-full min-w-0 flex-1 bg-transparent pr-4 text-sm text-white outline-none placeholder:text-gray-600"
    />
  </div>
</div>
<div>
  <label
    htmlFor="password"
    className="mb-2 block text-xs font-bold text-gray-200"
  >
    PASSWORD
  </label>

  <div className="flex h-14 w-full items-center rounded-xl border border-white/10 bg-[#1c1c1c] transition focus-within:border-[#ed1c2e] focus-within:ring-2 focus-within:ring-[#ed1c2e]/20">
    <div className="flex w-14 shrink-0 items-center justify-center">
      <Lock size={18} className="text-gray-500" />
    </div>

    <input
      id="password"
      type={showPassword ? "text" : "password"}
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="Masukkan password"
      autoComplete="current-password"
      required
      className="h-full min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-gray-600"
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
      className="flex h-full w-12 shrink-0 items-center justify-center text-gray-500 transition hover:text-white"
    >
      {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
    </button>
  </div>
</div>
            {/* Security Info */}
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <ShieldCheck size={15} className="text-[#ed1c2e]" />
              <span>Gunakan akun resmi GYM88 Anda.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#ed1c2e] text-sm font-bold text-white shadow-lg shadow-red-950/20 transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  Masuk ke Dashboard
                  <ArrowRight size={19} />
                </>
              )}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-gray-500">
            Belum memiliki akun?{" "}
            <Link
              href="/register"
              className="font-bold text-gray-300 transition hover:text-[#ed1c2e]"
            >
              Daftar Sekarang
            </Link>
          </p>

          {/* Bottom Note */}
          <div className="mt-3 flex items-center justify-center gap-2 text-[10px] tracking-wider text-gray-600">
            <CheckCircle2 size={13} />
            <span>GYM88 FITNESS CENTER · MEMBER PORTAL</span>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function LoginPage() {
  return (
    <ToastProvider>
      <LoginContent />
    </ToastProvider>
  );
}
