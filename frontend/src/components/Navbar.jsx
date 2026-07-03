import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Beranda', to: '/beranda' },
    { label: 'Riwayat', to: '/riwayat' },
    { label: 'Bantuan', to: '/bantuan' },
  ];

  return (
    <nav className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        <Link to="/beranda" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#30578f] text-white">
            <ShieldAlert size={18} />
          </div>
          <span className="text-lg font-semibold text-[#30578f]">KampusFix</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`text-sm font-medium ${location.pathname === item.to ? 'text-[#30578f]' : 'text-slate-600 hover:text-[#30578f]'}`}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-full border border-slate-200 px-3 py-2">
            <span className="text-sm font-semibold text-slate-700">{user?.name?.split(' ')[0] || 'User'}</span>
            <button onClick={logout} className="text-slate-500 hover:text-rose-600">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;