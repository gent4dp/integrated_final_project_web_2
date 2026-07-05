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
        <div className="hidden md:flex items-center gap-2">
          
          {/* Tombol Beranda */}
          <button 
            onClick={() => setActiveMenu('beranda')}
            className={`relative text-[14px] bg-transparent border-none px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-sans ${
              activeMenu === 'beranda' 
                ? 'font-bold text-[#2b5292] bg-[#2b5292]/8' 
                : 'font-medium text-[#64748b] hover:text-[#2b5292] hover:bg-[#2b5292]/5'
            }`}
          >
            Beranda
            <span
              className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#2b5292] transition-all duration-300 origin-center ${
                activeMenu === 'beranda' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
            />
          </button>

          {/* Tombol Bantuan */}
          <button 
            onClick={() => setActiveMenu('bantuan')}
            className={`relative text-[14px] bg-transparent border-none px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 font-sans ${
              activeMenu === 'bantuan' 
                ? 'font-bold text-[#2b5292] bg-[#2b5292]/8' 
                : 'font-medium text-[#64748b] hover:text-[#2b5292] hover:bg-[#2b5292]/5'
            }`}
          >
            Bantuan
            <span
              className={`absolute bottom-1 left-4 right-4 h-0.5 rounded-full bg-[#2b5292] transition-all duration-300 origin-center ${
                activeMenu === 'bantuan' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}
            />
          </button>

        </div>

        {/* KANAN: Dikosongkan (Profil & Kalender Berhasil Dihapus) */}
        <div className="hidden md:block w-[120px]"></div>

      </div>
    </nav>
  );
};

export default NavbarLanding;