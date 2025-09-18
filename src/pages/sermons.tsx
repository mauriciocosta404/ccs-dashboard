import { useEffect, useState } from "react";
import { Search, Play, Calendar, Loader, ExternalLink, Volume2 } from "lucide-react";
import httpClient from "../api/httpClient";

// Interfaces
interface Sermon {
  id: string;
  name: string;
  description: string | null;
  youtubeUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API para buscar pregações
const sermonsApi = {
  getAllSermons: async (): Promise<Sermon[]> => {
    try {
        const response = await httpClient.get<Sermon[]>("/sermons");
        const data = response.data;
        console.log('Pregaçõess fetched:', data);
        return data;

    } catch (error) {
      console.error("Erro ao buscar pregações:", error);
      throw error;
    }
  }
};

export function Sermons() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [filteredSermons, setFilteredSermons] = useState<Sermon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Função para extrair ID do vídeo do YouTube
  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  // Função para obter thumbnail do YouTube
  const getYouTubeThumbnail = (url: string): string | null => {
    const videoId = extractYouTubeId(url);
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  // Função para formatar data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  // Função para truncar texto
  const truncateText = (text: string | null, maxLength: number = 100): string => {
    if (!text) return "Sem descrição disponível";
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  // Carregar pregações
  const loadSermons = async () => {
    setLoading(true);
    try {
      const data = await sermonsApi.getAllSermons();

      console.log('Pregaçõess fetched:', data);

      // Filtra apenas pregações ativas
      const activeSermons = data.filter(sermon => sermon.isActive);
      setSermons(activeSermons);
      setFilteredSermons(activeSermons);
    } catch (error) {
      console.error('Erro ao carregar pregações:', error);
      // Define arrays vazios em caso de erro
      setSermons([]);
      setFilteredSermons([]);
    }
    setLoading(false);
  };

  // Filtrar pregações
  const filterSermons = (term: string) => {
    const filtered = sermons.filter(sermon => 
      sermon.name.toLowerCase().includes(term.toLowerCase()) ||
      (sermon.description && sermon.description.toLowerCase().includes(term.toLowerCase()))
    );
    setFilteredSermons(filtered);
  };

  // Abrir vídeo no YouTube
  const openYouTubeVideo = (url: string) => {
    window.open(url, '_blank');
  };

  // Effects
  useEffect(() => {
    loadSermons();
  }, []);

  useEffect(() => {
    filterSermons(searchTerm);
  }, [searchTerm, sermons]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Volume2 className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Pregações</h1>
          </div>
          <p className="text-lg text-gray-600">
            Assista às mensagens transformadoras da nossa igreja
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar pregações por título ou descrição..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent text-lg"
            />
          </div>
          {searchTerm && (
            <p className="mt-3 text-sm text-gray-500">
              {filteredSermons.length} pregação{filteredSermons.length !== 1 ? 'ões' : ''} encontrada{filteredSermons.length !== 1 ? 's' : ''} para "{searchTerm}"
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />
            <p className="text-lg text-gray-500">Carregando pregações...</p>
          </div>
        ) : filteredSermons.length === 0 ? (
          <div className="text-center py-12">
            {searchTerm ? (
              <>
                <Search className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma pregação encontrada
                </h3>
                <p className="text-gray-500 mb-4">
                  Não encontramos pregações que correspondam à sua busca por "{searchTerm}"
                </p>
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Ver todas as pregações
                </button>
              </>
            ) : (
              <>
                <Volume2 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  Nenhuma pregação disponível
                </h3>
                <p className="text-gray-500">
                  As pregações serão exibidas aqui quando estiverem disponíveis.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredSermons
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((sermon) => {
                const thumbnail = getYouTubeThumbnail(sermon.youtubeUrl);
                return (
                  <div
                    key={sermon.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gray-900">
                      {thumbnail ? (
                        <img
                          src={thumbnail}
                          alt={sermon.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="h-16 w-16 text-gray-400" />
                        </div>
                      )}
                      {/* Play overlay */}
                      <div
                        onClick={() => openYouTubeVideo(sermon.youtubeUrl)}
                        className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer group"
                      >
                        <div className="bg-white/20 rounded-full p-4 group-hover:bg-white/30 transition-colors">
                          <Play className="h-8 w-8 text-white fill-white" />
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {sermon.name}
                      </h3>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {truncateText(sermon.description)}
                      </p>

                      {/* Date */}
                      <div className="flex items-center text-sm text-gray-500 mb-4">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(sermon.createdAt)}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => openYouTubeVideo(sermon.youtubeUrl)}
                          className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play className="h-4 w-4" />
                          <span>Assistir</span>
                        </button>
                        <button
                          onClick={() => openYouTubeVideo(sermon.youtubeUrl)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center"
                          title="Abrir no YouTube"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* Footer Stats */}
        {!loading && filteredSermons.length > 0 && (
          <div className="text-center mt-8 py-4 bg-white rounded-lg shadow-lg">
            <p className="text-gray-600">
              {searchTerm ? 'Exibindo' : 'Total de'} {filteredSermons.length} pregação{filteredSermons.length !== 1 ? 'ões' : ''}
              {searchTerm && sermons.length !== filteredSermons.length && (
                <span className="ml-2 text-sm">
                  (de {sermons.length} total)
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}