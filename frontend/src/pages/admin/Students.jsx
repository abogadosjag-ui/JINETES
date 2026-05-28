import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { Search, ChevronRight, UserCheck, UserX } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import toast from 'react-hot-toast';

const LEVEL_LABEL = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState('active'); // 'active' | 'inactive'
  const [toggling, setToggling] = useState(null);

  useEffect(() => { fetchStudents(); }, []);

  async function fetchStudents() {
    const { data } = await api.get('/admin/users');
    setStudents(data);
  }

  async function handleToggle(student) {
    setToggling(student.id);
    try {
      const { data } = await api.put(`/admin/users/${student.id}/status`);
      setStudents(prev =>
        prev.map(s => s.id === student.id
          ? { ...s, isActive: data.isActive, inactiveSince: data.inactiveSince }
          : s
        )
      );
      toast.success(
        data.isActive
          ? `${student.name} marcado como activo`
          : `${student.name} marcado como inactivo`
      );
    } catch {
      toast.error('Error al cambiar el estado');
    } finally {
      setToggling(null);
    }
  }

  const active   = students.filter(s => s.isActive);
  const inactive = students.filter(s => !s.isActive);
  const list     = tab === 'active' ? active : inactive;

  const filtered = list.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Estudiantes</h1>
        <p className="text-earth-500 text-sm mt-1">{students.length} registrados en total</p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('active')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
            tab === 'active'
              ? 'bg-forest-600 text-white border-forest-600 shadow'
              : 'bg-white text-earth-600 border-earth-200 hover:border-earth-400'
          }`}>
          <UserCheck size={16} />
          Activos
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            tab === 'active' ? 'bg-white/20 text-white' : 'bg-forest-100 text-forest-700'
          }`}>{active.length}</span>
        </button>

        <button
          onClick={() => setTab('inactive')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition border ${
            tab === 'inactive'
              ? 'bg-earth-600 text-white border-earth-600 shadow'
              : 'bg-white text-earth-600 border-earth-200 hover:border-earth-400'
          }`}>
          <UserX size={16} />
          Inactivos
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-bold ${
            tab === 'inactive' ? 'bg-white/20 text-white' : 'bg-earth-200 text-earth-600'
          }`}>{inactive.length}</span>
        </button>
      </div>

      {/* Búsqueda */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input type="text" className="input pl-9" placeholder="Buscar por nombre o email..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      {/* Tabla */}
      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-earth-400">
            <p className="font-semibold">
              {tab === 'active' ? 'No hay estudiantes activos.' : 'No hay estudiantes inactivos.'}
            </p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-earth-50 text-earth-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Nivel</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Pagos</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Clases</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">
                  {tab === 'active' ? 'Registro' : 'Inactivo desde'}
                </th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-50">
              {filtered.map(s => (
                <tr key={s.id} className={`transition-colors ${s.isActive ? 'hover:bg-earth-50' : 'bg-earth-50/50 hover:bg-earth-100/50'}`}>
                  <td className="px-4 py-3 font-semibold text-earth-900">{s.name}</td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">{s.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="badge-confirmed">{LEVEL_LABEL[s.experienceLevel]}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{s._count.payments}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{s._count.classBookings}</td>
                  <td className="px-4 py-3 text-earth-400 text-xs hidden lg:table-cell">
                    {tab === 'active'
                      ? format(new Date(s.createdAt), "d MMM yyyy", { locale: es })
                      : s.inactiveSince
                        ? format(new Date(s.inactiveSince), "d MMM yyyy", { locale: es })
                        : '—'
                    }
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => handleToggle(s)}
                      disabled={toggling === s.id}
                      title={s.isActive ? 'Marcar como inactivo' : 'Marcar como activo'}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition ${
                        toggling === s.id
                          ? 'opacity-50 cursor-wait'
                          : s.isActive
                            ? 'bg-forest-100 text-forest-700 hover:bg-red-100 hover:text-red-600'
                            : 'bg-earth-200 text-earth-600 hover:bg-forest-100 hover:text-forest-700'
                      }`}>
                      {s.isActive
                        ? <><UserCheck size={12} />Activo</>
                        : <><UserX size={12} />Inactivo</>
                      }
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <Link to={`/admin/students/${s.id}`} className="text-primary-600 hover:text-primary-800">
                      <ChevronRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
