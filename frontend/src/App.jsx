import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import BerandaMhs from './pages/BerandaMhs';
import RiwayatProfil from './pages/RiwayatProfil';
import Bantuan from './pages/Bantuan';
import AdminDashboard from './pages/admin/AdminDashboard';
import KelolaLaporan from './pages/admin/KelolaLaporan';

function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Memuat akun...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/beranda" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/beranda" element={<ProtectedRoute><BerandaMhs /></ProtectedRoute>} />
        <Route path="/riwayat" element={<ProtectedRoute><RiwayatProfil /></ProtectedRoute>} />
        <Route path="/bantuan" element={<ProtectedRoute><Bantuan /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/kelola-laporan" element={<ProtectedRoute adminOnly><KelolaLaporan /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;