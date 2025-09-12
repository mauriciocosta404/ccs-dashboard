/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";

// Interfaces para os dados e props
interface EbdStudentFormData {
  fullName: string;
  gender: string;
  address: string;
  fatherName: string;
  motherName: string;
  birthDate: string;
  nationality: string;
  teacherId?: string;
}

interface PersonalInfoProps {
  fullName: string;
  gender: string;
  birthDate: string;
  nationality: string;
  onFullNameChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onBirthDateChange: (value: string) => void;
  onNationalityChange: (value: string) => void;
}

interface FamilyInfoProps {
  fatherName: string;
  motherName: string;
  address: string;
  teacherId?: string;
  onFatherNameChange: (value: string) => void;
  onMotherNameChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onTeacherIdChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
}

interface GenderSelectProps {
  value: string;
  onChange: (gender: string) => void;
}

const GENDER_OPTIONS = [
  { value: "", label: "Selecione o gênero" },
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" }
];

export default function RegisterEbdStudents() {
  // Estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState<EbdStudentFormData>({
    fullName: "",
    gender: "",
    address: "",
    fatherName: "",
    motherName: "",
    birthDate: "",
    nationality: "Angolana",
    teacherId: ""
  });
  
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Manipulador para alterações nos inputs
  const handleInputChange = (name: keyof EbdStudentFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (): Promise<void> => {
    if (!formData.fullName || !formData.gender || !formData.birthDate || !formData.nationality) {
      toast.error("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const studentData = {
        fullName: formData.fullName,
        gender: formData.gender,
        address: formData.address,
        fatherName: formData.fatherName,
        motherName: formData.motherName,
        birthDate: formData.birthDate,
        nationality: formData.nationality,
        ...(formData.teacherId && { teacherId: formData.teacherId })
      };

      // Enviar dados para a API
      const response = await httpClient.post("/ebd/students", studentData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        toast.success("Aluno cadastrado com sucesso!");
        // Resetar o formulário
        setFormData({
          fullName: "",
          gender: "",
          address: "",
          fatherName: "",
          motherName: "",
          birthDate: "",
          nationality: "Angolana",
          teacherId: ""
        });
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar aluno:", error);
      toast.error(error?.response?.data?.message || "Erro ao cadastrar aluno. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Registrar Aluno EBD"
        description="Formulário para cadastro de alunos da Escola Bíblica Dominical"
      />
      <PageBreadcrumb pageTitle="Registrar Aluno EBD" />
      <div className="grid grid-cols-1 gap-6">
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="space-y-6">
            <PersonalInfo 
              fullName={formData.fullName}
              gender={formData.gender}
              birthDate={formData.birthDate}
              nationality={formData.nationality}
              onFullNameChange={(value) => handleInputChange("fullName", value)}
              onGenderChange={(value) => handleInputChange("gender", value)}
              onBirthDateChange={(value) => handleInputChange("birthDate", value)}
              onNationalityChange={(value) => handleInputChange("nationality", value)}
            />
          </div>
          <div className="space-y-6">
            <FamilyInfo 
              fatherName={formData.fatherName}
              motherName={formData.motherName}
              address={formData.address}
              teacherId={formData.teacherId}
              onFatherNameChange={(value) => handleInputChange("fatherName", value)}
              onMotherNameChange={(value) => handleInputChange("motherName", value)}
              onAddressChange={(value) => handleInputChange("address", value)}
              onTeacherIdChange={(value) => handleInputChange("teacherId", value)}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PersonalInfo({ 
  fullName, 
  gender, 
  birthDate, 
  nationality, 
  onFullNameChange, 
  onGenderChange, 
  onBirthDateChange, 
  onNationalityChange 
}: PersonalInfoProps) {
  return (
    <ComponentCard title="Informações Pessoais">
      <div className="space-y-6">
        <div>
          <Label htmlFor="full-name">Nome Completo *</Label>
          <Input 
            type="text" 
            id="full-name" 
            value={fullName}
            onChange={(e) => onFullNameChange(e.target.value)}
            placeholder="Digite o nome completo do aluno"
          />
        </div>

        <div>
          <Label htmlFor="gender">Gênero *</Label>
          <GenderSelect 
            value={gender} 
            onChange={onGenderChange} 
          />
        </div>

        <div>
          <Label htmlFor="birth-date">Data de Nascimento *</Label>
          <DateInput 
            value={birthDate} 
            onChange={onBirthDateChange}
            placeholder="Selecione a data de nascimento"
          />
        </div>

        <div>
          <Label htmlFor="nationality">Nacionalidade *</Label>
          <Input 
            type="text" 
            id="nationality" 
            value={nationality}
            onChange={(e) => onNationalityChange(e.target.value)}
            placeholder="Ex: Angolana, Brasileira..."
          />
        </div>
      </div>
    </ComponentCard>
  );
}

function FamilyInfo({ 
  fatherName, 
  motherName, 
  address, 
  //teacherId,
  onFatherNameChange, 
  onMotherNameChange, 
  onAddressChange, 
  //onTeacherIdChange,
  onSubmit,
  loading 
}: FamilyInfoProps) {
  return (
    <ComponentCard title="Informações Familiares e Endereço">
      <div className="space-y-6">
        <div>
          <Label htmlFor="father-name">Nome do Pai</Label>
          <Input 
            type="text" 
            id="father-name" 
            value={fatherName}
            onChange={(e) => onFatherNameChange(e.target.value)}
            placeholder="Nome completo do pai"
          />
        </div>

        <div>
          <Label htmlFor="mother-name">Nome da Mãe</Label>
          <Input 
            type="text" 
            id="mother-name" 
            value={motherName}
            onChange={(e) => onMotherNameChange(e.target.value)}
            placeholder="Nome completo da mãe"
          />
        </div>

        <div>
          <Label htmlFor="address">Endereço</Label>
          <Input 
            type="text" 
            id="address" 
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            placeholder="Endereço completo"
          />
        </div>

        {/*<div>
          <Label htmlFor="teacher-id">ID do Professor (Opcional)</Label>
          <Input 
            type="text" 
            id="teacher-id" 
            value={teacherId || ""}
            onChange={(e) => onTeacherIdChange(e.target.value)}
            placeholder="ID do professor responsável"
          />
          <p className="mt-1 text-xs text-gray-500">
            Deixe vazio se não souber o ID do professor
          </p>
        </div>*/}

        <Button 
          className="w-full" 
          onClick={onSubmit}
          disabled={loading}
        >
          {loading ? "Enviando..." : "Cadastrar Aluno"}
        </Button>
      </div>
    </ComponentCard>
  );
}

function GenderSelect({ value, onChange }: GenderSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
    >
      {GENDER_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function DateInput({ value, onChange, placeholder }: DateInputProps) {
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
        options={{ 
          dateFormat: "Y-m-d",
          maxDate: new Date(), // Não permite datas futuras
          altInput: true,
          altFormat: "d/m/Y"
        }}
        placeholder={placeholder}
        className="h-11 w-full rounded-lg border appearance-none px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-3 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 bg-transparent text-gray-800 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:border-gray-700 dark:focus:border-brand-800"
      />
      <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-gray-400">
        <CalenderIcon className="size-6" />
      </span>
    </div>
  );
}