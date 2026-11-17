
"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Dumbbell,
  Users,
  MapPin,
  CalendarDays,
  Check,
  HeartPulse,
  Trophy,
  Globe,
  Phone,
  Mail,
  Star,
  ChevronRight,
  Flame,
} from "lucide-react";

// DATA FASILITAS
const facilities = [
  {
    title: "Cardio Area",
    description: "Tingkatkan stamina dan kesehatan jantung.",
    icon: HeartPulse,
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=85",
  },
  {
    title: "Strength Area",
    description: "Latihan kekuatan dengan peralatan modern.",
    icon: Dumbbell,
    image:
      "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=85",
  },
  {
    title: "Free Weights",
    description: "Dumbbell dan barbell untuk latihan intensif.",
    icon: Flame,
    image:
      "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=85",
  },
  {
    title: "Functional Training",
    description: "Tingkatkan mobilitas dan keseimbangan tubuh.",
    icon: Trophy,
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=85",
  },
];

// DATA MEMBERSHIP
const packages = [
  {
    name: "Daily Pass",
    price: "35.000",
    period: "/ hari",
    description: "Untuk latihan sesekali.",
    features: [
      "Akses gym 1 hari",
      "Semua alat fitness",
      "Area cardio",
    ],
  },
  {
    name: "Monthly",
    price: "250.000",
    period: "/ bulan",
    description: "Pilihan terbaik untuk konsistensi.",
    popular: true,
    features: [
      "Akses gym 30 hari",
      "Semua alat fitness",
      "Area cardio",
      "Konsultasi trainer",
      "Locker member",
    ],
  },
  {
    name: "Yearly",
    price: "2.400.000",
    period: "/ tahun",
    description: "Investasi terbaik untuk kesehatan.",
    features: [
      "Akses gym 12 bulan",
      "Semua fasilitas gym",
      "Konsultasi trainer",
      "Program latihan",
      "Prioritas membership",
    ],
  },
];

// DATA TESTIMONI
const testimonials = [
  {
    name: "Andi Pratama",
    role: "Member sejak 2025",
    text: "Fasilitasnya lengkap, suasananya nyaman, dan alat-alatnya terawat. Sangat cocok untuk latihan rutin.",
  },
  {
    name: "Rizky Ramadhan",
    role: "Member sejak 2024",
    text: "Trainer sangat membantu dalam menyusun program latihan. Perkembangan fisik saya juga semakin baik.",
  },
  {
    name: "Dian Permata",
    role: "Member sejak 2025",
    text: "Tempat gym yang nyaman dengan lingkungan positif. Saya semakin semangat menjaga kesehatan.",
  },
];

// DATA GALERI
const gallery = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&q=85",
  "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&q=85",
  "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=900&q=85",
  "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&q=85",
];

