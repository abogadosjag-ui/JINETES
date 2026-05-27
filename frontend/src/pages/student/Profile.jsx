import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { User, Phone, AlertCircle, Award } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LEVELS = [
  { value: 'BEGINNER', label: 'Principiante' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
];

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    emergencyContact: user?.emergencyContact || '',
    experienceLevel: user?.experienceLevel || 'BEGINNER',
  });
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.put('/users/profile', form);
      updateUser(data);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al actualizar el perfil');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Mi Perfil</h1>
        <p className="text-earth-500 text-sm mt-1">Actualiza tu información personal</p>
      </div>

      {/* Info no editable */}
      <div className="card flex items-center gap-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <User size={28} className="text-primary-600" />
        </div>
        <div>
          <p className="font-bold text-earth-900">{user?.name}</p>
          <p className="text-earth-500 text-sm">{user?.email}</p>
          <p className="text-earth-400 text-xs mt-1">
            Miembro desde {user?.createdAt ? format(new Date(user.createdAt), "d 'de' MMMM yyyy", { locale: es }) : '—'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-bold text-earth-900 mb-2">Información personal</h2>

        <div>
          <label className="label flex items-center gap-1.5"><User size={14} />Nombre completo</label>
          <input type="text" className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Phone size={14} />Teléfono</label>
          <input type="tel" className="input" placeholder="300 123 4567" value={form.phone} onChange={set('phone')} />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><AlertCircle size={14} />Contacto de emergencia</label>
          <input type="text" className="input" placeholder="Nombre y número de teléfono" value={form.emergencyContact} onChange={set('emergencyContact')} />
        </div>
        <div>
          <label className="label flex items-center gap-1.5"><Award size={14} />Nivel de experiencia</label>
          <select className="input" value={form.experienceLevel} onChange={set('experienceLevel')}>
            {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
          </select>
        </div>

        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
