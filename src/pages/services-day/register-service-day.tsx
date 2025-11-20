/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import { CalenderIcon } from "../../icons";
import TextArea from "../../components/form/input/TextArea";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";

// Interfaces para os dados e props
interface ServiceDayFormData {
  name: string;
  weekday: number;
  description?: string;
  title?: string;
  endTime: string;
  time: string;
}

interface ServiceDayDetailsProps {
  name: string;
  weekday: number;
  time: string;
  endTime: string;
  title: string;
  description: string;
  onTitleChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onWeekdayChange: (value: number) => void;
  onTimeChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

interface WeekdaySelectProps {
  value: number;
  onChange: (weekday: number) => void;
}

interface TimeInputProps {
  value: string;
  onChange: (time: string) => void;
}

const WEEKDAYS = [
  { value: 0, label: "Domingo" },
  { value: 1, label: "Segunda-feira" },
  { value: 2, label: "Terça-feira" },
  { value: 3, label: "Quarta-feira" },
  { value: 4, label: "Quinta-feira" },
  { value: 5, label: "Sexta-feira" },
  { value: 6, label: "Sábado" }
];

export default function RegisterServiceDay() {
  // Estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState<ServiceDayFormData>({
    name: "",
    weekday: 0,
    description: "",
    time: "",
    endTime: "",
    title: ""
  });
  
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Manipulador para alterações nos inputs
  const handleInputChange = (name: keyof ServiceDayFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (): Promise<void> => {
    if (!formData.name || !formData.time) {
      toast.error("Por favor, preencha o nome e o horário do culto.");
      return;
    }

    // Validar formato do horário (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(formData.time)) {
      toast.error("Por favor, insira um horário válido no formato HH:mm (ex: 19:30).");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const serviceDayData = {
        name: formData.name,
        weekday: formData.weekday,
        title: formData.title,
        time: formData.time,
        endTime: formData.endTime,
        ...(formData.description && { description: formData.description })
      };

      // Enviar dados para a API
      const response = await httpClient.post("/service-days", serviceDayData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        toast.success("Dia de culto cadastrado com sucesso!");
        // Resetar o formulário
        setFormData({
          name: "",
          weekday: 0,
          description: "",
          time: "",
          endTime: "",
          title: ""
        });
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar dia de culto:", error);
      toast.error(error?.response?.data?.message || "Erro ao cadastrar dia de culto. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Registrar Dia de Culto"
        description="Formulário para cadastro de dias de culto"
      />
      <PageBreadcrumb pageTitle="Registrar Dia de Culto" />
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <ServiceDayDetails 
            name={formData.name}
            weekday={formData.weekday}
            time={formData.time}
            endTime={formData.endTime}
            title={formData.title || ""}
            description={formData.description || ""}
            onTitleChange={(value) => handleInputChange("title", value)}
            onEndTimeChange={(value) => handleInputChange("endTime", value)}
            onNameChange={(value) => handleInputChange("name", value)}
            onWeekdayChange={(value) => handleInputChange("weekday", value)}
            onTimeChange={(value) => handleInputChange("time", value)}
            onDescriptionChange={(value) => handleInputChange("description", value)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function ServiceDayDetails({ 
  name, 
  weekday, 
  time, 
  endTime,
  title,
  onTitleChange,
  onEndTimeChange,
  description, 
  onNameChange, 
  onWeekdayChange, 
  onTimeChange, 
  onDescriptionChange,
  onSubmit,
  loading 
}: ServiceDayDetailsProps) {
  return (
    <ComponentCard title="Informações do Dia de Culto">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label htmlFor="nome-culto">Nome do Culto</Label>
            <Input 
              type="text" 
              id="nome-culto" 
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: Culto de Domingo, Reunião de Oração..."
            />
          </div>

          <div>
            <Label htmlFor="dia-semana">Dia da Semana</Label>
            <WeekdaySelect 
              value={weekday} 
              onChange={onWeekdayChange} 
            />
          </div>

          <div>
            <Label htmlFor="horario">Horário</Label>
            <TimeInput 
              value={time} 
              onChange={onTimeChange} 
            />
          </div>

          <div>
            <Label htmlFor="titulo">Título</Label>
            <Input 
              type="text" 
              id="titulo" 
              value={title} 
              onChange={(e) => onTitleChange(e.target.value)} 
            />
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <Label>Descrição (Opcional)</Label>
            <TextArea
              rows={5}
              value={description}
              onChange={(value: string) => onDescriptionChange(value)}
              placeholder="Ex: Culto com louvor, pregação da palavra e oração..."
            />
          </div>

          <div>
            <Label htmlFor="horario">Horário de término</Label>
            <TimeInput 
              value={endTime} 
              onChange={onEndTimeChange} 
            />
          </div>

          <Button 
            className="w-full md:mt-6" 
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Cadastrar Dia de Culto"}
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}

function WeekdaySelect({ value, onChange }: WeekdaySelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
    >
      {WEEKDAYS.map((day) => (
        <option key={day.value} value={day.value}>
          {day.label}
        </option>
      ))}
    </select>
  );
}

function TimeInput({ value, onChange }: TimeInputProps) {
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value;
    onChange(timeValue);
  };

  return (
    <div className="relative w-full">
      <input
        type="time"
        value={value}
        onChange={handleTimeChange}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
        placeholder="HH:mm"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalenderIcon className="size-6" />
      </span>
    </div>
  );
}