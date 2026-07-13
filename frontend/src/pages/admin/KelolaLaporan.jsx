import { useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ThumbsUp,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Clock,
  Eye,
  ArrowRight,
  X,
  Archive,
  Trash2,
  MessageCircle,
} from 'lucide-react';
import NavbarAdmin from '../../components/NavbarAdmin';
import DetailModal from '../../components/DetailModal';
import { getReports, updateStatus, archiveReport, getReport, postComment } from '../../services/api';

// ─── helpers ─────────────────────────────────────────────────────────────────

const STATUS_META = {
  pending: {
    label: 'Pending',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    ring: 'ring-amber-200',
    dot: 'bg-amber-400',
  },
  diproses: {
    label: 'Diproses',
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    ring: 'ring-blue-200',
    dot: 'bg-blue-500',
  },
  selesai: {
    label: 'Selesai',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    ring: 'ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  ditolak: {
    label: 'Ditolak',
    bg: 'bg-rose-50',
    text: 'text-rose-700',
    ring: 'ring-rose-200',
    dot: 'bg-rose-500',
  },
};

const NEXT_STATUS = { pending: 'diproses', diproses: 'selesai' };
const NEXT_LABEL  = { pending: 'Mulai Proses', diproses: 'Tandai Selesai' };
const NEXT_COLOR  = {
  pending:  'bg-blue-600 hover:bg-blue-700 text-white',
  diproses: 'bg-emerald-600 hover:bg-emerald-700 text-white',
};

const AVATAR_COLORS = [
  'bg-violet-500','bg-blue-500','bg-cyan-500','bg-teal-500',
  'bg-rose-500','bg-orange-500','bg-pink-500','bg-indigo-500',
];

function getInitials(name = '') {
  return name.split(' ').slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}
