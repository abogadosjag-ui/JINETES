export default function WhatsAppButton() {
  const phone = '573207173324';
  const message = encodeURIComponent('¡Hola! Me interesa la Escuela de Equitación. ¿Me pueden dar más información?');

  return (
    <a
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
    >
      {/* Etiqueta que aparece al hacer hover */}
      <span className="hidden group-hover:block text-sm font-semibold pl-4 pr-1 whitespace-nowrap">
        ¡Escríbenos!
      </span>

      {/* Ícono WhatsApp SVG oficial */}
      <div className="w-14 h-14 flex items-center justify-center shrink-0">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="white" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 2.667C8.64 2.667 2.667 8.64 2.667 16c0 2.347.64 4.64 1.853 6.64L2.667 29.333l6.88-1.8A13.267 13.267 0 0016.004 29.333C23.36 29.333 29.333 23.36 29.333 16S23.36 2.667 16.004 2.667zm0 24a11.04 11.04 0 01-5.6-1.52l-.4-.24-4.08 1.067 1.093-3.973-.267-.413A10.987 10.987 0 015.001 16c0-6.08 4.947-11.013 11.003-11.013S27.003 9.92 27.003 16 22.057 26.667 16.004 26.667zm6.04-8.24c-.333-.16-1.96-.96-2.267-1.067-.306-.107-.52-.16-.733.16-.214.32-.827 1.067-1.014 1.28-.186.214-.373.24-.693.08-.32-.16-1.347-.493-2.56-1.573-.947-.84-1.587-1.88-1.773-2.2-.187-.32-.02-.493.14-.653.147-.147.32-.373.48-.56.16-.187.213-.32.32-.534.107-.213.054-.4-.027-.56-.08-.16-.72-1.747-.987-2.387-.253-.613-.52-.52-.72-.533-.186-.013-.4-.013-.613-.013s-.56.08-.853.4c-.294.32-1.12 1.093-1.12 2.667s1.147 3.093 1.307 3.307c.16.213 2.24 3.413 5.427 4.787.76.32 1.347.52 1.813.667.76.24 1.453.2 2 .12.613-.093 1.893-.773 2.16-1.52.267-.747.267-1.387.187-1.52-.08-.133-.293-.213-.613-.373z"/>
        </svg>
      </div>
    </a>
  );
}
