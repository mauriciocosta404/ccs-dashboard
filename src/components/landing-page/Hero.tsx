import { useState, useEffect } from 'react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Array com as imagens do carrousel
  const slides = [
    {
      image: '/assets/banner1.jpg',
      title: 'Bem-vindo à Igreja Adonai Cenáculo da Salvação',
      subtitle: 'A olaria de Deus'
    },
    {
      image: '/assets/banner2.jpg', // Adicione suas outras imagens
      title: 'Unidos em Oração e Fé',
      subtitle: 'Venha fazer parte da nossa família'
    },
    {
      image: '/assets/banner3.jpg', // Adicione suas outras imagens
      title: 'Palavra que Transforma',
      subtitle: 'Encontre esperança e renovação'
    }
  ];

  // Auto-play do carrousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Muda slide a cada 5 segundos

    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <section className="h-screen relative overflow-hidden">
      <div id="home"></div>
      {/* Slides */}
      <div className="relative h-full overflow-hidden w-full">
        <div 
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ 
            transform: `translateX(-${currentSlide * 100}vw)`,
            width: `${slides.length * 100}vw`
          }}
        >
          {slides.map((slide, index) => (
            <div
              key={index}
              className="h-full flex-shrink-0"
              style={{ width: '100vw' }}
            >
              <div
                className="h-full w-full bg-cover bg-center relative"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                {/* Overlay escuro */}
                <div className="absolute inset-0 bg-black opacity-60"></div>
                
                {/* Conteúdo central */}
                <div className="relative h-full flex items-center justify-center text-center px-4 z-10">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl text-white mb-8 animate-fade-in-delay">
                      {slide.subtitle}
                    </p>
                    <a
                      href="#services"
                      className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-indigo-700 transition duration-300 animate-fade-in-delay-2"
                    >
                      Nossos Cultos
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Botões de navegação */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg backdrop-blur-sm transition duration-300"
        aria-label="Slide anterior"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-lg backdrop-blur-sm transition duration-300"
        aria-label="Próximo slide"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicadores de navegação (dots) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'w-8 bg-white' 
                : 'w-4 bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default Hero;