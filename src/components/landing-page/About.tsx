import React from 'react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Nossa História
            </h2>
            <p className="text-md text-gray-600 mb-6 text-justify">
              Fundada em 1990, a Igreja da Paz tem sido um farol de esperança em nossa
              comunidade. Nossa jornada começou com um pequeno grupo de fiéis e cresceu
              para se tornar uma família vibrante de crentes.
            </p>
            <p className="text-md text-gray-600 mb-6 text-justify">
              Nossos valores fundamentais são baseados no amor, na compaixão e no serviço
              ao próximo. Acreditamos que cada pessoa é única e especial aos olhos de Deus.
            </p>
            <p className="text-md text-gray-600 text-justify">
              Hoje, continuamos comprometidos com nossa missão de espalhar a mensagem de
              Cristo e fazer a diferença em nossa comunidade através de diversos ministérios
              e programas sociais.
            </p>
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/eESzBJElCx4"
                  title="Igreja da Paz - Nossa História"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-indigo-600 rounded-full opacity-10"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-indigo-600 rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;