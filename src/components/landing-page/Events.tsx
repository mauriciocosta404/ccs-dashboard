import { useState, useEffect } from 'react';
import { Calendar, Loader } from 'lucide-react';
import httpClient from '../../api/httpClient';

// Interfaces
interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim?: string;
  flyerUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API para buscar eventos

const Events = () => {
  const [events, setEvents] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para formatar o intervalo de datas
  const formatDateRange = (dataInicio: string, dataFim?: string): string => {
    try {
      const inicio = new Date(dataInicio);
      const fim = dataFim ? new Date(dataFim) : null;
      
      // Se for o mesmo dia
      if (fim && inicio.toDateString() === fim.toDateString()) {
        return inicio.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        });
      }
      
      // Se for um evento de um dia só
      if (!fim) {
        return inicio.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'short'
        });
      }
      
      // Se for um intervalo de dias
      const inicioStr = inicio.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
      
      const fimStr = fim.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
      
      return `${inicioStr} - ${fimStr}`;
    } catch (error) {
      console.error('Erro ao formatar data:', error);
      return dataInicio;
    }
  };

  // Função para obter imagem padrão se não houver flyer
  const getEventImage = (flyerUrl?: string): string => {
    if (flyerUrl) return flyerUrl;
    
    // Imagens padrão para eventos (mantendo as originais como fallback)
    const defaultImages = [
      '/assets/mpzola.jpg',
      '/assets/evento1.jpg',
      '/assets/evento2.jpg',
      '/assets/evento3.jpg',
      '/assets/evento4.jpg',
      '/assets/evento5.jpg'
    ];
    
    return defaultImages[Math.floor(Math.random() * defaultImages.length)];
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await httpClient.get<Evento[]>("/events");
      const data = response.data;
      setEvents(data);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar eventos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section id="events" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Próximos Eventos
            </h2>
              <div className="text-center py-12">
            <Loader className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-lg text-gray-500">Carregando eventos...</p>
          </div>
          </div>
        </div>
      </section>
    );
  }

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

        {events.length === 0 ? (
          console.log(events),
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Nenhum evento programado
            </h3>
            <p className="text-gray-500">
              Em breve teremos novas atividades. Fique atento!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {events.map((event) => (
              <div key={event.id} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                <img
                  src={getEventImage(event.flyerUrl)}
                  alt={event.titulo}
                  className="w-full h-48 object-cover object-top"
                />
                <div className="p-6">
                  <div className="flex items-center text-indigo-600 mb-2">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{formatDateRange(event.dataInicio, event.dataFim)}</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-900 mb-2">
                    {event.titulo}
                  </h3>
                  <p className="text-gray-600 text-xs">
                    {event.descricao}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;