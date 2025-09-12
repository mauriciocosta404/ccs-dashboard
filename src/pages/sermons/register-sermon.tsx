import { useState } from "react";
import ComponentCard from "../../components/common/ComponentCard";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import Label from "../../components/form/Label";
import TextArea from "../../components/form/input/TextArea";
import Input from "../../components/form/input/InputField";
import Button from "../../components/ui/button/Button";
import httpClient from "../../api/httpClient";
import { toast } from "react-toastify";

// Interfaces para os dados e props
interface SermonFormData {
  name: string;
  description?: string;
  youtubeUrl: string;
}

interface SermonDetailsProps {
  name: string;
  description: string;
  youtubeUrl: string;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onYoutubeUrlChange: (value: string) => void;
  onSubmit: () => void;
  loading: boolean;
}

export default function RegisterSermon() {
  // Estado para armazenar todos os dados do formulário
  const [formData, setFormData] = useState<SermonFormData>({
    name: "",
    description: "",
    youtubeUrl: ""
  });
  
  // Estado para controlar o carregamento
  const [loading, setLoading] = useState<boolean>(false);

  // Manipulador para alterações nos inputs
  const handleInputChange = (name: keyof SermonFormData, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Função para validar URL do YouTube
  const isValidYouTubeUrl = (url: string): boolean => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&\S*)?$/;
    return youtubeRegex.test(url);
  };

  // Função para lidar com o submit do formulário
  const handleSubmit = async (): Promise<void> => {
    if (!formData.name || !formData.youtubeUrl) {
      toast.error("Por favor, preencha o nome e a URL do YouTube da pregação.");
      return;
    }

    // Validar URL do YouTube
    if (!isValidYouTubeUrl(formData.youtubeUrl)) {
      toast.error("Por favor, insira uma URL válida do YouTube.");
      return;
    }

    setLoading(true);

    try {
      // Preparar dados para envio
      const sermonData = {
        name: formData.name,
        youtubeUrl: formData.youtubeUrl,
        ...(formData.description && { description: formData.description })
      };

      // Enviar dados para a API
      const response = await httpClient.post("/sermons", sermonData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.data) {
        toast.success("Pregação cadastrada com sucesso!");
        // Resetar o formulário
        setFormData({
          name: "",
          description: "",
          youtubeUrl: ""
        });
      }
    } catch (error: any) {
      console.error("Erro ao cadastrar pregação:", error);
      toast.error(error?.response?.data?.message || "Erro ao cadastrar pregação. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageMeta
        title="Registrar Pregação"
        description="Formulário para cadastro de pregações"
      />
      <PageBreadcrumb pageTitle="Registrar Pregação" />
      <div className="grid grid-cols-1 gap-6">
        <div className="w-full">
          <SermonDetails 
            name={formData.name}
            description={formData.description || ""}
            youtubeUrl={formData.youtubeUrl}
            onNameChange={(value) => handleInputChange("name", value)}
            onDescriptionChange={(value) => handleInputChange("description", value)}
            onYoutubeUrlChange={(value) => handleInputChange("youtubeUrl", value)}
            onSubmit={handleSubmit}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function SermonDetails({ 
  name, 
  description, 
  youtubeUrl, 
  onNameChange, 
  onDescriptionChange,
  onYoutubeUrlChange,
  onSubmit,
  loading 
}: SermonDetailsProps) {
  // Função para extrair ID do vídeo do YouTube
  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = extractYouTubeId(youtubeUrl);
  const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;

  return (
    <ComponentCard title="Informações da Pregação">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="space-y-6">
          <div>
            <Label htmlFor="nome-pregacao">Nome da Pregação</Label>
            <Input 
              type="text" 
              id="nome-pregacao" 
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              placeholder="Ex: A Parábola do Semeador, O Amor de Deus..."
            />
          </div>

          <div>
            <Label htmlFor="youtube-url">URL do YouTube</Label>
            <Input 
              type="url" 
              id="youtube-url" 
              value={youtubeUrl}
              onChange={(e) => onYoutubeUrlChange(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <p className="mt-1 text-xs text-gray-500">
              Cole o link completo do vídeo do YouTube
            </p>
          </div>

          {thumbnailUrl && (
            <div>
              <Label>Preview do Vídeo</Label>
              <div className="mt-2">
                <img 
                  src={thumbnailUrl} 
                  alt="Thumbnail do vídeo" 
                  className="w-full max-w-sm rounded-lg border"
                />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <Label>Descrição (Opcional)</Label>
            <TextArea
              rows={6}
              value={description}
              onChange={(value: string) => onDescriptionChange(value)}
              hint="Informe uma breve descrição sobre o conteúdo da pregação."
              placeholder="Ex: Nesta pregação falamos sobre a importância da fé e perseverança..."
            />
          </div>

          <Button 
            className="w-full" 
            onClick={onSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Cadastrar Pregação"}
          </Button>

          {youtubeUrl && videoId && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 mb-2">Preview do vídeo:</p>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </div>
    </ComponentCard>
  );
}