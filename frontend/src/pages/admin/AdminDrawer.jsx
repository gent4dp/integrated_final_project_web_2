import React, { useState } from 'react';
import { LayoutGrid, ClipboardList, LogOut, ShieldAlert } from 'lucide-react';

const AdminDrawer = () => {
  // Mengunci status menu aktif default pada 'Dashboard Statistik'
  const [activeMenu, setActiveMenu] = useState('/admin/dashboard');

  return (
    <aside className="w-[260px] h-screen bg-white border-r border-[#eef2f5] flex flex-col justify-between p-6 fixed left-0 top-0 box-border font-sans z-50">
      
      {/* BAGIAN ATAS: LOGO & NAVIGASI */}
      <div>
        {/* Logo KampusFix */}
        <div className="flex items-center gap-3 mb-8 pl-1">
          <div className="bg-[#2b5292] text-white w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-[18px] font-bold text-[#2b5292] leading-tight m-0 tracking-tight">
              KampusFix
            </h1>
            <p className="text-[11px] text-[#64748b] m-0 mt-0.5 font-medium">
              Admin Panel
            </p>
          </div>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex flex-col gap-1">
          {/* Tombol Dashboard Statistik */}
          <button 
            onClick={() => setActiveMenu('/admin/dashboard')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[13.5px] text-left w-full transition-all duration-150 border-none bg-transparent ${
              activeMenu === '/admin/dashboard' 
                ? 'bg-[#b9d5fd] text-[#2b5292] font-semibold' // WARNA HIGHLIGHT LEBIH GELAP & KONTRAS
                : 'text-[#475569] hover:bg-[#f8fafc] cursor-pointer'
            }`}
          >
            <LayoutGrid size={18} className="flex-shrink-0" />
            <span>Dashboard Statistik</span>
          </button>

          {/* Tombol Kelola Laporan */}
          <button 
            onClick={() => setActiveMenu('/admin/kelola-laporan')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-[13.5px] text-left w-full transition-all duration-150 border-none bg-transparent ${
              activeMenu === '/admin/kelola-laporan' 
                ? 'bg-[#b9d5fd] text-[#2b5292] font-semibold' // WARNA HIGHLIGHT LEBIH GELAP & KONTRAS
                : 'text-[#475569] hover:bg-[#f8fafc] cursor-pointer'
            }`}
          >
            <ClipboardList size={18} className="flex-shrink-0" />
            <span>Kelola Laporan</span>
          </button>
        </nav>
      </div>

      {/* BAGIAN BAWAH: PROFIL & LOGOUT */}
      <div className="border-t border-[#f1f5f9] pt-4 flex flex-col gap-4">
        <div className="flex items-center gap-3 pl-1">
          <img 
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=60" 
            alt="Budi Santoso" 
            className="w-9 h-9 rounded-full object-cover flex-shrink-0" 
          />
          <div className="flex flex-col min-w-0">
            <h4 className="text-[13px] font-semibold text-[#1e293b] m-0 truncate">
              Budi Santoso
            </h4>
            <p className="text-[11px] text-[#64748b] m-0 mt-0.5 truncate">
              Facility Management
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => alert('Logout berhasil')}
          className="flex items-center gap-3 w-full px-3 py-2 bg-transparent border-none text-[#dc2626] font-semibold text-[13px] rounded-lg text-left hover:bg-[#fef2f2] transition-colors cursor-pointer"
        >
          <LogOut size={16} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default AdminDrawer;