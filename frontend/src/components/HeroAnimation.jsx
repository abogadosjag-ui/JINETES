export default function HeroAnimation() {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
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
          maxHeight: '220px',
          objectFit: 'cover',
          objectPosition: 'center bottom',
          mixBlendMode: 'multiply',
          opacity: 0.88,
        }}
      />
    </div>
  );
}
