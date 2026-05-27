import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, CreditCard, Users } from 'lucide-react';
import { useState } from 'react';

const fotos = [
  { src: '/img/foto1.jpeg', alt: 'Jinetes en cabalgata' },
  { src: '/img/foto2.jpeg', alt: 'Clase de equitación' },
  { src: '/img/foto3.jpeg', alt: 'Trabajo con ganado' },
  { src: '/img/foto4.jpeg', alt: 'Clase familiar' },
  { src: '/img/foto5.jpeg', alt: 'Entrenamiento con lazo' },
  { src: '/img/foto6.jpeg', alt: 'Práctica en la arena' },
];

export default function Landing() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div className="min-h-screen bg-earth-900 text-white">

      {/* --- NAVBAR --- */}
      <header className="sticky top-0 z-30 bg-earth-900/90 backdrop-blur border-b border-earth-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center px-6 py-3">
          <img src="/logo.png" alt="JINETES" className="h-12 w-auto brightness-0 invert drop-shadow-md" />
          <div className="flex gap-3">
            <Link to="/login"
              className="px-4 py-2 rounded-lg border border-earth-400 hover:bg-earth-700 transition text-sm font-semibold">
              Iniciar sesión
            </Link>
            <Link to="/register"
              className="px-4 py-2 rounded-lg bg-primary-500 hover:bg-primary-400 transition text-sm font-semibold">
              Inscribirse
            </Link>
          </div>
        </div>
      </header>

      {/* --- HERO --- */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/foto7.jpeg')" }}
        />
        <div className="absolute inset-0 bg-earth-900/70" />

        <div className="relative max-w-6xl mx-auto px-6 py-48 text-center">
          <img src="/logo.png" alt="JINETES"
            className="h-32 w-auto mx-auto mb-6 brightness-0 invert drop-shadow-2xl" />
          <p className="text-primary-300 font-semibold uppercase tracking-widest text-sm mb-3">
            Donde el valor y la habilidad se encuentran en la arena
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Escuela de Equitación<br />
            <span className="text-primary-400">JINETES</span>
          </h1>
          <p className="text-earth-200 text-lg max-w-xl mx-auto mb-10">
            Inscríbete, agenda tus clases, sube tus comprobantes de pago
            y reserva cabalgatas desde un solo lugar.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register"
              className="px-8 py-4 bg-primary-500 hover:bg-primary-400 rounded-xl font-bold text-lg transition shadow-lg">
              Comenzar ahora →
            </Link>
            <a href="#galeria"
              className="px-8 py-4 border border-white/40 hover:bg-white/10 rounded-xl font-bold text-lg transition">
              Ver galería
            </a>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: Users,        title: 'Inscripción', desc: 'Regístrate y crea tu perfil de estudiante en minutos.' },
          { icon: CreditCard,   title: 'Pagos',       desc: 'Sube tu comprobante y el admin lo aprueba rápidamente.' },
          { icon: CalendarDays, title: 'Clases',      desc: 'Calendario en tiempo real para reservar tu clase.' },
          { icon: MapPin,       title: 'Cabalgatas',  desc: 'Agenda paseos indicando fecha y número de personas.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-earth-800 rounded-2xl p-5 text-left border border-earth-700">
            <div className="bg-primary-500/20 rounded-xl w-10 h-10 flex items-center justify-center mb-3">
              <Icon size={20} className="text-primary-400" />
            </div>
            <h3 className="font-bold mb-1">{title}</h3>
            <p className="text-earth-400 text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* --- GALERÍA --- */}
      <section id="galeria" className="max-w-6xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Nuestra escuela</p>
          <h2 className="text-3xl font-extrabold">Momentos en la arena</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {fotos.map((f, i) => (
            <button key={i} onClick={() => setLightbox(f)}
              className="relative overflow-hidden rounded-2xl aspect-[3/4] group cursor-zoom-in">
              <img src={f.src} alt={f.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-earth-900/0 group-hover:bg-earth-900/30 transition-colors duration-300" />
            </button>
          ))}
        </div>
      </section>

      {/* --- UBICACIÓN --- */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <div className="text-center mb-10">
          <p className="text-primary-400 text-sm font-semibold uppercase tracking-widest mb-2">Encuéntranos</p>
          <h2 className="text-3xl font-extrabold">Nuestra Ubicación</h2>
        </div>
        <div className="bg-earth-800 rounded-3xl overflow-hidden border border-earth-700 shadow-xl">
          <div className="w-full h-72 md:h-96">
            <iframe
              title="Ubicación Escuela JINETES"
              src="https://maps.google.com/maps?q=4.8052421,-75.8211887&z=15&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="grayscale-[20%] contrast-[1.05]"
            />
          </div>
          <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-start gap-3 text-left">
              <div className="bg-primary-500/20 rounded-xl w-10 h-10 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin size={20} className="text-primary-400" />
              </div>
              <div>
                <p className="font-bold text-lg">Escuela de Equitación JINETES</p>
                <p className="text-earth-400 text-sm">Colombia</p>
              </div>
            </div>
            <a
              href="https://maps.app.goo.gl/TSLPE8Pz9w63ZRyN9"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-primary-500 hover:bg-primary-400 rounded-xl font-bold transition shadow-lg shrink-0 whitespace-nowrap">
              <MapPin size={18} />
              ¿Cómo llegar?
            </a>
          </div>
        </div>
      </section>

      {/* --- CTA FINAL --- */}
      <section className="bg-primary-700 py-16 text-center px-6">
        <h2 className="text-3xl font-extrabold mb-4">¿Listo para montar?</h2>
        <p className="text-primary-200 mb-8 max-w-md mx-auto">
          Únete a la familia JINETES y vive la pasión por la equitación.
        </p>
        <Link to="/register"
          className="inline-block px-10 py-4 bg-white text-primary-700 rounded-xl font-bold text-lg hover:bg-primary-50 transition shadow-lg">
          Inscríbete gratis →
        </Link>
      </section>

      {/* --- LIGHTBOX --- */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox.src} alt={lightbox.alt}
            className="max-h-[90vh] max-w-[90vw] rounded-2xl shadow-2xl object-contain"
            onClick={e => e.stopPropagation()} />
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:text-primary-300 transition"
            onClick={() => setLightbox(null)}>
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
