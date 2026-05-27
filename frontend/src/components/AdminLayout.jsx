import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Users, CreditCard, CalendarDays, MapPin, LogOut, Menu, X, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Estudiantes', icon: Users },
  { to: '/admin/payments', label: 'Pagos', icon: CreditCard },
  { to: '/admin/schedule', label: 'Horario de Clases', icon: CalendarDays },
  { to: '/admin/cabalgatas', label: 'Cabalgatas', icon: MapPin },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="hidden md:flex flex-col w-64 bg-earth-900 text-white">
        <div className="px-4 py-4 border-b border-earth-700 text-center">
          <img src="/logo.png" alt="JINETES" className="h-14 w-auto mx-auto mb-1 brightness-0 invert drop-shadow-md" />
          <p className="text-xs text-primary-300 font-semibold tracking-widest uppercase">Panel Admin</p>
        </div>
        <div className="px-4 py-4 border-b border-earth-700 flex items-center gap-2">
          <ShieldCheck size={16} className="text-primary-400" />
          <div>
            <p className="font-semibold text-sm truncate">{user?.name}</p>
            <p className="text-xs text-earth-400">Administrador</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-earth-200 hover:bg-earth-700 hover:text-white'
                }`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-earth-700">
          <button onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-earth-300 hover:bg-earth-700 hover:text-white transition-colors">
            <LogOut size={18} /> Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-earth-900 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="JINETES" className="h-8 w-auto brightness-0 invert" />
          <span className="font-bold text-sm">JINETES</span>
        </div>
        <button onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setOpen(false)}>
          <aside className="w-64 h-full bg-earth-900 text-white" onClick={e => e.stopPropagation()}>
            <nav className="px-3 pt-16 pb-4 space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink key={to} to={to} end={end} onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive ? 'bg-primary-600 text-white' : 'text-earth-200 hover:bg-earth-700'
                    }`}>
                  <Icon size={18} />{label}
                </NavLink>
              ))}
            </nav>
            <div className="px-3 py-4 border-t border-earth-700">
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-earth-300 hover:bg-earth-700">
                <LogOut size={18} /> Cerrar sesión
              </button>
            </div>
          </aside>
        </div>
      )}

      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
