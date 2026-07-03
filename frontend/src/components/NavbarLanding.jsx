import React, { useState } from 'react'; // Memanggil useState dari React
import { ShieldAlert } from 'lucide-react'; // Mengapus Calendar karena tidak digunakan lagi

const NavbarLanding = () => {
  // State untuk melacak menu mana yang sedang aktif di Landing Page
  // Default pertama kali adalah 'beranda'
  const [activeMenu, setActiveMenu] = useState('beranda');

  return (
    <nav className="w-full bg-white border-b border-[#eef2f5] sticky top-0 z-[100] px-6 py-3 font-sans">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* KIRI: Logo & Nama Web */}
        <div className="flex items-center gap-2.5">
          <div className="bg-[#2b5292] w-8 h-8 rounded-lg flex items-center justify-center text-white">
            <ShieldAlert size={19} />
          </div>
          <span className="text-[20px] font-bold text-[#2b5292] tracking-tight">KampusFix</span>
        </div>

        {/* TENGAH: Menu Navigasi Dinamis */}
        <div className="hidden md:flex items-center gap-9">
          
          {/* Tombol Beranda */}
          <button 
            onClick={() => setActiveMenu('beranda')}
            className={`text-[14px] bg-transparent border-none py-1 relative cursor-pointer transition-colors duration-150 font-sans ${
              activeMenu === 'beranda' 
                ? "font-bold text-[#2b5292] after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#2b5292] after:bottom-[-20px] after:left-0" 
                : 'font-medium text-[#64748b] hover:text-[#2b5292]'
            }`}
          >
            Beranda
          </button>

          {/* Tombol Bantuan */}
          <button 
            onClick={() => setActiveMenu('bantuan')}
            className={`text-[14px] bg-transparent border-none py-1 relative cursor-pointer transition-colors duration-150 font-sans ${
              activeMenu === 'bantuan' 
                ? "font-bold text-[#2b5292] after:content-[''] after:absolute after:w-full after:h-[2px] after:bg-[#2b5292] after:bottom-[-20px] after:left-0" 
                : 'font-medium text-[#64748b] hover:text-[#2b5292]'
            }`}
          >
            Bantuan
          </button>

        </div>

        {/* KANAN: Dikosongkan (Profil & Kalender Berhasil Dihapus) */}
        <div className="hidden md:block w-[120px]"></div>

      </div>
    </nav>
  );
};

export default NavbarLanding;