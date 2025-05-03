import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import { User } from "../../types/User";
import { toast } from "react-toastify";
import httpClient from "../../api/httpClient";
import { useState } from "react";

type UserInfoCardProps = {
  user: User;
  onUpdate?: (updatedUser: User) => void;
};

export default function UserInfoCard({ user, onUpdate }: UserInfoCardProps) {
  const { isOpen, openModal, closeModal } = useModal();

  const [formData, setFormData] = useState<Partial<User>>({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || '',
    facebook: user.facebook || '',
    twitter: user.twitter || '',
    linkedin: user.linkedin || '',
    instagram: user.instagram || '',
    city: user.city || '',
    role: user.role
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await httpClient.patch(`/users/${user.id}`, formData);
      toast.success("Perfil atualizado com sucesso!");
      if (onUpdate) {
        onUpdate(response.data);
      }
      closeModal();
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
      console.error("Erro ao atualizar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informações pessoais
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Nome Completo
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {user.name || 'Não informado'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Email address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.email}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Phone
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.phone || 'Não informado'}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Bio
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {user.bio || 'Não informado'}
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={openModal}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
        >
          <svg
            className="fill-current"
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
              fill=""
            />
          </svg>
          Editar
        </button>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Personal Information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your details to keep your profile up-to-date.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Social Links
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div>
                    <Label>Facebook</Label>
                    <Input
                      type="text"
                      name="facebook"
                      value={formData.facebook || ""}
                      onChange={handleInputChange}
                      placeholder="https://www.facebook.com/seu-perfil"
                    />
                  </div>

                  <div>
                    <Label>X.com</Label>
                    <Input 
                      type="text" 
                      name="twitter"
                      value={formData.twitter || ""}
                      onChange={handleInputChange}
                      placeholder="https://x.com/seu-perfil" 
                    />
                  </div>

                  <div>
                    <Label>Linkedin</Label>
                    <Input
                      type="text"
                      name="linkedin"
                      value={formData.linkedin || ""}
                      onChange={handleInputChange}
                      placeholder="https://www.linkedin.com/in/seu-perfil"
                    />
                  </div>

                  <div>
                    <Label>Instagram</Label>
                    <Input 
                      type="text" 
                      name="instagram"
                      value={formData.instagram || ""}
                      onChange={handleInputChange}
                      placeholder="https://instagram.com/seu-perfil" 
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Personal Information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                <div className="col-span-2">
                    <Label>Nome Completo</Label>
                    <Input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email Address</Label>
                    <Input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input 
                      type="tel" 
                      name="phone"
                      value={formData.phone || ""}
                      onChange={handleInputChange}
                      placeholder="+244 123 456 789"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Bio</Label>
                    <Input 
                      type="text" 
                      name="bio"
                      value={formData.bio || ""}
                      onChange={handleInputChange}
                      placeholder="Sua breve descrição"
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Status</Label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm dark:border-gray-700 dark:bg-gray-800"
                    >
                      <option value="MEMBRO_NAO_BAPTIZADO">Membro Não Batizado</option>
                      <option value="MEMBRO_BAPTIZADO">Membro Batizado</option>
                      <option value="LIDER">Líder</option>
                      <option value="ADMIN">Admin</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} disabled={isLoading}>
                Close
              </Button>
              <Button 
                size="sm" 
                disabled={isLoading}
              >
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
