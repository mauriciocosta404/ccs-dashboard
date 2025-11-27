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
import { toast } from "react-toastify";
import { InventoryResponse } from "../../types/Inventory";

export default function InventoryList() {
  const [inventory, setInventory] = useState<InventoryResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<InventoryResponse[]>("/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Erro ao buscar inventário:", error);
      toast.error("Erro ao buscar inventário");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white/90">
          Inventário
        </h2>
      </div>
      <ComponentCard title="Resumo de Patrimônios">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
          <div className="max-w-full overflow-x-auto">
            <div className="min-w-[1000px]">
              <Table>
                <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                  <TableRow>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      N.Patrimonio
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Nome do Bem
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Categoria
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Total de Entradas
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Total de Saídas
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Saldo Actual
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Situação
                    </TableCell>
                    <TableCell isHeader className="px-5 py-3 text-start font-medium text-gray-500 dark:text-gray-400">
                      Observação
                    </TableCell>
                  </TableRow>
                </TableHeader>

                <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                  {(() => {
                    if (loading) {
                      return Array.from({ length: 5 }, (_, i) => `skeleton-${i}`).map((key) => (
                        <TableRow key={key}>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={150} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={120} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={100} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={80} height={20} /></TableCell>
                          <TableCell className="px-5 py-4"><Skeleton variant="text" width={150} height={20} /></TableCell>
                        </TableRow>
                      ));
                    }
                    if (inventory.length === 0) {
                      return (
                        <TableRow>
                          <TableCell className="px-5 py-4 text-center text-gray-500 dark:text-gray-400">
                            Não há dados de inventário disponíveis.
                          </TableCell>
                        </TableRow>
                      );
                    }
                    return inventory.map((item, index) => (
                      <TableRow key={`${item.patrimonyNumber}-${index}`} className="text-sm">
                        <TableCell className="px-5 py-4 text-start font-medium text-gray-800 dark:text-white">
                          {item.patrimonyNumber}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-800 dark:text-white">
                          {item.assetName}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {item.category}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {item.totalEntries}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {item.totalExits}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {item.currentBalance}
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start">
                          <Badge color={item.condition === 'Novo' ? 'success' : 'warning'}>
                            {item.condition}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-start text-gray-600 dark:text-gray-400">
                          {item.observations || "-"}
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
    </>
  );
}



