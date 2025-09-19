import { useEffect, useState } from "react";
import httpClient from "../../api/httpClient";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BoxIconLine,
  GroupIcon,
} from "../../icons";
import { User } from "../../types/User";
import Badge from "../ui/badge/Badge";
import { Loader } from "lucide-react";

const membersService = {
  getAllMembers: async (): Promise<User[]> => {
    try {
      const response = await httpClient.get<User[]>("/users");
      const data = response.data;
      return data;
    } catch (error) {
      console.error("Erro ao buscar membros:", error);
      throw error;
    }
  }
};

export default function EcommerceMetrics() {

  const [members, setMembers] = useState<User[]>([]);
  const [baptizedMembers, setBaptizedMembers] = useState<User[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await membersService.getAllMembers();
        setMembers(data);
        setBaptizedMembers(data.filter(member => member.role === 'MEMBRO_BAPTIZADO'));
        console.log(members);
      } catch (error) {
        console.error("Erro ao buscar membros:", error);
      }
    };

    fetchMembers();
  }, []);


  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
        </div>

        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Membros
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              { members && members.length != 0 ? members.length : (<Loader className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />)}
            </h4>
          </div>
          <Badge color="success">
            <ArrowUpIcon />
            11.01%
          </Badge>
        </div>
      </div>

      {/* <!-- Metric Item Start --> */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Membros Baptizados
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
              { members && members.length != 0 ? baptizedMembers.length : (<Loader className="h-12 w-12 animate-spin mx-auto text-indigo-600 mb-4" />)}
            </h4>
          </div>

          <Badge color="error">
            <ArrowDownIcon />
            9.05%
          </Badge>
        </div>
      </div>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
