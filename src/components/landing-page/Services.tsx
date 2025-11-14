/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Clock, Loader } from "lucide-react";
import httpClient from "../../api/httpClient";

// Interfaces
interface ServiceDay {
  id: string;
  name: string;
  weekday: number;
  description: string | null;
  time: string;
  createdAt: string;
  updatedAt: string;
}

// API para buscar dias de culto
const serviceDaysApi = {
  getAllServiceDays: async (): Promise<ServiceDay[]> => {
    try {
      const response = await httpClient.get<ServiceDay[]>("/service-days");
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao buscar dias de culto:", error);
      throw error;
    }
  }
};

const Services = () => {
  const [services, setServices] = useState<ServiceDay[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para converter número do dia da semana para nome
  const getWeekdayName = (weekday: number): string => {
    const weekdays = [
      'Domingo',    // 0
      'Segunda',    // 1
      'Terça',      // 2
      'Quarta',     // 3
      'Quinta',     // 4
      'Sexta',      // 5
      'Sábado'      // 6
    ];
    return weekdays[weekday] || 'Desconhecido';
  };

  // Função para obter a imagem de fundo baseada no dia da semana
  const getBackgroundImage = (weekday: number): string => {
    const imageMap: Record<number, string> = {
      0: '/assets/cultos/0.jpeg',  // Domingo
      2: '/assets/cultos/2.jpeg',  // Terça
      4: '/assets/cultos/4.jpeg',  // Quinta
      6: '/assets/cultos/6.jpeg',  // Sábado
    };
    return imageMap[weekday] || '';
  };

  // Função para formatar horário
  const formatTime = (time: string): string => {
    try {
      // Se o time já estiver no formato HH:MM, retorna assim
      if (time.includes(':') && time.length <= 5) {
        return time;
      }
      
      // Se for um horário completo (ex: "19:30:00"), extrai apenas HH:MM
      const timeParts = time.split(':');
      if (timeParts.length >= 2) {
        return `${timeParts[0]}:${timeParts[1]}`;
      }
      
      return time;
    } catch (error: any) {
      console.error('Erro ao formatar horário:', error);
      return time;
    }
  };

  // Carregar dias de culto
  const loadServiceDays = async () => {
    setLoading(true);
    try {
      const data = await serviceDaysApi.getAllServiceDays();
      
      // Ordena por dia da semana
      const sortedData = data.sort((a, b) => a.weekday - b.weekday);
      setServices(sortedData);
    } catch (error) {
      console.error('Erro ao carregar dias de culto:', error);
      setServices([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServiceDays();
  }, []);

  if (loading) {
    return (
      <section id="services" className="py-20 bg-gray-50">
          <div className="text-center py-12">
            <Loader className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-lg text-gray-500">Carregando horários dos cultos...</p>
          </div>
      </section>
    );
  }

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

        {services.length === 0 ? (
          <div className="text-center">
            <p className="text-lg text-gray-600">Nenhum culto cadastrado no momento.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const backgroundImage = getBackgroundImage(service.weekday);
                return (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-lg p-8 text-center hover:shadow-xl transition duration-300 relative overflow-hidden"
                    style={{
                      backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  >
                    {/* Overlay escuro para melhorar legibilidade do texto */}
                    {backgroundImage && (
                      <div className="absolute inset-0 bg-black/70 bg-opacity-20 rounded-lg"></div>
                    )}
                    {/* Conteúdo com posição relativa para ficar acima do overlay */}
                    <div className="relative z-10">
                      <h3 className="text-xl font-semibold text-white mb-4">
                        {getWeekdayName(service.weekday)}
                      </h3>
                      <div className="flex items-center justify-center mb-4">
                        <Clock className="h-5 w-5 text-white mr-2" />
                        <span className="text-lg text-white">{formatTime(service.time)}</span>
                      </div>
                      <p className="text-white">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-200 mt-2">{service.description}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Services;