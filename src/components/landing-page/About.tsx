

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
            A Catedral Cenáculo da Salvação foi fundada no dia 12 de Março de 2017, pelo Pastor Carlos
Felício e a Diaconisa Cesaltina Felício, que lideraram a igreja até o ano de 2020. A partir de
Outubro de 2020, o Reverendo Pastor Manuel Panzo assumiu a liderança como Pastor Titular.
Actualmente, a igreja conta com 1 Pastor Titular, 4 Diáconos e mais de 250 membros, incluindo
crianças, adolescentes, jovens, homens e mulheres de diversas idades.
            </p>
           
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-900 rounded-lg shadow-2xl overflow-hidden">
              <div className="relative pb-[56.25%] h-0">
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src="https://www.youtube.com/embed/eESzBJElCx4"
                  title="Igreja Adonai Cenaculo da Salvação- Nossa História"
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