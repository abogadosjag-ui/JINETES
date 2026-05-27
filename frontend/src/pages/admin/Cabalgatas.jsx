import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { CheckCircle, XCircle, CalendarDays, Users, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_BADGE = { PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled' };
const STATUS_LABEL = { PENDING: 'Pendiente', CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada' };

export default function AdminCabalgatas() {
  const [list, setList] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    const { data } = await api.get('/admin/cabalgatas');
    setList(data);
  }

  async function handleAction(status) {
    if (!modal) return;
    setLoading(true);
    try {
      await api.put(`/admin/cabalgatas/${modal.id}`, { status, adminNotes: notes });
      toast.success(status === 'CONFIRMED' ? 'Cabalgata confirmada' : 'Cabalgata cancelada');
      setModal(null);
      setNotes('');
      fetchList();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al actualizar');
    } finally { setLoading(false); }
  }

  const filtered = filter === 'ALL' ? list : list.filter(c => c.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Cabalgatas</h1>
        <p className="text-earth-500 text-sm mt-1">Gestiona las solicitudes de cabalgata de los estudiantes</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['PENDING', 'CONFIRMED', 'CANCELLED', 'ALL'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}>
            {f === 'ALL' ? 'Todas' : STATUS_LABEL[f]} {f !== 'ALL' && `(${list.filter(c => c.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-earth-400 text-sm">No hay cabalgatas con este filtro.</div>
        ) : filtered.map(c => (
          <div key={c.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="font-bold text-earth-900">{c.user.name}</p>
                <p className="text-sm text-earth-600 flex items-center gap-1">
                  <Phone size={13} className="text-earth-400" />{c.user.phone || 'Sin teléfono'}
                </p>
                <p className="text-sm text-earth-700 flex items-center gap-1">
                  <CalendarDays size={13} className="text-earth-400" />
                  {format(new Date(c.date), "EEEE d 'de' MMMM yyyy", { locale: es })}
                </p>
                <p className="text-sm text-earth-700 flex items-center gap-1">
                  <Users size={13} className="text-earth-400" />
                  {c.numPeople} {c.numPeople === 1 ? 'persona' : 'personas'}
                </p>
                {c.notes && <p className="text-xs text-earth-500 italic">"{c.notes}"</p>}
                {c.adminNotes && (
                  <p className="text-xs text-earth-600 bg-earth-50 rounded-lg px-2 py-1">
                    <span className="font-semibold">Nota admin:</span> {c.adminNotes}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <span className={STATUS_BADGE[c.status]}>{STATUS_LABEL[c.status]}</span>
                {c.status === 'PENDING' && (
                  <button onClick={() => { setModal(c); setNotes(''); }}
                    className="btn-primary text-sm px-3 py-1.5">
                    Gestionar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-xl text-earth-900">Gestionar cabalgata</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-earth-500">Estudiante:</span> <strong>{modal.user.name}</strong></p>
              <p><span className="text-earth-500">Teléfono:</span> {modal.user.phone || '—'}</p>
              <p><span className="text-earth-500">Fecha:</span> {format(new Date(modal.date), "d 'de' MMMM yyyy", { locale: es })}</p>
              <p><span className="text-earth-500">Personas:</span> {modal.numPeople}</p>
              {modal.notes && <p><span className="text-earth-500">Notas:</span> {modal.notes}</p>}
            </div>
            <div>
              <label className="label">Nota para el estudiante (opcional)</label>
              <textarea className="input resize-none h-20"
                placeholder="Ej: Confirmada para las 8am, traer ropa cómoda..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction('CONFIRMED')} disabled={loading}
                className="btn-success flex-1 flex items-center justify-center gap-2">
                <CheckCircle size={16} />{loading ? '...' : 'Confirmar'}
              </button>
              <button onClick={() => handleAction('CANCELLED')} disabled={loading}
                className="btn-danger flex-1 flex items-center justify-center gap-2">
                <XCircle size={16} />{loading ? '...' : 'Cancelar'}
              </button>
            </div>
            <button onClick={() => setModal(null)} className="btn-secondary w-full text-sm">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
}
