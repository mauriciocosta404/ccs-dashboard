import { useEffect, useState } from "react";
import Badge from "../components/ui/badge/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import Skeleton from '@mui/material/Skeleton';
import httpClient from "../api/httpClient";
import ComponentCard from "../components/common/ComponentCard";

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

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await httpClient.get<Member[]>("/users");
        setMembers(response.data);
      } catch (error) {
        console.error("Erro ao buscar membros batizados:", error);
      } finally {
        setLoading(false);
      }
    };

    
    fetchMembers();
    }, []);

  return (
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
                        Não há membros não batizados.
                    </TableCell>
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
