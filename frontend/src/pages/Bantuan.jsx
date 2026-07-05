import { useState } from 'react';
import LayoutMhs from '../components/LayoutMhs';

const faqs = [
  {
    question: 'Bagaimana cara mengirim laporan?',
    answer: 'Masuk dengan akun UIN Alauddin, pilih tombol Buat Laporan, lalu isi detail lokasi, fasilitas yang rusak, dan deskripsi kerusakan.',
  },
  {
    question: 'Apakah identitas pelapor terlihat?',
    answer: 'Ya. Setiap laporan akan terhubung ke akun Anda sehingga identitas pelapor terlihat dalam sistem.',
  },
  {
    question: 'Bagaimana status laporan dipantau?',
    answer: 'Status akan berubah dari pending ke diproses hingga selesai sesuai penanganan admin. Anda bisa melihat progresnya di beranda.',
  },
];

function Bantuan() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <LayoutMhs>
      <div className="mx-auto max-w-5xl px-4 py-8 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#30578f]">Bantuan</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900">FAQ KampusFix</h2>
          <div className="mt-6 space-y-3">
            {faqs.map((item, index) => (
              <div key={item.question} className="rounded-2xl border border-slate-200">
                <button onClick={() => setOpenIndex(index === openIndex ? -1 : index)} className="flex w-full items-center justify-between px-4 py-4 text-left text-sm font-semibold text-slate-800">
                  {item.question}
                  <span>{index === openIndex ? '-' : '+'}</span>
                </button>
                {index === openIndex && <p className="px-4 pb-4 text-sm text-slate-600">{item.answer}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutMhs>
  );
}

export default Bantuan;
