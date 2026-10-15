import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Gym 88 Management System",
  description: "Sistem Manajemen Gym & Pendeteksi Status Keaktifan Anggota",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="dark">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body className="bg-slate-950 text-slate-100 font-sans antialiased min-h-screen flex flex-col selection:bg-yellow-400 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}