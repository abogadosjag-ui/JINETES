import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { CalendarDays, CreditCard, MapPin, Clock } from 'lucide-react';
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

const LEVEL_LABEL = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };
const PAY_BADGE = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
const PAY_LABEL = { PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado' };

export default function StudentDashboard() {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [cabalgatas, setCabalgatas] = useState([]);

  useEffect(() => {
    api.get('/payments/mine').then(r => setPayments(r.data));
    api.get('/cabalgatas/mine').then(r => setCabalgatas(r.data));
    // clases reservadas — obtenemos todos los slots y filtramos los que el user reservó
    api.get('/classes').then(r => setBookings(r.data.filter(s => s.userBooked)));
  }, []);

  const upcoming = bookings
    .filter(s => new Date(s.dateTime) >= new Date())
    .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
    .slice(0, 3);

  const pendingPayments = payments.filter(p => p.status === 'PENDING').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">
          ¡Hola, {user?.name?.split(' ')[0]}! 👋
        </h1>
        <p className="text-earth-500 text-sm mt-1">
          Nivel: {LEVEL_LABEL[user?.experienceLevel]} · Miembro desde {user?.createdAt ? format(new Date(user.createdAt), 'MMMM yyyy', { locale: es }) : '—'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CalendarDays} label="Clases reservadas" value={bookings.length} color="bg-forest-500" to="/dashboard/classes" />
        <StatCard icon={CreditCard} label="Pagos enviados" value={payments.length} color="bg-primary-600" to="/dashboard/payments" />
        <StatCard icon={MapPin} label="Cabalgatas" value={cabalgatas.length} color="bg-earth-500" to="/dashboard/cabalgatas" />
        <StatCard icon={Clock} label="Pagos pendientes" value={pendingPayments} color="bg-yellow-500" to="/dashboard/payments" />
      </div>

      {/* Próximas clases */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-earth-900">Próximas clases</h2>
          <Link to="/dashboard/classes" className="text-primary-600 text-sm font-semibold hover:underline">Ver calendario →</Link>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-earth-400 text-sm">No tienes clases próximas. <Link to="/dashboard/classes" className="text-primary-600 hover:underline">Reservar una clase</Link></p>
        ) : (
          <div className="space-y-3">
            {upcoming.map(slot => (
              <div key={slot.id} className="flex items-center gap-3 p-3 bg-earth-50 rounded-xl">
                <div className="w-10 h-10 bg-forest-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                  {format(new Date(slot.dateTime), 'd')}
                </div>
                <div>
                  <p className="font-semibold text-sm text-earth-900">{slot.title}</p>
                  <p className="text-xs text-earth-500">
                    {format(new Date(slot.dateTime), "EEEE d MMM · HH:mm", { locale: es })} · {slot.instructor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Últimos pagos */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-earth-900">Últimos pagos</h2>
          <Link to="/dashboard/payments" className="text-primary-600 text-sm font-semibold hover:underline">Ver todos →</Link>
        </div>
        {payments.length === 0 ? (
          <p className="text-earth-400 text-sm">No has enviado comprobantes aún. <Link to="/dashboard/payments" className="text-primary-600 hover:underline">Subir comprobante</Link></p>
        ) : (
          <div className="space-y-2">
            {payments.slice(0, 3).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-earth-900">{p.concept}</p>
                  <p className="text-xs text-earth-500">{format(new Date(p.createdAt), 'd MMM yyyy', { locale: es })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-earth-800">
                    ${p.amount.toLocaleString('es-CO')}
                  </span>
                  <span className={PAY_BADGE[p.status]}>{PAY_LABEL[p.status]}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
