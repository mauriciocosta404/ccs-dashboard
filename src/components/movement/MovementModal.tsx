import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import TextArea from "../form/input/TextArea";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";
import { Movement, CreateMovementRequest } from "../../types/Movement";
import { Patrimony } from "../../types/Patrimony";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";

interface MovementModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
  readonly movement?: Movement | null;
  readonly isEditMode?: boolean;
}

const MOVEMENT_TYPES = [
  { value: "ENTRADA", label: "Entrada" },
  { value: "SAIDA", label: "Saída" },
  { value: "TRANSFERENCIA", label: "Transferência" },
  { value: "DOACAO", label: "Doação" },
  { value: "BAIXA", label: "Baixa" },
];

export default function MovementModal({
  isOpen,
  onClose,
  onSuccess,
  movement,
  isEditMode = false,
}: MovementModalProps) {
  const [formData, setFormData] = useState<CreateMovementRequest>({
    date: "",
    patrimonyId: "",
    assetName: "",
    movementType: "ENTRADA",
    origin: "",
    destination: "",
    quantity: undefined,
    obs: "",
    responsible: "",
    resourceSource: "",
    supplierDonor: "",
    observations: "",
  });
  const [loading, setLoading] = useState(false);
  const [patrimonies, setPatrimonies] = useState<Patrimony[]>([]);
  const [loadingPatrimonies, setLoadingPatrimonies] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchPatrimonies();
    }
  }, [isOpen]);

  useEffect(() => {
    if (movement && isEditMode) {
      setFormData({
        date: movement.date ? (typeof movement.date === 'string' ? movement.date : new Date(movement.date).toISOString().split('T')[0]) : "",
        patrimonyId: movement.patrimonyId || "",
        assetName: movement.assetName || "",
        movementType: movement.movementType || "ENTRADA",
        origin: movement.origin || "",
        destination: movement.destination || "",
        quantity: movement.quantity,
        obs: movement.obs || "",
        responsible: movement.responsible || "",
        resourceSource: movement.resourceSource || "",
        supplierDonor: movement.supplierDonor || "",
        observations: movement.observations || "",
      });
    } else {
      setFormData({
        date: "",
        patrimonyId: "",
        assetName: "",
        movementType: "ENTRADA",
        origin: "",
        destination: "",
        quantity: undefined,
        obs: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
      });
    }
  }, [movement, isEditMode, isOpen]);

  const fetchPatrimonies = async () => {
    setLoadingPatrimonies(true);
    try {
      const response = await httpClient.get<Patrimony[]>("/patrimonies");
      setPatrimonies(response.data);
    } catch (error) {
      console.error("Erro ao buscar patrimônios:", error);
    } finally {
      setLoadingPatrimonies(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? Number.parseFloat(value) : undefined,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateChange = (date: Date[]) => {
    if (date[0]) {
      setFormData((prev) => ({
        ...prev,
        date: date[0].toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.movementType) {
      toast.error("Por favor, selecione o tipo de movimento.");
      return;
    }

    setLoading(true);

    try {
      const dataToSend: CreateMovementRequest = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : undefined,
      };

      if (isEditMode && movement) {
        await httpClient.put(`/movement/${movement.id}`, dataToSend);
        toast.success("Movimento atualizado com sucesso!");
      } else {
        await httpClient.post("/movement", dataToSend);
        toast.success("Movimento cadastrado com sucesso!");
      }

      setFormData({
        date: "",
        patrimonyId: "",
        assetName: "",
        movementType: "ENTRADA",
        origin: "",
        destination: "",
        quantity: undefined,
        obs: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ||
        (error as { message?: string })?.message ||
        "Erro ao salvar movimento. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        date: "",
        patrimonyId: "",
        assetName: "",
        movementType: "ENTRADA",
        origin: "",
        destination: "",
        quantity: undefined,
        obs: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const patrimonyOptions = patrimonies.map((p) => ({
    value: p.id,
    label: `${p.patrimonyNumber} - ${p.assetName}`,
  }));

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Editar Movimento" : "Adicionar Movimento"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEditMode 
              ? "Atualize as informações do movimento." 
              : "Preencha os dados do novo movimento de patrimônio."}
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[600px] overflow-y-auto px-2 pb-3">
            {/* Informações Básicas */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Básicas
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="movementType">
                    Tipo de Movimento <span className="text-error-500">*</span>
                  </Label>
                  <Select
                    id="movementType"
                    name="movementType"
                    value={formData.movementType}
                    onChange={(value) => handleSelectChange("movementType", value)}
                    disabled={loading}
                    className="mt-1.5"
                    options={MOVEMENT_TYPES}
                  />
                </div>

                <div>
                  <Label htmlFor="date">Data</Label>
                  <div className="relative mt-1.5">
                    <Flatpickr
                      value={formData.date ? new Date(formData.date) : undefined}
                      onChange={handleDateChange}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date(),
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                      placeholder="Selecione a data"
                      disabled={loading}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <CalenderIcon />
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="patrimonyId">Patrimônio</Label>
                  <Select
                    id="patrimonyId"
                    name="patrimonyId"
                    value={formData.patrimonyId || ""}
                    onChange={(value) => handleSelectChange("patrimonyId", value)}
                    disabled={loading || loadingPatrimonies}
                    className="mt-1.5"
                    options={[
                      { value: "", label: "Selecione um patrimônio" },
                      ...patrimonyOptions,
                    ]}
                  />
                </div>

                <div>
                  <Label htmlFor="assetName">Nome do Bem</Label>
                  <Input
                    id="assetName"
                    type="text"
                    name="assetName"
                    placeholder="Nome do bem (se não houver patrimônio)"
                    value={formData.assetName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantidade</Label>
                  <Input
                    id="quantity"
                    type="number"
                    name="quantity"
                    placeholder="Quantidade"
                    value={formData.quantity || ""}
                    onChange={handleNumberChange}
                    disabled={loading}
                    min="1"
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="responsible">Responsável</Label>
                  <Input
                    id="responsible"
                    type="text"
                    name="responsible"
                    placeholder="Nome do responsável"
                    value={formData.responsible}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Origem e Destino */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Origem e Destino
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="origin">Origem</Label>
                  <Input
                    id="origin"
                    type="text"
                    name="origin"
                    placeholder="Local de origem"
                    value={formData.origin}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    type="text"
                    name="destination"
                    placeholder="Local de destino"
                    value={formData.destination}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Informações Adicionais */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Adicionais
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="resourceSource">Fonte de Recurso</Label>
                  <Input
                    id="resourceSource"
                    type="text"
                    name="resourceSource"
                    placeholder="Fonte de recurso"
                    value={formData.resourceSource}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="supplierDonor">Fornecedor/Doador</Label>
                  <Input
                    id="supplierDonor"
                    type="text"
                    name="supplierDonor"
                    placeholder="Fornecedor ou doador"
                    value={formData.supplierDonor}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Observações */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Observações
              </h5>
              <div className="grid grid-cols-1 gap-y-5">
                <div>
                  <Label htmlFor="obs">Observação Rápida</Label>
                  <TextArea
                    id="obs"
                    placeholder="Observação breve"
                    value={formData.obs}
                    onChange={(value) => handleTextAreaChange(value, "obs")}
                    disabled={loading}
                    className="mt-1.5"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="observations">Observações Detalhadas</Label>
                  <TextArea
                    id="observations"
                    placeholder="Observações detalhadas sobre o movimento"
                    value={formData.observations}
                    onChange={(value) => handleTextAreaChange(value, "observations")}
                    disabled={loading}
                    className="mt-1.5"
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-gray-200 pt-6 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : isEditMode ? "Atualizar" : "Salvar"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

