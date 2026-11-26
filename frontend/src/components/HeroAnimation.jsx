import { useRef, useState, useCallback } from 'react';

export default function HeroAnimation() {
  const videoRef    = useRef(null);
  const containerRef = useRef(null);
  const [offset,   setOffset]   = useState({ x: 0, y: 0 });
  const [glowPos,  setGlowPos]  = useState({ x: 50, y: 50 });
  const [hovered,  setHovered]  = useState(false);

  const handleMouseMove = useCallback((e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Parallax: desplazar según posición del cursor en la ventana
    const cx = e.clientX / window.innerWidth - 0.5;   // -0.5 → 0.5
    const cy = e.clientY / window.innerHeight - 0.5;
    setOffset({ x: cx * 28, y: cy * 8 });

    // Posición del brillo dentro del contenedor
    const gx = ((e.clientX - rect.left) / rect.width)  * 100;
    const gy = ((e.clientY - rect.top)  / rect.height) * 100;
    setGlowPos({ x: gx, y: gy });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setHovered(true);
    if (videoRef.current) videoRef.current.playbackRate = 1.9;
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    setOffset({ x: 0, y: 0 });
    if (videoRef.current) videoRef.current.playbackRate = 1;
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute bottom-0 left-0 right-0 select-none"
      style={{ height: '320px', pointerEvents: 'auto', cursor: 'crosshair' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-hidden="true"
    >
      {/* Video con parallax + scale al hover */}
      <video
        ref={videoRef}
        src="/vaquero.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center bottom',
          filter: 'invert(1) sepia(0.3) saturate(1.5)',
          mixBlendMode: 'screen',
          opacity: hovered ? 1 : 0.88,
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${hovered ? 1.05 : 1})`,
          transition: hovered
            ? 'transform 0.08s linear, opacity 0.3s ease'
            : 'transform 0.7s cubic-bezier(0.25,1,0.5,1), opacity 0.4s ease',
          willChange: 'transform',
        }}
      />

      {/* Brillo dorado que sigue el cursor */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle 130px at ${glowPos.x}% ${glowPos.y}%, rgba(212,128,30,0.22) 0%, transparent 70%)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      {/* Texto flotante al hover */}
      <div
        style={{
          position: 'absolute',
          bottom: '8px',
          left: '50%',
          transform: `translateX(-50%) translateY(${hovered ? 0 : 10}px)`,
          opacity: hovered ? 0.75 : 0,
          transition: 'opacity 0.35s ease, transform 0.35s ease',
          pointerEvents: 'none',
          whiteSpace: 'nowrap',
        }}
        className="font-sans text-primary-300 text-[10px] tracking-[0.4em] uppercase"
      >
        ¡A todo galope!
      </div>
    </div>
  );
}
