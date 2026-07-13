import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, PlusCircle, X, AlertCircle, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createReport, getReport, getReports, getStats, postComment, toggleVote } from '../services/api';
import CardLaporan from '../components/CardLaporan';
import DetailModal from '../components/DetailModal';
import CommentModal from '../components/CommentModal';
import LayoutMhs from '../components/LayoutMhs';


function BerandaMhs() {
  const { user } = useAuth();
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, selesai: 0, diproses: 0, pending: 0, resolveRate: 0 });
  const [filter, setFilter] = useState({ q: '', status: 'all', sort: 'terbaru' });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentReport, setCommentReport] = useState(null);


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

  const handleEdit = (reportId) => {
    navigate(`/buat-laporan?edit=${reportId}`);
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
    await postComment(reportId, { komentar });
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
    await postComment(reportId, { komentar });
    getReport(reportId).then((res) => {
      if (res?.data) setCommentReport(res.data);
    }).catch(() => {});
  };

  return (
    <LayoutMhs>
      <div className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-8">
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-3xl bg-gradient-to-br from-[#30578f] via-[#2a4f7f] to-[#1e3b63] p-6 text-white shadow-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-100">Halo, {user?.name || 'Mahasiswa'}</p>
              <h2 className="mt-2 text-3xl font-bold">Pantau dan dukung fasilitas kampus yang sedang diperbaiki.</h2>
              <p className="mt-3 max-w-2xl text-sm text-blue-100">Buat aduan, lihat laporan terdekat, dan ikuti progres penanganan dari satu tempat.</p>
            </div>
            <Link to="/buat-laporan" className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#30578f] shrink-0">
              <PlusCircle size={18} /> Buat Laporan
            </Link>
          </div>
        </motion.section>

        {/* Resolve Rate Premium Banner */}
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                Sistem Transparan & Akuntabel
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Tingkat Penyelesaian Laporan (Resolve Rate)</h3>
              <p className="text-sm text-slate-500 max-w-xl leading-relaxed">
                Persentase penanganan aduan kerusakan fasilitas kampus oleh Tim Sarana & Prasarana UIN Alauddin Makassar. Kami berkomitmen menyelesaikan setiap aduan demi kenyamanan kuliah Anda.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end shrink-0">
              <div className="flex items-baseline gap-1">
                <span className="text-5xl font-black tracking-tight text-[#30578f]">{stats.resolveRate}%</span>
                <span className="text-sm font-semibold text-slate-400">Terselesaikan</span>
              </div>
            </div>
          </div>
          <div className="mt-5 overflow-hidden rounded-full bg-slate-100 h-2.5">
            <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-[#30578f] transition-all duration-500" style={{ width: `${stats.resolveRate}%` }} />
          </div>
        </section>

        {/* Toolbar & Filter Laporan */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Cari laporan berdasarkan judul..." value={filter.q} onChange={(event) => setFilter({ ...filter, q: event.target.value })} className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-[#30578f] focus:bg-white transition-all duration-150" />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                <Filter size={13} />
                <span>Filter:</span>
              </div>
              <select value={filter.status} onChange={(event) => setFilter({ ...filter, status: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-650 outline-none focus:border-[#30578f] transition cursor-pointer">
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="diproses">Sedang Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 ml-1">
                <SlidersHorizontal size={13} />
                <span>Urutkan:</span>
              </div>
              <select value={filter.sort} onChange={(event) => setFilter({ ...filter, sort: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-650 outline-none focus:border-[#30578f] transition cursor-pointer">
                <option value="terbaru">Terbaru</option>
                <option value="terpopuler">Terpopuler (Upvote)</option>
              </select>
            </div>
          </div>
        </section>

        {/* Daftar Laporan / Feeds */}
        <section className="space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#30578f] mb-3" />
              <p className="text-sm">Memuat laporan...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
              <AlertCircle className="mx-auto h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-semibold text-slate-600">Tidak ada aduan ditemukan</p>
              <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter atau cari kata kunci lain</p>
            </div>
          ) : (
            reports.map((report) => (
              <CardLaporan key={report.id} report={report} onVote={() => handleVote(report.id)} onOpenDetail={() => openDetail(report.id)} onOpenComment={() => openComment(report.id)} onEdit={handleEdit} />
            ))
          )}
        </section>
      </div>

      <DetailModal isOpen={isDetailOpen} onClose={closeDetail} report={selectedReport} isAdmin={false} onCommentSubmit={handleCommentSubmit} />
      <CommentModal isOpen={isCommentOpen} onClose={closeComment} report={commentReport} onCommentSubmit={handleCommentModalSubmit} />
    </LayoutMhs>
  );
}

export default BerandaMhs;
