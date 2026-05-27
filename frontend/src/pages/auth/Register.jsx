import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/client';
import toast from 'react-hot-toast';

const LEVELS = [
  { value: 'BEGINNER', label: 'Principiante' },
  { value: 'INTERMEDIATE', label: 'Intermedio' },
  { value: 'ADVANCED', label: 'Avanzado' },
];

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    emergencyContact: '', experienceLevel: 'BEGINNER',
  });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('La contraseña debe tener al menos 6 caracteres'); return; }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      login(data.user, data.token);
      toast.success('¡Cuenta creada exitosamente!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Error al registrarse');
    } finally { setLoading(false); }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-earth-800 to-forest-700 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <img src="/logo.png" alt="JINETES" className="h-24 w-auto mx-auto brightness-0 invert drop-shadow-xl" />
          <h1 className="text-2xl font-extrabold text-white mt-4">Crear cuenta</h1>
          <p className="text-earth-300 text-sm mt-1">Únete a la familia JINETES</p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre completo *</label>
                <input type="text" className="input" placeholder="Juan Rodríguez"
                  value={form.name} onChange={set('name')} required />
              </div>
              <div>
                <label className="label">Correo electrónico *</label>
                <input type="email" className="input" placeholder="tu@email.com"
                  value={form.email} onChange={set('email')} required />
              </div>
              <div>
                <label className="label">Contraseña *</label>
                <input type="password" className="input" placeholder="Mínimo 6 caracteres"
                  value={form.password} onChange={set('password')} required />
              </div>
              <div>
                <label className="label">Teléfono</label>
                <input type="tel" className="input" placeholder="300 123 4567"
                  value={form.phone} onChange={set('phone')} />
              </div>
              <div>
                <label className="label">Contacto de emergencia</label>
                <input type="text" className="input" placeholder="Nombre y teléfono"
                  value={form.emergencyContact} onChange={set('emergencyContact')} />
              </div>
              <div>
                <label className="label">Nivel de experiencia</label>
                <select className="input" value={form.experienceLevel} onChange={set('experienceLevel')}>
                  {LEVELS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-2">
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>
          <p className="text-center text-sm text-earth-600 mt-6">
            ¿Ya tienes cuenta?{' '}
            <Link to="/login" className="text-primary-600 font-semibold hover:underline">Inicia sesión</Link>
          </p>
          <p className="text-center mt-2">
            <Link to="/" className="text-xs text-earth-400 hover:underline">← Volver al inicio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
