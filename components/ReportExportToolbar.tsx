// components/ReportExportToolbar.tsx
"use client";

import { useToast } from "@/components/ToastProvider";

interface ExportToolbarProps {
  data: any[];
  filename: string;
  title: string;
}

export default function ReportExportToolbar({ data, filename, title }: ExportToolbarProps) {
  const { showToast } = useToast();

  // Fungsi Ekspor ke Excel (CSV)
  const handleExportExcel = () => {
    if (!data || data.length === 0) {
      showToast("Tidak ada data untuk diexport!", "warning");
      return;
    }

    try {
      const headers = Object.keys(data[0]);
      const csvRows = [];

      // Masukkan header kolom
      csvRows.push(headers.join(","));

      // Masukkan baris data
      for (const row of data) {
        const values = headers.map(header => {
          const val = row[header] ?? "";
          const escaped = String(val).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(","));
      }

      const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast("File Excel (CSV) berhasil diunduh!", "success");
    } catch (error) {
      showToast("Gagal mengexport file Excel.", "error");
    }
  };

  // Fungsi Cetak / Ekspor PDF
  const handleExportPDF = () => {
    if (!data || data.length === 0) {
      showToast("Tidak ada data untuk dicetak!", "warning");
      return;
    }
    window.print();
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={handleExportExcel}
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 text-xs"
      >
        <i className="fa-solid fa-file-excel text-sm"></i>
        <span>Ekspor Excel</span>
      </button>

      <button
        onClick={handleExportPDF}
        className="bg-rose-600 hover:bg-rose-700 text-white font-bold px-3.5 py-2.5 rounded-xl shadow-xs transition flex items-center space-x-2 text-xs"
      >
        <i className="fa-solid fa-file-pdf text-sm"></i>
        <span>Cetak / Ekspor PDF</span>
      </button>
    </div>
  );
}