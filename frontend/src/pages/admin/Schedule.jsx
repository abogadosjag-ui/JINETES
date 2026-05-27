import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Plus, X, Trash2, Users } from 'lucide-react';

const BLANK = { title: '', instructor: '', dateTime: '', duration: 60, maxStudents: 5 };

export default function AdminSchedule() {
  const [slots, setSlots] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(BLANK);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    const { data } = await api.get('/classes');
    setSlots(data);
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
    if (!confirm('¿Eliminar esta clase y todas sus reservas?')) return;
    await api.delete(`/admin/classes/${id}`);
    toast.success('Clase eliminada');
    setSelected(null);
    fetchSlots();
  }

  function handleDateClick({ dateStr, date }) {
    const local = new Date(date);
    local.setHours(8, 0, 0, 0);
    const isoLocal = local.toISOString().slice(0, 16);
    setForm(p => ({ ...p, dateTime: isoLocal }));
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

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-earth-900">Horario de Clases</h1>
          <p className="text-earth-500 text-sm mt-1">Crea y gestiona los slots de clase. Haz clic en el calendario para agregar.</p>
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
          eventClick={({ event }) => setSelected(event.extendedProps)}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          height={550}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
          selectable
        />
      </div>

      {/* Formulario nueva clase */}
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

      {/* Detalle slot seleccionado */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-xl text-earth-900">{selected.title}</h2>
              <button onClick={() => setSelected(null)}><X size={20} className="text-earth-400" /></button>
            </div>
            <div className="text-sm space-y-2 text-earth-700 mb-4">
              <p>Instructor: <strong>{selected.instructor}</strong></p>
              <p>Duración: <strong>{selected.duration} min</strong></p>
              <p className="flex items-center gap-1"><Users size={14} />
                {selected.bookedCount} / {selected.maxStudents} cupos ocupados
              </p>
            </div>
            <button onClick={() => handleDelete(selected.id)}
              className="btn-danger w-full flex items-center justify-center gap-2">
              <Trash2 size={16} />Eliminar clase
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
