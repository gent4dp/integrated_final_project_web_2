import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await login(email, password);
      const user = response?.data?.user || response?.user || null;
      if (user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/beranda');
      }
    } catch (err) {
      setError('Email atau kata sandi tidak valid.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f7fb] px-4 py-12 font-sans antialiased">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[440px] rounded-3xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="text-center">
          <Link to="/" className="text-3xl font-black text-[#30578f] hover:opacity-85 transition inline-block">KampusFix</Link>
          <p className="mt-2 text-sm text-slate-500">Sistem pelaporan fasilitas kampus terpadu</p>
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
          Gunakan akun yang sudah tersedia di database demo: admin@uin-alauddin.ac.id atau mahasiswa@uin-alauddin.ac.id.
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email Kampus</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="nama@uin-alauddin.ac.id" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#30578f]" required />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Kata Sandi</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm outline-none focus:border-[#30578f]" required />
          </div>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-[#30578f] px-4 py-3 text-sm font-semibold text-white disabled:opacity-70">
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;