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
import AddMemberModal from "../../components/members/AddMemberModal";
import { Edit, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { User } from "../../types/User";

interface Member {
  id: string;
  name: string;
  email: string;
  role: 'MEMBRO_BAPTIZADO'| 'MEMBRO_NAO_BAPTIZADO' ;
  createdAt: string;
  updatedAt: string;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<User | null>(null);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<Member[]>("/users");
      setMembers(response.data);
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleDelete = async (memberId: string, memberName: string) => {
    if (!confirm(`Tem certeza que deseja excluir o membro ${memberName}?`)) {
      return;
    }

    try {
      await httpClient.delete(`/users/${memberId}`);
      setMembers(prev => prev.filter(member => member.id !== memberId));
      toast.success("Membro excluído com sucesso!");
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Erro ao excluir membro. Tente novamente.";
      toast.error(errorMessage);
      console.error("Erro ao excluir membro:", error);
    }
  };

  const handleEdit = async (member: Member) => {
    try {
      // Buscar dados completos do usuário
      const response = await httpClient.get<User>(`/users/${member.id}`);
      setEditingMember(response.data);
      setIsAddMemberModalOpen(true);
    } catch (error) {
      console.error("Erro ao buscar dados do membro:", error);
      toast.error("Erro ao carregar dados do membro para edição");
    }
  };

  const handleCloseModal = () => {
    setIsAddMemberModalOpen(false);
    setEditingMember(null);
  };

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Membros
        </h2>
        <Button
          size="sm"
          onClick={() => setIsAddMemberModalOpen(true)}
        >
          Adicionar Membro
        </Button>
      </div>
      <ComponentCard title="Membros">
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
                    // 🟡 Skeletons
                    Array.from({ length: 3 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                        <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                        <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                    </TableRow>
                    ))
                ) : members.length === 0 ? (
                    // ❌ Nenhum membro
                    <TableRow>
                    <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                        Não há membros cadastrados.
                    </TableCell>
                    <TableCell className="px-5 py-4">{""}</TableCell>
                    <TableCell className="px-5 py-4">{""}</TableCell>
                    <TableCell className="px-5 py-4">{""}</TableCell>
                    </TableRow>
                ) : (
                    // ✅ Dados reais
                    members.map((member) => (
                    <TableRow key={member.id} className="text-sm">
                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white flex items-center gap-1">
                        <div className="w-8 h-8 overflow-hidden rounded-full bg-[#4c4ee4] flex justify-center items-center">
                            <span className="text-white">{member.name.charAt(0)}</span>    
                        </div>
                        {member.name}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">{member.email}</TableCell>
                        <TableCell className="px-5 py-4 text-start">
                        <Badge color={member.role == 'MEMBRO_NAO_BAPTIZADO' ? 'success' : 'warning'}>
                          {member.role == 'MEMBRO_NAO_BAPTIZADO' ? 'Baptizado' : 'Não baptizado'}
                        </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEdit(member)}
                              className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                              title="Editar membro"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(member.id, member.name)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              title="Excluir membro"
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
        </div>
      </ComponentCard>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={handleCloseModal}
        onSuccess={fetchMembers}
        editingMember={editingMember}
      />
    </>
  );
}
