import { useEffect, useState } from "react";
import Badge from "../../components/ui/badge/Badge";
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
import Button from "../../components/ui/button/Button";
import { Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { Movement } from "../../types/Movement";
import MovementModal from "../../components/movement/MovementModal";

export default function MovementList() {
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchMovements = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<Movement[]>("/movements");
      setMovements(response.data);
    } catch (error) {
      console.error("Erro ao buscar movimentos:", error);
      toast.error("Erro ao buscar movimentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovements();
  }, []);

  const handleCreate = () => {
    setSelectedMovement(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (movement: Movement) => {
    setSelectedMovement(movement);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este movimento?")) {
      return;
    }
    try {
      await httpClient.delete(`/movement/${id}`);
      setMovements(prev => prev.filter(item => item.id !== id));
      toast.success("Movimento excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir movimento:", error);
      toast.error("Erro ao excluir movimento");
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "-";
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return "-";
    }
  };

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case "ENTRADA":
        return "success";
      case "SAIDA":
        return "error";
      case "TRANSFERENCIA":
        return "warning";
      case "DOACAO":
        return "info";
      case "BAIXA":
        return "error";
      default:
        return "default";
    }
  };

  const getMovementTypeLabel = (type: string) => {
    switch (type) {
      case "ENTRADA":
        return "Entrada";
      case "SAIDA":
        return "Saída";
      case "TRANSFERENCIA":
        return "Transferência";
      case "DOACAO":
        return "Doação";
      case "BAIXA":
        return "Baixa";
      default:
        return type;
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Movimentos de Patrimônio
        </h2>
        <Button
          size="sm"
          onClick={handleCreate}
        >
          Adicionar Movimento
        </Button>
      </div>
      <ComponentCard title="Lista de Movimentos">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1200px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Data
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Tipo
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Patrimônio
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Nome do Bem
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Origem
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Destino
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Quantidade
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Responsável
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Ações
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {(() => {
                    if (loading) {
                      return Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((key) => (
                        <TableRow key={key}>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={150} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                        </TableRow>
                      ));
                    }
                    if (movements.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={9} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                            Não há movimentos cadastrados.
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return movements.map((movement) => (
                      <TableRow key={movement.id} className="text-sm">
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {formatDate(movement.date)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Badge color={getMovementTypeColor(movement.movementType)}>
                            {getMovementTypeLabel(movement.movementType)}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                          {movement.patrimonyNumber || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white">
                          {movement.assetName || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {movement.origin || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {movement.destination || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {movement.quantity || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {movement.responsible || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start flex gap-2">
                          <button 
                            onClick={() => handleEdit(movement)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(movement.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Excluir"
                          >
                            <Trash size={20} />
                          </button>
                        </TableCell>
                      </TableRow>
                    ));
                  })()}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </ComponentCard>
      <MovementModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMovement(null);
        }}
        onSuccess={fetchMovements}
        movement={selectedMovement}
        isEditMode={isEditMode}
      />
    </>
  );
}

