import React from 'react';
import { Clock, MapPin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      day: 'Domingo',
      time: '10:00',
      type: 'Culto de Celebração',
    },
    {
      day: 'Quarta',
      time: '19:30',
      type: 'Culto de Oração',
    },
    {
      day: 'Sábado',
      time: '19:00',
      type: 'Culto de Jovens',
    },
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Horários dos Cultos
          </h2>
          <p className="text-lg text-gray-600">
            Venha nos visitar e participe de nossos cultos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {service.day}
              </h3>
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-5 w-5 text-indigo-600 mr-2" />
                <span className="text-lg text-gray-700">{service.time}</span>
              </div>
              <p className="text-gray-600">{service.type}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center text-indigo-600">
            <MapPin className="h-5 w-5 mr-2" />
            <span>Rua Example, 123 - Cidade</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;