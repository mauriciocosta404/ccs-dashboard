import React from 'react';
import { Calendar } from 'lucide-react';

const Events = () => {
  const events = [
    {
      title: 'Retiro de Jovens',
      date: '15-17 Abril',
      description: 'Um fim de semana especial de comunhão e renovação espiritual.',
      image: '/assets/mpzola.jpg'
    },
    {
      title: 'Conferência de Família',
      date: '5 Maio',
      description: 'Palestras e workshops sobre relacionamento familiar.',
      image: '/assets/evento1.jpg'
    },
    {
      title: 'Ação Social',
      date: '20 Maio',
      description: 'Dia de serviço à comunidade e distribuição de alimentos.',
      image: '/assets/evento2.jpg'
    },
    {
      title: 'Ação Social',
      date: '20 Maio',
      description: 'Dia de serviço à comunidade e distribuição de alimentos.',
      image: '/assets/evento3.jpg'
    },
    {
      title: 'Ação Social',
      date: '20 Maio',
      description: 'Dia de serviço à comunidade e distribuição de alimentos.',
      image: '/assets/evento4.jpg'
    },
    {
      title: 'Ação Social',
      date: '20 Maio',
      description: 'Dia de serviço à comunidade e distribuição de alimentos.',
      image: '/assets/evento5.jpg'
    }
  ];

  return (
    <section id="events" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Próximos Eventos
          </h2>
          <p className="text-lg text-gray-600">
            Participe de nossas atividades especiais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-indigo-600 mb-2">
                  <Calendar className="h-5 w-5 mr-2" />
                  <span>{event.date}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {event.title}
                </h3>
                <p className="text-gray-600">
                  {event.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Events;