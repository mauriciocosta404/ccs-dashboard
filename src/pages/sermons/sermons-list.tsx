import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Skeleton from '@mui/material/Skeleton';
import httpClient from "../../api/httpClient";
import ComponentCard from "../../components/common/ComponentCard";
import { Edit, Trash, ExternalLink, Play } from "lucide-react";
import { toast } from "react-toastify";

interface Sermon {
  id: string;
  name: string;
  description?: string;
  youtubeUrl: string;
  createdAt: string;
  updatedAt: string;
}

export default function SermonList() {
  const [sermons, setSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSermons = async () => {
      try {
        const response = await httpClient.get<Sermon[]>("/sermons");
        setSermons(response.data);
      } catch (error) {
        console.error("Erro ao buscar pregações:", error);
        toast.error("Erro ao carregar pregações");
      } finally {
        setLoading(false);
      }
    };

    fetchSermons();
  }, []);

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
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const truncateDescription = (description?: string, maxLength: number = 60) => {
    if (!description) return "Sem descrição";
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir esta pregação?")) {
      return;
    }

    try {
      await httpClient.delete(`/sermons/${id}`);
      setSermons(prev => prev.filter(item => item.id !== id));
      toast.success("Pregação excluída com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir pregação:", error);
      toast.error("Erro ao excluir pregação");
    }
  };

  const handleEdit = (sermon: Sermon) => {
    // Aqui você pode implementar a navegação para a tela de edição
    console.log("Editando pregação:", sermon);
    toast.info("Funcionalidade de edição será implementada em breve");
  };

  const handleWatchVideo = (youtubeUrl: string) => {
    window.open(youtubeUrl, '_blank');
  };

  return (
    <ComponentCard title="Pregações">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[800px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Thumbnail
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Nome
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Descrição
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Data de Criação
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  // Skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="rectangular" width={80} height={45} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={200} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={250} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={100} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={80} height={20} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : sermons.length === 0 ? (
                  // Estado vazio
                  <TableRow className="w-full">
                    <TableCell className="px-5 py-12 text-center text-gray-500 dark:text-gray-400 w-full">
                      <div className="flex flex-col items-center gap-3 w-full">
                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
                          <Play className="w-8 h-8 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">Nenhuma pregação cadastrada</p>
                          <p className="text-sm mt-1">Adicione a primeira pregação para começar</p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Dados reais
                  sermons
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .map((sermon) => {
                      const thumbnail = getYouTubeThumbnail(sermon.youtubeUrl);
                      return (
                        <TableRow key={sermon.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                          <TableCell className="px-5 py-4">
                            <div className="relative w-20 h-11 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                              {thumbnail ? (
                                <img 
                                  src={thumbnail} 
                                  alt={sermon.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Play className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                   onClick={() => handleWatchVideo(sermon.youtubeUrl)}>
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div>
                              <p className="font-medium text-gray-800 dark:text-white">
                                {sermon.name}
                              </p>
                              <button
                                onClick={() => handleWatchVideo(sermon.youtubeUrl)}
                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 mt-1"
                              >
                                <ExternalLink className="w-3 h-3" />
                                Assistir no YouTube
                              </button>
                            </div>
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                            {truncateDescription(sermon.description)}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                            {formatDate(sermon.createdAt)}
                          </TableCell>
                          <TableCell className="px-5 py-4 text-start">
                            <div className="flex gap-2">
                              <button 
                                className="text-green-600 hover:text-green-800 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                                onClick={() => handleWatchVideo(sermon.youtubeUrl)}
                                title="Assistir"
                              >
                                <Play size={16} />
                              </button>
                              <button 
                                className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                                onClick={() => handleEdit(sermon)}
                                title="Editar"
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                onClick={() => handleDelete(sermon.id)}
                                title="Excluir"
                              >
                                <Trash size={16} />
                              </button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {!loading && sermons.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {sermons.length} pregaç{sermons.length !== 1 ? 'ões' : 'ão'} cadastrada{sermons.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}