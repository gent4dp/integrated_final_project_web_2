import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { CheckCircle2, Clock3, MessageSquare, MapPin, ShieldAlert } from 'lucide-react';

const statusSteps = ['pending', 'diproses', 'selesai'];
const stepLabels = {
  pending: 'Diajukan',
  diproses: 'Diproses',
  selesai: 'Selesai',
};

function DetailModal({ isOpen, onClose, report, onStatusChange, onCommentSubmit, isAdmin }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const currentIndex = statusSteps.indexOf(report.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between pb-4 border-b border-slate-100">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#30578f]">Detail Aduan</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{report.judul_laporan}</h3>
                <p className="mt-1 text-sm text-slate-500">{report.fakultas} • {report.lokasi_fasilitas}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">{report.kategori}</span>
                <span className={`rounded-full px-3 py-2 text-sm font-semibold ${report.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' : report.status === 'diproses' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>{report.status}</span>
                <button onClick={onClose} className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-500 hover:bg-slate-50">Tutup</button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto mt-4 pr-1">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MapPin size={16} /> Lokasi
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{report.lokasi_fasilitas}</p>
                </div>

                <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Deskripsi kerusakan</p>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{report.deskripsi_kerusakan}</p>
                </div>

                {report.foto_bukti && (
                  <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                    <p className="text-sm font-semibold text-slate-700">Foto bukti</p>
                    <div className="mt-4 overflow-hidden rounded-3xl bg-slate-50 border border-slate-100 flex justify-center items-center max-h-80">
                      <img src={report.foto_bukti} alt="Bukti laporan" className="max-h-80 max-w-full object-contain" />
                    </div>
                  </div>
                )}

                <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MessageSquare size={16} /> Diskusi
                    </div>
                    <span className="text-xs text-slate-500">{report.comments?.length || 0} komentar</span>
                  </div>
                  <div className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                    {report.comments?.length ? report.comments.map((comment) => (
                      <div key={comment.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
                          <span>{comment.user?.name || 'Pengguna'}</span>
                          <span className="text-xs text-slate-500">{new Date(comment.created_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <p className="mt-2 text-sm text-slate-600 leading-6">{comment.komentar}</p>
                      </div>
                    )) : <p className="text-sm text-slate-500">Belum ada komentar.</p>}
                  </div>
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (!commentText.trim() || isSubmitting) return;
                    setIsSubmitting(true);
                    try {
                      await onCommentSubmit?.(report.id, commentText);
                      setCommentText('');
                    } finally {
                      setIsSubmitting(false);
                    }
                  }} className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                    <label className="text-sm font-semibold text-slate-700">Tambahkan komentar</label>
                    <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} rows={3} className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#30578f]" placeholder="Tulis komentar Anda di sini..." disabled={isSubmitting} />
                    <button type="submit" disabled={isSubmitting || !commentText.trim()} className="mt-3 rounded-2xl bg-[#30578f] px-4 py-3 text-sm font-semibold text-white hover:bg-[#274a77] disabled:opacity-50 disabled:cursor-not-allowed">{isSubmitting ? 'Mengirim...' : 'Kirim komentar'}</button>
                  </form>
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <Clock3 size={16} /> Status progress
                  </div>
                  <div className="mt-4 space-y-4">
                    {statusSteps.map((step, index) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full ${index <= currentIndex ? 'bg-[#30578f] text-white' : 'bg-slate-200 text-slate-500'}`}>
                          {index <= currentIndex ? <CheckCircle2 size={16} /> : index + 1}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{stepLabels[step]}</p>
                          <p className="text-xs text-slate-500">{index === currentIndex ? 'Saat ini' : 'Tahap berikutnya'}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                  <p className="text-sm font-semibold text-slate-700">Informasi pelapor</p>
                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex justify-between border-b border-slate-200 pb-3">
                      <span>Nama</span>
                      <span>{report.user?.name || 'Pengguna'}</span>
                    </div>
                    <div className="flex justify-between pt-3 text-slate-500">
                      <span>NIM</span>
                      <span>{report.user?.nim || '***'}</span>
                    </div>
                  </div>
                </div>

                {isAdmin && (
                  <div className="rounded-3xl border border-slate-200 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <ShieldAlert size={16} /> Panel admin
                    </div>
                    <select
                      className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                      defaultValue={report.status}
                      onChange={(event) => onStatusChange?.(report.id, event.target.value)}
                    >
                      <option value="pending">Pending</option>
                      <option value="diproses">Diproses</option>
                      <option value="selesai">Selesai</option>
                    </select>
                    <button
                      className="mt-4 w-full rounded-2xl bg-[#30578f] px-4 py-3 text-sm font-semibold text-white"
                      onClick={() => onCommentSubmit?.(report.id, 'Catatan admin diperbarui melalui panel KampusFix.')}
                    >
                      Simpan catatan
                    </button>
                  </div>
                )}
              </div>
            </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default DetailModal;
