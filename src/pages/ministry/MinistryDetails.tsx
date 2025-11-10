import { useEffect, useState } from "react";
import { useParams } from "react-router";
import httpClient from "../../api/httpClient";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Alert from "../../components/ui/alert/Alert";
import AddMemberModal from "../../components/ministry/AddMemberModal";
import Button from "../../components/ui/button/Button";
import { User } from "../../types/User";
import Badge from "../../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import Skeleton from '@mui/material/Skeleton';
import ComponentCard from "../../components/common/ComponentCard";
import { Trash } from "lucide-react";
import { toast } from "react-toastify";

interface Ministry {
  id: string;
  name: string;
  users: User[];
  createdAt: string;
  updatedAt: string;
}

export default function MinistryDetails() {
  const { id } = useParams<{ id: string }>();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID do ministério não encontrado na URL");
      setLoading(false);
      return;
    }

    const fetchMinistry = async () => {
      try {
        const response = await httpClient.get<Ministry>(`/ministery/${id}`);
        setMinistry(response.data);
        console.log(response.data);
      } catch (err) {
        setError("Erro ao carregar dados do ministério");
        console.error("Erro ao buscar ministério:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  const handleRefreshMinistry = () => {
    if (!id) return;
    setLoading(true);
    httpClient.get<Ministry>(`/ministery/${id}`)
      .then((response) => {
        setMinistry(response.data);
      })
      .catch((err) => {
        setError("Erro ao carregar dados do ministério");
        console.error("Erro ao buscar ministério:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleRemoveMember = async (userId: string) => {
    if (!id) return;
    
    if (!confirm("Tem certeza que deseja remover este membro do ministério?")) {
      return;
    }

    try {
      await httpClient.delete(`/ministerios/${id}/membros/${userId}`);
      toast.success("Membro removido do ministério com sucesso!");
      handleRefreshMinistry();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Erro ao remover membro do ministério. Tente novamente.";
      toast.error(errorMessage);
      console.error("Erro ao remover membro:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <PageMeta
          title="Ministério - ADONAI CCS"
          description="Detalhes do ministério"
        />
        <PageBreadcrumb pageTitle="Carregando..." />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mx-auto w-full max-w-4xl">
            <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div>
        <PageMeta
          title="Erro - ADONAI CCS"
          description="Erro ao carregar ministério"
        />
        <PageBreadcrumb pageTitle="Erro" />
        <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
          <div className="mx-auto w-full max-w-4xl">
            <Alert
              variant="error"
              title="Erro"
              message={error || "Ministério não encontrado"}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageMeta
        title={`${ministry.name} - ADONAI CCS`}
        description={`Detalhes do ministério ${ministry.name}`}
      />
      <PageBreadcrumb pageTitle={ministry.name} />
      <div className="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
        <div className="mx-auto w-full">
          <div className="mb-8 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white/90 sm:text-4xl">
              {ministry.name}
            </h1>
            <Button
              size="sm"
              onClick={() => setIsAddMemberModalOpen(true)}
            >
              Adicionar Membro
            </Button>
          </div>
          
          <ComponentCard title="Membros do Ministério">
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
              <div className="max-w-full overflow-x-auto">
                <div className="min-w-[600px]">
                  <Table>
                    <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                      <TableRow>
                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          Nome
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          Email
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          Status
                        </TableCell>
                        <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                          Ações
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell className="px-5 py-4">
                              <Skeleton variant="text" width={120} height={20} />
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <Skeleton variant="text" width={120} height={20} />
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <Skeleton variant="text" width={120} height={20} />
                            </TableCell>
                            <TableCell className="px-5 py-4">
                              <Skeleton variant="text" width={60} height={20} />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : !ministry.users || ministry.users.length === 0 ? (
                        <TableRow>
                          <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                            Nenhum membro adicionado a este ministério ainda.
                          </TableCell>
                          <TableCell className="px-5 py-4">{""}</TableCell>
                          <TableCell className="px-5 py-4">{""}</TableCell>
                          <TableCell className="px-5 py-4">{""}</TableCell>
                        </TableRow>
                      ) : (
                        ministry.users.map((user) => (
                          <TableRow key={user.id} className="text-sm">
                            <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white flex items-center gap-1">
                              <div className="w-8 h-8 overflow-hidden rounded-full bg-[#4c4ee4] flex justify-center items-center">
                                <span className="text-white">{user.name.charAt(0)}</span>    
                              </div>
                              {user.name}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                              {user.email}
                            </TableCell>
                            <TableCell className="px-5 py-4 text-start">
                              <Badge color={user.role === 'MEMBRO_BAPTIZADO' ? 'warning' : 'success'}>
                                {user.role === 'MEMBRO_BAPTIZADO' ? 'Baptizado' : 'Não baptizado'}
                              </Badge>
                            </TableCell>
                            <TableCell className="px-5 py-4 text-start">
                              <button
                                onClick={() => handleRemoveMember(user.id)}
                                className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                title="Remover membro"
                              >
                                <Trash size={16} />
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
        </div>
      </div>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        ministryId={ministry.id}
        onSuccess={handleRefreshMinistry}
      />
    </div>
  );
}

