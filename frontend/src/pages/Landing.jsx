import { Link } from 'react-router-dom';
import { CalendarDays, MapPin, CreditCard, Users } from 'lucide-react';
import { useState } from 'react';
import MorphingNavbar from '../components/MorphingNavbar';
import HeroAnimation from '../components/HeroAnimation';

const fotos = [
  { src: '/img/foto1.jpeg', alt: 'Jinetes en cabalgata',   label: 'Cabalgata' },
  { src: '/img/foto2.jpeg', alt: 'Clase de equitación',    label: 'Equitación' },
  { src: '/img/foto3.jpeg', alt: 'Trabajo con ganado',     label: 'Ganado' },
  { src: '/img/foto4.jpeg', alt: 'Clase familiar',         label: 'Familia' },
  { src: '/img/foto5.jpeg', alt: 'Entrenamiento con lazo', label: 'Lazo' },
  { src: '/img/foto6.jpeg', alt: 'Práctica en la arena',   label: 'Arena' },
];

const servicios = [
  { icon: Users,        title: 'Inscripción', desc: 'Regístrate y crea tu perfil de estudiante en minutos.' },
  { icon: CreditCard,   title: 'Pagos',       desc: 'Sube tu comprobante y el admin lo aprueba rápidamente.' },
  { icon: CalendarDays, title: 'Clases',      desc: 'Calendario en tiempo real para reservar tu clase.' },
  { icon: MapPin,       title: 'Cabalgatas',  desc: 'Agenda paseos indicando fecha y número de personas.' },
];

function Rule({ className = '' }) {
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      <div className="h-px flex-1 bg-primary-700" />
      <span className="text-primary-500 text-base leading-none">◆</span>
      <div className="h-px flex-1 bg-primary-700" />
    </div>
  );
}

