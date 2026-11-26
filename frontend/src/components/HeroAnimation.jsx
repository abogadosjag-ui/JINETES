export default function HeroAnimation() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 pointer-events-none select-none"
      aria-hidden="true"
      style={{ height: '320px' }}
    >
      <video
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
          opacity: 0.88,
        }}
      />
    </div>
  );
}