function avatarColor(id) {
  return AVATAR_COLORS[(id || 0) % AVATAR_COLORS.length];
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || {
    label: status, bg: 'bg-slate-100', text: 'text-slate-600',
    ring: 'ring-slate-200', dot: 'bg-slate-400',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${meta.bg} ${meta.text} ${meta.ring}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

// ─── Confirmation Modal ───────────────────────────────────────────────────────

function ConfirmModal({ isOpen, report, targetStatus, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && report && (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
        >
          <motion.div
            key="modal"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f1ff] mb-5">
              <AlertCircle size={26} className="text-[#30578f]" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Konfirmasi Perubahan Status</h3>
            <p className="mt-2 text-sm text-slate-500 leading-6">Anda akan mengubah status laporan berikut:</p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800 truncate">{report.judul_laporan}</p>
              <p className="mt-1 text-xs text-slate-500">{report.lokasi_fasilitas}</p>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={report.status} />
                <ArrowRight size={14} className="text-slate-400" />
                <StatusBadge status={targetStatus} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                  targetStatus === 'ditolak'
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-sm shadow-rose-600/10'
                    : NEXT_COLOR[report.status] || 'bg-[#30578f] text-white'
                }`}
              >
                Ya, Ubah Status
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Archive Confirm Modal ────────────────────────────────────────────────────

function ArchiveConfirmModal({ isOpen, report, onConfirm, onCancel }) {
  return (
    <AnimatePresence>
      {isOpen && report && (
        <motion.div
          key="archive-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 backdrop-blur-sm"
        >
          <motion.div
            key="archive-modal"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 mb-5">
              <Archive size={26} className="text-amber-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Arsipkan Laporan?</h3>
            <p className="mt-2 text-sm text-slate-500 leading-6">
              Laporan ini akan dipindahkan ke arsip dan tidak lagi tampil di daftar aktif.
              Data tetap tersimpan untuk keperluan statistik.
            </p>

            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800 truncate">{report.judul_laporan}</p>
              <p className="mt-1 text-xs text-slate-500">{report.lokasi_fasilitas}</p>
              <div className="mt-3">
                <StatusBadge status={report.status} />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={onCancel}
                className="flex-1 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 rounded-2xl bg-amber-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Ya, Arsipkan
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 8;

function KelolaLaporan() {
  const [reports, setReports]       = useState([]);
  const [filter, setFilter]         = useState('all');
  const [search, setSearch]         = useState('');
  const [sortBy, setSortBy]         = useState('terbaru'); // 'terbaru', 'upvotes', 'urgensi'
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [confirmTarget, setConfirmTarget] = useState(null); // { report, targetStatus }
  const [detailReport, setDetailReport]   = useState(null);
  const [archiveTarget, setArchiveTarget] = useState(null); // report to archive
  const [archiving, setArchiving]         = useState(false);

  const openDetail = async (report) => {
    try {
      const res = await getReport(report.id);
      setDetailReport(res.data || report);
    } catch (err) {
      console.error('Gagal memuat detail aduan:', err);
      setDetailReport(report);
    }
  };

  useEffect(() => {
    setLoading(true);
    getReports({ include_selesai: true })
      .then((res) => setReports(res.data || []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const sortedAndFiltered = useMemo(() => {
    const list = reports.filter((r) => {
      const matchStatus = filter === 'all' || r.status === filter;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.judul_laporan?.toLowerCase().includes(q) ||
        r.lokasi_fasilitas?.toLowerCase().includes(q) ||
        r.user?.name?.toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'upvotes') {
        const votesA = a.votes_count || a.votes || 0;
        const votesB = b.votes_count || b.votes || 0;
        return votesB - votesA;
      }
      if (sortBy === 'urgensi') {
        const priorityWeight = { darurat: 3, sedang: 2, rendah: 1 };
        const weightA = priorityWeight[a.prioritas?.toLowerCase()] || 0;
        const weightB = priorityWeight[b.prioritas?.toLowerCase()] || 0;
        return weightB - weightA;
      }
      // Default: terbaru
      return new Date(b.created_at) - new Date(a.created_at);
    });
  }, [reports, filter, search, sortBy]);

  const filtered = sortedAndFiltered;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => { setPage(1); }, [filter, search, sortBy]);

  const requestStatusChange = (report) => {
    const next = NEXT_STATUS[report.status];
    if (!next) return;
    setConfirmTarget({ report, targetStatus: next });
  };

  const confirmStatusChange = async () => {
    if (!confirmTarget) return;
    const { report, targetStatus } = confirmTarget;
    await updateStatus(report.id, { status: targetStatus });
    setReports((prev) =>
      prev.map((r) => (r.id === report.id ? { ...r, status: targetStatus } : r))
    );
    setConfirmTarget(null);
  };

  const requestArchive = (report) => {
    setArchiveTarget(report);
  };

  const confirmArchive = async () => {
    if (!archiveTarget || archiving) return;
    setArchiving(true);
    try {
      await archiveReport(archiveTarget.id);
      // Hapus dari state lokal — tidak lagi tampil di daftar aktif
      setReports((prev) => prev.filter((r) => r.id !== archiveTarget.id));
      setArchiveTarget(null);
    } catch (err) {
      console.error('Gagal mengarsipkan laporan:', err);
    } finally {
      setArchiving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb]">
      <NavbarAdmin />

      <main className="flex-1 p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#30578f]">Admin Panel</p>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Kelola Laporan</h1>
          <p className="mt-1 text-sm text-slate-500">Kelola dan perbarui status aduan fasilitas kampus</p>
        </div>

        {/* Stats strip */}
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {['all', 'pending', 'diproses', 'selesai', 'ditolak'].map((s) => {
            const count = s === 'all' ? reports.length : reports.filter((r) => r.status === s).length;
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-2xl border p-4 text-left transition-all ${
                  filter === s
                    ? 'border-[#30578f] bg-[#30578f] text-white shadow-md shadow-[#30578f]/20'
                    : 'border-slate-200 bg-white hover:border-[#30578f]/40 hover:shadow-sm'
                }`}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${filter === s ? 'text-blue-100' : 'text-slate-500'}`}>
                  {s === 'all' ? 'Semua' : STATUS_META[s]?.label}
                </p>
                <p className={`mt-1.5 text-2xl font-bold ${filter === s ? 'text-white' : 'text-slate-800'}`}>{count}</p>
              </button>
            );
          })}
        </div>

        {/* Table card */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:max-w-xs">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari laporan, pelapor, lokasi…"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-4 text-sm outline-none focus:border-[#30578f] focus:bg-white focus:ring-2 focus:ring-[#30578f]/10 transition"
                />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-semibold text-slate-600 outline-none hover:border-slate-300 transition cursor-pointer"
              >
                <option value="terbaru">Urutkan: Terbaru</option>
                <option value="upvotes">Urutkan: Upvote Terbanyak</option>
                <option value="urgensi">Urutkan: Tingkat Urgensi</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter size={14} className="text-slate-400" />
              <span className="text-xs text-slate-500">{filtered.length} laporan ditemukan</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3.5">Pelapor</th>
                  <th className="px-4 py-3.5">Lokasi</th>
                  <th className="px-4 py-3.5">Fasilitas / Barang</th>
                  <th className="px-4 py-3.5 text-center">Upvotes</th>
                  <th className="px-4 py-3.5 text-center">Comments</th>
                  <th className="px-4 py-3.5 text-center">Status</th>
                  <th className="px-4 py-3.5 text-center">Lihat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <Loader2 size={28} className="mx-auto animate-spin text-[#30578f]" />
                      <p className="mt-3 text-sm text-slate-500">Memuat laporan…</p>
                    </td>
                  </tr>
                ) : paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-16 text-center">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                        <AlertCircle size={28} className="text-slate-400" />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-600">Tidak ada laporan</p>
                      <p className="mt-1 text-xs text-slate-400">Coba ubah filter atau kata kunci pencarian</p>
                    </td>
                  </tr>
                ) : (
                  paginated.map((report, idx) => (
                    <motion.tr
                      key={report.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="group transition-colors hover:bg-slate-50/70"
                    >
                      {/* Pelapor */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white ${avatarColor(report.id)}`}>
                            {getInitials(report.user?.name || 'U')}
                          </div>
                          <div>
                            <p className="font-semibold leading-tight text-slate-800">{report.user?.name || 'Pengguna'}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{report.user?.nim || '—'}</p>
                          </div>
                        </div>
                      </td>

                      {/* Lokasi */}
                      <td className="max-w-[180px] px-4 py-4">
                        <div className="flex items-start gap-1.5">
                          <MapPin size={13} className="mt-0.5 shrink-0 text-slate-400" />
                          <span className="line-clamp-2 leading-5 text-slate-600">{report.lokasi_fasilitas}</span>
                        </div>
                      </td>

                      {/* Fasilitas / Barang */}
                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 capitalize">
                          {report.kategori || 'Lainnya'}
                        </span>
                      </td>

                      {/* Upvotes */}
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
                          <ThumbsUp size={12} />
                          {report.votes_count ?? 0}
                        </div>
                      </td>

                      {/* Comments */}
                      <td className="px-4 py-4 text-center">
                        <button
                          onClick={() => openDetail(report)}
                          className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-650 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition cursor-pointer"
                          title="Lihat diskusi & komentar"
                        >
                          <MessageCircle size={12} className="text-slate-400" />
                          {report.comments_count ?? 0}
                        </button>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4 text-center">
                        <StatusBadge status={report.status} />
                      </td>

                      {/* Lihat */}
                      <td className="px-4 py-4 text-center">
                        <div className="flex items-center justify-center">
                          <button
                            onClick={() => openDetail(report)}
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-semibold text-[#30578f] bg-white transition hover:bg-blue-50 hover:border-blue-200 cursor-pointer shadow-sm"
                          >
                            <Eye size={13} className="text-[#30578f]" />
                            Detail
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
              <p className="text-xs text-slate-500">
                Halaman <span className="font-semibold">{page}</span> dari{' '}
                <span className="font-semibold">{totalPages}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={15} />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-semibold transition ${
                      p === page
                        ? 'bg-[#30578f] text-white shadow-sm'
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmTarget}
        report={confirmTarget?.report}
        targetStatus={confirmTarget?.targetStatus}
        onConfirm={confirmStatusChange}
        onCancel={() => setConfirmTarget(null)}
      />

      {/* Archive Confirm Modal */}
      <ArchiveConfirmModal
        isOpen={!!archiveTarget}
        report={archiveTarget}
        onConfirm={confirmArchive}
        onCancel={() => setArchiveTarget(null)}
      />

      {/* Reusable Detail Modal (Admin View) */}
      <DetailModal
        isOpen={!!detailReport}
        onClose={() => setDetailReport(null)}
        report={detailReport}
        isAdmin={true}
        onStatusChange={async (id, newStatus) => {
          try {
            await updateStatus(id, { status: newStatus });
            setReports((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
            );
            setDetailReport((prev) => (prev ? { ...prev, status: newStatus } : null));
          } catch (err) {
            console.error('Gagal memperbarui status:', err);
          }
        }}
        onCommentSubmit={async (id, text) => {
          try {
            await postComment(id, { komentar: text });
            // Ambil data terbaru detail laporan untuk memuat comments array
            const res = await getReport(id);
            if (res && res.data) {
              setReports((prev) =>
                prev.map((r) => (r.id === id ? res.data : r))
              );
              setDetailReport(res.data);
            }
          } catch (err) {
            console.error('Gagal mengirim tanggapan admin:', err);
            throw err;
          }
        }}
      />
    </div>
  );
}

export default KelolaLaporan;
