import { LayoutGrid, ClipboardList, LogOut, ShieldAlert } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavbarAdmin() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white p-6 shrink-0 z-40">
      <div>
        <Link to="/" className="mb-8 flex items-center gap-3 cursor-pointer group">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#30578f] text-white transition group-hover:scale-105">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900 leading-tight">KampusFix</h2>
            <p className="text-xs text-slate-500">Admin Panel</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {[
            { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutGrid size={18} /> },
            { to: '/admin/kelola-laporan', label: 'Kelola Laporan', icon: <ClipboardList size={18} /> },
          ].map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 relative overflow-hidden ${
                  isActive
                    ? 'bg-[#e8f1ff] text-[#30578f]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {/* Garis kiri aktif */}
                <span
                  className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-[#30578f] transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-0'
                  }`}
                />
                <span className={`transition-colors duration-200 ${isActive ? 'text-[#30578f]' : 'text-slate-400'}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800 truncate">{user?.name || 'Admin'}</p>
        <p className="mt-1 text-xs text-slate-500 truncate">{user?.email || 'admin@uin-alauddin.ac.id'}</p>
        <button onClick={handleLogout} className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-600 hover:text-rose-700 transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default NavbarAdmin;
