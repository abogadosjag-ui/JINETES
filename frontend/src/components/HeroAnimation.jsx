/* Animación del vaquero — usa el video generado con IA */
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
        className="w-full object-cover object-bottom"
        style={{ maxHeight: '320px', mixBlendMode: 'multiply' }}
      />
    </div>
  );
}
