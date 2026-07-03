import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Eye, ShieldCheck, TrendingUp, LogIn, MapPin, MonitorCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import NavbarLanding from '../components/NavbarLanding';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans antialiased selection:bg-[#30578f] selection:text-white">
      <NavbarLanding />

      <main className="flex-grow">
        <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2 md:px-12 md:py-20 md:items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-sm font-semibold text-[#30578f]">
              <ShieldCheck size={16} /> KampusFix • UIN Alauddin Makassar
            </div>
            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 md:text-5xl">
              Fasilitas kampus rusak? <span className="text-[#30578f]">Laporkan di satu platform.</span>
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600">
              Platform digital untuk mahasiswa UIN Alauddin Makassar dalam menyampaikan aspirasi perbaikan fasilitas secara transparan, cepat, dan terdokumentasi.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/login" className="flex items-center gap-2 rounded-full bg-[#30578f] px-6 py-3 font-semibold text-white shadow-lg shadow-blue-900/10">
                <LogIn size={18} /> Masuk ke KampusFix
              </Link>
              <a href="#fitur" className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-[#30578f]">
                Pelajari selengkapnya
              </a>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="relative flex justify-center md:justify-end">
            <div className="relative w-full max-w-lg">
              <img src="https://washilah.com/wp-content/uploads/2024/07/IMG-20240722-WA0001-scaled.jpg" alt="Gedung Kampus" className="h-[320px] w-full rounded-[2rem] border border-slate-100 object-cover shadow-2xl md:h-[380px]" />
              <div className="absolute bottom-[-16px] left-6 flex items-center gap-3 rounded-2xl border border-white/60 bg-white/90 px-4 py-3 shadow-lg backdrop-blur">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-[#30578f]">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">Fasilitas kampus</p>
                  <p className="text-sm font-semibold text-slate-800">UINAM Official</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section id="fitur" className="border-y border-slate-100 bg-slate-50/70 py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-6 text-center md:px-12">
            <h2 className="text-2xl font-extrabold text-slate-900 md:text-3xl">Kenapa KampusFix?</h2>
            <p className="mt-2 text-slate-500">Dibuat khusus untuk efisiensi penanganan fasilitas kampus</p>

            <div className="mt-12 grid gap-8 text-left md:grid-cols-3">
              {[
                { icon: Eye, title: 'Transparansi penuh', text: 'Pantau status aduan dari diterima hingga selesai dan lihat catatan penanganan tim.' },
                { icon: ShieldAlert, title: 'Valid & aman', text: 'Akses hanya melalui akun resmi kampus sehingga setiap laporan dapat dipertanggungjawabkan.' },
                { icon: TrendingUp, title: 'Prioritas oleh dukungan', text: 'Laporan dengan dukungan terbanyak akan lebih cepat mendapat perhatian tim fasilitas.' },
              ].map((item, index) => (
                <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#30578f]">
                    <item.icon size={20} />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16 md:px-12 md:py-24">
          <h2 className="text-center text-2xl font-extrabold text-slate-900 md:text-3xl">Cara kerja</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              { icon: LogIn, title: 'Login akun', text: 'Masuk dengan akun UIN Alauddin yang telah tersedia.' },
              { icon: MapPin, title: 'Laporkan lokasi', text: 'Pilih gedung, isi detail, dan lampirkan bukti jika ada.' },
              { icon: MonitorCheck, title: 'Pantau progres', text: 'Ikuti perkembangan penanganan dari dashboard Anda.' },
            ].map((item, index) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }} className="rounded-2xl bg-slate-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#30578f] text-white">
                  <item.icon size={20} />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-[#30578f] py-12 text-white">
          <div className="mx-auto grid max-w-5xl gap-8 px-6 text-center md:grid-cols-2">
            <div>
              <p className="text-4xl font-black tracking-tight md:text-5xl">142</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-blue-100">Laporan terselesaikan</p>
            </div>
            <div>
              <p className="text-4xl font-black tracking-tight md:text-5xl">12</p>
              <p className="mt-2 text-sm uppercase tracking-[0.25em] text-blue-100">Laporan diproses</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;