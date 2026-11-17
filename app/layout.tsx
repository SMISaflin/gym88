
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GYM88 | Fitness Center",
  description:
    "GYM88 Fitness Center - Wujudkan tubuh sehat dan ideal bersama fasilitas gym modern dan trainer profesional.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        {/* Script Midtrans Snap (Ganti dengan URL production jika sudah live) */}
        <script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          async
        ></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
