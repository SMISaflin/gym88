"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    
    // Auto dismiss dalam 4 detik
    const timer = setTimeout(() => {
      setToast(null);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* CONTAINER TOAST NOTIFICATION (Posisi di kanan atas layar) */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 transition-all duration-300 ease-out transform translate-y-0 opacity-100">
          <div className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-xl border backdrop-blur-md max-w-md ${
            toast.type === "success" 
              ? "bg-emerald-50/95 border-emerald-200 text-emerald-900" 
              : toast.type === "error"
              ? "bg-rose-50/95 border-rose-200 text-rose-900"
              : toast.type === "warning"
              ? "bg-amber-50/95 border-amber-200 text-amber-900"
              : "bg-blue-50/95 border-blue-200 text-blue-900"
          }`}>
            
            {/* Ikon Status */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 font-bold ${
              toast.type === "success" ? "bg-emerald-500 text-white" :
              toast.type === "error" ? "bg-rose-500 text-white" :
              toast.type === "warning" ? "bg-amber-500 text-white" : "bg-blue-500 text-white"
            }`}>
              <i className={`fa-solid ${
                toast.type === "success" ? "fa-check" :
                toast.type === "error" ? "fa-xmark" :
                toast.type === "warning" ? "fa-triangle-exclamation" : "fa-info"
              }`}></i>
            </div>

            {/* Pesan Teks */}
            <div className="flex flex-col pr-2">
              <span className="font-black uppercase text-[10px] tracking-wider opacity-70">
                {toast.type === "success" ? "Berhasil" : toast.type === "error" ? "Gagal" : toast.type === "warning" ? "Peringatan" : "Informasi"}
              </span>
              <span className="font-bold text-xs">{toast.message}</span>
            </div>

            {/* Tombol Tutup Manual */}
            <button 
              onClick={() => setToast(null)}
              className="ml-auto text-slate-400 hover:text-slate-700 p-1 transition"
            >
              <i className="fa-solid fa-xmark text-xs"></i>
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

// Custom Hook agar mudah dipanggil di halaman lain
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast harus digunakan di dalam pembungkus ToastProvider");
  }
  return context;
}