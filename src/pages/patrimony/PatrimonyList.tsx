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
import { Patrimony } from "../../types/Patrimony";
import PatrimonyModal from "../../components/patrimony/PatrimonyModal";

export default function PatrimonyList() {
  const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatrimony, setSelectedPatrimony] = useState<Patrimony | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const fetchPatrimonies = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<Patrimony[]>("/patrimonies");
      setPatrimonies(response.data);
    } catch (error) {
      console.error("Erro ao buscar patrimônios:", error);
      toast.error("Erro ao buscar patrimônios");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatrimonies();
  }, []);

  const handleCreate = () => {
    setSelectedPatrimony(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleEdit = (patrimony: Patrimony) => {
    setSelectedPatrimony(patrimony);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este patrimônio?")) {
      return;
    }
    try {
      await httpClient.delete(`/patrimony/${id}`);
      setPatrimonies(prev => prev.filter(item => item.id !== id));
      toast.success("Patrimônio excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir patrimônio:", error);
      toast.error("Erro ao excluir patrimônio");
    }
  };


  const formatCurrency = (value?: number) => {
    if (!value) return "-";
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Patrimônio
        </h2>
        <Button
          size="sm"
          onClick={handleCreate}
        >
          Adicionar Patrimônio
        </Button>
      </div>
      <ComponentCard title="Lista de Patrimônios">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Imagem
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Número
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Nome do Bem
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Categoria
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Condição
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Valor
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Localização
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
                          <TableCell className="px-5 py-4"><Skeleton variant="rectangular" width={40} height={40} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={150} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                        </TableRow>
                      ));
                    }
                    if (patrimonies.length === 0) {
                      return (
                        <TableRow>
                          <TableCell colSpan={8} className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                            Não há patrimônios cadastrados.
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return patrimonies.map((patrimony) => (
                      <TableRow key={patrimony.id} className="text-sm">
                        <TableCell className="px-5 py-4">
                          {(() => {
                            if (patrimony.imageUrl) {
                              return (
                                <img 
                                  src={patrimony.imageUrl} 
                                  alt={patrimony.assetName} 
                                  className="w-10 h-10 rounded object-cover"
                                />
                              );
                            }
                            return (
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-gray-500 dark:text-gray-400 text-xs">Sem imagem</span>
                              </div>
                            );
                          })()}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                          {patrimony.patrimonyNumber}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white">
                          {patrimony.assetName}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {patrimony.category}
                          {patrimony.subcategory && ` - ${patrimony.subcategory}`}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Badge color={patrimony.condition === 'Novo' ? 'success' : 'warning'}>
                            {patrimony.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {formatCurrency(patrimony.acquisitionValue)}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {patrimony.currentLocation || "-"}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start flex gap-2">
                          <button 
                            onClick={() => handleEdit(patrimony)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar"
                          >
                            <Edit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(patrimony.id)}
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
      <PatrimonyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatrimony(null);
        }}
        onSuccess={fetchPatrimonies}
        patrimony={selectedPatrimony}
        isEditMode={isEditMode}
      />
    </>
  );
}

