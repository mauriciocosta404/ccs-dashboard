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
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import TextArea from "../../components/form/input/TextArea";
import Button from "../../components/ui/button/Button";

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
  const { isOpen, openModal, closeModal } = useModal();
  const [editingService, setEditingService] = useState<ServiceDay | null>(null);
  const [formData, setFormData] = useState<Partial<ServiceDay>>({});
  const [saving, setSaving] = useState(false);

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

  // Função para formatar horário para o input time (HH:mm)
  const formatTimeForInput = (time: string): string => {
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
    } catch (error) {
      console.error('Erro ao formatar horário:', error);
      return time;
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
    setEditingService(serviceDay);
    setFormData({
      name: serviceDay.name,
      weekday: serviceDay.weekday,
      time: formatTimeForInput(serviceDay.time),
      description: serviceDay.description || '',
    });
    openModal();
  };

  // Função para salvar edição
  const handleSave = async () => {
    if (!editingService) return;

    if (!formData.name || !formData.time) {
      toast.error("Por favor, preencha o nome e o horário do culto.");
      return;
    }

    // Validar formato do horário (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.time as string)) {
      toast.error("Por favor, insira um horário válido no formato HH:mm (ex: 19:30).");
      return;
    }

    setSaving(true);

    try {
      await httpClient.put(`/service-days/${editingService.id}`, {
        name: formData.name,
        weekday: formData.weekday,
        time: formData.time,
        description: formData.description || null,
      });

      toast.success("Culto atualizado com sucesso!");
      closeModal();
      setEditingService(null);
      setFormData({});
      // Recarregar a lista
      const response = await httpClient.get<ServiceDay[]>("/service-days");
      setServiceDays(response.data);
    } catch (error: any) {
      console.error("Erro ao atualizar culto:", error);
      toast.error(error?.response?.data?.message || "Erro ao atualizar culto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

  // Função para fechar modal
  const handleCloseModal = () => {
    if (!saving) {
      closeModal();
      setEditingService(null);
      setFormData({});
    }
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

      {/* Modal de Edição */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} className="max-w-[600px] m-4">
        <div className="no-scrollbar relative w-full max-w-[600px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Culto
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Atualize as informações do culto.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="edit-name">Nome do Culto</Label>
                  <Input
                    type="text"
                    id="edit-name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Culto de Domingo, Reunião de Oração..."
                  />
                </div>

                <div>
                  <Label htmlFor="edit-weekday">Dia da Semana</Label>
                  <select
                    id="edit-weekday"
                    value={formData.weekday ?? 0}
                    onChange={(e) => setFormData({ ...formData, weekday: parseInt(e.target.value) })}
                    className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                  >
                    <option value={0}>Domingo</option>
                    <option value={1}>Segunda-feira</option>
                    <option value={2}>Terça-feira</option>
                    <option value={3}>Quarta-feira</option>
                    <option value={4}>Quinta-feira</option>
                    <option value={5}>Sexta-feira</option>
                    <option value={6}>Sábado</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="edit-time">Horário</Label>
                  <Input
                    type="time"
                    id="edit-time"
                    value={formData.time || ''}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Descrição (Opcional)</Label>
                  <TextArea
                    rows={4}
                    value={formData.description || ''}
                    onChange={(value: string) => setFormData({ ...formData, description: value })}
                    placeholder="Ex: Culto com louvor, pregação da palavra e oração..."
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={handleCloseModal} disabled={saving}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={saving}>
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </ComponentCard>
  );
}