import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import { getStats, getReports } from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, diproses: 0, selesai: 0, archived: 0 });
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then((response) => setStats(response.data || {}))
      .catch(() => setStats({ total: 0, pending: 0, diproses: 0, selesai: 0, archived: 0 }));

    setReportsLoading(true);
    getReports({ include_selesai: true, per_page: 5, sort: 'terbaru' })
      .then((response) => setReports(response.data || []))
      .catch(() => setReports([]))
      .finally(() => setReportsLoading(false));
  }, []);

  const statCards = [
    {
      label: 'Total Laporan',
      value: stats.total,
      bg: 'bg-[#30578f]',
      text: 'text-white',
      sub: 'text-blue-200',
    },
    {
      label: 'Pending',
      value: stats.pending,
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      sub: 'text-amber-400',
      border: 'border border-amber-200',
    },
    {
      label: 'Diproses',
      value: stats.diproses,
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      sub: 'text-blue-300',
      border: 'border border-blue-200',
    },
    {
      label: 'Selesai',
      value: stats.selesai,
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      sub: 'text-emerald-300',
      border: 'border border-emerald-200',
    },
    {
      label: 'Diarsipkan',
      value: stats.archived,
      bg: 'bg-slate-50',
      text: 'text-slate-600',
      sub: 'text-slate-400',
      border: 'border border-slate-200',
      hint: 'Laporan selesai yang telah diarsipkan',
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NavbarAdmin />
      
      <main className="flex-1 p-6 md:p-8">
        {/* Header Summary */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-5 border-b border-slate-100">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#30578f]">Dashboard Statistik</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-900">Ringkasan Penanganan Fasilitas</h2>
              <p className="text-xs text-slate-500 mt-1">Status pengerjaan fisik sarana & prasarana kampus</p>
            </div>
            <Link
              to="/admin/kelola-laporan"
              className="rounded-xl bg-[#30578f] px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-[#254a7a] transition-all self-start sm:self-center"
            >
              Kelola Laporan
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map(({ label, value, bg, text, sub, border, hint }) => (
              <div
                key={label}
                className={`rounded-2xl p-4 transition hover:shadow-sm ${bg} ${border ?? ''}`}
                title={hint}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${sub ?? text}`}>{label}</p>
                <p className={`mt-2 text-3xl font-black ${text}`}>{value}</p>
                {hint && (
                  <p className="mt-1 text-[10px] text-slate-400 leading-4">{hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Terbaru Section */}
        <div className="mt-6 rounded-3xl bg-white p-6 md:p-8 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Aduan Terbaru Masuk</h3>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">5 laporan terakhir yang dikirim oleh mahasiswa</p>
            </div>
            <Link to="/admin/kelola-laporan" className="text-xs font-bold text-[#30578f] hover:underline">
              Lihat Semua Laporan →
            </Link>
          </div>

          <div className="overflow-x-auto">
            {reportsLoading ? (
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <span className="h-7 w-7 animate-spin rounded-full border-4 border-slate-300 border-t-[#30578f] mb-3" />
                <p className="text-xs">Memuat laporan terbaru...</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <p className="text-sm font-semibold">Belum ada aduan masuk</p>
                <p className="text-xs mt-1">Laporan dari mahasiswa akan tampil di sini</p>
              </div>
            ) : (
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <th className="px-4 py-3.5 rounded-l-xl">Pelapor</th>
                    <th className="px-4 py-3.5">Judul Laporan</th>
                    <th className="px-4 py-3.5">Lokasi Spesifik</th>
                    <th className="px-4 py-3.5 rounded-r-xl">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reports.map((report) => (
                    <tr key={report.id} className="hover:bg-slate-50/40 transition">
                      <td className="px-4 py-3">
                        <span className="font-bold text-slate-800 block text-xs">{report.user?.name || 'Mahasiswa'}</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">{report.user?.nim || '—'}</span>
                      </td>
                      <td className="px-4 py-3 text-slate-700 font-semibold text-xs">{report.judul_laporan}</td>
                      <td className="px-4 py-3 text-slate-500 text-xs">{report.lokasi_fasilitas}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          report.status === 'selesai' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                          report.status === 'diproses' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${
                            report.status === 'selesai' ? 'bg-emerald-400' :
                            report.status === 'diproses' ? 'bg-blue-400' : 'bg-amber-400'
                          }`} />
                          {report.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
