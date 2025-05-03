

const AboutPastor = () => {
  return (
    <section id="pastor" className="px-4 py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <img
              src="/assets/mpzola2.jpg"
              alt="Pastor"
              className="rounded-lg shadow-xl w-full h-[23rem] object-cover"
            />
            <div className="absolute inset-0 bg-indigo-600 opacity-10 rounded-lg"></div>
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Pastor Manuel Panzo
            </h2>
            <p className="text-md text-gray-600 mb-6 text-justify">
              Com mais de 20 anos de dedicação ao ministério, o Pastor Manuel Panzo tem guiado nossa
              congregação com sabedoria, compaixão e um profundo compromisso com os ensinamentos
              de Cristo.
            </p>
            <p className="text-md text-gray-600 mb-6 text-justify">
              Formado em Teologia pela Universidade Teológica, ele combina conhecimento bíblico
              com uma abordagem moderna e acolhedora.
            </p>
            <div className="text-md text-gray-600 text-justify">
              "Nossa missão é criar um ambiente onde todos possam experimentar o amor de Deus
              e crescer em sua jornada espiritual."
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPastor;