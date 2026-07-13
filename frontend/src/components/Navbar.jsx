import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Beranda', to: '/beranda' },
    { label: 'Riwayat', to: '/riwayat' },
    { label: 'Bantuan', to: '/bantuan' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#30578f] text-white">
            <ShieldAlert size={18} />
          </div>
          <span className="text-lg font-semibold text-[#30578f]">KampusFix</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
                  isActive
                    ? 'text-[#30578f]'
                    : 'text-slate-600 hover:text-[#30578f] hover:bg-[#30578f]/5'
                }`}
              >
                {item.label}
                {/* Garis bawah aktif */}
                <span
                  className={`absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-[#30578f] transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-40 group-hover:scale-x-100'
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">{user?.name?.split(' ')[0] || 'User'}</span>
            <button onClick={handleLogout} className="text-slate-500 hover:text-rose-600 transition-colors">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;