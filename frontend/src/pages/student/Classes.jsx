import { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import api from '../../api/client';
import { X, Clock, User, CalendarDays, Info } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function Classes() {
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => { fetchSlots(); }, []);

  async function fetchSlots() {
    const { data } = await api.get('/classes');
    setSlots(data);
  }

  const events = slots.map(slot => ({
    id: slot.id,
    title: slot.title,
    start: slot.dateTime,
    end: new Date(new Date(slot.dateTime).getTime() + slot.duration * 60000).toISOString(),
    className: 'fc-event-booked',
    extendedProps: slot,
  }));

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Mis Clases</h1>
        <p className="text-earth-500 text-sm mt-1">Aquí aparecen las clases que el administrador te ha asignado.</p>
      </div>

      {/* Aviso informativo */}
      <div className="flex items-start gap-3 bg-primary-50 border border-primary-200 rounded-xl p-4 text-sm text-primary-800">
        <Info size={18} className="text-primary-500 mt-0.5 shrink-0" />
        <p>
          Tu horario es asignado por el administrador de la escuela. Si necesitas un cambio,
          comunícate directamente con nosotros.
        </p>
      </div>

      {slots.length === 0 ? (
        <div className="card text-center py-16 text-earth-400">
          <CalendarDays size={48} className="mx-auto mb-3 opacity-30" />
          <p className="font-semibold">Aún no tienes clases asignadas</p>
          <p className="text-sm mt-1">El administrador te asignará una clase pronto.</p>
        </div>
      ) : (
        <div className="card">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            locale={esLocale}
            events={events}
            eventClick={({ event }) => setSelected(event.extendedProps)}
            headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth,timeGridWeek,timeGridDay' }}
            height={520}
            slotMinTime="06:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
          />
        </div>
      )}

      {/* Modal detalle (solo lectura) */}
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
                <User size={16} className="text-earth-400" />
                Instructor: <strong>{selected.instructor}</strong>
              </div>
            </div>

            <div className="mt-5 bg-primary-50 text-primary-700 text-sm rounded-xl px-4 py-3 font-semibold text-center">
              ✓ Clase asignada — ¡Te esperamos!
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
