import { useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";

interface AddMemberModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onSuccess,
}: AddMemberModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "MEMBRO_NAO_BAPTIZADO",
    phone: "",
    bio: "",
    address: "",
    country: "",
    city: "",
    marital_status: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    instagram: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim()) {
      toast.error("Por favor, preencha os campos obrigatórios (Nome, Sobrenome e Email).");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Por favor, insira um email válido.");
      return;
    }

    setLoading(true);

    try {
      const fullName = `${formData.firstName} ${formData.lastName}`;
      
      const userData: Record<string, string> = {
        name: fullName,
        email: formData.email,
        senha: "root", // Senha padrão
        role: formData.role,
      };

      // Adicionar campos opcionais apenas se preenchidos
      if (formData.phone) userData.phone = formData.phone;
      if (formData.bio) userData.bio = formData.bio;
      if (formData.address) userData.address = formData.address;
      if (formData.country) userData.country = formData.country;
      if (formData.city) userData.city = formData.city;
      if (formData.marital_status) userData.marital_status = formData.marital_status;
      if (formData.facebook) userData.facebook = formData.facebook;
      if (formData.twitter) userData.twitter = formData.twitter;
      if (formData.linkedin) userData.linkedin = formData.linkedin;
      if (formData.instagram) userData.instagram = formData.instagram;

      await httpClient.post("/users", userData);

      toast.success("Membro cadastrado com sucesso!");
      // Resetar formulário
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "MEMBRO_NAO_BAPTIZADO",
        phone: "",
        bio: "",
        address: "",
        country: "",
        city: "",
        marital_status: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      });
      onClose();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        "Erro ao cadastrar membro. Tente novamente.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "MEMBRO_NAO_BAPTIZADO",
        phone: "",
        bio: "",
        address: "",
        country: "",
        city: "",
        marital_status: "",
        facebook: "",
        twitter: "",
        linkedin: "",
        instagram: "",
      });
      onClose();
    }
  };

  const handleCloseClick = () => {
    handleClose();
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: "MEMBRO_NAO_BAPTIZADO", label: "Não Baptizado" },
    { value: "MEMBRO_BAPTIZADO", label: "Baptizado" },
    { value: "LIDER", label: "Líder" },
    { value: "ADMIN", label: "Admin" },
  ];

  const maritalStatusOptions = [
    { value: "", label: "Selecione o estado civil" },
    { value: "SOLTEIRO", label: "Solteiro(a)" },
    { value: "CASADO", label: "Casado(a)" },
    { value: "DIVORCIADO", label: "Divorciado(a)" },
    { value: "VIUVO", label: "Viúvo(a)" },
  ];

  const modalContent = (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[700px] m-4">
      <div className="no-scrollbar relative w-full overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
        <div className="px-2 pr-14">
          <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
            Adicionar Membro
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            Preencha os dados do novo membro. A senha padrão será "root".
          </p>
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
            <div>
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Informações Pessoais
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="firstName">
                    Nome <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    name="firstName"
                    placeholder="Nome"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">
                    Sobrenome <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    name="lastName"
                    placeholder="Sobrenome"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="email">
                    Email <span className="text-error-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="email@exemplo.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="role">
                    Status <span className="text-error-500">*</span>
                  </Label>
                  <div className="mt-1.5">
                    <Select
                      name="role"
                      options={roleOptions}
                      placeholder="Selecione o status"
                      value={formData.role}
                      onChange={(value) => handleSelectChange("role", value)}
                    />
                  </div>
                </div>

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
                  <Label htmlFor="marital_status">Estado Civil</Label>
                  <div className="mt-1.5">
                    <Select
                      name="marital_status"
                      options={maritalStatusOptions}
                      placeholder="Selecione o estado civil"
                      value={formData.marital_status}
                      onChange={(value) => handleSelectChange("marital_status", value)}
                    />
                  </div>
                </div>

                <div className="col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    type="text"
                    name="bio"
                    placeholder="Breve descrição sobre o membro"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Endereço
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    type="text"
                    name="address"
                    placeholder="Endereço completo"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    type="text"
                    name="city"
                    placeholder="Cidade"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="country">País</Label>
                  <Input
                    id="country"
                    type="text"
                    name="country"
                    placeholder="País"
                    value={formData.country}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Redes Sociais
              </h5>

              <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    type="url"
                    name="facebook"
                    placeholder="https://www.facebook.com/perfil"
                    value={formData.facebook}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="twitter">X (Twitter)</Label>
                  <Input
                    id="twitter"
                    type="url"
                    name="twitter"
                    placeholder="https://x.com/perfil"
                    value={formData.twitter}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    name="linkedin"
                    placeholder="https://www.linkedin.com/in/perfil"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    disabled={loading}
                    className="mt-1.5"
                  />
                </div>

                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    type="url"
                    name="instagram"
                    placeholder="https://instagram.com/perfil"
                    value={formData.instagram}
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
              onClick={handleCloseClick}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-lg transition px-4 py-3 text-sm bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-400 dark:ring-gray-700 dark:hover:bg-white/[0.03] dark:hover:text-gray-300 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Close
            </button>
            <Button size="sm" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Membro"}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

