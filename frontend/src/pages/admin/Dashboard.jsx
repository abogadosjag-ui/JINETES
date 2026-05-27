import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Users, CreditCard, CalendarDays, MapPin, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

function StatCard({ icon: Icon, label, value, color, to }) {
  return (
    <Link to={to} className="card hover:shadow-md transition-shadow flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-earth-500 text-sm">{label}</p>
        <p className="font-bold text-2xl text-earth-900">{value}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ students: 0, pendingPayments: 0, upcomingClasses: 0, pendingCabalgatas: 0 });
  const [recentPayments, setRecentPayments] = useState([]);
  const [pendingCabalgatas, setPendingCabalgatas] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/admin/users'),
      api.get('/admin/payments'),
      api.get('/classes'),
      api.get('/admin/cabalgatas'),
    ]).then(([users, payments, classes, cabalgatas]) => {
      const now = new Date();
      setStats({
        students: users.data.length,
        pendingPayments: payments.data.filter(p => p.status === 'PENDING').length,
        upcomingClasses: classes.data.filter(c => new Date(c.dateTime) >= now).length,
        pendingCabalgatas: cabalgatas.data.filter(c => c.status === 'PENDING').length,
      });
      setRecentPayments(payments.data.filter(p => p.status === 'PENDING').slice(0, 5));
      setPendingCabalgatas(cabalgatas.data.filter(c => c.status === 'PENDING').slice(0, 5));
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Panel de Administración</h1>
        <p className="text-earth-500 text-sm mt-1">Resumen general de la escuela</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Estudiantes" value={stats.students} color="bg-earth-500" to="/admin/students" />
        <StatCard icon={CreditCard} label="Pagos pendientes" value={stats.pendingPayments} color="bg-yellow-500" to="/admin/payments" />
        <StatCard icon={CalendarDays} label="Clases próximas" value={stats.upcomingClasses} color="bg-forest-500" to="/admin/schedule" />
        <StatCard icon={MapPin} label="Cabalgatas pendientes" value={stats.pendingCabalgatas} color="bg-primary-600" to="/admin/cabalgatas" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Pagos pendientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-earth-900">Pagos por revisar</h2>
            <Link to="/admin/payments" className="text-primary-600 text-sm font-semibold hover:underline">Ver todos →</Link>
          </div>
          {recentPayments.length === 0 ? (
            <p className="text-earth-400 text-sm">No hay pagos pendientes.</p>
          ) : recentPayments.map(p => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-earth-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-earth-900">{p.user.name}</p>
                <p className="text-xs text-earth-500">{p.concept}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">${p.amount.toLocaleString('es-CO')}</p>
                <span className="badge-pending">Pendiente</span>
              </div>
            </div>
          ))}
        </div>

        {/* Cabalgatas pendientes */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-earth-900">Cabalgatas por confirmar</h2>
            <Link to="/admin/cabalgatas" className="text-primary-600 text-sm font-semibold hover:underline">Ver todas →</Link>
          </div>
          {pendingCabalgatas.length === 0 ? (
            <p className="text-earth-400 text-sm">No hay cabalgatas pendientes.</p>
          ) : pendingCabalgatas.map(c => (
            <div key={c.id} className="flex items-center justify-between py-2 border-b border-earth-50 last:border-0">
              <div>
                <p className="text-sm font-semibold text-earth-900">{c.user.name}</p>
                <p className="text-xs text-earth-500 flex items-center gap-1">
                  <CalendarDays size={11} />{format(new Date(c.date), "d MMM yyyy", { locale: es })}
                  {' · '}<Users size={11} />{c.numPeople} personas
                </p>
              </div>
              <span className="badge-pending">Pendiente</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
