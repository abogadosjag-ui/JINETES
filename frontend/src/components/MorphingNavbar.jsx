import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { label: 'Galería',   href: '#galeria' },
  { label: 'Ubicación', href: '#ubicacion' },
];

const STYLES = `
.msn-progress{position:fixed;z-index:101;top:0;right:0;left:0;height:3px;background:linear-gradient(90deg,#d4801e,#e9b876);transform:scaleX(0);transform-origin:0 50%;will-change:transform;transition:transform .1s linear}
.msn-nav{--paper:#422f20;--surface:#4f3a26;--ink:#f8f5f0;--muted:#c0a682;--line:#62482d;--accent:#d4801e;position:fixed;z-index:100;top:0;right:0;left:0;display:flex;justify-content:center;padding:0 20px;pointer-events:none;font-family:Nunito,ui-sans-serif,system-ui,sans-serif;color:var(--ink)}
.msn-nav *{box-sizing:border-box}
.msn-nav a{color:inherit;text-decoration:none}
.msn-shell{pointer-events:auto;display:flex;align-items:center;justify-content:space-between;gap:22px;width:100%;max-width:1180px;height:68px;margin-top:0;padding:0 12px 0 22px;border:1px solid transparent;border-radius:20px;background:transparent;transition:max-width .5s cubic-bezier(.34,1.32,.5,1),height .38s cubic-bezier(.34,1.2,.5,1),margin-top .38s ease,padding .38s ease,background-color .3s ease,border-color .3s ease,box-shadow .4s ease}
.msn-nav.is-floating .msn-shell{max-width:960px;height:58px;margin-top:12px;padding:0 10px 0 20px;border-color:rgba(98,72,45,0.6);background:rgba(66,47,32,0.92);-webkit-backdrop-filter:saturate(140%) blur(20px);backdrop-filter:saturate(140%) blur(20px);box-shadow:0 1px 0 rgba(248,245,240,0.06) inset,0 16px 44px -18px rgba(0,0,0,0.85)}
.msn-nav.is-compact .msn-shell{max-width:520px;height:52px}
.msn-brand{flex:none;display:flex;align-items:center;transition:transform .18s ease}
.msn-brand img{height:40px;width:auto;filter:brightness(0) invert(1);transition:height .38s cubic-bezier(.34,1.2,.5,1)}
.msn-brand:hover{transform:translateY(-1px)}
.msn-nav.is-compact .msn-brand img{height:34px}
.msn-links{display:flex;gap:28px;overflow:hidden;max-width:300px;opacity:1;transition:max-width .45s cubic-bezier(.34,1.2,.5,1),opacity .28s ease,transform .3s ease,gap .35s ease}
.msn-nav.is-compact .msn-links{max-width:0;gap:0;opacity:0;transform:translateY(-8px);pointer-events:none}
.msn-links a{position:relative;color:var(--muted);font-size:14px;font-weight:600;white-space:nowrap;transition:color .15s ease}
.msn-links a:after{content:"";position:absolute;right:0;bottom:-5px;left:0;height:2px;border-radius:2px;background:var(--accent);transform:scaleX(0);transform-origin:0 50%;transition:transform .28s cubic-bezier(.2,.7,.2,1)}
.msn-links a:hover{color:var(--ink)}
.msn-links a:hover:after{transform:scaleX(1)}
.msn-actions{display:flex;flex:none;align-items:center;gap:8px}
.msn-btn{display:inline-flex;align-items:center;justify-content:center;height:40px;padding:0 16px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink);font-size:13.5px;font-weight:700;white-space:nowrap;text-decoration:none;cursor:pointer;transition:height .38s ease,padding .38s ease,background-color .18s ease,transform .18s ease,box-shadow .22s ease}
.msn-btn:hover{background:rgba(80,60,40,0.9);transform:translateY(-2px);box-shadow:0 8px 20px -14px rgba(0,0,0,0.9)}
.msn-btn:active{transform:translateY(0) scale(.97)}
.msn-btn-cta{background:var(--accent);border-color:var(--accent);color:#fff}
.msn-btn-cta:hover{background:#b86415;transform:translateY(-2px)}
.msn-nav.is-compact .msn-btn{height:36px;padding:0 13px;font-size:12.5px}
@media(max-width:900px){.msn-links{display:none}}
@media(max-width:560px){.msn-nav{padding:0 12px}.msn-shell,.msn-nav.is-floating .msn-shell,.msn-nav.is-compact .msn-shell{gap:10px;height:60px;padding:0 8px 0 12px}.msn-actions{gap:6px}.msn-btn{height:36px;padding:0 11px;font-size:12.5px}}
@media(prefers-reduced-motion:reduce){.msn-nav *,.msn-shell,.msn-progress{transition-duration:.01ms!important}}
`;

export default function MorphingNavbar() {
  const [atTop, setAtTop] = useState(true);
  const [direction, setDirection] = useState('up');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      const y = window.scrollY;
      const delta = y - lastY;
      setAtTop(y < 8);
      if (delta > 4) setDirection('down');
      else if (delta < -4) setDirection('up');
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, y / max)) : 0);
      lastY = y;
      frame = 0;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  const floating = !atTop;
  const compact = floating && direction === 'down';

  return (
    <>
      <style>{STYLES}</style>
      <div
        className="msn-progress"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <nav
        className={`msn-nav${floating ? ' is-floating' : ''}${compact ? ' is-compact' : ''}`}
        aria-label="Navegación principal"
      >
        <div className="msn-shell">
          <a className="msn-brand" href="#top" aria-label="Ir al inicio">
            <img src="/logo.png" alt="JINETES" />
          </a>
          <div className="msn-links">
            {NAV_LINKS.map(link => (
              <a href={link.href} key={link.href}>{link.label}</a>
            ))}
          </div>
          <div className="msn-actions">
            <Link to="/login" className="msn-btn">Iniciar sesión</Link>
            <Link to="/register" className="msn-btn msn-btn-cta">Inscribirse</Link>
          </div>
        </div>
      </nav>
    </>
  );
}
