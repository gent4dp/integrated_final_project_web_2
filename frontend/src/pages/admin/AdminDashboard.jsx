import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavbarAdmin from '../../components/NavbarAdmin';
import { getStats } from '../../services/api';

function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, diproses: 0, selesai: 0, archived: 0 });

  useEffect(() => {
    getStats()
      .then((response) => setStats(response.data || {}))
      .catch(() => setStats({ total: 0, pending: 0, diproses: 0, selesai: 0, archived: 0 }));
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
      <main className="flex-1 p-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#30578f]">Dashboard</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Ringkasan penanganan fasilitas</h2>
            </div>
            <Link
              to="/admin/kelola-laporan"
              className="rounded-full bg-[#30578f] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#254a7a]"
            >
              Kelola laporan
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {statCards.map(({ label, value, bg, text, sub, border, hint }) => (
              <div
                key={label}
                className={`rounded-2xl p-4 ${bg} ${border ?? ''}`}
                title={hint}
              >
                <p className={`text-xs font-semibold uppercase tracking-wide ${sub ?? text}`}>{label}</p>
                <p className={`mt-2 text-3xl font-bold ${text}`}>{value}</p>
                {hint && (
                  <p className="mt-1 text-xs text-slate-400 leading-4">{hint}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
