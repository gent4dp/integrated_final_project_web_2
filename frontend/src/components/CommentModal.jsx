import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

function CommentModal({ isOpen, onClose, report, onCommentSubmit }) {
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!report) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      await onCommentSubmit?.(report.id, commentText);
      setCommentText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/50 px-4 pb-0 sm:items-center sm:pb-4"
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white shadow-2xl flex flex-col max-h-[85vh]"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 px-5 pt-5 pb-4 border-b border-slate-100">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <MessageCircle size={15} className="text-[#30578f]" />
                  Diskusi
                </div>
                <p className="mt-0.5 truncate text-xs text-slate-400">{report.judul_laporan}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 rounded-full border border-slate-200 p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-slate-600"
              >
                <X size={15} />
              </button>
            </div>

            {/* Comment list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
              {report.comments?.length ? (
                report.comments.map((comment) => {
                  const initials = comment.user?.name?.charAt(0)?.toUpperCase() || '?';
                  const date = comment.created_at
                    ? new Date(comment.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })
                    : '';
                  return (
                    <div key={comment.id} className="flex gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#30578f] to-[#1e3a5f] text-white text-xs font-bold">
                        {initials}
                      </div>
                      <div className="flex-1 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-700">
                            {comment.user?.name || 'Pengguna'}
                          </span>
                          <span className="text-[10px] text-slate-400">{date}</span>
                        </div>
                        <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                          {comment.komentar}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <MessageCircle size={32} className="text-slate-200 mb-3" />
                  <p className="text-sm text-slate-400">Belum ada komentar.</p>
                  <p className="text-xs text-slate-300 mt-1">Jadilah yang pertama berkomentar!</p>
                </div>
              )}
            </div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="border-t border-slate-100 px-5 py-4">
              <div className="flex items-end gap-3">
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  rows={2}
                  placeholder="Tulis komentar... (Enter untuk kirim)"
                  className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-[#30578f] focus:bg-white placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  disabled={isSubmitting || !commentText.trim()}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#30578f] text-white shadow-sm transition hover:bg-[#274a77] disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Send size={15} />
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CommentModal;
