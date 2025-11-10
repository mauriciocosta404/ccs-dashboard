import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Select from "../form/Select";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";
import { User } from "../../types/User";

interface AddMemberModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly ministryId: string;
  readonly onSuccess?: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  ministryId,
  onSuccess,
}: AddMemberModalProps) {
  const [selectedUserId, setSelectedUserId] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Buscar usuários disponíveis
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await httpClient.get<User[]>("/users");
      setUsers(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      toast.error("Erro ao carregar lista de usuários");
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserId) {
      toast.error("Por favor, selecione um usuário.");
      return;
    }

    setLoading(true);

    try {
      await httpClient.post(`/ministerios/${ministryId}/membros`, {
        userId: selectedUserId,
      });

      toast.success("Membro adicionado ao ministério com sucesso!");
      setSelectedUserId("");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Erro ao adicionar membro ao ministério. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setSelectedUserId("");
      onClose();
    }
  };

  const handleCloseClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const selectOptions = users.map((user) => ({
    value: user.id,
    label: `${user.name} (${user.email})`,
  }));

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Adicionar Membro ao Ministério
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Selecione um usuário para adicionar ao ministério.
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Selecionar Usuário
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label htmlFor="user-select">Usuário</Label>
                  {loadingUsers ? (
                    <div className="mt-1.5 h-11 w-full rounded-lg border border-gray-300 bg-gray-100 px-4 py-2.5 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800">
                      Carregando usuários...
                    </div>
                  ) : (
                    <Select
                      id="user-select"
                      name="userId"
                      options={selectOptions}
                      placeholder="Selecione um usuário"
                      value={selectedUserId}
                      onChange={setSelectedUserId}
                      className="mt-1.5"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              type="button"
              onClick={handleCloseClick}
              disabled={loading || loadingUsers}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>
            <Button
              size="sm"
              disabled={loading || loadingUsers || !selectedUserId}
            >
              {loading ? "Adicionando..." : "Adicionar Membro"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

