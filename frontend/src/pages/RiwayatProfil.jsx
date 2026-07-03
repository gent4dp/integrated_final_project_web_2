import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/api';
import LayoutMhs from '../components/LayoutMhs';

function RiwayatProfil() {
  const { user } = useAuth();
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    getReports({ my_reports: true, include_selesai: true }).then((response) => setReports(response.data || [])).catch(() => setReports([]));
  }, []);

  const filtered = useMemo(() => filter === 'all' ? reports : reports.filter((report) => report.status === filter), [filter, reports]);

  return (
    <LayoutMhs>
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#30578f]">Riwayat Anda</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">Laporan yang pernah Anda kirim</h2>
              <p className="mt-2 text-sm text-slate-500">{user?.name || 'Pengguna'}</p>
            </div>
            <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="all">Semua status</option>
              <option value="pending">Pending</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </select>
          </div>

          <div className="mt-6 space-y-3">
            {filtered.map((report) => (
              <div key={report.id} className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{report.judul_laporan}</p>
                    <p className="text-sm text-slate-500">{report.lokasi_fasilitas}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600">{report.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </LayoutMhs>
  );
}

export default RiwayatProfil;
