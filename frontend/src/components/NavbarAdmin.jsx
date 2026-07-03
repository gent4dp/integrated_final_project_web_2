import { LayoutGrid, ClipboardList, LogOut, ShieldAlert } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function NavbarAdmin() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="flex min-h-screen w-72 flex-col justify-between border-r border-slate-200 bg-white p-6">
      <div>
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#30578f] text-white">
            <ShieldAlert size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">KampusFix</h2>
            <p className="text-sm text-slate-500">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${location.pathname === '/admin/dashboard' ? 'bg-[#e8f1ff] text-[#30578f]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <LayoutGrid size={18} /> Dashboard
          </Link>
          <Link
            to="/admin/kelola-laporan"
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${location.pathname === '/admin/kelola-laporan' ? 'bg-[#e8f1ff] text-[#30578f]' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ClipboardList size={18} /> Kelola Laporan
          </Link>
        </nav>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-800">{user?.name || 'Admin'}</p>
        <p className="mt-1 text-xs text-slate-500">{user?.email || 'admin@uin-alauddin.ac.id'}</p>
        <button onClick={logout} className="mt-4 flex items-center gap-2 text-sm font-semibold text-rose-600">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default NavbarAdmin;
