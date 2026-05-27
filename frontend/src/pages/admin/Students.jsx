import { useEffect, useState } from 'react';
import api from '../../api/client';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const LEVEL_LABEL = { BEGINNER: 'Principiante', INTERMEDIATE: 'Intermedio', ADVANCED: 'Avanzado' };

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => { api.get('/admin/users').then(r => setStudents(r.data)); }, []);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.email.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-earth-900">Estudiantes</h1>
          <p className="text-earth-500 text-sm mt-1">{students.length} estudiantes registrados</p>
        </div>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-earth-400" />
        <input type="text" className="input pl-9" placeholder="Buscar por nombre o email..."
          value={query} onChange={e => setQuery(e.target.value)} />
      </div>

      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-earth-400 text-sm p-6">No se encontraron estudiantes.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-earth-50 text-earth-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left hidden md:table-cell">Email</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Nivel</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Pagos</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Clases</th>
                <th className="px-4 py-3 text-left hidden lg:table-cell">Registro</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-50">
              {filtered.map(s => (
                <tr key={s.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-earth-900">{s.name}</td>
                  <td className="px-4 py-3 text-earth-500 hidden md:table-cell">{s.email}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="badge-confirmed">{LEVEL_LABEL[s.experienceLevel]}</span>
                  </td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{s._count.payments}</td>
                  <td className="px-4 py-3 text-center hidden md:table-cell">{s._count.classBookings}</td>
                  <td className="px-4 py-3 text-earth-400 text-xs hidden lg:table-cell">
                    {format(new Date(s.createdAt), "d MMM yyyy", { locale: es })}
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
