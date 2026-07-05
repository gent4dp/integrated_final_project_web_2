import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createReport, getReport, getReports, getStats, postComment, toggleVote } from '../services/api';
import CardLaporan from '../components/CardLaporan';
import DetailModal from '../components/DetailModal';
import CommentModal from '../components/CommentModal';
import LayoutMhs from '../components/LayoutMhs';


function BerandaMhs() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, selesai: 0, diproses: 0, pending: 0, resolveRate: 0 });
  const [filter, setFilter] = useState({ q: '', status: 'all', sort: 'terbaru' });
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentReport, setCommentReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [form, setForm] = useState({
    judul_laporan: '',
    kategori: '',
    prioritas: 'sedang',
    fakultas: '',
    lokasi_fasilitas: '',
    deskripsi_kerusakan: '',
    foto_bukti: null,
  });

  const fetchReports = async (showLoading = true) => {
    if (showLoading || reports.length === 0) {
      setLoading(true);
    }
    try {
      const [reportsRes, statsRes] = await Promise.all([
        getReports({
          q: filter.q,
          status: filter.status === 'all' ? '' : filter.status,
          sort: filter.sort,
        }),
        getStats(),
      ]);
      setReports(reportsRes.data || []);
      if (statsRes && statsRes.data) {
        const { total, selesai, diproses, pending } = statsRes.data;
        setStats({
          total,
          selesai,
          diproses,
          pending,
          resolveRate: total ? Math.round((selesai / total) * 100) : 0,
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter.q, filter.status, filter.sort]);

  useEffect(() => {
    if (!selectedReportId) return undefined;
    const interval = setInterval(() => fetchSelectedReport(selectedReportId), 6000);
    return () => clearInterval(interval);
  }, [selectedReportId]);



  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'foto_bukti' && value instanceof File) {
            payload.append(key, value);
          } else {
            payload.append(key, value);
          }
        }
      });

      await createReport(payload);
      setForm({
        judul_laporan: '',
        kategori: '',
        prioritas: 'sedang',
        fakultas: '',
        lokasi_fasilitas: '',
        deskripsi_kerusakan: '',
        foto_bukti: null,
      });
      await fetchReports();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Create report failed:', error);

      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().join(' ');
        setSubmitError(messages || 'Data laporan tidak valid. Silakan periksa form.');
      } else {
        setSubmitError(error.response?.data?.message || 'Gagal mengirim laporan. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVote = async (reportId) => {
    await toggleVote(reportId);
    await fetchReports(false);
  };

  const fetchSelectedReport = async (reportId) => {
    const response = await getReport(reportId);
    setSelectedReport(response.data || null);
    setSelectedReportId(reportId);
  };

  const openDetail = async (reportId) => {
    await fetchSelectedReport(reportId);
    setIsDetailOpen(true);
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setSelectedReport(null);
    setSelectedReportId(null);
  };

  const handleCommentSubmit = async (reportId, komentar) => {
    // Kirim komentar, lalu refresh report (untuk update counter & data)
    await postComment(reportId, { komentar });
    // Refresh report di background — tidak perlu await di sini karena optimistic update sudah handle UI
    getReport(reportId).then((res) => {
      if (res?.data) setSelectedReport(res.data);
    }).catch(() => {});
  };

  const openComment = async (reportId) => {
    const response = await getReport(reportId);
    setCommentReport(response.data || null);
    setIsCommentOpen(true);
  };

  const closeComment = () => {
    setIsCommentOpen(false);
    setCommentReport(null);
    fetchReports(false);
  };

  const handleCommentModalSubmit = async (reportId, komentar) => {
    // Kirim komentar, lalu refresh hanya data komentar di commentReport
    await postComment(reportId, { komentar });
    // Refresh ringan — fetch komentar terbaru saja
    getReport(reportId).then((res) => {
      if (res?.data) setCommentReport(res.data);
    }).catch(() => {});
  };

  return (
    <LayoutMhs>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 lg:px-8">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-br from-[#30578f] via-[#2a4f7f] to-[#1e3b63] p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Halo, {user?.name || 'Mahasiswa'}</p>
              <h2 className="mt-2 text-3xl font-bold">Pantau dan dukung fasilitas kampus yang sedang diperbaiki.</h2>
              <p className="mt-3 max-w-2xl text-sm text-blue-100">Buat aduan, lihat laporan terdekat, dan ikuti progres penanganan dari satu tempat.</p>
            </div>
            <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#30578f]">
              <PlusCircle size={18} /> Buat Laporan
            </button>
          </div>
        </motion.section>

        <section className="grid gap-4 md:grid-cols-4">
          {[
            ['Total Aduan', stats.total, 'text-slate-800'],
            ['Selesai', stats.selesai, 'text-emerald-600'],
            ['Diproses', stats.diproses, 'text-amber-600'],
            ['Baru', stats.pending, 'text-rose-600'],
          ].map(([label, value, textClass]) => (
            <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-500">{label}</p>
              <p className={`mt-2 text-3xl font-semibold ${textClass}`}>{value}</p>
            </div>
          ))}
        </section>

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold text-[#30578f]">Resolve rate</p>
              <h3 className="text-xl font-semibold text-slate-800">{stats.resolveRate}% laporan sudah selesai</h3>
            </div>
            <div className="h-3 w-full max-w-md overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-[#30578f]" style={{ width: `${stats.resolveRate}%` }} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <label className="flex flex-1 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400 focus-within:border-[#30578f] focus-within:bg-white transition-colors">
              <Search size={15} className="shrink-0" />
              <input
                value={filter.q}
                onChange={(event) => setFilter({ ...filter, q: event.target.value })}
                placeholder="Cari laporan..."
                className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400"
              />
            </label>
            {/* Filter selects */}
            <div className="flex flex-wrap gap-2">

              <select
                value={filter.status}
                onChange={(event) => setFilter({ ...filter, status: event.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none transition hover:border-slate-300"
              >
                <option value="all">⚡ Semua Status</option>
                <option value="pending">⏳ Pending</option>
                <option value="diproses">🔄 Diproses</option>
              </select>
              <select
                value={filter.sort}
                onChange={(event) => setFilter({ ...filter, sort: event.target.value })}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 outline-none transition hover:border-slate-300"
              >
                <option value="terbaru">🕒 Terbaru</option>
                <option value="upvote">👍 Upvote</option>
                <option value="urgensi">🔥 Prioritas</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          {loading ? <p className="text-sm text-slate-500">Memuat laporan...</p> : reports.map((report) => (
            <CardLaporan key={report.id} report={report} onVote={() => handleVote(report.id)} onOpenDetail={() => openDetail(report.id)} onOpenComment={() => openComment(report.id)} />
          ))}
        </section>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/60 px-4">
            <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#30578f]">Buat laporan</p>
                  <h3 className="text-2xl font-semibold text-slate-900">Laporkan fasilitas yang bermasalah</h3>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="rounded-full border px-3 py-2 text-sm">Tutup</button>
              </div>
              <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
                {/* Judul Laporan */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Judul Laporan <span className="text-rose-500">*</span></label>
                  <input required value={form.judul_laporan} onChange={(event) => setForm({ ...form, judul_laporan: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors" placeholder="Contoh: AC ruangan tidak dingin" />
                </div>

                {/* Kategori */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Fasilitas / Benda yang Rusak <span className="text-rose-500">*</span></label>
                  <input required value={form.kategori} onChange={(event) => setForm({ ...form, kategori: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors" placeholder="Contoh: AC, Kursi Kuliah, Proyektor, Pintu" />
                </div>

                {/* Prioritas */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Tingkat Urgensi <span className="text-rose-500">*</span></label>
                  <select required value={form.prioritas} onChange={(event) => setForm({ ...form, prioritas: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors">
                    <option value="rendah">Rendah</option>
                    <option value="sedang">Sedang</option>
                    <option value="darurat">Darurat</option>
                  </select>
                </div>

                {/* Fakultas / Unit */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Fakultas / Unit <span className="text-rose-500">*</span></label>
                  <select required value={form.fakultas} onChange={(event) => setForm({ ...form, fakultas: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors">
                    <option value="">-- Pilih Fakultas / Unit --</option>
                    <option value="Fakultas Syariah dan Hukum">Fakultas Syariah dan Hukum</option>
                    <option value="Fakultas Tarbiyah dan Keguruan">Fakultas Tarbiyah dan Keguruan</option>
                    <option value="Fakultas Ushuluddin dan Filsafat">Fakultas Ushuluddin dan Filsafat</option>
                    <option value="Fakultas Adab dan Humaniora">Fakultas Adab dan Humaniora</option>
                    <option value="Fakultas Dakwah dan Komunikasi">Fakultas Dakwah dan Komunikasi</option>
                    <option value="Fakultas Sains dan Teknologi">Fakultas Sains dan Teknologi</option>
                    <option value="Fakultas Kedokteran dan Ilmu Kesehatan">Fakultas Kedokteran dan Ilmu Kesehatan</option>
                    <option value="Fakultas Ekonomi dan Bisnis Islam">Fakultas Ekonomi dan Bisnis Islam</option>
                    <option value="Pascasarjana">Pascasarjana</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                </div>

                {/* Lokasi Spesifik */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Lokasi Spesifik Fasilitas <span className="text-rose-500">*</span></label>
                  <input required value={form.lokasi_fasilitas} onChange={(event) => setForm({ ...form, lokasi_fasilitas: event.target.value })} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors" placeholder="Contoh: Gedung A, Lantai 2, Ruang 201" />
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2 flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Deskripsi Kerusakan <span className="text-rose-500">*</span></label>
                  <textarea required value={form.deskripsi_kerusakan} onChange={(event) => setForm({ ...form, deskripsi_kerusakan: event.target.value })} className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-[#30578f] transition-colors" placeholder="Jelaskan kondisi kerusakan secara detail..." />
                </div>

                {/* Foto Bukti */}
                <label className="md:col-span-2 flex flex-col gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-500">
                  <span className="font-semibold text-slate-700">Unggah foto bukti (opsional)</span>
                  <input type="file" accept="image/*" onChange={(event) => setForm({ ...form, foto_bukti: event.target.files?.[0] || null })} />
                </label>

                {submitError && (
                  <div className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {submitError}
                  </div>
                )}

                <div className="md:col-span-2 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="rounded-xl border px-4 py-2 text-sm">Batal</button>
                  <button type="submit" disabled={isSubmitting} className="rounded-xl bg-[#30578f] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">
                    {isSubmitting ? 'Mengirim...' : 'Kirim laporan'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <DetailModal isOpen={isDetailOpen} onClose={closeDetail} report={selectedReport} isAdmin={false} onCommentSubmit={handleCommentSubmit} />
      <CommentModal isOpen={isCommentOpen} onClose={closeComment} report={commentReport} onCommentSubmit={handleCommentModalSubmit} />
    </LayoutMhs>
  );
}

export default BerandaMhs;
