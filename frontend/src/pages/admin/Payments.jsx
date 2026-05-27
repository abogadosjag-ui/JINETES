import { useEffect, useState } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { ExternalLink, CheckCircle, XCircle, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAY_BADGE = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
const PAY_LABEL = { PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado' };

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [filter, setFilter] = useState('PENDING');
  const [modal, setModal] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    const { data } = await api.get('/admin/payments');
    setPayments(data);
  }

  async function handleAction(status) {
    if (!modal) return;
    setLoading(true);
    try {
      await api.put(`/admin/payments/${modal.id}`, { status, adminNotes: notes });
      toast.success(status === 'APPROVED' ? 'Pago aprobado' : 'Pago rechazado');
      setModal(null);
      setNotes('');
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al actualizar');
    } finally { setLoading(false); }
  }

  const filtered = filter === 'ALL' ? payments : payments.filter(p => p.status === filter);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Gestión de Pagos</h1>
        <p className="text-earth-500 text-sm mt-1">Aprueba o rechaza los comprobantes enviados por los estudiantes</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${filter === f ? 'bg-primary-600 text-white' : 'bg-earth-100 text-earth-700 hover:bg-earth-200'}`}>
            {f === 'ALL' ? 'Todos' : PAY_LABEL[f]} {f !== 'ALL' && `(${payments.filter(p => p.status === f).length})`}
          </button>
        ))}
      </div>

      <div className="card p-0 overflow-hidden">
        {filtered.length === 0 ? (
          <p className="text-earth-400 text-sm p-6">No hay pagos con este filtro.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-earth-50 text-earth-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left">Estudiante</th>
                <th className="px-4 py-3 text-left">Concepto</th>
                <th className="px-4 py-3 text-right">Monto</th>
                <th className="px-4 py-3 text-center hidden md:table-cell">Fecha</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-earth-50">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-earth-50 transition-colors">
                  <td className="px-4 py-3 font-semibold text-earth-900">{p.user.name}</td>
                  <td className="px-4 py-3 text-earth-600">{p.concept}</td>
                  <td className="px-4 py-3 text-right font-bold">${p.amount.toLocaleString('es-CO')}</td>
                  <td className="px-4 py-3 text-center text-earth-400 text-xs hidden md:table-cell">
                    {format(new Date(p.createdAt), "d MMM yyyy", { locale: es })}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={PAY_BADGE[p.status]}>{PAY_LABEL[p.status]}</span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <a href={`/uploads/${p.proofFile}`} target="_blank" rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-earth-500 hover:text-primary-600 hover:bg-primary-50 transition" title="Ver comprobante">
                        <ExternalLink size={15} />
                      </a>
                      {p.status === 'PENDING' && (
                        <button onClick={() => { setModal(p); setNotes(''); }}
                          className="px-2 py-1 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg text-xs font-semibold transition">
                          Revisar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal revisión */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <h2 className="font-bold text-xl text-earth-900">Revisar comprobante</h2>
            <div className="text-sm space-y-1">
              <p><span className="text-earth-500">Estudiante:</span> <strong>{modal.user.name}</strong></p>
              <p><span className="text-earth-500">Concepto:</span> {modal.concept}</p>
              <p><span className="text-earth-500">Monto:</span> <strong>${modal.amount.toLocaleString('es-CO')}</strong></p>
            </div>
            <a href={`/uploads/${modal.proofFile}`} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-primary-600 hover:underline text-sm">
              <ExternalLink size={14} /> Ver comprobante en nueva pestaña
            </a>
            <div>
              <label className="label">Nota para el estudiante (opcional)</label>
              <textarea className="input resize-none h-20" placeholder="Ej: El monto no coincide con la mensualidad..."
                value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => handleAction('APPROVED')} disabled={loading}
                className="btn-success flex-1 flex items-center justify-center gap-2">
                <CheckCircle size={16} />{loading ? '...' : 'Aprobar'}
              </button>
              <button onClick={() => handleAction('REJECTED')} disabled={loading}
                className="btn-danger flex-1 flex items-center justify-center gap-2">
                <XCircle size={16} />{loading ? '...' : 'Rechazar'}
              </button>
            </div>
            <button onClick={() => setModal(null)} className="btn-secondary w-full text-sm">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}
