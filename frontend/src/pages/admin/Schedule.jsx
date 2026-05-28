import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, X, Trash2, Users, UserPlus, UserMinus } from 'lucide-react';

const BLANK = { title: '', instructor: '', dateTime: '', duration: 60, maxStudents: 5 };

export default function AdminSchedule() {
  const [slots, setSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [selected, setSelected] = useState(null);       // slot básico (del calendar)
  const [slotDetail, setSlotDetail] = useState(null);   // slot con alumnos inscritos
  const [allStudents, setAllStudents] = useState([]);
  const [assignId, setAssignId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSlots(); fetchStudents(); }, []);

  async function fetchSlots() {
    const { data } = await api.get('/classes');
    setSlots(data);
  }

  async function fetchStudents() {
    const { data } = await api.get('/admin/users');
    setAllStudents(data.filter(u => u.role === 'STUDENT'));
  }

  async function openSlot(extProps) {
    setSelected(extProps);
    setAssignId('');
    const { data } = await api.get(`/admin/classes/${extProps.id}`);
    setSlotDetail(data);
  }

  function closeSlot() {
    setSelected(null);
    setSlotDetail(null);
    setAssignId('');
  }

  async function handleCreate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...form, dateTime: new Date(form.dateTime).toISOString() };
      await api.post('/admin/classes', payload);
      toast.success('Clase creada exitosamente');
      setShowForm(false);
      setForm(BLANK);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al crear la clase');
    } finally { setLoading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar esta clase y todas sus asignaciones?')) return;
    await api.delete(`/admin/classes/${id}`);
    toast.success('Clase eliminada');
    closeSlot();
    fetchSlots();
  }

  async function handleAssign() {
    if (!assignId) return;
    setLoading(true);
    try {
      await api.post(`/admin/classes/${slotDetail.id}/assign`, { userId: assignId });
      toast.success('Alumno asignado correctamente');
      setAssignId('');
      const { data } = await api.get(`/admin/classes/${slotDetail.id}`);
      setSlotDetail(data);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al asignar alumno');
    } finally { setLoading(false); }
  }

  async function handleUnassign(userId, userName) {
    if (!confirm(`¿Quitar a ${userName} de esta clase?`)) return;
    setLoading(true);
    try {
      await api.delete(`/admin/classes/${slotDetail.id}/assign/${userId}`);
      toast.success('Alumno removido');
      const { data } = await api.get(`/admin/classes/${slotDetail.id}`);
      setSlotDetail(data);
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al remover alumno');
    } finally { setLoading(false); }
  }

  function handleDateClick({ date }) {
    const local = new Date(date);
    local.setHours(8, 0, 0, 0);
    setForm(p => ({ ...p, dateTime: local.toISOString().slice(0, 16) }));
    setShowForm(true);
  }

  const events = slots.map(s => ({
    id: s.id,
    title: `${s.title} (${s.bookedCount}/${s.maxStudents})`,
    start: s.dateTime,
    end: new Date(new Date(s.dateTime).getTime() + s.duration * 60000).toISOString(),
    className: s.bookedCount >= s.maxStudents ? 'fc-event-full' : 'fc-event-available',
    extendedProps: s,
  }));

  // Alumnos que aún no están en este slot
  const assignedIds = slotDetail?.bookings?.map(b => b.userId) ?? [];
  const availableStudents = allStudents.filter(s => !assignedIds.includes(s.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-earth-900">Horario de Clases</h1>
          <p className="text-earth-500 text-sm mt-1">Crea clases y asigna alumnos. Haz clic en el calendario para agregar.</p>
        </div>
        <button onClick={() => { setShowForm(true); setForm(BLANK); }}
          className="btn-primary flex items-center gap-2"><Plus size={16} />Nueva clase</button>
      </div>

      <div className="card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          events={events}
          dateClick={handleDateClick}
          eventClick={({ event }) => openSlot(event.extendedProps)}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          height={550}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          selectable
        />
      </div>

      {/* ── Modal: Nueva clase ── */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-earth-900">Nueva clase</h2>
              <button onClick={() => setShowForm(false)}><X size={20} className="text-earth-400" /></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="label">Nombre de la clase *</label>
                  <input type="text" className="input" placeholder="Ej: Clase de Salto - Nivel Intermedio"
                    value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
                </div>
                <div className="col-span-2">
                  <label className="label">Instructor *</label>
                  <input type="text" className="input" placeholder="Nombre del instructor"
                    value={form.instructor} onChange={e => setForm(p => ({ ...p, instructor: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Fecha y hora *</label>
                  <input type="datetime-local" className="input"
                    value={form.dateTime} onChange={e => setForm(p => ({ ...p, dateTime: e.target.value }))} required />
                </div>
                <div>
                  <label className="label">Duración (minutos)</label>
                  <input type="number" className="input" min="15" step="15"
                    value={form.duration} onChange={e => setForm(p => ({ ...p, duration: +e.target.value }))} />
                </div>
                <div>
                  <label className="label">Cupos máximos</label>
                  <input type="number" className="input" min="1"
                    value={form.maxStudents} onChange={e => setForm(p => ({ ...p, maxStudents: +e.target.value }))} />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? 'Creando...' : 'Crear clase'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal: Detalle + asignación de alumnos ── */}
      {selected && slotDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-bold text-xl text-earth-900">{slotDetail.title}</h2>
              <button onClick={closeSlot}><X size={20} className="text-earth-400" /></button>
            </div>
            <p className="text-sm text-earth-500 mb-4">
              {slotDetail.instructor} · {slotDetail.duration} min ·{' '}
              {slotDetail.bookings?.length ?? 0}/{slotDetail.maxStudents} cupos
            </p>

            {/* Alumnos asignados */}
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-earth-700 flex items-center gap-2 mb-2">
                <Users size={15} />Alumnos asignados ({slotDetail.bookings?.length ?? 0})
              </h3>
              {slotDetail.bookings?.length === 0 ? (
                <p className="text-sm text-earth-400 italic">Ningún alumno asignado aún.</p>
              ) : (
                <ul className="space-y-2">
                  {slotDetail.bookings.map(b => (
                    <li key={b.id} className="flex items-center justify-between bg-earth-50 rounded-xl px-3 py-2">
                      <div>
                        <p className="text-sm font-semibold text-earth-800">{b.user.name}</p>
                        <p className="text-xs text-earth-400">{b.user.email}</p>
                      </div>
                      <button
                        onClick={() => handleUnassign(b.user.id, b.user.name)}
                        disabled={loading}
                        className="text-red-400 hover:text-red-600 transition"
                        title="Quitar alumno">
                        <UserMinus size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Asignar nuevo alumno */}
            {(slotDetail.bookings?.length ?? 0) < slotDetail.maxStudents && (
              <div className="border-t border-earth-100 pt-4 mb-4">
                <h3 className="text-sm font-semibold text-earth-700 flex items-center gap-2 mb-2">
                  <UserPlus size={15} />Asignar alumno
                </h3>
                {availableStudents.length === 0 ? (
                  <p className="text-sm text-earth-400 italic">No hay más alumnos disponibles.</p>
                ) : (
                  <div className="flex gap-2">
                    <select
                      className="input flex-1 text-sm"
                      value={assignId}
                      onChange={e => setAssignId(e.target.value)}>
                      <option value="">Selecciona un alumno…</option>
                      {availableStudents.map(s => (
                        <option key={s.id} value={s.id}>{s.name} — {s.email}</option>
                      ))}
                    </select>
                    <button
                      onClick={handleAssign}
                      disabled={!assignId || loading}
                      className="btn-primary flex items-center gap-1 text-sm px-4">
                      <UserPlus size={15} />Asignar
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Eliminar clase */}
            <div className="border-t border-earth-100 pt-4">
              <button
                onClick={() => handleDelete(slotDetail.id)}
                className="btn-danger w-full flex items-center justify-center gap-2">
                <Trash2 size={16} />Eliminar clase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
