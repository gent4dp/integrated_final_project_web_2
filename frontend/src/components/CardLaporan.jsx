import React from 'react';
import { ThumbsUp, MessageCircle, MapPin, AlertTriangle, Wrench } from 'lucide-react';

const PRIORITAS_CONFIG = {
  rendah: { label: 'Rendah', cls: 'bg-slate-100 text-slate-600' },
  sedang: { label: 'Sedang', cls: 'bg-amber-50 text-amber-700' },
  darurat: { label: 'Darurat', cls: 'bg-rose-50 text-rose-600' },
};

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    cls: 'bg-amber-50 text-amber-700 border border-amber-200',
    dot: 'bg-amber-400',
  },
  diproses: {
    label: 'Diproses',
    cls: 'bg-blue-50 text-blue-700 border border-blue-200',
    dot: 'bg-blue-400',
  },
  selesai: {
    label: 'Selesai',
    cls: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dot: 'bg-emerald-400',
  },
};

function CardLaporan({ report, onVote, onOpenDetail, onOpenComment }) {
  const status = STATUS_CONFIG[report.status?.toLowerCase()] ?? {
    label: report.status || 'Unknown',
    cls: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  };
  const prioritas = PRIORITAS_CONFIG[report.prioritas?.toLowerCase()] ?? {
    label: report.prioritas || '-',
    cls: 'bg-slate-100 text-slate-600',
  };
  const initials = report.user?.name?.charAt(0)?.toUpperCase() || 'A';
  const timeAgo = report.created_at
    ? (() => {
        const diff = Math.floor((Date.now() - new Date(report.created_at)) / 60000);
        if (diff < 1) return 'Baru saja';
        if (diff < 60) return `${diff} menit yang lalu`;
        const h = Math.floor(diff / 60);
        if (h < 24) return `${h} jam yang lalu`;
        return `${Math.floor(h / 24)} hari yang lalu`;
      })()
    : '';

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300">

      {/* === Main body: text left, image right === */}
      <div className="flex gap-0 p-4 pb-3">

        {/* Left: all text content */}
        <div className="flex min-w-0 flex-1 flex-col gap-2.5">

          {/* Header row: avatar + name + status */}
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#30578f] to-[#1e3a5f] text-white text-xs font-bold shadow-sm">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900 text-sm leading-snug">
                    {report.judul_laporan}
                  </p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    {report.user?.name || 'Pengguna'}
                    {timeAgo && <> · {timeAgo}</>}
                  </p>
                </div>
                {/* Status badge */}
                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {/* Meta pills: location, category, priority */}
          <div className="flex flex-wrap items-center gap-1.5">
            {report.lokasi_fasilitas && (
              <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={10} className="shrink-0" />
                <span className="truncate max-w-[160px]">{report.lokasi_fasilitas}</span>
              </span>
            )}
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
              <Wrench size={9} className="shrink-0" />
              <span className="capitalize">{report.kategori || 'Lainnya'}</span>
            </span>
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${prioritas.cls}`}>
              <AlertTriangle size={9} className="shrink-0" />
              {prioritas.label}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm leading-relaxed text-slate-600 line-clamp-2 pr-2">
            {report.deskripsi_kerusakan}
          </p>
        </div>

        {/* Right: thumbnail image (only if exists) */}
        {report.foto_bukti && (
          <div className="ml-3 shrink-0 self-start">
            <div className="h-20 w-24 overflow-hidden rounded-xl bg-slate-100 sm:h-24 sm:w-32">
              <img
                src={report.foto_bukti}
                alt="Bukti laporan"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 px-4 py-2.5">
        <button
          onClick={() => onVote(report.id)}
          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${
            report.user_vote
              ? 'border-blue-200 bg-blue-50 text-[#30578f]'
              : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <ThumbsUp
            size={12}
            className={report.user_vote ? 'fill-[#30578f] text-[#30578f]' : 'text-slate-400'}
          />
          <span className="hidden sm:inline">Saya Juga Mengalami</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
            report.user_vote ? 'bg-blue-100 text-[#30578f]' : 'bg-slate-100 text-slate-500'
          }`}>
            {report.votes_count || 0}
          </span>
        </button>

        <button
          onClick={() => onOpenComment(report.id)}
          className="inline-flex items-center gap-1 text-xs text-slate-400 transition hover:text-slate-600"
        >
          <MessageCircle size={13} />
          <span>{report.comments_count || 0} komentar</span>
        </button>

        <button
          onClick={() => onOpenDetail(report.id)}
          className="ml-auto rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 hover:border-slate-300"
        >
          Lihat detail
        </button>
      </div>
    </article>
  );
}

export default CardLaporan;