export default function Landing() {
  const [lightbox, setLightbox] = useState(null);
  const [active, setActive]     = useState(2);

  return (
    <div id="top" className="min-h-screen bg-earth-900 text-white">
      <MorphingNavbar />

      {/* ══════════════════ HERO ══════════════════ */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">

        {/* Fondo fotográfico */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/img/foto7.jpeg')" }}
        />
        {/* Capas de oscurecimiento */}
        <div className="absolute inset-0 bg-earth-900/78" />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse 85% 70% at 50% 42%, transparent 25%, rgba(66,47,32,0.65) 100%)' }}
        />

        {/* Contenido centrado */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto pb-80">

          {/* Encabezado geográfico */}
          <div className="flex items-center gap-4 justify-center mb-10">
            <div className="h-px flex-1 max-w-[80px] bg-primary-600" />
            <span className="font-sans text-primary-400 text-[10px] tracking-[0.45em] uppercase">
              Pereira · Risaralda · Colombia
            </span>
            <div className="h-px flex-1 max-w-[80px] bg-primary-600" />
          </div>

          {/* Logo */}
          <img
            src="/logo.png"
            alt="JINETES"
            className="h-24 sm:h-28 w-auto mx-auto mb-8 brightness-0 invert opacity-90 drop-shadow-2xl"
          />

          {/* Título principal — Rye */}
          <h1 className="font-western text-6xl sm:text-7xl md:text-8xl text-white leading-none tracking-wider mb-6 drop-shadow-2xl">
            JINETES
          </h1>

          {/* Separador ornamental */}
          <div className="flex items-center gap-6 justify-center my-6 max-w-xs mx-auto">
            <div className="h-px flex-1 bg-primary-500/50" />
            <span className="text-primary-400 text-xl">◆</span>
            <div className="h-px flex-1 bg-primary-500/50" />
          </div>

          {/* Tagline — Playfair Display itálica */}
          <p className="font-serif text-lg md:text-xl italic text-earth-200 leading-relaxed mb-10">
            "Donde el valor y la habilidad se encuentran en la arena"
          </p>

          {/* CTAs */}
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/register"
              className="px-9 py-4 bg-primary-500 hover:bg-primary-400 font-sans font-bold uppercase tracking-widest text-sm transition shadow-xl border-2 border-primary-400"
            >
              Comenzar ahora →
            </Link>
            <a
              href="#galeria"
              className="px-9 py-4 border-2 border-white/35 hover:border-primary-400 hover:text-primary-300 font-sans font-bold uppercase tracking-widest text-sm transition"
            >
              Ver galería
            </a>
          </div>

          {/* Pie del hero */}
          <div className="flex items-center gap-4 justify-center mt-16 opacity-35">
            <div className="h-px flex-1 max-w-16 bg-white" />
            <span className="font-sans text-white text-[10px] tracking-[0.35em] uppercase">Escuela de Equitación</span>
            <div className="h-px flex-1 max-w-16 bg-white" />
          </div>
        </div>

        {/* Animación vaquero */}
        <HeroAnimation />

        {/* Degradado inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-earth-900 to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════ SERVICIOS ══════════════════ */}
      <section className="py-24 px-6 bg-earth-900">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-16">
            <span className="font-sans text-primary-500 text-[10px] tracking-[0.4em] uppercase block mb-4">
              Lo que ofrecemos
            </span>
            <h2 className="font-western text-4xl md:text-5xl text-white mb-5">La Escuela</h2>
            <Rule className="max-w-xs mx-auto" />
          </div>

          <div className="grid md:grid-cols-2 gap-x-16 gap-y-0">
            {servicios.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-6 items-start border-b border-earth-800 py-9">
                <div className="flex-shrink-0 w-11 h-11 rounded-full border border-primary-600/70 flex items-center justify-center mt-0.5">
                  <Icon size={18} className="text-primary-400" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white mb-2 tracking-wide">{title}</h3>
                  <p className="font-serif text-earth-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════ GALERÍA ══════════════════ */}
      <section id="galeria" className="pb-24 px-6 scroll-mt-20 bg-earth-900">

        <div className="text-center mb-14">
          <Rule className="max-w-xs mx-auto mb-8" />
          <span className="font-sans text-primary-500 text-[10px] tracking-[0.4em] uppercase block mb-4">
            Nuestra escuela
          </span>
          <h2 className="font-western text-4xl md:text-5xl text-white">La Arena</h2>
        </div>

        {/* Desktop — acordeón */}
        <div
          className="hidden md:flex gap-1 h-[500px] overflow-hidden shadow-2xl max-w-6xl mx-auto"
          onMouseLeave={() => setActive(2)}
        >
          {fotos.map((f, i) => (
            <div
              key={i}
              className="relative overflow-hidden cursor-pointer"
              style={{
                flex: active === i ? '5 1 0' : '0.55 1 0',
                transition: 'flex 0.6s cubic-bezier(0.4,0,0.2,1)',
              }}
              onMouseEnter={() => setActive(i)}
              onClick={() => setLightbox(f)}
            >
              <img
                src={f.src} alt={f.alt}
                className="w-full h-full object-cover"
                style={{
                  transform: active === i ? 'scale(1.03)' : 'scale(1.12)',
                  transition: 'transform 0.6s ease',
                }}
              />
              <div
                className="absolute inset-0 bg-earth-900/60"
                style={{ opacity: active === i ? 0 : 1, transition: 'opacity 0.4s ease' }}
              />
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ opacity: active === i ? 0 : 1, transition: 'opacity 0.3s ease' }}
              >
                <span
                  className="font-serif text-white font-bold text-xs uppercase tracking-widest bg-earth-900/70 px-2 py-3"
                  style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                >
                  {f.label}
                </span>
              </div>
              <div
                className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-earth-900 via-earth-900/40 to-transparent"
                style={{ opacity: active === i ? 1 : 0, transition: 'opacity 0.4s ease', pointerEvents: 'none' }}
              >
                <p className="font-sans text-primary-400 text-xs font-bold uppercase tracking-widest mb-1">Nuestra escuela</p>
                <p className="font-serif text-white font-bold text-xl">{f.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile — grid */}
        <div className="md:hidden grid grid-cols-2 gap-2">
          {fotos.map((f, i) => (
            <button
              key={i}
              onClick={() => setLightbox(f)}
              className="relative overflow-hidden aspect-square group"
            >
              <img src={f.src} alt={f.alt} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-earth-900/40 group-hover:bg-earth-900/0 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-earth-900/80 to-transparent">
                <p className="font-serif text-white text-xs font-bold">{f.label}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════ UBICACIÓN ══════════════════ */}
      <section id="ubicacion" className="py-24 px-6 bg-earth-800 scroll-mt-20">
        <div className="max-w-5xl mx-auto">

          <div className="text-center mb-14">
            <Rule className="max-w-xs mx-auto mb-8" />
            <span className="font-sans text-primary-500 text-[10px] tracking-[0.4em] uppercase block mb-4">
              Encuéntranos
            </span>
            <h2 className="font-western text-4xl md:text-5xl text-white">El Rancho</h2>
          </div>

          <div className="overflow-hidden border border-earth-700 shadow-2xl">
            <div className="w-full h-72 md:h-96">
              <iframe
                title="Ubicación Escuela JINETES"
                src="https://maps.google.com/maps?q=4.8052421,-75.8211887&z=15&output=embed"
                width="100%" height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale-[25%] contrast-[1.05]"
              />
            </div>
            <div className="p-8 bg-earth-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <span className="text-primary-500 text-xl mt-0.5 leading-none">◆</span>
                <div>
                  <p className="font-serif font-bold text-lg text-white leading-snug">Escuela de Equitación JINETES</p>
                  <p className="font-sans text-earth-300 text-sm font-semibold mt-1">Pereira, Risaralda</p>
                  <p className="font-sans text-earth-500 text-sm">Vía Cerritos — Al lado de La Finca de Rigo</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/TSLPE8Pz9w63ZRyN9"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 font-sans font-bold uppercase tracking-widest text-sm transition shadow-lg border-2 border-primary-400 whitespace-nowrap shrink-0"
              >
                <MapPin size={16} />
                ¿Cómo llegar?
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════ CTA FINAL ══════════════════ */}
      <section className="relative py-28 px-6 overflow-hidden text-center bg-earth-900">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-15"
          style={{ backgroundImage: "url('/img/foto3.jpeg')" }}
        />
        <div className="relative z-10 max-w-2xl mx-auto">
          <Rule className="max-w-xs mx-auto mb-12" />
          <h2 className="font-western text-5xl md:text-6xl text-white mb-5 drop-shadow-lg leading-tight">
            ¿Listo Para<br />Montar?
          </h2>
          <p className="font-serif text-earth-300 italic text-lg md:text-xl mb-12 leading-relaxed">
            Únete a la familia JINETES y vive la pasión por la equitación.
          </p>
          <Link
            to="/register"
            className="inline-block px-12 py-4 bg-primary-500 hover:bg-primary-400 font-sans font-bold uppercase tracking-widest text-sm transition shadow-xl border-2 border-primary-400"
          >
            Inscríbete gratis →
          </Link>
          <Rule className="max-w-xs mx-auto mt-12" />
        </div>
      </section>

      {/* ══════════════════ LIGHTBOX ══════════════════ */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/92 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img
            src={lightbox.src} alt={lightbox.alt}
            className="max-h-[90vh] max-w-[90vw] shadow-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-4 right-4 font-sans text-white text-3xl font-bold hover:text-primary-300 transition"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
