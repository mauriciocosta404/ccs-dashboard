import { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import httpClient from "../../api/httpClient";
import { User } from "../../types/User";
import Skeleton from '@mui/material/Skeleton';
import ComponentCard from "../common/ComponentCard";

interface Sector {
  id: string;
  name: string;
  users?: User[];
}

export default function MembersBySectorChart() {
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSectors = async () => {
      try {
        // Primeiro, buscar todos os sectors
        const sectorsResponse = await httpClient.get<Sector[]>("/sectors");
        const sectorsList = sectorsResponse.data || [];
        
        // Verificar se os sectors já vêm com users
        const firstSector = sectorsList[0];
        const hasUsers = firstSector?.users !== undefined;
        
        if (hasUsers) {
          // Se já vier com users, usar diretamente
          setSectors(sectorsList);
        } else {
          // Se não vier com users, buscar cada sector individualmente para obter os membros
          const sectorsWithUsers = await Promise.all(
            sectorsList.map(async (sector) => {
              try {
                const sectorDetail = await httpClient.get<Sector>(`/sector/${sector.id}`);
                return sectorDetail.data;
              } catch (error) {
                console.error(`Erro ao buscar detalhes do sector ${sector.id}:`, error);
                return { ...sector, users: [] };
              }
            })
          );
          setSectors(sectorsWithUsers);
        }
      } catch (error) {
        console.error("Erro ao buscar sectores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSectors();
  }, []);

  const options: ApexOptions = {
    colors: ["#465fff"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "bar",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        borderRadius: 5,
        borderRadiusApplication: "end",
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#6B7280"],
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: sectors.map((sector) => sector.name || "Sem nome"),
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
        rotate: -45,
        rotateAlways: false,
      },
    },
    yaxis: {
      title: {
        text: "Número de Membros",
        style: {
          fontSize: "12px",
          color: "#6B7280",
        },
      },
      labels: {
        style: {
          fontSize: "12px",
          colors: "#6B7280",
        },
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val: number) => {
          const plural = val === 1 ? '' : 's';
          return `${val} membro${plural}`;
        },
      },
    },
    grid: {
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
  };

  const series = [
    {
      name: "Membros",
      data: sectors.map((sector) => sector.users?.length || 0),
    },
  ];

  if (loading) {
    return (
      <ComponentCard title="Membros por Sector">
        <div className="space-y-4">
          <Skeleton variant="rectangular" height={350} />
        </div>
      </ComponentCard>
    );
  }

  return (
    <ComponentCard title="Membros por Sector">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        {sectors.length === 0 ? (
          <div className="flex items-center justify-center h-[350px]">
            <p className="text-gray-500 dark:text-gray-400">
              Nenhum sector encontrado.
            </p>
          </div>
        ) : (
          <div className="min-w-[600px]">
            <Chart options={options} series={series} type="bar" height={350} />
          </div>
        )}
      </div>
    </ComponentCard>
  );
}

