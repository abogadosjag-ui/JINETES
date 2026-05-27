import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { MapPin, Users, CalendarDays, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const STATUS_BADGE = { PENDING: 'badge-pending', CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled' };
const STATUS_LABEL = { PENDING: 'Pendiente', CONFIRMED: 'Confirmada', CANCELLED: 'Cancelada' };

export default function Cabalgatas() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ date: '', numPeople: 1, notes: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchList(); }, []);

  async function fetchList() {
    const { data } = await api.get('/cabalgatas/mine');
    setList(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, date: new Date(form.date).toISOString(), numPeople: parseInt(form.numPeople) };
      await api.post('/cabalgatas', payload);
      toast.success('¡Solicitud de cabalgata enviada! El administrador la confirmará pronto.');
      setForm({ date: '', numPeople: 1, notes: '' });
      fetchList();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al enviar la solicitud');
    } finally { setLoading(false); }
  }

  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Cabalgatas</h1>
        <p className="text-earth-500 text-sm mt-1">Solicita un paseo ecuestre para ti y tus acompañantes</p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-bold text-earth-900 flex items-center gap-2">
          <MapPin size={18} className="text-primary-600" />
          Nueva solicitud de cabalgata
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label flex items-center gap-1.5"><CalendarDays size={14} />Fecha deseada *</label>
            <input type="date" className="input" min={minDateStr}
              value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required />
          </div>
          <div>
            <label className="label flex items-center gap-1.5"><Users size={14} />Número de personas *</label>
            <input type="number" className="input" min="1" max="30"
              value={form.numPeople} onChange={e => setForm(p => ({ ...p, numPeople: e.target.value }))} required />
          </div>
        </div>

        <div>
          <label className="label flex items-center gap-1.5"><FileText size={14} />Notas adicionales</label>
          <textarea className="input resize-none h-24" placeholder="Ej: preferimos tarde, algún integrante tiene experiencia previa..."
            value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} />
        </div>

        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <MapPin size={16} />{loading ? 'Enviando...' : 'Solicitar cabalgata'}
        </button>
      </form>

      {/* Historial */}
      <div className="card">
        <h2 className="font-bold text-earth-900 mb-4">Mis solicitudes</h2>
        {list.length === 0 ? (
          <p className="text-earth-400 text-sm">No tienes solicitudes de cabalgata aún.</p>
        ) : (
          <div className="space-y-3">
            {list.map(c => (
              <div key={c.id} className="border border-earth-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-earth-900 flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-earth-400" />
                      {format(new Date(c.date), "EEEE d 'de' MMMM yyyy", { locale: es })}
                    </p>
                    <p className="text-sm text-earth-600 mt-1 flex items-center gap-1.5">
                      <Users size={14} className="text-earth-400" />
                      {c.numPeople} {c.numPeople === 1 ? 'persona' : 'personas'}
                    </p>
                    {c.notes && <p className="text-xs text-earth-500 mt-1 italic">"{c.notes}"</p>}
                  </div>
                  <span className={STATUS_BADGE[c.status]}>{STATUS_LABEL[c.status]}</span>
                </div>
                {c.adminNotes && (
                  <div className="mt-2 text-xs text-earth-600 bg-earth-50 rounded-lg px-3 py-2">
                    <span className="font-semibold">Nota del admin:</span> {c.adminNotes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
