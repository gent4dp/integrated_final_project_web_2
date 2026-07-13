import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getReports, getReport, toggleVote, postComment } from '../services/api';
import LayoutMhs from '../components/LayoutMhs';
import CardLaporan from '../components/CardLaporan';
import DetailModal from '../components/DetailModal';
import CommentModal from '../components/CommentModal';

function RiwayatProfil() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportId, setSelectedReportId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const [commentReport, setCommentReport] = useState(null);

  const fetchMyReports = async () => {
    setLoading(true);
    try {
      const response = await getReports({ my_reports: true, include_selesai: true });
      setReports(response.data || []);
    } catch (err) {
      console.error(err);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyReports();
  }, []);

  const filtered = useMemo(() => 
    filter === 'all' 
      ? reports 
      : reports.filter((report) => report.status === filter), 
    [filter, reports]
  );

  const handleEdit = (reportId) => {
    navigate(`/buat-laporan?edit=${reportId}`);
  };

  const handleVote = async (reportId) => {
    await toggleVote(reportId);
    const response = await getReports({ my_reports: true, include_selesai: true });
    setReports(response.data || []);
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
    getReports({ my_reports: true, include_selesai: true })
      .then((res) => setReports(res.data || []))
      .catch(() => {});
  };

  const handleCommentModalSubmit = async (reportId, komentar) => {
    await postComment(reportId, { komentar });
    getReport(reportId).then((res) => {
      if (res?.data) setCommentReport(res.data);
    }).catch(() => {});
  };

  return (
    <LayoutMhs>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#30578f]">Riwayat Laporan</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Laporan yang pernah Anda kirim</h2>
              <p className="text-sm text-slate-500 mt-1">Akun: <span className="font-semibold text-slate-700">{user?.name}</span> ({user?.nim || '-'})</p>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-xs font-semibold text-slate-400">Status:</span>
              <select 
                value={filter} 
                onChange={(event) => setFilter(event.target.value)} 
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-650 outline-none focus:border-[#30578f] transition cursor-pointer"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Pending</option>
                <option value="diproses">Sedang Diproses</option>
                <option value="selesai">Selesai</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-400">
                <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#30578f] mb-3" />
                <p className="text-sm">Memuat riwayat...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-400">
                <ClipboardList className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">Tidak ada riwayat aduan</p>
                <p className="text-xs text-slate-400 mt-1">Keluhan yang Anda ajukan akan muncul di halaman ini</p>
              </div>
            ) : (
              filtered.map((report) => (
                <CardLaporan
                  key={report.id}
                  report={report}
                  onVote={() => handleVote(report.id)}
                  onOpenDetail={() => openDetail(report.id)}
                  onOpenComment={() => openComment(report.id)}
                  onEdit={handleEdit}
                />
              ))
            )}
          </div>
        </div>
      </div>

      <DetailModal isOpen={isDetailOpen} onClose={closeDetail} report={selectedReport} isAdmin={false} onCommentSubmit={handleCommentSubmit} />
      <CommentModal isOpen={isCommentOpen} onClose={closeComment} report={commentReport} onCommentSubmit={handleCommentModalSubmit} />
    </LayoutMhs>
  );
}

export default RiwayatProfil;
