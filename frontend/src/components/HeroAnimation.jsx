export default function HeroAnimation() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
      style={{
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 18%, black 78%, transparent 100%)',
      }}
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
          maxHeight: '300px',
          objectFit: 'cover',
          objectPosition: 'center 55%',
          mixBlendMode: 'multiply',
          opacity: 0.88,
        }}
      />
    </div>
  );
}
