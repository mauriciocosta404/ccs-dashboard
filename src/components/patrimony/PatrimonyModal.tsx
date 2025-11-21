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
import { Patrimony, CreatePatrimonyRequest } from "../../types/Patrimony";
import { useDropzone } from "react-dropzone";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";

interface PatrimonyModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
  readonly patrimony?: Patrimony | null;
  readonly isEditMode?: boolean;
}

export default function PatrimonyModal({
  isOpen,
  onClose,
  onSuccess,
  patrimony,
  isEditMode = false,
}: PatrimonyModalProps) {
  const [formData, setFormData] = useState<CreatePatrimonyRequest & { file: File | null; filePreview: string | null }>({
    assetName: "",
    category: "",
    subcategory: "",
    acquisitionDate: "",
    acquisitionValue: undefined,
    condition: "Novo",
    currentLocation: "",
    responsible: "",
    resourceSource: "",
    supplierDonor: "",
    observations: "",
    file: null,
    filePreview: null,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (patrimony && isEditMode) {
      setFormData({
        assetName: patrimony.assetName || "",
        category: patrimony.category || "",
        subcategory: patrimony.subcategory || "",
        acquisitionDate: patrimony.acquisitionDate ? new Date(patrimony.acquisitionDate).toISOString().split('T')[0] : "",
        acquisitionValue: patrimony.acquisitionValue,
        condition: patrimony.condition || "Novo",
        currentLocation: patrimony.currentLocation || "",
        responsible: patrimony.responsible || "",
        resourceSource: patrimony.resourceSource || "",
        supplierDonor: patrimony.supplierDonor || "",
        observations: patrimony.observations || "",
        file: null,
        filePreview: patrimony.imageUrl || null,
      });
    } else {
      setFormData({
        assetName: "",
        category: "",
        subcategory: "",
        acquisitionDate: "",
        acquisitionValue: undefined,
        condition: "Novo",
        currentLocation: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
        file: null,
        filePreview: null,
      });
    }
  }, [patrimony, isEditMode, isOpen]);

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

  const handleTextAreaChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      observations: value,
    }));
  };

  const handleDateChange = (date: Date[]) => {
    if (date[0]) {
      setFormData((prev) => ({
        ...prev,
        acquisitionDate: date[0].toISOString().split("T")[0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.assetName.trim() || !formData.category.trim() || !formData.condition) {
      toast.error("Por favor, preencha os campos obrigatórios (Nome do Bem, Categoria e Condição).");
      return;
    }

    if (!['Novo', 'Usado'].includes(formData.condition)) {
      toast.error("Condição deve ser 'Novo' ou 'Usado'.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      
      formDataToSend.append("assetName", formData.assetName);
      formDataToSend.append("category", formData.category);
      if (formData.subcategory) formDataToSend.append("subcategory", formData.subcategory);
      if (formData.acquisitionDate) formDataToSend.append("acquisitionDate", formData.acquisitionDate);
      if (formData.acquisitionValue !== undefined) formDataToSend.append("acquisitionValue", formData.acquisitionValue.toString());
      formDataToSend.append("condition", formData.condition);
      if (formData.currentLocation) formDataToSend.append("currentLocation", formData.currentLocation);
      if (formData.responsible) formDataToSend.append("responsible", formData.responsible);
      if (formData.resourceSource) formDataToSend.append("resourceSource", formData.resourceSource);
      if (formData.supplierDonor) formDataToSend.append("supplierDonor", formData.supplierDonor);
      if (formData.observations) formDataToSend.append("observations", formData.observations);
      
      if (formData.file) {
        formDataToSend.append("file", formData.file);
      }

      if (isEditMode && patrimony) {
        await httpClient.put(`/patrimony/${patrimony.id}`, formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Patrimônio atualizado com sucesso!");
      } else {
        await httpClient.post("/patrimony", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        toast.success("Patrimônio cadastrado com sucesso!");
      }

      // Resetar formulário
      setFormData({
        assetName: "",
        category: "",
        subcategory: "",
        acquisitionDate: "",
        acquisitionValue: undefined,
        condition: "Novo",
        currentLocation: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
        file: null,
        filePreview: null,
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ||
        (error as { message?: string })?.message ||
        "Erro ao salvar patrimônio. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        assetName: "",
        category: "",
        subcategory: "",
        acquisitionDate: "",
        acquisitionValue: undefined,
        condition: "Novo",
        currentLocation: "",
        responsible: "",
        resourceSource: "",
        supplierDonor: "",
        observations: "",
        file: null,
        filePreview: null,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  const conditionOptions = [
    { value: "Novo", label: "Novo" },
    { value: "Usado", label: "Usado" },
  ];

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[900px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            {isEditMode ? "Editar Patrimônio" : "Adicionar Patrimônio"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {isEditMode 
              ? "Atualize as informações do patrimônio." 
              : "Preencha os dados do novo patrimônio."}
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[600px] overflow-y-auto px-2 pb-3">
            {/* Upload de Imagem */}
            <div className="mb-6">
              <ImageUploader
                filePreview={formData.filePreview}
                onFileSelect={(file, preview) => {
                  setFormData((prev) => ({
                    ...prev,
                    file,
                    filePreview: preview,
                  }));
                }}
              />
            </div>

            {/* Informações Básicas */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Básicas
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                  <Label htmlFor="assetName">
                    Nome do Bem <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="assetName"
                    type="text"
                    name="assetName"
                    placeholder="Nome do bem patrimonial"
                    value={formData.assetName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="category">
                    Categoria <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="category"
                    type="text"
                    name="category"
                    placeholder="Ex: Mobiliário, Equipamento, etc."
                    value={formData.category}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="subcategory">Subcategoria</Label>
                  <Input
                    id="subcategory"
                    type="text"
                    name="subcategory"
                    placeholder="Ex: Mesa, Cadeira, etc."
                    value={formData.subcategory}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="condition">
                    Condição <span className="text-error-500">*</span>
                  </Label>
                  <div className="mt-1.5">
                    <Select
                      name="condition"
                      options={conditionOptions}
                      placeholder="Selecione a condição"
                      value={formData.condition}
                      onChange={(value) => handleSelectChange("condition", value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Aquisição */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações de Aquisição
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
                  <div className="relative w-full flatpickr-wrapper mt-1.5">
                    <Flatpickr
                      value={formData.acquisitionDate}
                      onChange={handleDateChange}
                      options={{ dateFormat: "Y-m-d" }}
                      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
                    />
                    <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
                      <CalenderIcon className="size-6" />
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="acquisitionValue">Valor de Aquisição</Label>
                  <Input
                    id="acquisitionValue"
                    type="number"
                    name="acquisitionValue"
                    placeholder="0.00"
                    step="0.01"
                    value={formData.acquisitionValue || ""}
                    onChange={handleNumberChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="resourceSource">Origem do Recurso</Label>
                  <Input
                    id="resourceSource"
                    type="text"
                    name="resourceSource"
                    placeholder="Ex: Doação, Compra, etc."
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
                    placeholder="Nome do fornecedor ou doador"
                    value={formData.supplierDonor}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Localização e Responsável */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Localização e Responsável
              </h5>
              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="currentLocation">Localização Atual</Label>
                  <Input
                    id="currentLocation"
                    type="text"
                    name="currentLocation"
                    placeholder="Ex: Sala 1, Depósito, etc."
                    value={formData.currentLocation}
                    onChange={handleInputChange}
                    disabled={loading}
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

            {/* Observações */}
            <div className="mb-6">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Observações
              </h5>
              <div>
                <Label htmlFor="observations">Observações</Label>
                <TextArea
                  rows={4}
                  value={formData.observations}
                  onChange={handleTextAreaChange}
                  hint="Informações adicionais sobre o patrimônio."
                  className="mt-1.5"
                />
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
            <Button size="sm" disabled={loading}>
              {(() => {
                if (loading) return "Salvando...";
                if (isEditMode) return "Atualizar";
                return "Cadastrar";
              })()}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

interface ImageUploaderProps {
  readonly filePreview: string | null;
  readonly onFileSelect: (file: File | null, preview: string | null) => void;
}

function ImageUploader({
  filePreview,
  onFileSelect,
}: ImageUploaderProps) {
  const onDrop = (acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const previewUrl = URL.createObjectURL(file);
      onFileSelect(file, previewUrl);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`transition border border-dashed cursor-pointer rounded-xl p-7 lg:p-10 ${
        isDragActive
          ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
          : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
      }`}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center">
        {filePreview ? (
          <div className="mb-5 flex justify-center">
            <img 
              src={filePreview} 
              alt="Preview" 
              className="max-h-48 rounded-lg" 
            />
          </div>
        ) : (
          <div className="mb-5 flex justify-center">
            <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
              📁
            </div>
          </div>
        )}
        
        <h4 className="mb-2 font-semibold text-gray-800 dark:text-white/90">
          {(() => {
            if (isDragActive) {
              return "Solte os arquivos aqui";
            }
            return "Arraste & Solte os arquivos aqui";
          })()}
        </h4>
        <span className="text-center mb-3 text-sm text-gray-700 dark:text-gray-400">
          PNG, JPG, WebP, SVG são suportados
        </span>
        <span className="font-medium underline text-theme-sm text-brand-500">
          Ou clique para selecionar
        </span>
        
        {filePreview && (
          <button 
            className="mt-4 text-sm text-red-500 hover:text-red-700"
            onClick={(e) => {
              e.stopPropagation();
              onFileSelect(null, null);
            }}
          >
            Remover imagem
          </button>
        )}
      </div>
    </div>
  );
}

