import { useEffect, useState } from "react";
import { useParams } from "react-router";
import httpClient from "../../api/httpClient";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Alert from "../../components/ui/alert/Alert";

interface Ministry {
  id: string;
  name: string;
  // Adicione outros campos conforme necessário
}

export default function MinistryDetails() {
  const { id } = useParams<{ id: string }>();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        setError("Erro ao carregar dados do ministério");
        console.error("Erro ao buscar ministério:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

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
        <div className="mx-auto w-full max-w-4xl">
          <div className="mb-8">
            <h1 className="mb-4 text-3xl font-bold text-gray-800 dark:text-white/90 sm:text-4xl">
              {ministry.name}
            </h1>
          </div>
          
          <div className="space-y-6">
            <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-800/50">
              <h2 className="mb-3 text-xl font-semibold text-gray-800 dark:text-white/90">
                Informações do Ministério
              </h2>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nome</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white/90">
                    {ministry.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">ID</p>
                  <p className="text-base font-medium text-gray-800 dark:text-white/90">
                    {ministry.id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