export default function GymLandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  // Mengambil tahun setelah komponen dipasang di browser
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const navItems = [
    ["Beranda", "#beranda"],
    ["Tentang", "#tentang"],
    ["Fasilitas", "#fasilitas"],
    ["Membership", "#membership"],
    ["Galeri", "#galeri"],
    ["Kontak", "#kontak"],
  ];

  return (
    <main className={darkMode ? "gym-site dark" : "gym-site"}>

      {/* NAVBAR */}
      <header className="navbar">
        <div className="container nav-inner">
          <a href="#beranda" className="logo">
            <Dumbbell size={34} strokeWidth={3} />
            <span>
              GYM<span className="red">88</span>
            </span>
          </a>

          <nav className={menuOpen ? "nav-links show" : "nav-links"}>
            {navItems.map(([label, href]) => (
              <a
                href={href}
                key={label}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <button
              className="theme-button"
              onClick={() => setDarkMode(!darkMode)}
              aria-label="Ganti tema"
              type="button"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <a href="/login" className="btn btn-primary nav-cta">
              Daftar Member
            </a>

            <button
              className="mobile-menu"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Buka menu"
              type="button"
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="hero" id="beranda">
        <div className="hero-image" />
        <div className="hero-overlay" />

        <div className="container hero-content">
          <div className="hero-copy">
            <span className="eyebrow">
              <span className="eyebrow-line" />
              GYM88 FITNESS CENTER
            </span>

            <h1>
              Bentuk Tubuh Ideal,
              <br />
              Jaga Kesehatan
              <br />
              Bersama <span className="red">Gym88.</span>
            </h1>

            <p>
              Pusat kebugaran dengan fasilitas lengkap, peralatan
              modern, trainer profesional, dan program latihan
              yang sesuai dengan tujuanmu.
            </p>

            <div className="hero-buttons">
              <a href="#membership" className="btn btn-primary">
                Daftar Sekarang
                <ArrowRight size={19} />
              </a>

              <a href="#fasilitas" className="btn btn-outline">
                Lihat Fasilitas
              </a>
            </div>

            <div className="hero-benefits">
              <div>
                <Dumbbell />
                <span>
                  Alat Lengkap
                  <br />
                  & Modern
                </span>
              </div>

              <div>
                <Users />
                <span>
                  Trainer
                  <br />
                  Profesional
                </span>
              </div>

              <div>
                <MapPin />
                <span>
                  Lokasi
                  <br />
                  Strategis
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-decoration" />
      </section>

      {/* STATISTICS */}
      <section className="stats-section">
        <div className="container stats">
          {[
            {
              icon: Users,
              number: "1.200+",
              label: "Member Aktif",
            },
            {
              icon: Dumbbell,
              number: "50+",
              label: "Alat Olahraga",
            },
            {
              icon: Trophy,
              number: "10+",
              label: "Trainer Profesional",
            },
            {
              icon: CalendarDays,
              number: "5+",
              label: "Program Latihan",
            },
          ].map((item) => (
            <div className="stat-item" key={item.label}>
              <item.icon />
              <div>
                <h3>{item.number}</h3>
                <p>{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="section about-section" id="tentang">
        <div className="container about-grid">
          <div className="about-copy">
            <span className="section-label">TENTANG GYM88</span>

            <h2>
              Lebih dari Sekadar{" "}
              <span className="red">Tempat Gym.</span>
            </h2>

            <p>
              GYM88 hadir sebagai pusat kebugaran modern yang
              membantu kamu mencapai gaya hidup sehat, bugar,
              dan percaya diri dengan dukungan fasilitas lengkap
              dan lingkungan yang nyaman.
            </p>

            <ul className="check-list">
              <li>
                <Check /> Fasilitas lengkap dan terawat
              </li>
              <li>
                <Check /> Program latihan sesuai tujuan
              </li>
              <li>
                <Check /> Pendampingan trainer profesional
              </li>
              <li>
                <Check /> Lingkungan latihan yang nyaman
              </li>
            </ul>

            <a href="#fasilitas" className="btn btn-primary">
              Selengkapnya <ArrowRight size={18} />
            </a>
          </div>

          <div className="about-visual">
            <img
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&q=90"
              alt="Interior gym modern GYM88"
            />

            <div className="about-badge">
              <Dumbbell size={27} />
              <div>
                <strong>GYM88 FITNESS</strong>
                <span>Train. Improve. Repeat.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FACILITIES */}
      <section className="section facilities-section" id="fasilitas">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">FASILITAS KAMI</span>

              <h2>
                Fasilitas untuk Hasil{" "}
                <span className="red">Maksimal.</span>
              </h2>

              <p>
                Peralatan modern untuk mendukung setiap target latihanmu.
              </p>
            </div>

            <a href="#galeri" className="text-link">
              Lihat Galeri <ArrowRight size={18} />
            </a>
          </div>

          <div className="facility-grid">
            {facilities.map((facility) => (
              <article className="facility-card" key={facility.title}>
                <img src={facility.image} alt={facility.title} />

                <div className="facility-content">
                  <facility.icon size={27} />
                  <h3>{facility.title}</h3>
                  <p>{facility.description}</p>

                  <a href="#kontak">
                    Selengkapnya <ChevronRight size={16} />
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBERSHIP */}
      <section className="section membership-section" id="membership">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">PAKET MEMBERSHIP</span>

            <h2>
              Pilih Paket <span className="red">Latihanmu.</span>
            </h2>

            <p>
              Mulai perjalanan hidup sehatmu bersama GYM88.
              Pilih paket sesuai kebutuhan.
            </p>
          </div>

          <div className="pricing-grid">
            {packages.map((pkg) => (
              <article
                className={`pricing-card ${pkg.popular ? "popular" : ""}`}
                key={pkg.name}
              >
                {pkg.popular && (
                  <span className="popular-label">
                    PALING POPULER
                  </span>
                )}

                <h3>{pkg.name}</h3>
                <p>{pkg.description}</p>

                <div className="price">
                  <span>Rp</span> {pkg.price}
                  <small>{pkg.period}</small>
                </div>

                <div className="pricing-divider" />

                <ul className="check-list">
                  {pkg.features.map((feature) => (
                    <li key={feature}>
                      <Check /> {feature}
                    </li>
                  ))}
                </ul>

                <a
                  href="#kontak"
                  className={`btn ${
                    pkg.popular
                      ? "btn-primary"
                      : "btn-outline-dark"
                  }`}
                >
                  Pilih Paket <ArrowRight size={18} />
                </a>
              </article>
            ))}
          </div>

          <p className="pricing-note">
            * Harga merupakan contoh dan dapat disesuaikan dengan
            ketentuan resmi GYM88.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="section gallery-section" id="galeri">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="section-label">GALERI GYM88</span>

              <h2>
                Lihat Keseruan <span className="red">Latihan.</span>
              </h2>

              <p>
                Kenali suasana dan fasilitas latihan GYM88.
              </p>
            </div>
          </div>

          <div className="gallery-grid">
            {gallery.map((image, index) => (
              <div
                className={`gallery-item gallery-${index + 1}`}
                key={image}
              >
                <img
                  src={image}
                  alt={`Galeri GYM88 ${index + 1}`}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section testimonial-section">
        <div className="container">
          <div className="section-heading centered">
            <span className="section-label">TESTIMONI MEMBER</span>

            <h2>
              Cerita Mereka di <span className="red">GYM88.</span>
            </h2>

            <p>
              Perjalanan sehat dimulai dari langkah kecil.
            </p>
          </div>

          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <article
                className="testimonial-card"
                key={testimonial.name}
              >
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={17}
                      fill="currentColor"
                    />
                  ))}
                </div>

                <p>&ldquo;{testimonial.text}&rdquo;</p>

                <div className="testimonial-author">
                  <div className="avatar">
                    {testimonial.name.charAt(0)}
                  </div>

                  <div>
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="kontak">
        <div className="container cta-content">
          <span className="section-label">WAKTUNYA BERUBAH</span>

          <h2>
            Jangan Tunggu Besok.
            <br />
            <span className="red">Mulai Hari Ini!</span>
          </h2>

          <p>
            Bergabunglah bersama GYM88 dan mulai perjalanan
            menuju tubuh yang lebih sehat dan kuat.
          </p>

          <a href="#membership" className="btn btn-primary">
            Gabung Sekarang <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-grid">
          <div className="footer-brand">
            <a href="#beranda" className="logo">
              <Dumbbell size={32} />
              <span>
                GYM<span className="red">88</span>
              </span>
            </a>

            <p>
              GYM88 Fitness Center. Tempat terbaik untuk
              membangun kebugaran, kesehatan, dan kepercayaan diri.
            </p>

            <div className="social-links">

              <a href="#" aria-label="Website">
                <Globe />
              </a>
            </div>
          </div>

          <div>
            <h4>Navigasi</h4>
            <a href="#beranda">Beranda</a>
            <a href="#tentang">Tentang Kami</a>
            <a href="#fasilitas">Fasilitas</a>
            <a href="#membership">Membership</a>
          </div>

          <div>
            <h4>Informasi</h4>
            <a href="#galeri">Galeri</a>
            <a href="#kontak">Kontak</a>
            <a href="#membership">Paket Latihan</a>
          </div>

          <div>
            <h4>Hubungi Kami</h4>
            <p>
              <MapPin /> Lokasi GYM88
            </p>
            <p>
              <Phone /> Nomor Telepon
            </p>
            <p>
              <Mail /> Email GYM88
            </p>
          </div>
        </div>

        <div className="container footer-bottom">
          <p>
            © {year ?? ""} GYM88 Fitness Center. All rights reserved.
          </p>
          <p>Train Hard. Stay Strong.</p>
        </div>
      </footer>
    </main>
  );
}
