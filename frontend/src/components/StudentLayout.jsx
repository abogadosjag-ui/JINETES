import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, User, CreditCard, CalendarDays, MapPin, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/dashboard', label: 'Inicio', icon: LayoutDashboard, end: true },
  { to: '/dashboard/profile', label: 'Mi Perfil', icon: User },
  { to: '/dashboard/payments', label: 'Pagos', icon: CreditCard },
  { to: '/dashboard/classes', label: 'Clases', icon: CalendarDays },
  { to: '/dashboard/cabalgatas', label: 'Cabalgatas', icon: MapPin },
];

export default function StudentLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  function handleLogout() { logout(); navigate('/'); }

  return (
    <div className="min-h-screen flex bg-earth-50">
      {/* Sidebar desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-earth-800 text-white">
        <div className="px-4 py-4 border-b border-earth-700">
          <img src="/logo.png" alt="JINETES" className="h-14 w-auto mx-auto brightness-0 invert drop-shadow-md" />
        </div>
        <div className="px-4 py-4 border-b border-earth-700">
          <p className="text-xs text-earth-400 uppercase tracking-wider mb-1">Estudiante</p>
          <p className="font-semibold truncate">{user?.name}</p>
          <p className="text-xs text-earth-400 truncate">{user?.email}</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-600 text-white' : 'text-earth-200 hover:bg-earth-700 hover:text-white'
                }`}
            >
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

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 inset-x-0 z-30 bg-earth-800 text-white flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="JINETES" className="h-8 w-auto brightness-0 invert" />
          <span className="font-bold text-sm">JINETES</span>
        </div>
        <button onClick={() => setOpen(!open)}>{open ? <X size={22} /> : <Menu size={22} />}</button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-20 bg-black/50" onClick={() => setOpen(false)}>
          <aside className="w-64 h-full bg-earth-800 text-white" onClick={e => e.stopPropagation()}>
            <div className="px-4 pt-16 pb-4 border-b border-earth-700">
              <p className="font-semibold truncate">{user?.name}</p>
              <p className="text-xs text-earth-400 truncate">{user?.email}</p>
            </div>
            <nav className="px-3 py-4 space-y-1">
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

      {/* Main content */}
      <main className="flex-1 overflow-auto pt-14 md:pt-0">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
