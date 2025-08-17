interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  success: boolean;
}

class AIChatService {
  //private apiUrl = 'https://api.openai.com/v1/chat/completions';
  private fallbackResponses: { [key: string]: string[] } = {
    'salvação': [
      'A salvação é um dom gratuito de Deus através de Jesus Cristo. Como está escrito em Efésios 2:8-9: "Pois vocês são salvos pela graça, por meio da fé, e isto não vem de vocês, é dom de Deus; não por obras, para que ninguém se glorie."',
      'Jesus disse em João 14:6: "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai, a não ser por mim." A salvação vem através da fé em Jesus Cristo como nosso Salvador pessoal.'
    ],
    'oração': [
      'A oração é nossa comunicação direta com Deus. Jesus nos ensinou a orar no Pai Nosso (Mateus 6:9-13). Podemos orar a qualquer momento e em qualquer lugar, pois Deus sempre nos ouve.',
      'Em 1 Tessalonicenses 5:17, Paulo nos exorta a "orar sem cessar". A oração deve ser constante em nossa vida cristã, incluindo adoração, confissão, gratidão e súplicas.'
    ],
    'fé': [
      'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos (Hebreus 11:1). É através da fé que nos aproximamos de Deus e recebemos Suas promessas.',
      'Jesus disse que se tivermos fé do tamanho de um grão de mostarda, poderemos mover montanhas (Mateus 17:20). A fé cresce através da leitura da Palavra e da oração.'
    ],
    'amor': [
      'O amor é o maior mandamento. Jesus disse: "Ame o Senhor, o seu Deus, de todo o seu coração, de toda a sua alma e de todo o seu entendimento. Este é o primeiro e maior mandamento. E o segundo é semelhante a ele: Ame o seu próximo como a si mesmo" (Mateus 22:37-39).',
      '1 Coríntios 13 nos ensina sobre o verdadeiro amor: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha..."'
    ],
    'perdão': [
      'O perdão é essencial na vida cristã. Jesus nos ensinou a perdoar "setenta vezes sete" (Mateus 18:22), ou seja, sempre. Devemos perdoar como Cristo nos perdoou.',
      'Em Efésios 4:32, Paulo nos exorta: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo."'
    ],
    'esperança': [
      'Nossa esperança está em Cristo Jesus. Romanos 15:13 diz: "Que o Deus da esperança os encha de toda alegria e paz, por sua confiança nele, para que vocês transbordem de esperança, pelo poder do Espírito Santo."',
      'A esperança cristã não é apenas um desejo, mas uma certeza baseada nas promessas de Deus. Temos esperança da vida eterna e da volta de Jesus.'
    ],
    'propósito': [
      'Deus tem um propósito para cada vida. Jeremias 29:11 nos assegura: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro."',
      'Nosso propósito principal é glorificar a Deus e desfrutar dEle para sempre. Cada pessoa tem dons únicos para servir no Reino de Deus.'
    ]
  };

  /*private getSystemPrompt(): string {
    return `Você é um assistente espiritual cristão sábio e compassivo da Igreja Adonai Cenáculo da Salvação. Sua função é:

1. Responder questões bíblicas e espirituais com base nas Escrituras
2. Oferecer orientação pastoral amorosa e bíblica
3. Compartilhar versículos relevantes quando apropriado
4. Manter um tom acolhedor, respeitoso e cheio de esperança
5. Direcionar pessoas para buscar orientação pastoral quando necessário
6. Nunca dar conselhos médicos ou legais específicos
7. Sempre apontar para Jesus Cristo como a resposta definitiva

Responda de forma clara, bíblica e pastoral. Use versículos das Escrituras quando relevante e mantenha suas respostas focadas na fé cristã evangélica.`;
  }*/

