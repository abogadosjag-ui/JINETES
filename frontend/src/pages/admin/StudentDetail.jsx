import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import { ArrowLeft, Phone, AlertCircle, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAY_BADGE = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
const PAY_LABEL = { PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado' };
const LEVEL_LABEL = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };

export default function AdminStudentDetail() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);

  useEffect(() => { api.get(`/admin/users/${id}`).then(r => setStudent(r.data)); }, [id]);

  if (!student) return <div className="text-earth-400 p-8">Cargando...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-3">
        <Link to="/admin/students" className="text-earth-500 hover:text-earth-800"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-2xl font-extrabold text-earth-900">{student.name}</h1>
          <p className="text-earth-500 text-sm">{student.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="card grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div><p className="label">Nivel</p><p className="font-semibold">{LEVEL_LABEL[student.experienceLevel]}</p></div>
        <div><p className="label">Teléfono</p><p className="font-semibold">{student.phone || '—'}</p></div>
        <div><p className="label">Contacto emergencia</p><p className="font-semibold truncate">{student.emergencyContact || '—'}</p></div>
        <div><p className="label">Miembro desde</p><p className="font-semibold">{format(new Date(student.createdAt), "d MMM yyyy", { locale: es })}</p></div>
      </div>

      {/* Pagos */}
      <div className="card">
        <h2 className="font-bold text-earth-900 mb-3">Pagos ({student.payments.length})</h2>
        {student.payments.length === 0 ? <p className="text-earth-400 text-sm">Sin pagos.</p> : (
          <div className="space-y-2">
            {student.payments.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl text-sm">
                <div>
                  <p className="font-semibold">{p.concept}</p>
                  <p className="text-earth-500 text-xs">{format(new Date(p.createdAt), "d MMM yyyy", { locale: es })}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold">${p.amount.toLocaleString('es-CO')}</span>
                  <span className={PAY_BADGE[p.status]}>{PAY_LABEL[p.status]}</span>
                  <a href={`/uploads/${p.proofFile}`} target="_blank" rel="noopener noreferrer" className="text-primary-600"><ExternalLink size={14} /></a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Clases */}
      <div className="card">
        <h2 className="font-bold text-earth-900 mb-3">Clases reservadas ({student.classBookings.length})</h2>
        {student.classBookings.length === 0 ? <p className="text-earth-400 text-sm">Sin reservas.</p> : (
          <div className="space-y-2">
            {student.classBookings.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl text-sm">
                <div>
                  <p className="font-semibold">{b.slot.title}</p>
                  <p className="text-earth-500 text-xs">{format(new Date(b.slot.dateTime), "EEEE d MMM · HH:mm", { locale: es })}</p>
                </div>
                <span className={b.status === 'CONFIRMED' ? 'badge-confirmed' : 'badge-cancelled'}>{b.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cabalgatas */}
      <div className="card">
        <h2 className="font-bold text-earth-900 mb-3">Cabalgatas ({student.cabalgatas.length})</h2>
        {student.cabalgatas.length === 0 ? <p className="text-earth-400 text-sm">Sin cabalgatas.</p> : (
          <div className="space-y-2">
            {student.cabalgatas.map(c => (
              <div key={c.id} className="flex items-center justify-between p-3 bg-earth-50 rounded-xl text-sm">
                <div>
                  <p className="font-semibold">{format(new Date(c.date), "d 'de' MMMM yyyy", { locale: es })}</p>
                  <p className="text-earth-500 text-xs">{c.numPeople} personas{c.notes ? ` · ${c.notes}` : ''}</p>
                </div>
                <span className={c.status === 'CONFIRMED' ? 'badge-confirmed' : c.status === 'PENDING' ? 'badge-pending' : 'badge-cancelled'}>{c.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
