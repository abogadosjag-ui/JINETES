import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { X, Users, Clock, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Classes() {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    const { data } = await api.get('/classes');
    setSlots(data);
  }

  const events = slots.map(slot => ({
    id: slot.id,
    title: `${slot.title} (${slot.bookedCount}/${slot.maxStudents})`,
    start: slot.dateTime,
    end: new Date(new Date(slot.dateTime).getTime() + slot.duration * 60000).toISOString(),
    className: slot.userBooked ? 'fc-event-booked' : slot.available ? 'fc-event-available' : 'fc-event-full',
    extendedProps: slot,
  }));

  function handleEventClick({ event }) {
    setSelected(event.extendedProps);
  }

  async function handleBook() {
    if (!selected) return;
    setLoading(true);
    try {
      await api.post(`/classes/book/${selected.id}`);
      toast.success('¡Clase reservada exitosamente!');
      await fetchSlots();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al reservar la clase');
    } finally { setLoading(false); }
  }

  async function handleCancel() {
    if (!selected) return;
    setLoading(true);
    try {
      await api.delete(`/classes/book/${selected.id}`);
      toast.success('Reserva cancelada');
      await fetchSlots();
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al cancelar la reserva');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Clases</h1>
        <p className="text-earth-500 text-sm mt-1">Haz clic en una clase para reservarla</p>
      </div>

      <div className="flex gap-3 text-xs flex-wrap">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-forest-500 inline-block" /> Disponible</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-primary-600 inline-block" /> Tu reserva</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded-sm bg-gray-400 inline-block" /> Sin cupos</span>
      </div>

      <div className="card">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          locale={esLocale}
          events={events}
          eventClick={handleEventClick}
          headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
          height={520}
          slotMinTime="06:00:00"
          slotMaxTime="20:00:00"
          allDaySlot={false}
        />
      </div>

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-xl text-earth-900">{selected.title}</h2>
              <button onClick={() => setSelected(null)} className="text-earth-400 hover:text-earth-700">
                <X size={20} />
              </button>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-earth-700">
                <Clock size={16} className="text-earth-400" />
                {format(new Date(selected.dateTime), "EEEE d 'de' MMMM · HH:mm", { locale: es })}
                {' '}({selected.duration} min)
              </div>
              <div className="flex items-center gap-2 text-earth-700">
                <User size={16} className="text-earth-400" />Instructor: {selected.instructor}
              </div>
              <div className="flex items-center gap-2 text-earth-700">
                <Users size={16} className="text-earth-400" />
                {selected.bookedCount} / {selected.maxStudents} cupos ocupados
              </div>
            </div>

            {selected.userBooked ? (
              <div className="mt-5 space-y-2">
                <div className="bg-primary-50 text-primary-700 text-sm rounded-lg px-4 py-2 font-semibold text-center">
                  ✓ Ya tienes reserva en esta clase
                </div>
                <button onClick={handleCancel} disabled={loading} className="btn-danger w-full">
                  {loading ? 'Cancelando...' : 'Cancelar reserva'}
                </button>
              </div>
            ) : selected.available ? (
              <button onClick={handleBook} disabled={loading} className="btn-success w-full mt-5">
                {loading ? 'Reservando...' : 'Reservar clase'}
              </button>
            ) : (
              <div className="mt-5 bg-gray-100 text-gray-600 text-sm rounded-lg px-4 py-2 font-semibold text-center">
                Sin cupos disponibles
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
