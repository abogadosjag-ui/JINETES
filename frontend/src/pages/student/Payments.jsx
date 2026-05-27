import { useState, useEffect } from 'react';
import api from '../../api/client';
import toast from 'react-hot-toast';
import { Upload, FileText, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const PAY_BADGE = { PENDING: 'badge-pending', APPROVED: 'badge-approved', REJECTED: 'badge-rejected' };
const PAY_LABEL = { PENDING: 'Pendiente', APPROVED: 'Aprobado', REJECTED: 'Rechazado' };

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [form, setForm] = useState({ concept: '', amount: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchPayments(); }, []);

  async function fetchPayments() {
    const { data } = await api.get('/payments/mine');
    setPayments(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) { toast.error('Debes seleccionar el archivo del comprobante'); return; }
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('concept', form.concept);
      fd.append('amount', form.amount);
      fd.append('proofFile', file);
      await api.post('/payments', fd);
      toast.success('Comprobante enviado. El administrador lo revisará pronto.');
      setForm({ concept: '', amount: '' });
      setFile(null);
      e.target.reset();
      fetchPayments();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al enviar el comprobante');
    } finally { setLoading(false); }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-earth-900">Pagos</h1>
        <p className="text-earth-500 text-sm mt-1">Sube tu comprobante de pago para que el administrador lo apruebe</p>
      </div>

      {/* Formulario subida */}
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h2 className="font-bold text-earth-900">Subir comprobante</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">Concepto del pago *</label>
            <input type="text" className="input" placeholder="Ej: Mensualidad junio 2024"
              value={form.concept} onChange={e => setForm(p => ({ ...p, concept: e.target.value }))} required />
          </div>
          <div>
            <label className="label">Monto (COP) *</label>
            <input type="number" className="input" placeholder="150000" min="1"
              value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} required />
          </div>
        </div>
        <div>
          <label className="label">Comprobante (imagen o PDF, máx 5 MB) *</label>
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-earth-300 rounded-xl cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors">
            <Upload size={24} className="text-earth-400 mb-2" />
            <span className="text-sm text-earth-500">
              {file ? file.name : 'Haz clic o arrastra el archivo aquí'}
            </span>
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.webp,.pdf"
              onChange={e => setFile(e.target.files[0])} />
          </label>
        </div>
        <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
          <Upload size={16} />{loading ? 'Enviando...' : 'Enviar comprobante'}
        </button>
      </form>

      {/* Historial */}
      <div className="card">
        <h2 className="font-bold text-earth-900 mb-4">Historial de pagos</h2>
        {payments.length === 0 ? (
          <p className="text-earth-400 text-sm">No has enviado comprobantes aún.</p>
        ) : (
          <div className="space-y-3">
            {payments.map(p => (
              <div key={p.id} className="border border-earth-100 rounded-xl p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-earth-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-earth-900 truncate">{p.concept}</p>
                      <p className="text-xs text-earth-500">
                        {format(new Date(p.createdAt), "d 'de' MMMM yyyy", { locale: es })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="font-bold text-earth-800 text-sm">
                      ${p.amount.toLocaleString('es-CO')}
                    </span>
                    <span className={PAY_BADGE[p.status]}>{PAY_LABEL[p.status]}</span>
                  </div>
                </div>
                {p.adminNotes && (
                  <div className="mt-2 text-xs text-earth-600 bg-earth-50 rounded-lg px-3 py-2">
                    <span className="font-semibold">Nota del admin:</span> {p.adminNotes}
                  </div>
                )}
                <a href={`/uploads/${p.proofFile}`} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 hover:underline">
                  <ExternalLink size={12} /> Ver comprobante
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
