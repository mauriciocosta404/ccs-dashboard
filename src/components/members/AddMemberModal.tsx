import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Button from "../ui/button/Button";
import Select from "../form/Select";
import Checkbox from "../form/input/Checkbox";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";
import { User } from "../../types/User";

interface AddMemberModalProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onSuccess?: () => void;
  readonly editingMember?: User | null;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  onSuccess,
  editingMember,
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
  const [sectors, setSectors] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);
  const [loadingSectors, setLoadingSectors] = useState(false);
  const [ministries, setMinistries] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedMinistries, setSelectedMinistries] = useState<string[]>([]);
  const [loadingMinistries, setLoadingMinistries] = useState(false);

  // Preencher formulário quando estiver editando
  useEffect(() => {
    if (editingMember && isOpen) {
      const nameParts = editingMember.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      setFormData({
        firstName,
        lastName,
        email: editingMember.email || "",
        role: editingMember.role || "MEMBRO_NAO_BAPTIZADO",
        phone: editingMember.phone || "",
        bio: editingMember.bio || "",
        address: editingMember.address || "",
        country: editingMember.country || "",
        city: editingMember.city || "",
        marital_status: editingMember.marital_status || "",
        facebook: editingMember.facebook || "",
        twitter: editingMember.twitter || "",
        linkedin: editingMember.linkedin || "",
        instagram: editingMember.instagram || "",
      });

      // Buscar sectors e ministérios do usuário
      fetchUserSectorsAndMinistries(editingMember.id);
    } else if (isOpen && !editingMember) {
      // Resetar formulário quando criar novo
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
      setSelectedSectors([]);
      setSelectedMinistries([]);
    }
  }, [editingMember, isOpen]);

  // Buscar sectors e ministérios quando o modal abrir
  useEffect(() => {
    if (isOpen) {
      fetchSectors();
      fetchMinistries();
    }
  }, [isOpen]);

  const fetchUserSectorsAndMinistries = async (userId: string) => {
    try {
      // Buscar todos os sectors e verificar quais o usuário pertence
      const sectorsResponse = await httpClient.get<Array<{ id: string; name: string; users?: User[] }>>("/sectors");
      const userSectors = sectorsResponse.data
        .filter(sector => sector.users?.some(u => u.id === userId))
        .map(sector => sector.id);
      setSelectedSectors(userSectors);

      // Buscar todos os ministérios e verificar quais o usuário pertence
      const ministriesResponse = await httpClient.get<Array<{ id: string; name: string; users?: User[] }>>("/ministeries");
      const userMinistries = ministriesResponse.data
        .filter(ministry => ministry.users?.some(u => u.id === userId))
        .map(ministry => ministry.id);
      setSelectedMinistries(userMinistries);
    } catch (error) {
      console.error("Erro ao buscar sectors e ministérios do usuário:", error);
    }
  };

  const fetchSectors = async () => {
    setLoadingSectors(true);
    try {
      const response = await httpClient.get<Array<{ id: string; name: string }>>("/sectors");
      setSectors(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar sectors:", error);
      toast.error("Erro ao carregar lista de sectors");
    } finally {
      setLoadingSectors(false);
    }
  };

  const fetchMinistries = async () => {
    setLoadingMinistries(true);
    try {
      const response = await httpClient.get<Array<{ id: string; name: string }>>("/ministeries");
      setMinistries(response.data || []);
    } catch (error) {
      console.error("Erro ao buscar ministérios:", error);
      toast.error("Erro ao carregar lista de ministérios");
    } finally {
      setLoadingMinistries(false);
    }
  };

  const handleSectorToggle = (sectorId: string) => {
    setSelectedSectors((prev) => {
      if (prev.includes(sectorId)) {
        return prev.filter((id) => id !== sectorId);
      } else {
        return [...prev, sectorId];
      }
    });
  };

  const handleMinistryToggle = (ministryId: string) => {
    setSelectedMinistries((prev) => {
      if (prev.includes(ministryId)) {
        return prev.filter((id) => id !== ministryId);
      } else {
        return [...prev, ministryId];
      }
    });
  };

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
        role: formData.role,
      };

      // Não incluir senha na edição
      if (!editingMember) {
        userData.senha = "root"; // Senha padrão apenas na criação
      }

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

      let userId: string;

      if (editingMember) {
        // Modo de edição - fazer PATCH
        await httpClient.patch(`/users/${editingMember.id}`, userData);
        userId = editingMember.id;
        toast.success("Membro atualizado com sucesso!");

        // Atualizar sectors do usuário
        try {
          // Buscar sectors atuais do usuário
          const sectorsResponse = await httpClient.get<Array<{ id: string; name: string; users?: User[] }>>("/sectors");
          const currentSectors = sectorsResponse.data
            .filter(sector => sector.users?.some(u => u.id === userId))
            .map(sector => sector.id);

          // Remover dos sectors que não estão mais selecionados
          const sectorsToRemove = currentSectors.filter(id => !selectedSectors.includes(id));
          await Promise.all(
            sectorsToRemove.map(sectorId =>
              httpClient.delete(`/sectors/${sectorId}/membros/${userId}`)
            )
          );

          // Adicionar aos sectors novos
          const sectorsToAdd = selectedSectors.filter(id => !currentSectors.includes(id));
          await Promise.all(
            sectorsToAdd.map(sectorId =>
              httpClient.post(`/sectors/${sectorId}/membros`, { userId })
            )
          );
        } catch (sectorError) {
          console.error("Erro ao atualizar sectors do usuário:", sectorError);
          toast.warning("Membro atualizado, mas houve erro ao atualizar alguns sectors");
        }

        // Atualizar ministérios do usuário
        try {
          // Buscar ministérios atuais do usuário
          const ministriesResponse = await httpClient.get<Array<{ id: string; name: string; users?: User[] }>>("/ministeries");
          const currentMinistries = ministriesResponse.data
            .filter(ministry => ministry.users?.some(u => u.id === userId))
            .map(ministry => ministry.id);

          // Remover dos ministérios que não estão mais selecionados
          const ministriesToRemove = currentMinistries.filter(id => !selectedMinistries.includes(id));
          await Promise.all(
            ministriesToRemove.map(ministryId =>
              httpClient.delete(`/ministerios/${ministryId}/membros/${userId}`)
            )
          );

          // Adicionar aos ministérios novos
          const ministriesToAdd = selectedMinistries.filter(id => !currentMinistries.includes(id));
          await Promise.all(
            ministriesToAdd.map(ministryId =>
              httpClient.post(`/ministerios/${ministryId}/membros`, { userId })
            )
          );
        } catch (ministryError) {
          console.error("Erro ao atualizar ministérios do usuário:", ministryError);
          toast.warning("Membro atualizado, mas houve erro ao atualizar alguns ministérios");
        }
      } else {
        // Modo de criação - fazer POST
        const response = await httpClient.post("/users", userData);
        // Tentar obter o ID do usuário de diferentes formatos de resposta
        const newUserId = response.data?.id || response.data?.user?.id || (response.data as { id?: string })?.id;

        // Se não conseguiu o ID diretamente, buscar pelo email
        userId = newUserId || "";
        if (!userId) {
          try {
            const usersResponse = await httpClient.get<User[]>("/users");
            const createdUser = usersResponse.data.find((u) => u.email === formData.email);
            userId = createdUser?.id || "";
          } catch (fetchError) {
            console.error("Erro ao buscar usuário criado:", fetchError);
          }
        }

        // Adicionar usuário aos sectors selecionados
        if (userId && selectedSectors.length > 0) {
          try {
            await Promise.all(
              selectedSectors.map((sectorId) =>
                httpClient.post(`/sectors/${sectorId}/membros`, {
                  userId: userId,
                })
              )
            );
          } catch (sectorError) {
            console.error("Erro ao adicionar usuário aos sectors:", sectorError);
            toast.warning("Usuário criado, mas houve erro ao adicionar a alguns sectors");
          }
        }

        // Adicionar usuário aos ministérios selecionados
        if (userId && selectedMinistries.length > 0) {
          try {
            await Promise.all(
              selectedMinistries.map((ministryId) =>
                httpClient.post(`/ministerios/${ministryId}/membros`, {
                  userId: userId,
                })
              )
            );
          } catch (ministryError) {
            console.error("Erro ao adicionar usuário aos ministérios:", ministryError);
            toast.warning("Usuário criado, mas houve erro ao adicionar a alguns ministérios");
          }
        }

        toast.success("Membro cadastrado com sucesso!");
      }

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
      setSelectedSectors([]);
      setSelectedMinistries([]);
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
      setSelectedSectors([]);
      setSelectedMinistries([]);
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
            {editingMember ? "Editar Membro" : "Adicionar Membro"}
          </h4>
          <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
            {editingMember 
              ? "Edite os dados do membro."
              : "Preencha os dados do novo membro. A senha padrão será \"root\"."}
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

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Sectores
              </h5>

              <div className="space-y-3">
                {loadingSectors ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carregando sectors...</p>
                ) : sectors.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum sector disponível. Crie um sector primeiro.
                  </p>
                ) : (
                  sectors.map((sector) => (
                    <div key={sector.id} className="flex items-center">
                      <Checkbox
                        id={`sector-${sector.id}`}
                        checked={selectedSectors.includes(sector.id)}
                        onChange={() => handleSectorToggle(sector.id)}
                        disabled={loading}
                        label={sector.name}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="mt-7">
              <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                Ministérios
              </h5>

              <div className="space-y-3">
                {loadingMinistries ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Carregando ministérios...</p>
                ) : ministries.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nenhum ministério disponível. Crie um ministério primeiro.
                  </p>
                ) : (
                  ministries.map((ministry) => (
                    <div key={ministry.id} className="flex items-center">
                      <Checkbox
                        id={`ministry-${ministry.id}`}
                        checked={selectedMinistries.includes(ministry.id)}
                        onChange={() => handleMinistryToggle(ministry.id)}
                        disabled={loading}
                        label={ministry.name}
                      />
                    </div>
                  ))
                )}
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
            <Button type="submit" size="sm" disabled={loading}>
              {loading 
                ? (editingMember ? "Atualizando..." : "Cadastrando...") 
                : (editingMember ? "Atualizar Membro" : "Cadastrar Membro")}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );

  return createPortal(modalContent, document.body);
}

