

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
            O Pastor Manuel Panzo é o Vice-Presidente da Adonai Igreja Evangélica Pentecostal
Internacional, onde tem servido com zelo, integridade e dedicação há nove anos. Natural do
município do Cazenga, província de Luanda – Angola, rendeu sua vida a Cristo aos 8 anos
de idade e foi ordenado ao ministério pastoral no ano de 2016.
            </p>
            <p className="text-md text-gray-600 mb-6 text-justify">
            É casado com a Diaconisa Teresa Panzo, sua companheira de ministério, com quem tem dois
            filhos. Juntos, lideram a Catedral Cenáculo da Salvação, onde têm sido instrumentos de Deus
            para edificação de vidas e na expansão do Reino de Deus.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutPastor;