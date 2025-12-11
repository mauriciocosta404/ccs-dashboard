import { useEffect, useState } from "react";
import httpClient from "../../api/httpClient";
import Button from "../../components/ui/button/Button";
import { toast } from "react-toastify";
import { Settings, CreateSettingsRequest } from "../../types/Settings";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import { CalenderIcon } from "../../icons";
import Flatpickr from "react-flatpickr";
import Skeleton from '@mui/material/Skeleton';

export default function SettingsList() {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await httpClient.get<Settings[]>("/settings");
      if (response.data && response.data.length > 0) {
        const firstSetting = response.data[0];
        setSettings(firstSetting);
        
        let formattedDate = "";
        if (firstSetting.foundingDate) {
          if (typeof firstSetting.foundingDate === 'string') {
            formattedDate = firstSetting.foundingDate.split('T')[0];
          } else {
            formattedDate = new Date(firstSetting.foundingDate).toISOString().split('T')[0];
          }
        }
        
        setFormData({
          churchName: firstSetting.churchName || "",
          acronym: firstSetting.acronym || "",
          localChurch: firstSetting.localChurch || "",
          foundingDate: formattedDate,
          foundingLocation: firstSetting.foundingLocation || "",
          headquartersAddress: firstSetting.headquartersAddress || "",
          phone: firstSetting.phone || "",
          email: firstSetting.email || "",
          website: firstSetting.website || "",
          whatsapp: firstSetting.whatsapp || "",
          facebook: firstSetting.facebook || "",
          pastor: firstSetting.pastor || "",
          vicePastor: firstSetting.vicePastor || "",
          secretary: firstSetting.secretary || "",
          treasurer: firstSetting.treasurer || "",
          others: firstSetting.others || "",
          bank: firstSetting.bank || "",
          accountNumber: firstSetting.accountNumber || "",
          ibanNib: firstSetting.ibanNib || "",
          registrationNumber: firstSetting.registrationNumber || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar configurações:", error);
      toast.error("Erro ao buscar configurações");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

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
    setSaving(true);

    try {
      const dataToSend: CreateSettingsRequest = {};
      
      Object.entries(formData).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          dataToSend[key as keyof CreateSettingsRequest] = value;
        }
      });

      if (settings?.id) {
        await httpClient.put(`/settings/${settings.id}`, dataToSend);
        toast.success("Configuração atualizada com sucesso!");
      } else {
        await httpClient.post("/settings", dataToSend);
        toast.success("Configuração criada com sucesso!");
      }

      await fetchSettings();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        `Erro ao ${settings?.id ? 'atualizar' : 'criar'} configuração. Tente novamente.`;
      toast.error(errorMessage);
      console.error("Erro ao salvar configuração:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <PageMeta
        title="Configurações - ADONAI CCS"
        description="Gerenciar configurações da igreja"
      />
      <PageBreadcrumb pageTitle="Configurações" />
      
      <form onSubmit={handleSubmit}>
        {/* Seção 1: INFORMAÇÕES DA IGREJA */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-4  rounded-t-2xl">
            <h3 className="text-base font-medium">
              INFORMAÇÕES DA IGREJA
            </h3>
      </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
                  {loading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="churchName">Nome da Igreja</Label>
                <Input
                  id="churchName"
                  type="text"
                  name="churchName"
                  value={formData.churchName}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="acronym">Sigla (Se tiver)</Label>
                <Input
                  id="acronym"
                  type="text"
                  name="acronym"
                  value={formData.acronym}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="localChurch">Igreja Local</Label>
                <Input
                  id="localChurch"
                  type="text"
                  name="localChurch"
                  value={formData.localChurch}
                  onChange={handleInputChange}
                  disabled={saving}
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
                      altInput: true,
                      altFormat: "d/m/Y",
                    }}
                    className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-500"
                    placeholder="Selecione a data"
                    disabled={saving}
                  />
                  <CalenderIcon className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none size-5 text-gray-400" />
                </div>
              </div>
              <div>
                <Label htmlFor="foundingLocation">Local de Fundação</Label>
                <Input
                  id="foundingLocation"
                  type="text"
                  name="foundingLocation"
                  value={formData.foundingLocation}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="headquartersAddress">Endereço Actual da SEDE</Label>
                <Input
                  id="headquartersAddress"
                  type="text"
                  name="headquartersAddress"
                  value={formData.headquartersAddress}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="website">Site</Label>
                <Input
                  id="website"
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  type="text"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  type="text"
                  name="facebook"
                  value={formData.facebook}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
                          </div>
            </div>
          )}
          </div>
        </div>

        {/* Seção 2: LIDERENÇA-RESPONSÁVEL */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-4  rounded-t-2xl">
            <h3 className="text-base font-medium">
              LIDERENÇA-RESPONSÁVEL
            </h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="pastor">Pastor</Label>
                <Input
                  id="pastor"
                  type="text"
                  name="pastor"
                  value={formData.pastor}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="vicePastor">Vice-Pastor</Label>
                <Input
                  id="vicePastor"
                  type="text"
                  name="vicePastor"
                  value={formData.vicePastor}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="secretary">Secretária</Label>
                <Input
                  id="secretary"
                  type="text"
                  name="secretary"
                  value={formData.secretary}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="treasurer">Tesoureira</Label>
                <Input
                  id="treasurer"
                  type="text"
                  name="treasurer"
                  value={formData.treasurer}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="others">Outros</Label>
                <Input
                  id="others"
                  type="text"
                  name="others"
                  value={formData.others}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Seção 3: INFORMAÇÕES BANCÁRIAS */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-4  rounded-t-2xl">
            <h3 className="text-base font-medium ">
              INFORMAÇÕES BANCÁRIAS
            </h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
              <Skeleton variant="rectangular" height={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="bank">Banco</Label>
                <Input
                  id="bank"
                  type="text"
                  name="bank"
                  value={formData.bank}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Nº da Conta</Label>
                <Input
                  id="accountNumber"
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="ibanNib">IBAN/NIB</Label>
                <Input
                  id="ibanNib"
                  type="text"
                  name="ibanNib"
                  value={formData.ibanNib}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Seção 4: DADOS DE IDENTIFICAÇÃO */}
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
          <div className="px-6 py-4  rounded-t-2xl">
            <h3 className="text-base font-medium">
              DADOS DE IDENTIFICAÇÃO
            </h3>
          </div>
          <div className="p-4 border-t border-gray-100 dark:border-gray-800 sm:p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton variant="rectangular" height={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div>
                <Label htmlFor="registrationNumber">Nº de Registro/Licença</Label>
                <Input
                  id="registrationNumber"
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  disabled={saving}
                  className="mt-1.5"
                />
              </div>
            </div>
          )}
          </div>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end gap-3">
          <Button
            type="submit"
            size="sm"
            disabled={loading || saving}
          >
            {saving ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </>
  );
}

