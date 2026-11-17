
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
      <body>{children}</body>
    </html>
  );
}
