import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, Clock3, MessageSquare, MapPin, ShieldAlert, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

// statusSteps and stepLabels are now dynamic inside the component

function DetailModal({ isOpen, onClose, report, onStatusChange, onCommentSubmit, isAdmin }) {
  const { user } = useAuth();
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [optimisticComments, setOptimisticComments] = useState([]);
  const commentListRef = useRef(null);

  // Parse images safely (handles arrays, single string, or JSON string)
  const images = (() => {
    if (!report?.foto_bukti) return [];
    if (Array.isArray(report.foto_bukti)) return report.foto_bukti;
    try {
      const parsed = JSON.parse(report.foto_bukti);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [report.foto_bukti];
  })();

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset optimistic ketika report berubah (setelah fetch ulang)
  useEffect(() => {
    setOptimisticComments([]);
  }, [report?.comments]);

  // Auto-scroll ke komentar terbaru
  useEffect(() => {
    if (commentListRef.current) {
      commentListRef.current.scrollTop = commentListRef.current.scrollHeight;
    }
  }, [report?.comments, optimisticComments]);

  if (!report) return null;

  const statusSteps = report.status === 'ditolak' ? ['pending', 'ditolak'] : ['pending', 'diproses', 'selesai'];
  const stepLabels = {
    pending: 'Diajukan',
    diproses: 'Diproses',
    selesai: 'Selesai',
    ditolak: 'Ditolak (Spam)',
  };

  const currentIndex = statusSteps.indexOf(report.status);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="w-full max-w-4xl rounded-3xl bg-white p-6 shadow-2xl max-h-[90vh] flex flex-col"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between pb-4 border-b border-slate-100">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#30578f]">Detail Laporan</p>
                <h3 className="mt-1 text-2xl font-bold text-slate-900">{report.judul_laporan}</h3>
                <p className="mt-1 text-sm text-slate-500">{report.fakultas} • {report.lokasi_fasilitas}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 capitalize">{report.kategori}</span>
                <span className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                  report.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' : 
                  report.status === 'diproses' ? 'bg-blue-100 text-blue-700' : 
                  report.status === 'ditolak' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                }`}>{report.status}</span>
                
                {/* Modern X Close Button with hover:bg-rose-500 */}
                <button 
                  onClick={onClose} 
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 hover:bg-rose-500 hover:text-white hover:border-rose-500 transition-all duration-200"
                  title="Tutup"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto mt-4 pr-1">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
                {/* Kiri: Deskripsi & Foto Bukti (Kondisional Admin) dan Diskusi */}
                <div className="space-y-5">
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <MapPin size={16} /> Lokasi Fasilitas
                    </div>
                    <p className="mt-3 text-sm text-slate-600">{report.lokasi_fasilitas}</p>
                  </div>

                  {/* Otorisasi: Hanya Admin yang dapat melihat deskripsi kerusakan & lampiran bukti secara detail */}
                  {isAdmin ? (
                    <>
                      <div className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-white">
                        <p className="text-sm font-bold text-slate-800">Deskripsi Kerusakan (Admin View)</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">{report.deskripsi_kerusakan}</p>
                      </div>

                      {images.length > 0 && (
                        <div className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-white">
                          <p className="text-sm font-bold text-slate-800">Foto Bukti (Admin View)</p>
                          <div className="mt-4 grid gap-3 grid-cols-1 sm:grid-cols-2">
                            {images.map((src, index) => (
                              <div key={index} className="overflow-hidden rounded-2xl bg-slate-50 border border-slate-100 flex justify-center items-center h-48 sm:h-64 shadow-sm">
                                <img 
                                  src={src} 
                                  alt={`Bukti laporan ${index + 1}`} 
                                  className="h-full w-full object-cover hover:scale-105 transition duration-300" 
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=60';
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="rounded-3xl border border-slate-100 bg-blue-50/50 p-5 text-slate-600 text-sm">
                      <p className="font-semibold text-[#30578f]">Catatan Pengaduan</p>
                      <p className="mt-2 text-xs leading-relaxed text-slate-500">
                        Deskripsi rinci dan lampiran foto disimpan untuk keperluan analisis perbaikan dan hanya dapat diakses oleh Admin.
                      </p>
                    </div>
                  )}

                  {/* Diskusi / Tanggapan */}
                  <div className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <MessageSquare size={16} /> Diskusi & Tindak Lanjut
                      </div>
                      <span className="text-xs text-slate-500">{report.comments?.length || 0} komentar</span>
                    </div>
                    
                    <div ref={commentListRef} className="mt-4 space-y-3 max-h-72 overflow-y-auto pr-1">
                      {[...(report.comments || []), ...optimisticComments].length ? (
                        [...(report.comments || []), ...optimisticComments].map((comment) => (
                          <div
                            key={comment.id}
                            className={`rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-opacity ${comment._optimistic ? 'opacity-60' : 'opacity-100'}`}
                          >
                            <div className="flex items-center justify-between gap-3 text-sm font-semibold text-slate-800">
                              <span>
                                {comment.user?.name || 'Pengguna'}
                                {comment._optimistic && (
                                  <span className="ml-1.5 text-[10px] font-normal text-slate-400">mengirim...</span>
                                )}
                              </span>
                              <span className="text-[10px] font-normal text-slate-400">
                                {new Date(comment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">{comment.komentar}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 py-4 text-center">Belum ada komentar atau tindak lanjut.</p>
                      )}
                    </div>

                    <AnimatePresence>
                      {commentError && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden mt-3"
                        >
                          <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 px-4 py-2.5 text-xs text-rose-700">
                            <AlertCircle size={14} className="shrink-0" />
                            <span>{commentError}</span>
                            <button onClick={() => setCommentError('')} className="ml-auto text-rose-400 hover:text-rose-600">
                              <X size={12} />
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Otorisasi: Form Submit Komentar / Tindak Lanjut hanya untuk Admin */}
                    {isAdmin ? (
                      <form onSubmit={async (e) => {
                        e.preventDefault();
                        const text = commentText.trim();
                        if (!text || isSubmitting) return;
                        setCommentError('');
                        setCommentText('');
                        setIsSubmitting(true);

                        const tempId = `temp_${Date.now()}`;
                        setOptimisticComments((prev) => [...prev, {
                          id: tempId,
                          komentar: text,
                          created_at: new Date().toISOString(),
                          user: { name: user?.name || 'Kamu', id: user?.id },
                          _optimistic: true,
                        }]);

                        try {
                          await onCommentSubmit?.(report.id, text);
                          setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
                        } catch (err) {
                          setOptimisticComments((prev) => prev.filter((c) => c.id !== tempId));
                          setCommentText(text);
                          const status = err?.response?.status;
                          if (status === 429) {
                            setCommentError('Terlalu cepat mengirim komentar. Tunggu sebentar lalu coba lagi.');
                          } else if (status === 422) {
                            const msgs = err?.response?.data?.errors
                              ? Object.values(err.response.data.errors).flat().join(' ')
                              : err?.response?.data?.message;
                            setCommentError(msgs || 'Komentar tidak valid.');
                          } else {
                            setCommentError('Gagal mengirim komentar. Silakan coba lagi.');
                          }
                        } finally {
                          setIsSubmitting(false);
                        }
                      }} className="mt-4 rounded-2xl border border-slate-200 bg-white p-4">
                        <label className="text-xs font-bold text-[#30578f] uppercase tracking-wider">Form Tindak Lanjut (Admin Only)</label>
                        <textarea
                          value={commentText}
                          onChange={(e) => {
                            setCommentText(e.target.value);
                            if (commentError) setCommentError('');
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              e.target.form.requestSubmit();
                            }
                          }}
                          rows={3}
                          className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-[#30578f] focus:bg-white disabled:opacity-60 transition"
                          placeholder="Tulis instruksi perbaikan atau catatan tindak lanjut di sini..."
                          disabled={isSubmitting}
                        />
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-slate-400">Shift+Enter untuk baris baru</span>
                          <button type="submit" disabled={isSubmitting || !commentText.trim()} className="rounded-xl bg-[#30578f] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#274a77] disabled:opacity-50 disabled:cursor-not-allowed transition">
                            {isSubmitting ? 'Mengirim...' : 'Kirim Tanggapan'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-400 text-center leading-relaxed">
                        Kolom penulisan komentar/tindak lanjut hanya dapat diisi oleh Admin Fasilitas. Mahasiswa dapat melihat perkembangan aduan di panel samping.
                      </div>
                    )}
                  </div>
                </div>

                {/* Kanan: Status & Info Pelapor */}
                <div className="space-y-4">
                  <div className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-white">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <Clock3 size={16} /> Progres Aduan
                    </div>
                    <div className="mt-4 space-y-4">
                      {statusSteps.map((step, index) => (
                        <div key={step} className="flex items-start gap-3">
                          <div className={`mt-0.5 flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                            index <= currentIndex ? 'bg-[#30578f] text-white shadow-sm' : 'bg-slate-150 text-slate-400 border border-slate-200'
                          }`}>
                            {index <= currentIndex ? <CheckCircle2 size={13} /> : index + 1}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-700 leading-snug">{stepLabels[step]}</p>
                            <p className="text-[10px] text-slate-400 leading-none mt-0.5">{index === currentIndex ? 'Progres Saat Ini' : 'Tahap'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pelapor</p>
                    <div className="mt-4 space-y-3 text-xs text-slate-600">
                      <div className="flex justify-between border-b border-slate-200 pb-2">
                        <span className="text-slate-400">Nama</span>
                        <span className="font-semibold text-slate-700">{report.user?.name || 'Pengguna'}</span>
                      </div>
                      <div className="flex justify-between pt-2">
                        <span className="text-slate-400">NIM</span>
                        <span className="font-semibold text-slate-700">{report.user?.nim || '***'}</span>
                      </div>
                    </div>
                  </div>

                  {isAdmin && (
                    <div className="rounded-3xl border border-slate-200 p-5 shadow-sm bg-white space-y-3">
                      <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <ShieldAlert size={16} className="text-[#30578f]" />
                        <span>Kontrol Status</span>
                      </div>
                      <select
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-600 cursor-pointer outline-none focus:border-[#30578f]"
                        value={report.status}
                        onChange={(event) => onStatusChange?.(report.id, event.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="diproses">Diproses</option>
                        <option value="selesai">Selesai</option>
                        <option value="ditolak">Ditolak</option>
                      </select>
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
