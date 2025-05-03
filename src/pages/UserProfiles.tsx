import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import UserAddressCard from "../components/UserProfile/UserAddressCard";
import PageMeta from "../components/common/PageMeta";
import { useParams } from "react-router";
import { User } from "../types/User";
import { useEffect, useState } from "react";
import httpClient from "../api/httpClient";
import Alert from "../components/ui/alert/Alert";

export default function UserProfiles() {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    if (!userId) {
      setError("ID do usuário não encontrado na URL");
      setLoading(false);
      return;
    }

    const cleanUserId = userId.replace(/[^a-zA-Z0-9-]/g, '');

    const fetchUserData = async () => {
      try {
        const response = await httpClient.get(`/users/${cleanUserId}`);
        setUser(response.data);
      } catch (err) {
        setError("Erro ao carregar dados do usuário");
        console.error("Erro ao buscar usuário:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

if (loading) {
  return <div>Carregando...</div>;
}

if (error) {
  return <Alert
  variant="error"
  title="Error Message"
  message="Usuário não encontrado"
  showLink={false}
/>;
}
if (!user) {
  return <Alert
    variant="error"
    title="Error Message"
    message="Usuário não encontrado"
    showLink={false}
  />;
}


  return (
    <>
      <PageMeta
        title="Perfil do Usuário | TailAdmin"
        description={`Página de perfil de ${user.name}`}
      />
      <PageBreadcrumb pageTitle={`Perfil`} />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Perfil
        </h3>
        <div className="space-y-6">
        <UserMetaCard user={user} />
          <UserInfoCard user={user} onUpdate={handleUserUpdate}/>
          <UserAddressCard  user={user} />
        </div>
      </div>
    </>
  );
}
