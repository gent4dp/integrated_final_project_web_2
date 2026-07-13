import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, FileText } from 'lucide-react';
import { createReport, getReport, updateReport } from '../services/api';
import LayoutMhs from '../components/LayoutMhs';

function BuatLaporan() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');

  const [fetchingReport, setFetchingReport] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    judul_laporan: '',
    kategori: '',
    prioritas: 'sedang',
    fakultas: '',
    lokasi_fasilitas: '',
    deskripsi_kerusakan: '',
    foto_bukti: [],
  });

  const [existingPhotos, setExistingPhotos] = useState([]);

  // Fetch report details if in edit mode
  useEffect(() => {
    if (!editId) return;

    setFetchingReport(true);
    getReport(editId)
      .then((res) => {
        const report = res.data;
        if (report) {
          // Check status - only pending reports can be edited
          if (report.status?.toLowerCase() !== 'pending') {
            navigate('/riwayat');
            return;
          }

          setForm({
            judul_laporan: report.judul_laporan || '',
            kategori: report.kategori || '',
            prioritas: report.prioritas || 'sedang',
            fakultas: report.fakultas || '',
            lokasi_fasilitas: report.lokasi_fasilitas || '',
            deskripsi_kerusakan: report.deskripsi_kerusakan || '',
            foto_bukti: [], // Fresh uploads array
          });

          // Set existing photos for display
          if (report.foto_bukti) {
            setExistingPhotos(
              Array.isArray(report.foto_bukti) ? report.foto_bukti : [report.foto_bukti]
            );
          }
        }
      })
      .catch((err) => {
        console.error('Failed to load report for editing:', err);
        setSubmitError('Gagal memuat detail aduan untuk diedit.');
      })
      .finally(() => {
        setFetchingReport(false);
      });
  }, [editId, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.judul_laporan.trim()) {
      newErrors.judul_laporan = 'Judul aduan wajib diisi.';
    } else if (form.judul_laporan.trim().length < 5) {
      newErrors.judul_laporan = 'Judul aduan minimal 5 karakter.';
    }

    if (!form.kategori.trim()) {
      newErrors.kategori = 'Fasilitas/benda yang rusak wajib diisi.';
    }

    if (!form.prioritas) {
      newErrors.prioritas = 'Tingkat urgensi wajib dipilih.';
    }

    if (!form.fakultas) {
      newErrors.fakultas = 'Fakultas/unit wajib dipilih.';
    }

    if (!form.lokasi_fasilitas.trim()) {
      newErrors.lokasi_fasilitas = 'Lokasi spesifik wajib diisi.';
    }

    if (!form.deskripsi_kerusakan.trim()) {
      newErrors.deskripsi_kerusakan = 'Deskripsi kerusakan wajib diisi.';
    } else if (form.deskripsi_kerusakan.trim().length < 10) {
      newErrors.deskripsi_kerusakan = 'Deskripsi kerusakan minimal 10 karakter.';
    }

    // Photo evidence upload validation (Maximum 5 photos, 0 is allowed)
    if (form.foto_bukti && form.foto_bukti.length > 0) {
      if (form.foto_bukti.length > 5) {
        newErrors.foto_bukti = 'Maksimal mengunggah 5 foto bukti.';
      } else {
        let isInvalid = false;
        let isOversized = false;
        form.foto_bukti.forEach((file) => {
          if (!file.type.startsWith('image/')) isInvalid = true;
          if (file.size > 5 * 1024 * 1024) isOversized = true;
        });

        if (isInvalid) {
          newErrors.foto_bukti = 'Semua file harus berupa gambar (JPEG, PNG, JPG, GIF).';
        } else if (isOversized) {
          newErrors.foto_bukti = 'Ukuran setiap foto maksimal 5 MB.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null) {
          if (key === 'foto_bukti' && Array.isArray(value)) {
            value.forEach((file) => {
              payload.append('foto_bukti[]', file);
            });
          } else {
            payload.append(key, value);
          }
        }
      });

      if (editId) {
        await updateReport(editId, payload);
      } else {
        await createReport(payload);
      }

      navigate('/riwayat');
    } catch (error) {
      console.error('Submit report failed:', error);
      const validationErrors = error.response?.data?.errors;
      if (validationErrors) {
        const messages = Object.values(validationErrors).flat().join(' ');
        setSubmitError(messages || 'Data aduan tidak valid. Silakan periksa form.');
      } else {
        setSubmitError(error.response?.data?.message || 'Gagal menyimpan aduan. Silakan coba lagi.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (fetchingReport) {
    return (
      <LayoutMhs>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-500">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-[#30578f] mb-3" />
          <p className="text-sm">Memuat detail aduan...</p>
        </div>
      </LayoutMhs>
    );
  }

  return (
    <LayoutMhs>
      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Back navigation */}
        <div className="mb-6">
          <Link
            to="/beranda"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-[#30578f] transition"
          >
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </div>

        {/* Card Form */}
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-[#30578f]">
              {editId ? 'Ubah Laporan' : 'Buat Aduan Baru'}
            </span>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {editId ? 'Sesuaikan isi laporan aduan' : 'Laporkan sarpras yang bermasalah'}
            </h2>
            <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
              Silakan isi formulir di bawah ini dengan lengkap. Aduan yang Anda sampaikan akan langsung masuk ke panel fasilitas untuk segera ditindaklanjuti.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 md:grid-cols-2">
            {/* Judul Laporan */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Judul Laporan / Keluhan <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.judul_laporan}
                onChange={(e) => {
                  setForm({ ...form, judul_laporan: e.target.value });
                  setErrors({ ...errors, judul_laporan: null });
                }}
                className={`rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors ${
                  errors.judul_laporan
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10'
                    : 'border-slate-250 focus:border-[#30578f] bg-slate-50/10 focus:bg-white'
                }`}
                placeholder="Contoh: AC ruangan kelas 204 mati total"
              />
              {errors.judul_laporan && (
                <span className="text-xs text-rose-600 font-semibold">{errors.judul_laporan}</span>
              )}
            </div>

            {/* Kategori */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Fasilitas / Benda yang Rusak <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.kategori}
                onChange={(e) => {
                  setForm({ ...form, kategori: e.target.value });
                  setErrors({ ...errors, kategori: null });
                }}
                className={`rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors ${
                  errors.kategori
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10'
                    : 'border-slate-250 focus:border-[#30578f] bg-slate-50/10 focus:bg-white'
                }`}
                placeholder="Contoh: AC, Kursi, Proyektor, Pintu"
              />
              {errors.kategori && (
                <span className="text-xs text-rose-600 font-semibold">{errors.kategori}</span>
              )}
            </div>

            {/* Prioritas */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Tingkat Urgensi <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={form.prioritas}
                onChange={(e) => {
                  setForm({ ...form, prioritas: e.target.value });
                  setErrors({ ...errors, prioritas: null });
                }}
                className="rounded-xl border border-slate-250 bg-slate-50/10 px-3.5 py-3 text-sm outline-none focus:border-[#30578f] focus:bg-white transition-colors cursor-pointer"
              >
                <option value="rendah">Rendah (Dapat menunggu)</option>
                <option value="sedang">Sedang (Perlu segera)</option>
                <option value="darurat">Darurat (Mengganggu KBM)</option>
              </select>
              {errors.prioritas && (
                <span className="text-xs text-rose-600 font-semibold">{errors.prioritas}</span>
              )}
            </div>

            {/* Fakultas / Unit */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Fakultas / Unit Lokasi <span className="text-rose-500">*</span>
              </label>
              <select
                required
                value={form.fakultas}
                onChange={(e) => {
                  setForm({ ...form, fakultas: e.target.value });
                  setErrors({ ...errors, fakultas: null });
                }}
                className={`rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors cursor-pointer ${
                  errors.fakultas
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10'
                    : 'border-slate-250 focus:border-[#30578f] bg-slate-50/10 focus:bg-white'
                }`}
              >
                <option value="">-- Pilih Fakultas / Unit Lokasi --</option>
                <option value="Fakultas Syariah dan Hukum">Fakultas Syariah dan Hukum</option>
                <option value="Fakultas Tarbiyah dan Keguruan">Fakultas Tarbiyah dan Keguruan</option>
                <option value="Fakultas Ushuluddin dan Filsafat">Fakultas Ushuluddin dan Filsafat</option>
                <option value="Fakultas Adab dan Humaniora">Fakultas Adab dan Humaniora</option>
                <option value="Fakultas Dakwah dan Komunikasi">Fakultas Dakwah dan Komunikasi</option>
                <option value="Fakultas Sains dan Teknologi">Fakultas Sains dan Teknologi</option>
                <option value="Fakultas Kedokteran dan Ilmu Kesehatan">Fakultas Kedokteran dan Ilmu Kesehatan</option>
                <option value="Fakultas Ekonomi dan Bisnis Islam">Fakultas Ekonomi dan Bisnis Islam</option>
                <option value="Pascasarjana">Pascasarjana</option>
                <option value="Lainnya">Lainnya/Fasilitas Umum</option>
              </select>
              {errors.fakultas && (
                <span className="text-xs text-rose-600 font-semibold">{errors.fakultas}</span>
              )}
            </div>

            {/* Lokasi Spesifik */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Lokasi Spesifik Ruangan / Fasilitas <span className="text-rose-500">*</span>
              </label>
              <input
                required
                value={form.lokasi_fasilitas}
                onChange={(e) => {
                  setForm({ ...form, lokasi_fasilitas: e.target.value });
                  setErrors({ ...errors, lokasi_fasilitas: null });
                }}
                className={`rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors ${
                  errors.lokasi_fasilitas
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10'
                    : 'border-slate-250 focus:border-[#30578f] bg-slate-50/10 focus:bg-white'
                }`}
                placeholder="Contoh: Gedung Sains Lt. 3, Ruang Kuliah 305"
              />
              {errors.lokasi_fasilitas && (
                <span className="text-xs text-rose-600 font-semibold">{errors.lokasi_fasilitas}</span>
              )}
            </div>

            {/* Deskripsi */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Deskripsi Kerusakan Fasilitas <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={form.deskripsi_kerusakan}
                onChange={(e) => {
                  setForm({ ...form, deskripsi_kerusakan: e.target.value });
                  setErrors({ ...errors, deskripsi_kerusakan: null });
                }}
                rows={4}
                className={`rounded-xl border px-3.5 py-3 text-sm outline-none transition-colors ${
                  errors.deskripsi_kerusakan
                    ? 'border-rose-500 focus:border-rose-500 bg-rose-50/10'
                    : 'border-slate-250 focus:border-[#30578f] bg-slate-50/10 focus:bg-white'
                }`}
                placeholder="Jelaskan kondisi kerusakan sarpras secara detail agar memudahkan proses identifikasi..."
              />
              {errors.deskripsi_kerusakan && (
                <span className="text-xs text-rose-600 font-semibold">{errors.deskripsi_kerusakan}</span>
              )}
            </div>

            {/* Foto Bukti */}
            <div className="flex flex-col gap-1.5 md:col-span-2">
              <label className="text-xs font-bold uppercase text-slate-700 tracking-wider">
                Unggah Bukti Foto (Opsional - Maksimal 5 Foto)
              </label>
              <label
                className={`flex flex-col gap-2 rounded-2xl border-2 border-dashed px-5 py-4 text-center cursor-pointer transition-colors ${
                  errors.foto_bukti
                    ? 'border-rose-300 bg-rose-50/10'
                    : 'border-slate-200 bg-slate-50/10 hover:bg-slate-50'
                }`}
              >
                <span className="text-xs font-semibold text-slate-500">
                  {form.foto_bukti.length > 0
                    ? `Terpilih ${form.foto_bukti.length} foto baru`
                    : 'Pilih file gambar bukti kerusakan (bisa pilih lebih dari satu)'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    setForm({ ...form, foto_bukti: Array.from(e.target.files || []) });
                    setErrors({ ...errors, foto_bukti: null });
                  }}
                  className="hidden"
                />
              </label>
              <p className="text-[10px] text-slate-400 leading-normal">
                Format gambar: JPEG, PNG, JPG, GIF. Maksimal 5 MB per foto. Anda diperbolehkan tidak mengunggah foto aduan, atau melampirkan maksimal hingga 5 foto bukti.
              </p>
              {errors.foto_bukti && (
                <span className="text-xs text-rose-600 font-semibold mt-1">{errors.foto_bukti}</span>
              )}

              {/* Display existing photos in edit mode */}
              {editId && existingPhotos.length > 0 && form.foto_bukti.length === 0 && (
                <div className="mt-2">
                  <p className="text-xs font-bold text-slate-500 mb-2">Foto Terunggah Sebelumnya:</p>
                  <div className="flex flex-wrap gap-2">
                    {existingPhotos.map((src, idx) => (
                      <div key={idx} className="h-14 w-14 overflow-hidden rounded-lg border border-slate-200">
                        <img src={src} alt="Existing" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {submitError && (
              <div className="md:col-span-2 rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {submitError}
              </div>
            )}

            <div className="md:col-span-2 flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#30578f] px-5 py-3 text-sm font-semibold text-white hover:bg-[#274a77] disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan Aduan
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </LayoutMhs>
  );
}

export default BuatLaporan;
