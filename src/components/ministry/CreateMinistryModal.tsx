import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";

interface CreateMinistryModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export default function CreateMinistryModal({
  isOpen,
  onClose,
  onSuccess,
}: CreateMinistryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Por favor, preencha o nome do ministério.");
      return;
    }

    setLoading(true);

    try {
      await httpClient.post("/ministery", {
        name: name.trim(),
      });

      toast.success("Ministério criado com sucesso!");
      setName("");
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Erro ao criar ministério. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setName("");
      onClose();
    }
  };

  const handleCloseClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Criar Ministério
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Adicione um novo ministério ao sistema.
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações do Ministério
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label htmlFor="ministry-name">Nome do Ministério</Label>
                  <Input
                    id="ministry-name"
                    type="text"
                    placeholder="Ex: Louvor, Intercessão, Protocolo..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={loading}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              type="button"
              onClick={handleCloseClick}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>
            <Button
              size="sm"
              disabled={loading}
              type="submit"
            >
              {loading ? "Criando..." : "Criar Ministério"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

