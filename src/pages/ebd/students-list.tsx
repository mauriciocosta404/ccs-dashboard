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
import { Edit, Trash, UserCheck, UserX, GraduationCap } from "lucide-react";
import { toast } from "react-toastify";

interface EbdStudent {
  id: string;
  fullName: string;
  gender: string;
  address: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  nationality: string;
  teacherId?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface FilterState {
  status: 'all' | 'active' | 'inactive';
  gender: 'all' | 'MASCULINO' | 'FEMININO';
}

export default function EbdStudentsList() {
  const [students, setStudents] = useState<EbdStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    status: 'all',
    gender: 'all'
  });

  useEffect(() => {
    fetchStudents();
  }, [filters.status]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      let endpoint = "/ebd/students";
      
      if (filters.status === 'active') {
        endpoint = "/ebd/students/active";
      } else if (filters.status === 'inactive') {
        endpoint = "/ebd/students/inactive";
      }

      const response = await httpClient.get<EbdStudent[]>(endpoint);
      console.log(response);
      setStudents(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
      toast.error("Erro ao carregar alunos da EBD");
    } finally {
      setLoading(false);
    }
  };

  // Filtrar alunos por gênero localmente
  const filteredStudents = students.filter(student => {
    if (filters.gender === 'all') return true;
    return student.gender === filters.gender;
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este aluno?")) {
      return;
    }

    try {
      await httpClient.delete(`/ebd/students/${id}`);
      setStudents(prev => prev.filter(item => item.id !== id));
      toast.success("Aluno excluído com sucesso!");
    } catch (error) {
      console.error("Erro ao excluir aluno:", error);
      toast.error("Erro ao excluir aluno");
    }
  };

  const handleToggleStatus = async (student: EbdStudent) => {
    try {
      const endpoint = student.isActive 
        ? `/ebd/students/${student.id}/deactivate`
        : `/ebd/students/${student.id}/activate`;
      
      await httpClient.patch(endpoint);
      
      setStudents(prev => 
        prev.map(item => 
          item.id === student.id 
            ? { ...item, isActive: !item.isActive }
            : item
        )
      );
      
      toast.success(
        student.isActive 
          ? "Aluno desativado com sucesso!" 
          : "Aluno ativado com sucesso!"
      );
    } catch (error) {
      console.error("Erro ao alterar status do aluno:", error);
      toast.error("Erro ao alterar status do aluno");
    }
  };

  const handleEdit = (student: EbdStudent) => {
    console.log("Editando aluno:", student);
    toast.info("Funcionalidade de edição será implementada em breve");
  };

  const getGenderColor = (gender: string) => {
    return gender === 'MASCULINO' 
      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      : 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-400';
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
  };

  return (
    <ComponentCard title="Alunos da EBD">
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as FilterState['status'] }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="active">Ativos</option>
            <option value="inactive">Inativos</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Gênero
          </label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value as FilterState['gender'] }))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="all">Todos</option>
            <option value="MASCULINO">Masculino</option>
            <option value="FEMININO">Feminino</option>
          </select>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Nome Completo
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Gênero
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Idade
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Nacionalidade
                  </TableCell>
                  <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                    Endereço
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
                  // Skeletons
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={200} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={80} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={50} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={100} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={150} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={60} height={20} />
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <Skeleton variant="text" width={80} height={20} />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredStudents.length === 0 ? (
                  // Estado vazio
                  <TableRow>
                    <TableCell className="px-5 py-12 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <GraduationCap className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-lg">Nenhum aluno encontrado</p>
                          <p className="text-sm mt-1">
                            {filters.status !== 'all' || filters.gender !== 'all'
                              ? 'Tente ajustar os filtros ou adicione novos alunos'
                              : 'Adicione o primeiro aluno da EBD para começar'
                            }
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  // Dados reais
                  filteredStudents
                    .sort((a, b) => a.fullName.localeCompare(b.fullName))
                    .map((student) => (
                    <TableRow key={student.id} className="text-sm hover:bg-gray-50 dark:hover:bg-white/[0.02]">
                      <TableCell className="px-5 py-4 text-start">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {student.fullName}
                          </p>
                          {(student.fatherName || student.motherName) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {student.fatherName && `Pai: ${student.fatherName}`}
                              {student.fatherName && student.motherName && ' | '}
                              {student.motherName && `Mãe: ${student.motherName}`}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGenderColor(student.gender)}`}>
                          {student.gender === 'MASCULINO' ? 'M' : 'F'}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        <div>
                          <p className="font-medium">{calculateAge(student.birthDate)} anos</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(student.birthDate)}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {student.nationality}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                        {student.address || 'Não informado'}
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.isActive)}`}>
                          {student.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-start">
                        <div className="flex gap-2">
                          <button 
                            className={`p-1 rounded transition-colors ${
                              student.isActive 
                                ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                                : 'text-green-600 hover:text-green-800 hover:bg-green-50 dark:hover:bg-green-900/20'
                            }`}
                            onClick={() => handleToggleStatus(student)}
                            title={student.isActive ? 'Desativar' : 'Ativar'}
                          >
                            {student.isActive ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            onClick={() => handleEdit(student)}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            onClick={() => handleDelete(student.id)}
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
        
        {!loading && filteredStudents.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50 dark:bg-white/[0.02]">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredStudents.length !== students.length 
                  ? `Mostrando ${filteredStudents.length} de ${students.length} aluno${students.length !== 1 ? 's' : ''}`
                  : `Total: ${students.length} aluno${students.length !== 1 ? 's' : ''} cadastrado${students.length !== 1 ? 's' : ''}`
                }
              </p>
              
              {students.length > 0 && (
                <div className="flex gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-600 inline-block" />
                    Ativos
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-orange-600 inline-block" />
                    Inativos
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ComponentCard>
  );
}