import { useState } from "react";
import ComponentCard from "../components/common/ComponentCard";
import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import Label from "../components/form/Label";
import { CalenderIcon } from "../icons";
import Flatpickr from "react-flatpickr";
import TextArea from "../components/form/input/TextArea";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { useDropzone } from "react-dropzone";
import httpClient from "../api/httpClient";
import { toast } from "react-toastify";

// Interfaces para os dados e props
interface EventFormData {
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  file: File | null;
  filePreview: string | null;
}

interface DateInputsProps {
  startDate: string;
  endDate: string;
  onStartDateChange: (date: string) => void;
  onEndDateChange: (date: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
}

interface EventDetailsProps {
  titulo: string;
  descricao: string;
  onTituloChange: (value: string) => void;
  onDescricaoChange: (value: string) => void;
}

interface ImageUploaderProps {
  filePreview: string | null;
  onFileSelect: (file: File | null, preview: string | null) => void;
}

export default function RegisterEvent() {
  // Estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState<EventFormData>({
    titulo: "",
    descricao: "",
    dataInicio: "",
    dataFim: "",
    file: null,
    filePreview: null
  });
  
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Manipulador para alterações nos inputs
  const handleInputChange = (name: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (): Promise<void> => {
    if (!formData.titulo || !formData.descricao || !formData.dataInicio || !formData.dataFim || !formData.file) {
      toast.error("Por favor, preencha todos os campos e selecione uma imagem.");
      return;
    }

    setLoading(true);

    try {
      // Criar FormData para envio multipart
      const eventData = new FormData();
      eventData.append("titulo", formData.titulo);
      eventData.append("descricao", formData.descricao);
      eventData.append("dataInicio", formData.dataInicio);
      eventData.append("dataFim", formData.dataFim);
      eventData.append("file", formData.file);

      // Enviar dados para a API
      const response = await httpClient.post("/event", eventData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (response.data) {
        toast.success("Evento cadastrado com sucesso!");
        // Resetar o formulário ou redirecionar
        setFormData({
          titulo: "",
          descricao: "",
          dataInicio: "",
          dataFim: "",
          file: null,
          filePreview: null
        });
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar evento:", error);
      toast.error(error?.response?.data?.message || "Erro ao cadastrar evento. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Registrar Evento"
        description="Formulário para cadastro de eventos"
      />
      <PageBreadcrumb pageTitle="Registrar Evento" />
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <ImageUploader 
            filePreview={formData.filePreview}
            onFileSelect={(file, preview) => {
              handleInputChange("file", file);
              handleInputChange("filePreview", preview);
            }}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <DateInputs 
              startDate={formData.dataInicio}
              endDate={formData.dataFim}
              onStartDateChange={(date) => handleInputChange("dataInicio", date)}
              onEndDateChange={(date) => handleInputChange("dataFim", date)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
          <div className="space-y-6">
            <EventDetails 
              titulo={formData.titulo}
              descricao={formData.descricao}
              onTituloChange={(value) => handleInputChange("titulo", value)}
              onDescricaoChange={(value) => handleInputChange("descricao", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function DateInputs({ startDate, endDate, onStartDateChange, onEndDateChange, onSubmit, loading }: DateInputsProps) {
  return (
    <ComponentCard title="Detalhes do evento">
      <div className="space-y-6">
        <div>
          <Label htmlFor="start-date">Data de início</Label>
          <DateInput value={startDate} onChange={onStartDateChange} />
        </div>
        <div>
          <Label htmlFor="end-date">Data de término</Label>
          <DateInput value={endDate} onChange={onEndDateChange} />
        </div>
      </div>
      <Button 
        className="lg:w-1/3 w-full mt-4" 
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? "Enviando..." : "Gravar"}
      </Button>
    </ComponentCard>
  );
}

function DateInput({ value, onChange }: DateInputProps) {
  const handleDateChange = (date: Date[]) => {
    if (date[0]) {
      onChange(date[0].toISOString().split("T")[0]); // Y-m-d
    }
  };

  return (
    <div className="relative w-full flatpickr-wrapper">
      <Flatpickr
        value={value}
        onChange={handleDateChange}
        options={{ dateFormat: "Y-m-d" }}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalenderIcon className="size-6" />
      </span>
    </div>
  );
}

function EventDetails({ titulo, descricao, onTituloChange, onDescricaoChange }: EventDetailsProps) {
  return (
    <ComponentCard title="Informações adicionais">
      <div className="space-y-6">
        <div>
          <Label htmlFor="nome-evento">Nome do Evento</Label>
          <Input 
            type="text" 
            id="nome-evento" 
            value={titulo}
            onChange={(e) => onTituloChange(e.target.value)}
          />
        </div>

        <div>
          <Label>Descrição</Label>
          <TextArea
            rows={3}
            value={descricao}
            onChange={(value: string) => onDescricaoChange(value)}
            hint="Informe detalhes relevantes sobre o evento."
          />
        </div>
      </div>
    </ComponentCard>
  );
}

function ImageUploader({ filePreview, onFileSelect }: ImageUploaderProps) {
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
    <ComponentCard title="Imagem do Evento">
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
            {isDragActive ? "Solte os arquivos aqui" : "Arraste & Solte os arquivos aqui"}
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
    </ComponentCard>
  );
}