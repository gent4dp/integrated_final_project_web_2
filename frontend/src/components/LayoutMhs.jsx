import React from 'react';
import Navbar from '../components/Navbar'; // Memanggil Navbar buatanmu
import Footer from '../components/Footer'; // Memanggil Footer buatan temanmu

// Kita menangkap komponen halaman lain menggunakan properti { children }
const LayoutMhs = ({ children }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
      
      {/* 1. BAGIAN ATAS: Navbar yang selalu stand by */}
      <Navbar />

      {/* 2. BAGIAN TENGAH: Tempat otomatis untuk konten halaman baru */}
      {/* flex-grow memastikan jika kontennya sedikit, footer tetap dipaksa berada di paling bawah layar */}
      <main className="flex-grow">
        {children}
      </main>

      {/* 3. BAGIAN BAWAH: Footer kelompok kalian */}
      <Footer />

    </div>
  );
};

export default LayoutMhs;