import React from 'react';

export default function Navbar() {
  return (
    <nav className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-blue-600/20">
            S
          </div>
          <span className="text-xl font-bold tracking-tight text-white">SyncSpace</span>
        </div>
        <div className="flex gap-4">
          <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Masuk
          </button>
          <button className="text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            Daftar
          </button>
        </div>
      </div>
    </nav>
  );
}