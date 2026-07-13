import { useState } from 'react';
import { HelpCircle, ChevronDown, Phone, Mail, Clock, MessageSquare, AlertCircle, ShieldCheck } from 'lucide-react';
import LayoutMhs from '../components/LayoutMhs';

const faqs = [
  {
    question: 'Bagaimana cara menyampaikan aduan kerusakan fasilitas?',
    answer: 'Masuk terlebih dahulu menggunakan akun resmi UIN Alauddin Makassar Anda. Di halaman Beranda, klik tombol "Buat Laporan". Isi data laporan seperti judul, lokasi fasilitas spesifik, kategori alat/barang, tingkat urgensi, serta deskripsi detail dan foto bukti kerusakan jika ada.',
  },
  {
    question: 'Berapa lama laporan kerusakan saya akan diproses?',
    answer: 'Tim Sarana & Prasarana UINAM akan melakukan review laporan Anda dalam waktu maksimal 1x24 jam sejak laporan masuk (berstatus Pending). Jika laporan valid, status akan berubah menjadi "Diproses" dan tim teknis akan segera dijadwalkan untuk melakukan perbaikan fisik di lokasi.',
  },
  {
    question: 'Apa fungsi tombol "Saya Juga Mengalami" (Upvote)?',
    answer: 'Tombol tersebut berguna bagi mahasiswa lain untuk memberikan dukungan suara (upvote) pada laporan yang sama. Semakin banyak upvote yang didapatkan oleh suatu aduan, maka tingkat prioritas perbaikan fasilitas tersebut akan semakin tinggi di dashboard antrean tim admin.',
  },
  {
    question: 'Apakah identitas saya aman saat melapor?',
    answer: 'Demi menjaga transparansi dan pertanggungjawaban data, identitas pelapor (Nama & NIM) akan tercatat di sistem admin KampusFix. Namun, kami menjamin bahwa laporan Anda akan ditangani secara profesional tanpa memengaruhi rekam akademis.',
  },
  {
    question: 'Bagaimana jika laporan saya ditolak atau diarsipkan?',
    answer: 'Laporan yang tidak valid, tidak sopan, atau bersifat spam akan ditolak oleh admin. Sedangkan laporan yang telah diselesaikan pengerjaannya ("Selesai") secara bertahap akan dipindahkan ke folder Arsip oleh admin untuk merapikan antrean tanpa menghapus riwayat datanya di database statistik.',
  },
];

const alurLangkah = [
  {
    id: 1,
    title: '1. Kirim Laporan',
    desc: 'Mahasiswa mengisi form laporan kerusakan fasilitas kampus secara lengkap.',
    icon: <MessageSquare className="h-5 w-5 text-blue-600" />,
    bg: 'bg-blue-50',
  },
  {
    id: 2,
    title: '2. Verifikasi Admin',
    desc: 'Admin memeriksa validitas pengaduan, mencocokkan lokasi, serta menetapkan prioritas.',
    icon: <AlertCircle className="h-5 w-5 text-amber-600" />,
    bg: 'bg-amber-50',
  },
  {
    id: 3,
    title: '3. Tindak Lanjut',
    desc: 'Tim teknisi bergerak ke lapangan untuk menangani pengerjaan perbaikan fasilitas terkait.',
    icon: <Clock className="h-5 w-5 text-indigo-600" />,
    bg: 'bg-indigo-50',
  },
  {
    id: 4,
    title: '4. Selesai',
    desc: 'Fasilitas selesai diperbaiki dan admin memperbarui status aduan menjadi Selesai.',
    icon: <ShieldCheck className="h-5 w-5 text-emerald-600" />,
    bg: 'bg-emerald-50',
  },
];

function Bantuan() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <LayoutMhs>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        
        {/* Header Hero Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-[#30578f] mb-4">
            <HelpCircle size={14} /> Pusat Informasi & Bantuan
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">Ada yang Bisa Kami Bantu?</h1>
          <p className="mt-3 text-slate-500 max-w-xl mx-auto text-sm leading-relaxed">
            Temukan jawaban atas pertanyaan umum seputar pengaduan sarana prasarana Kampus UIN Alauddin Makassar atau hubungi kontak resmi kami.
          </p>
        </div>

        {/* Alur Kerja Section */}
        <div className="mt-8 rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Alur Penanganan Pengaduan</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {alurLangkah.map((langkah) => (
              <div key={langkah.id} className="relative rounded-2xl border border-slate-100 p-5 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all duration-200">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${langkah.bg} mb-4`}>
                  {langkah.icon}
                </div>
                <h3 className="text-sm font-bold text-slate-800 leading-snug">{langkah.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-500">{langkah.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.5fr_1fr]">
          
          {/* FAQ Accordion Section */}
          <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4 mb-5 flex items-center gap-2">
              <HelpCircle className="text-[#30578f] h-5 w-5" /> Pertanyaan Populer (FAQ)
            </h2>
            <div className="space-y-3">
              {faqs.map((item, index) => {
                const isOpen = index === openIndex;
                return (
                  <div key={item.question} className={`rounded-2xl border transition-all duration-200 ${isOpen ? 'border-[#30578f]/40 bg-blue-50/10 shadow-sm' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
                    <button 
                      onClick={() => setOpenIndex(isOpen ? -1 : index)} 
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-bold text-slate-800"
                    >
                      <span>{item.question}</span>
                      <ChevronDown size={16} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-[#30578f]' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs leading-relaxed text-slate-600 border-t border-slate-100/50 mt-1">
                        {item.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Hotline & Kontak Section */}
          <div className="space-y-6">
            
            {/* Kontak Card */}
            <div className="rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-4">Hotline & Kontak Resmi</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                Butuh bantuan darurat atau ingin berkoordinasi secara langsung? Hubungi perwakilan Tim Sarana & Prasarana UINAM di bawah ini:
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <Phone size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">WhatsApp Support</p>
                    <p className="text-sm font-bold text-slate-800 hover:text-emerald-600 transition">+62 812-3456-7890</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Mail size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Email Layanan</p>
                    <p className="text-sm font-bold text-slate-800 hover:text-[#30578f] transition">sarpras@uin-alauddin.ac.id</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Jam Operasional</p>
                    <p className="text-sm font-bold text-slate-800">Senin - Jumat | 08.00 - 16.00 WITA</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Penting Card */}
            <div className="rounded-3xl bg-gradient-to-br from-[#30578f] to-[#1e3b63] p-6 text-white shadow-md">
              <h3 className="font-bold text-base">Lokasi Fisik Kantor</h3>
              <p className="mt-2 text-xs leading-relaxed text-blue-100">
                Gedung Rektorat Lantai 2, Kampus II UIN Alauddin Makassar.
                Jl. H. M. Yasin Limpo No. 36, Samata, Kec. Somba Opu, Kabupaten Gowa, Sulawesi Selatan.
              </p>
            </div>

          </div>

        </div>

      </div>
    </LayoutMhs>
  );
}

export default Bantuan;
