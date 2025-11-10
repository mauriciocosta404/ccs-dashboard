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
import { Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";

interface Event {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  flyerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ListEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await httpClient.get<Event[]>("/events");
        console.log(response)
        setEvents(response.data);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description?.length <= maxLength) return description;
    return `${description?.substring(0, maxLength)}...`;
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este evento?")) {
      return;
    }
    try {
      await httpClient.delete(`/events/${id}`);
      setEvents(prev => prev.filter(item => item.id !== id));
      toast.success("Evento excluído com sucesso!");
    }
    catch (error) {
      console.error("Erro ao excluir evento:", error);
      toast.error("Erro ao excluir evento");
    }
  };

  return (
    <ComponentCard title="Eventos">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Imagem
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Título
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Descrição
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Data Início
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Data Término
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Ações
                  </TableCell>
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {loading ? (
                  // 🟡 Skeletons
                  Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-5 py-4"><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                      <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                      <TableCell className="px-5 py-4"><Skeleton variant="text" width={180} height={20} /></TableCell>
                      <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                      <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                      <TableCell className="px-5 py-4"><Skeleton variant="text" width={60} height={20} /></TableCell>
                    </TableRow>
                  ))
                ) : events.length === 0 ? (
                  // ❌ Nenhum evento
                  <TableRow>
                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                      Não há eventos cadastrados.
                    </TableCell>
                  </TableRow>
                ) : (
                  // ✅ Dados reais
                  events.map((event) => (
                    <TableRow key={event.id} className="text-sm">
                      <TableCell className="px-5 py-4">
                        {event.flyerUrl ? (
                          <img 
                            src={event.flyerUrl} 
                            alt={event.titulo} 
                            className="w-10 h-10 rounded object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">Sem imagem</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                        {event.titulo}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {truncateDescription(event.descricao)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {formatDate(event.dataFim)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {formatDate(event.dataFim)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start flex gap-2">
                        <button className="text-blue-500 hover:text-blue-700">
                          <Edit size={20} />
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="text-red-500 hover:text-red-700">
                          <Trash size={20} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ComponentCard>
  );
}