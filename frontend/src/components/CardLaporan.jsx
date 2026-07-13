import React from 'react';
import { ThumbsUp, MessageCircle, MapPin, AlertTriangle, Wrench, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PRIORITAS_CONFIG = {
  rendah: { label: 'Rendah', cls: 'bg-slate-100 text-slate-600 border border-slate-200' },
  sedang: { label: 'Sedang', cls: 'bg-amber-50 text-amber-700 border border-amber-200' },
  darurat: { label: 'Darurat', cls: 'bg-rose-50 text-rose-600 border border-rose-200' },
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
  ditolak: {
    label: 'Ditolak',
    cls: 'bg-rose-50 text-rose-700 border border-rose-200',
    dot: 'bg-rose-500',
  },
};

function CardLaporan({ report, onVote, onOpenDetail, onOpenComment, onEdit }) {
  const { user } = useAuth();
  const status = STATUS_CONFIG[report.status?.toLowerCase()] ?? {
    label: report.status || 'Unknown',
    cls: 'bg-slate-100 text-slate-600 border border-slate-200',
    dot: 'bg-slate-400',
  };
  const prioritas = PRIORITAS_CONFIG[report.prioritas?.toLowerCase()] ?? {
    label: report.prioritas || '-',
    cls: 'bg-slate-100 text-slate-600 border border-slate-200',
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

  // Parse images if array or single string or json string
  const images = (() => {
    if (!report.foto_bukti) return [];
    if (Array.isArray(report.foto_bukti)) return report.foto_bukti;
    try {
      const parsed = JSON.parse(report.foto_bukti);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [report.foto_bukti];
  })();

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md hover:border-slate-300 flex flex-col gap-4">
      
      {/* 1. HEADER: User info + Status Badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#30578f] to-[#1e3a5f] text-white text-sm font-bold shadow-sm">
            {initials}
          </div>
          <div>
            <p className="font-bold text-slate-900 text-sm leading-snug">
              {report.user?.name || 'Pengguna'}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {report.user?.nim || '—'} {timeAgo && <> · {timeAgo}</>}
            </p>
          </div>
        </div>
        {/* Status Badge */}
        <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${status.cls}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
          {status.label}
        </span>
      </div>

      {/* 2. BODY CONTENT: Title, Meta badges, Description, Admin Notes, Image Gallery */}
      <div className="flex flex-col gap-3">
        
        {/* Title */}
        <h3 className="font-normal text-slate-800 text-base md:text-lg leading-snug">
          {report.judul_laporan}
        </h3>

        {/* Meta tags */}
        <div className="flex flex-wrap items-center gap-2">
          {report.lokasi_fasilitas && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-100">
              <MapPin size={11} className="shrink-0 text-slate-400" />
              <span>{report.lokasi_fasilitas}</span>
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-500 border border-slate-100">
            <Wrench size={11} className="shrink-0 text-slate-400" />
            <span className="capitalize">{report.kategori || 'Lainnya'}</span>
          </span>
          <span className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${prioritas.cls}`}>
            <AlertTriangle size={11} className="shrink-0" />
            <span>{prioritas.label}</span>
          </span>
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-slate-650 pr-1">
          {report.deskripsi_kerusakan}
        </p>

        {/* Admin Note Box */}
        {report.catatan_admin && (
          <div className="rounded-2xl bg-amber-50/70 border border-amber-100 p-4 flex gap-3 text-xs leading-relaxed text-amber-800 shadow-sm/5">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5 text-amber-700">Tanggapan/Catatan Tim Sarpras:</span>
              <span className="italic">"{report.catatan_admin}"</span>
            </div>
          </div>
        )}

        {/* Image Swiper / Slider - Stacked below description */}
        {images.length > 0 && (
          <div className="relative w-full h-72 sm:h-80 bg-white border border-slate-200 rounded-2xl overflow-hidden mt-2 flex items-center justify-center shadow-sm">
            <div className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-none">
              {images.map((src, index) => (
                <div key={index} className="w-full h-full shrink-0 snap-center relative flex items-center justify-center bg-white">
                  <img
                    src={src}
                    alt={`Bukti aduan ${index + 1}`}
                    className="h-full w-full object-contain cursor-pointer transition hover:scale-[1.01] duration-300"
                    onClick={() => onOpenComment(report.id)}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=600&auto=format&fit=crop&q=60';
                    }}
                  />
                  {images.length > 1 && (
                    <div className="absolute bottom-3 right-3 rounded-lg bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm select-none">
                      {index + 1} / {images.length}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 3. FOOTER ACTIONS: Upvote, Comment count */}
      <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
        <div className="flex items-center gap-3">
          {/* Upvote Button */}
          <button
            onClick={() => onVote(report.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition-all duration-150 cursor-pointer ${
              report.user_vote
                ? 'border-blue-200 bg-blue-50 text-[#30578f]'
                : 'border-slate-200 bg-white text-slate-500 hover:border-slate-350 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp
              size={13}
              className={report.user_vote ? 'fill-[#30578f] text-[#30578f]' : 'text-slate-400'}
            />
            <span>Saya Juga Mengalami</span>
            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
              report.user_vote ? 'bg-blue-100 text-[#30578f]' : 'bg-slate-100 text-slate-500'
            }`}>
              {report.votes_count || 0}
            </span>
          </button>

          {/* Comment Count Button */}
          <button
            onClick={() => onOpenComment(report.id)}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-500 hover:bg-slate-50 transition cursor-pointer"
          >
            <MessageCircle size={13} className="text-slate-400" />
            <span>Coment</span>
            <span className="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              {report.comments_count || 0}
            </span>
          </button>

          {/* Edit Button (Visible only to owner when status is pending) */}
          {report.status?.toLowerCase() === 'pending' && report.user?.id === user?.id && (
            <button
              onClick={() => onEdit?.(report.id)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-50 transition cursor-pointer"
            >
              <Wrench size={13} className="text-blue-500" />
              <span>Edit</span>
            </button>
          )}
        </div>
      </div>

    </article>
  );
}

export default CardLaporan;