  async sendMessage(message: string/*, conversationHistory: ChatMessage[] = []*/): Promise<ChatResponse> {
    try {
      // Primeiro, tenta usar uma API real (se disponível)
      const response = await this.tryRealAPI(/*message,*/ /*conversationHistory*/);
      if (response.success) {
        return response;
      }
    } catch (error: any) {
      console.log('API externa não disponível, usando respostas locais');
    }

    // Fallback para respostas locais inteligentes
    return this.generateLocalResponse(message);
  }

  private async tryRealAPI(/*message: string, history: ChatMessage[]*/): Promise<ChatResponse> {
    // Esta função tentaria usar uma API real se estivesse configurada
    // Por enquanto, sempre retorna falha para usar o fallback local
    throw new Error('API externa não configurada');
  }

  private generateLocalResponse(message: string): ChatResponse {
    const lowerMessage = message.toLowerCase();
    
    // Respostas específicas baseadas em palavras-chave
    for (const [keyword, responses] of Object.entries(this.fallbackResponses)) {
      if (lowerMessage.includes(keyword)) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        return {
          message: randomResponse,
          success: true
        };
      }
    }

    // Respostas para saudações
    if (lowerMessage.includes('olá') || lowerMessage.includes('oi') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
      return {
        message: 'Olá! Que a paz do Senhor esteja com você! 🙏 Como posso ajudá-lo hoje? Posso responder questões sobre a Bíblia, fé, oração, ou qualquer dúvida espiritual que você tenha.',
        success: true
      };
    }

    // Respostas para agradecimentos
    if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu') || lowerMessage.includes('muito bem')) {
      return {
        message: 'Fico feliz em poder ajudar! Que Deus continue abençoando sua jornada espiritual. Se tiver mais dúvidas, estarei aqui. "Deem graças ao Senhor, porque ele é bom; o seu amor dura para sempre!" (Salmos 107:1) 🙏',
        success: true
      };
    }

    // Respostas para perguntas sobre a igreja
    if (lowerMessage.includes('igreja') || lowerMessage.includes('culto') || lowerMessage.includes('pastor')) {
      return {
        message: 'A Igreja Adonai Cenáculo da Salvação é uma comunidade acolhedora onde você pode crescer em sua fé! Temos cultos aos domingos às 10h, quartas às 19h30 e sábados às 19h para os jovens. Nosso Pastor João Silva está sempre disponível para orientação pastoral. Venha nos visitar! 🏛️',
        success: true
      };
    }

    // Respostas para dúvidas sobre Jesus
    if (lowerMessage.includes('jesus') || lowerMessage.includes('cristo') || lowerMessage.includes('salvador')) {
      return {
        message: 'Jesus Cristo é o centro da nossa fé! Ele é o Filho de Deus que veio ao mundo para nos salvar. Como está escrito em João 3:16: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna." Você gostaria de saber mais sobre como ter um relacionamento pessoal com Jesus? ✝️',
        success: true
      };
    }

    // Respostas para dúvidas sobre a Bíblia
    if (lowerMessage.includes('bíblia') || lowerMessage.includes('biblia') || lowerMessage.includes('escritura') || lowerMessage.includes('versículo')) {
      return {
        message: 'A Bíblia é a Palavra de Deus e nossa fonte de sabedoria e orientação! Você pode explorar a Bíblia completa aqui no nosso site clicando em "Bíblia" no menu. Recomendo começar lendo o Evangelho de João para conhecer melhor Jesus. "Toda Escritura é inspirada por Deus e útil para o ensino, para a repreensão, para a correção e para a instrução na justiça" (2 Timóteo 3:16) 📖',
        success: true
      };
    }

    // Resposta padrão
    return {
      message: 'Obrigado por sua pergunta! Embora eu não tenha uma resposta específica no momento, encorajo você a buscar orientação na Palavra de Deus e em oração. Nosso Pastor João Silva também está disponível para conversas mais aprofundadas. "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento; reconheça o Senhor em todos os seus caminhos, e ele endireitará as suas veredas." (Provérbios 3:5-6) 🙏',
      success: true
    };
  }

  generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export const aiChatService = new AIChatService();
export type { ChatMessage, ChatResponse };