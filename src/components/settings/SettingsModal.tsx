import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";
import { Settings, CreateSettingsRequest } from "../../types/Settings";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";

interface SettingsModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
  readonly settings?: Settings | null;
  readonly isEditMode?: boolean;
}

export default function SettingsModal({
  isOpen,
  onClose,
  onSuccess,
  settings,
  isEditMode = false,
}: SettingsModalProps) {
  const [formData, setFormData] = useState<CreateSettingsRequest>({
    churchName: "",
    acronym: "",
    localChurch: "",
    foundingDate: "",
    foundingLocation: "",
    headquartersAddress: "",
    phone: "",
    email: "",
    website: "",
    whatsapp: "",
    facebook: "",
    pastor: "",
    vicePastor: "",
    secretary: "",
    treasurer: "",
    others: "",
    bank: "",
    accountNumber: "",
    ibanNib: "",
    registrationNumber: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (settings && isEditMode) {
      setFormData({
        churchName: settings.churchName || "",
        acronym: settings.acronym || "",
        localChurch: settings.localChurch || "",
        foundingDate: settings.foundingDate 
          ? (typeof settings.foundingDate === 'string' 
              ? settings.foundingDate.split('T')[0] 
              : new Date(settings.foundingDate).toISOString().split('T')[0])
          : "",
        foundingLocation: settings.foundingLocation || "",
        headquartersAddress: settings.headquartersAddress || "",
        phone: settings.phone || "",
        email: settings.email || "",
        website: settings.website || "",
        whatsapp: settings.whatsapp || "",
        facebook: settings.facebook || "",
        pastor: settings.pastor || "",
        vicePastor: settings.vicePastor || "",
        secretary: settings.secretary || "",
        treasurer: settings.treasurer || "",
        others: settings.others || "",
        bank: settings.bank || "",
        accountNumber: settings.accountNumber || "",
        ibanNib: settings.ibanNib || "",
        registrationNumber: settings.registrationNumber || "",
      });
    } else {
      setFormData({
        churchName: "",
        acronym: "",
        localChurch: "",
        foundingDate: "",
        foundingLocation: "",
        headquartersAddress: "",
        phone: "",
        email: "",
        website: "",
        whatsapp: "",
        facebook: "",
        pastor: "",
        vicePastor: "",
        secretary: "",
        treasurer: "",
        others: "",
        bank: "",
        accountNumber: "",
        ibanNib: "",
        registrationNumber: "",
      });
    }
  }, [settings, isEditMode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (date: Date[]) => {
    if (date[0]) {
      setFormData((prev) => ({
        ...prev,
        foundingDate: date[0].toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Preparar dados para envio (remover campos vazios)
      const dataToSend: CreateSettingsRequest = {};
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          dataToSend[key as keyof CreateSettingsRequest] = value;
        }
      });

      if (isEditMode && settings?.id) {
        await httpClient.put(`/settings/${settings.id}`, dataToSend);
        toast.success("Configuração atualizada com sucesso!");
      } else {
        await httpClient.post("/settings", dataToSend);
        toast.success("Configuração criada com sucesso!");
      }

      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        `Erro ao ${isEditMode ? 'atualizar' : 'criar'} configuração. Tente novamente.`;
      toast.error(errorMessage);
      console.error("Erro ao salvar configuração:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Editar Configuração" : "Criar Configuração"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEditMode 
              ? "Edite as informações da configuração da igreja."
              : "Preencha as informações da configuração da igreja."}
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar max-h-[600px] overflow-y-auto px-2 pb-3">
            {/* Informações Básicas */}
            <div className="mb-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Básicas
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="churchName">Nome da Igreja</Label>
                  <Input
                    id="churchName"
                    type="text"
                    name="churchName"
                    placeholder="Ex: Igreja Adonai Cenáculo da Salvação"
                    value={formData.churchName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="acronym">Sigla</Label>
                  <Input
                    id="acronym"
                    type="text"
                    name="acronym"
                    placeholder="Ex: ADONAI CCS"
                    value={formData.acronym}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="localChurch">Igreja Local</Label>
                  <Input
                    id="localChurch"
                    type="text"
                    name="localChurch"
                    placeholder="Nome da igreja local"
                    value={formData.localChurch}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="foundingDate">Data de Fundação</Label>
                  <div className="relative mt-1.5">
                    <Flatpickr
                      value={formData.foundingDate}
                      onChange={handleDateChange}
                      options={{
                        dateFormat: "Y-m-d",
                        maxDate: new Date(),
                      }}
                      className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      placeholder="Selecione a data"
                      disabled={loading}
                    />
                    <CalenderIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none size-5 text-gray-400" />
                  </div>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="foundingLocation">Local de Fundação</Label>
                  <Input
                    id="foundingLocation"
                    type="text"
                    name="foundingLocation"
                    placeholder="Cidade, País"
                    value={formData.foundingLocation}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="headquartersAddress">Endereço da Sede</Label>
                  <Input
                    id="headquartersAddress"
                    type="text"
                    name="headquartersAddress"
                    placeholder="Endereço completo da sede"
                    value={formData.headquartersAddress}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="mb-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações de Contato
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    name="phone"
                    placeholder="+244 123 456 789"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="contato@igreja.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    type="url"
                    name="website"
                    placeholder="https://www.igreja.com"
                    value={formData.website}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    type="text"
                    name="whatsapp"
                    placeholder="+244 123 456 789"
                    value={formData.whatsapp}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    name="facebook"
                    placeholder="https://www.facebook.com/igreja"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Liderança */}
            <div className="mb-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Liderança
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="pastor">Pastor</Label>
                  <Input
                    id="pastor"
                    type="text"
                    name="pastor"
                    placeholder="Nome do pastor"
                    value={formData.pastor}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="vicePastor">Vice-Pastor</Label>
                  <Input
                    id="vicePastor"
                    type="text"
                    name="vicePastor"
                    placeholder="Nome do vice-pastor"
                    value={formData.vicePastor}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="secretary">Secretário</Label>
                  <Input
                    id="secretary"
                    type="text"
                    name="secretary"
                    placeholder="Nome do secretário"
                    value={formData.secretary}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="treasurer">Tesoureiro</Label>
                  <Input
                    id="treasurer"
                    type="text"
                    name="treasurer"
                    placeholder="Nome do tesoureiro"
                    value={formData.treasurer}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="others">Outros Líderes</Label>
                  <Input
                    id="others"
                    type="text"
                    name="others"
                    placeholder="Outros membros da liderança"
                    value={formData.others}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Informações Financeiras */}
            <div className="mb-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Financeiras
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="bank">Banco</Label>
                  <Input
                    id="bank"
                    type="text"
                    name="bank"
                    placeholder="Nome do banco"
                    value={formData.bank}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="accountNumber">Número da Conta</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    name="accountNumber"
                    placeholder="Número da conta bancária"
                    value={formData.accountNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="ibanNib">IBAN/NIB</Label>
                  <Input
                    id="ibanNib"
                    type="text"
                    name="ibanNib"
                    placeholder="IBAN ou NIB"
                    value={formData.ibanNib}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="registrationNumber">Número de Registro</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    name="registrationNumber"
                    placeholder="Número de registro legal"
                    value={formData.registrationNumber}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <Button
              size="sm"
              disabled={loading}
              type="submit"
            >
              {loading 
                ? (isEditMode ? "Atualizando..." : "Criando...") 
                : (isEditMode ? "Atualizar Configuração" : "Criar Configuração")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}


