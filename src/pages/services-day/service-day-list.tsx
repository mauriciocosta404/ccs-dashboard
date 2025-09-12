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

interface ServiceDay {
  id: string;
  name: string;
  weekday: number;
  description?: string;
  time: string;
  createdAt: string;
  updatedAt: string;
}

const WEEKDAYS = [
  "Domingo",
  "Segunda-feira", 
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

export default function ServiceDayList() {
  const [serviceDays, setServiceDays] = useState<ServiceDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServiceDays = async () => {
      try {
        const response = await httpClient.get<ServiceDay[]>("/service-days");
        console.log(response);
        setServiceDays(response.data);
      } catch (error) {
        console.error("Erro ao buscar dias de culto:", error);
        toast.error("Erro ao carregar dias de culto");
      } finally {
        setLoading(false);
      }
    };

    fetchServiceDays();
  }, []);

  const formatTime = (timeString: string) => {
    // Se já estiver no formato correto, retorna como está
    if (timeString && timeString.includes(':')) {
      return timeString;
    }
    
    // Caso contrário, tenta formatar
    try {
      const date = new Date(`2000-01-01T${timeString}`);
      return date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      });
    } catch {
      return timeString;
    }
  };

  const getWeekdayName = (weekday: number) => {
    return WEEKDAYS[weekday] || "Dia inválido";
  };

  const truncateDescription = (description?: string, maxLength: number = 50) => {
    if (!description) return "Sem descrição";
    if (description.length <= maxLength) return description;
    return `${description.substring(0, maxLength)}...`;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este dia de culto?")) {
      return;
    }

    try {
      await httpClient.delete(`/service-days/${id}`);
      setServiceDays(prev => prev.filter(item => item.id !== id));
      toast.success("Dia de culto excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir dia de culto:", error);
      toast.error("Erro ao excluir dia de culto");
    }
  };

  const handleEdit = (serviceDay: ServiceDay) => {
    // Aqui você pode implementar a navegação para a tela de edição
    // ou abrir um modal de edição
    console.log("Editando dia de culto:", serviceDay);
    toast.info("Funcionalidade de edição será implementada em breve");
  };

  return (
    <ComponentCard title="Dias de Culto">
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[700px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Nome
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Dia da Semana
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Horário
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Descrição
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
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={150} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={120} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={80} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={180} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={60} height={20} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : serviceDays.length === 0 ? (
                  // ❌ Nenhum dia de culto
                  <TableRow>
                    <TableCell className="px-5 py-8 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-2 w-full">
                        <span className="text-4xl">📅</span>
                        <p className="font-medium">Nenhum dia de culto cadastrado</p>
                        <p className="text-sm">Adicione o primeiro dia de culto para começar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // ✅ Dados reais
                  serviceDays
                    .sort((a, b) => a.weekday - b.weekday) // Ordenar por dia da semana
                    .map((serviceDay) => (
                    <TableRow key={serviceDay.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                        {serviceDay.name}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                          {getWeekdayName(serviceDay.weekday)}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-mono bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                          {formatTime(serviceDay.time)}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {truncateDescription(serviceDay.description)}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex gap-2">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            onClick={() => handleEdit(serviceDay)}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={() => handleDelete(serviceDay.id)}
                            title="Excluir"
                          >
                            <Trash size={16} />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
        
        {!loading && serviceDays.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Total: {serviceDays.length} dia{serviceDays.length !== 1 ? 's' : ''} de culto cadastrado{serviceDays.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}