interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  success: boolean;
  isFromAPI?: boolean;
}

interface RateLimitInfo {
  lastRequest: number;
  requestCount: number;
  dailyRequestCount: number;
  lastResetDate: string;
}

class AIChatService {
  private geminiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
  private geminiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  
  // Rate limiting - valores conservadores para o free tier
  private readonly MAX_REQUESTS_PER_MINUTE = 3;
  private readonly MAX_REQUESTS_PER_DAY = 50;
  private readonly MIN_INTERVAL_MS = 20000; // 20 segundos entre requests
  
  private readonly STORAGE_KEY = 'aiChatRateLimit';

  private fallbackResponses: { [key: string]: string[] } = {
    'salvação': [
      'A salvação é um dom gratuito de Deus através de Jesus Cristo. Como está escrito em Efésios 2:8-9: "Pois vocês são salvos pela graça, por meio da fé, e isto não vem de vocês, é dom de Deus; não por obras, para que ninguém se glorie."',
      'Jesus disse em João 14:6: "Eu sou o caminho, a verdade e a vida. Ninguém vem ao Pai, a não ser por mim." A salvação vem através da fé em Jesus Cristo como nosso Salvador pessoal.',
      'Para ser salvo, você precisa reconhecer que é pecador, crer que Jesus morreu por seus pecados e ressuscitou, e confessá-lo como seu Senhor e Salvador. Romanos 10:9 diz: "Se você confessar com a sua boca que Jesus é Senhor e crer em seu coração que Deus o ressuscitou dentre os mortos, será salvo."'
    ],
    'oração': [
      'A oração é nossa comunicação direta com Deus. Jesus nos ensinou a orar no Pai Nosso (Mateus 6:9-13). Podemos orar a qualquer momento e em qualquer lugar, pois Deus sempre nos ouve.',
      'Em 1 Tessalonicenses 5:17, Paulo nos exorta a "orar sem cessar". A oração deve ser constante em nossa vida cristã, incluindo adoração, confissão, gratidão e súplicas.',
      'Para ter uma vida de oração eficaz: 1) Separe um tempo específico para orar diariamente, 2) Use a Bíblia para guiar suas orações, 3) Ore com sinceridade e humildade, 4) Seja específico em seus pedidos, 5) Não esqueça de agradecer e louvar a Deus.'
    ],
    'fé': [
      'A fé é a certeza daquilo que esperamos e a prova das coisas que não vemos (Hebreus 11:1). É através da fé que nos aproximamos de Deus e recebemos Suas promessas.',
      'Jesus disse que se tivermos fé do tamanho de um grão de mostarda, poderemos mover montanhas (Mateus 17:20). A fé cresce através da leitura da Palavra e da oração.',
      'A fé não é um sentimento, mas uma decisão de confiar em Deus apesar das circunstâncias. Romanos 10:17 nos ensina: "Consequentemente, a fé vem por se ouvir a mensagem, e a mensagem é ouvida mediante a palavra de Cristo."'
    ],
    'amor': [
      'O amor é o maior mandamento. Jesus disse: "Ame o Senhor, o seu Deus, de todo o seu coração, de toda a sua alma e de todo o seu entendimento. Este é o primeiro e maior mandamento. E o segundo é semelhante a ele: Ame o seu próximo como a si mesmo" (Mateus 22:37-39).',
      '1 Coríntios 13 nos ensina sobre o verdadeiro amor: "O amor é paciente, o amor é bondoso. Não inveja, não se vangloria, não se orgulha..."',
      'O amor de Deus por nós é incondicional e eterno. 1 João 4:19 diz: "Nós amamos porque ele nos amou primeiro." Devemos amar os outros como reflexo do amor que recebemos de Deus.'
    ],
    'perdão': [
      'O perdão é essencial na vida cristã. Jesus nos ensinou a perdoar "setenta vezes sete" (Mateus 18:22), ou seja, sempre. Devemos perdoar como Cristo nos perdoou.',
      'Em Efésios 4:32, Paulo nos exorta: "Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo."',
      'Perdoar não significa esquecer ou aceitar o mal, mas libertar seu coração do ressentimento. O perdão é um ato de obediência a Deus e liberdade para nós mesmos.'
    ],
    'esperança': [
      'Nossa esperança está em Cristo Jesus. Romanos 15:13 diz: "Que o Deus da esperança os encha de toda alegria e paz, por sua confiança nele, para que vocês transbordem de esperança, pelo poder do Espírito Santo."',
      'A esperança cristã não é apenas um desejo, mas uma certeza baseada nas promessas de Deus. Temos esperança da vida eterna e da volta de Jesus.',
      'Mesmo nas dificuldades, podemos ter esperança porque sabemos que Deus está no controle. Romanos 8:28: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam."'
    ],
    'propósito': [
      'Deus tem um propósito para cada vida. Jeremias 29:11 nos assegura: "Porque sou eu que conheço os planos que tenho para vocês, diz o Senhor, planos de fazê-los prosperar e não de causar dano, planos de dar a vocês esperança e um futuro."',
      'Nosso propósito principal é glorificar a Deus e desfrutar dEle para sempre. Cada pessoa tem dons únicos para servir no Reino de Deus.',
      'Para descobrir seu propósito: 1) Ore e busque a Deus, 2) Conheça seus dons e talentos, 3) Observe as necessidades ao seu redor, 4) Busque conselho sábio, 5) Dê passos de obediência mesmo quando incerto.'
    ],
    'dificuldades': [
      'Nas dificuldades, podemos encontrar refúgio em Deus. Salmos 46:1 diz: "Deus é o nosso refúgio e a nossa fortaleza, auxílio sempre presente na adversidade."',
      'Jesus prometeu em João 16:33: "Eu lhes disse essas coisas para que em mim vocês tenham paz. No mundo vocês terão aflições; contudo, tenham ânimo! Eu venci o mundo."',
      'Lembre-se de que Deus usa as dificuldades para nos fortalecer e nos aproximar dEle. Romanos 5:3-4 nos ensina que a tribulação produz perseverança, e a perseverança, caráter aprovado.'
    ],
    'paz': [
      'A paz que Deus oferece é diferente da paz do mundo. João 14:27: "Deixo-lhes a paz; a minha paz lhes dou. Não a dou como o mundo a dá. Não se perturbe o seu coração, nem tenham medo."',
      'Para ter paz em meio às tempestades da vida, mantenha seus olhos em Jesus. Isaías 26:3: "Tu, Senhor, darás perfeita paz àquele cujo propósito é firme, porque ele confia em ti."',
      'A paz de Deus vem através da oração e confiança. Filipenses 4:6-7: "Não andem ansiosos por coisa alguma, mas em tudo, pela oração e súplicas, e com ação de graças, apresentem seus pedidos a Deus. E a paz de Deus, que excede todo o entendimento, guardará seus corações e suas mentes em Cristo Jesus."'
    ]
  };

  private getSystemPrompt(): string {
    return `Você é um assistente espiritual cristão sábio e compassivo da Igreja Adonai Cenáculo da Salvação. Sua função é:

1. Responder questões bíblicas e espirituais com base nas Escrituras
2. Oferecer orientação pastoral amorosa e bíblica
3. Compartilhar versículos relevantes quando apropriado
4. Manter um tom acolhedor, respeitoso e cheio de esperança
5. Direcionar pessoas para buscar orientação pastoral quando necessário
6. Nunca dar conselhos médicos ou legais específicos
7. Sempre apontar para Jesus Cristo como a resposta definitiva

Responda de forma clara, bíblica e pastoral. Use versículos das Escrituras quando relevante e mantenha suas respostas focadas na fé cristã evangélica. Seja conciso mas carinhoso.`;
  }

  private getRateLimitInfo(): RateLimitInfo {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    const today = new Date().toDateString();
    
    if (!stored) {
      return {
        lastRequest: 0,
        requestCount: 0,
        dailyRequestCount: 0,
        lastResetDate: today
      };
    }
    
    const info: RateLimitInfo = JSON.parse(stored);
    
    // Reset daily count if it's a new day
    if (info.lastResetDate !== today) {
      info.dailyRequestCount = 0;
      info.lastResetDate = today;
      info.requestCount = 0; // Reset minute counter too
    }
    
    // Reset minute counter if more than a minute has passed
    if (Date.now() - info.lastRequest > 60000) {
      info.requestCount = 0;
    }
    
    return info;
  }

  private updateRateLimitInfo(info: RateLimitInfo): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(info));
  }

  private canMakeRequest(): { canRequest: boolean; waitTime?: number; reason?: string } {
    const info = this.getRateLimitInfo();
    const now = Date.now();
    
    // Check daily limit
    if (info.dailyRequestCount >= this.MAX_REQUESTS_PER_DAY) {
      return { 
        canRequest: false, 
        reason: 'Limite diário de consultas à IA atingido. Voltarei a usar a API amanhã.' 
      };
    }
    
    // Check minute limit
    if (info.requestCount >= this.MAX_REQUESTS_PER_MINUTE) {
      return { 
        canRequest: false, 
        waitTime: 60 - Math.floor((now - info.lastRequest) / 1000),
        reason: 'Muitas consultas em pouco tempo. Aguarde um momento.' 
      };
    }
    
    // Check minimum interval
    const timeSinceLastRequest = now - info.lastRequest;
    if (timeSinceLastRequest < this.MIN_INTERVAL_MS) {
      const waitTime = Math.ceil((this.MIN_INTERVAL_MS - timeSinceLastRequest) / 1000);
      return { 
        canRequest: false, 
        waitTime,
        reason: `Aguarde ${waitTime} segundos antes da próxima consulta à IA.` 
      };
    }
    
    return { canRequest: true };
  }

  async sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<ChatResponse> {
    // Sempre tenta resposta local primeiro para palavras-chave conhecidas
    const localResponse = this.tryLocalResponse(message);
    if (localResponse.success) {
      return { ...localResponse, isFromAPI: false };
    }

    // Check rate limits before trying API
    const rateLimitCheck = this.canMakeRequest();
    if (!rateLimitCheck.canRequest) {
      console.log('Rate limit exceeded:', rateLimitCheck.reason);
      return this.generateFallbackResponse(message, rateLimitCheck.reason);
    }

    try {
      // Try Gemini API
      const response = await this.tryGeminiAPI(message, conversationHistory);
      if (response.success) {
        // Update rate limit info on successful request
        const info = this.getRateLimitInfo();
        info.lastRequest = Date.now();
        info.requestCount += 1;
        info.dailyRequestCount += 1;
        this.updateRateLimitInfo(info);
        
        return { ...response, isFromAPI: true };
      }
    } catch (error) {
      console.log('Gemini API não disponível:', error);
    }

    // Fallback para respostas locais
    return this.generateFallbackResponse(message);
  }

  private tryLocalResponse(message: string): ChatResponse {
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

    return { message: '', success: false };
  }

  private async tryGeminiAPI(message: string, history: ChatMessage[]): Promise<ChatResponse> {
    if (!this.geminiKey) {
      throw new Error('Gemini API key não configurada');
    }

    // Construir o contexto da conversa de forma mais eficiente
    let conversationContext = this.getSystemPrompt() + '\n\n';
    
    // Adicionar apenas as últimas 4 mensagens para economizar tokens
    const recentHistory = history.slice(-4);
    for (const msg of recentHistory) {
      conversationContext += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}\n`;
    }
    
    conversationContext += `Usuário: ${message}\nAssistente:`;

    const response = await fetch(`${this.geminiUrl}?key=${this.geminiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ 
            text: conversationContext 
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 20,
          topP: 0.8,
          maxOutputTokens: 500, // Reduzido para economizar quota
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      
      // Parse specific error types
      try {
        const errorObj = JSON.parse(errorData);
        if (errorObj.error?.code === 429) {
          // Rate limit exceeded - update our internal tracking
          const info = this.getRateLimitInfo();
          info.dailyRequestCount = this.MAX_REQUESTS_PER_DAY; // Mark as exhausted
          this.updateRateLimitInfo(info);
          
          throw new Error('RATE_LIMIT_EXCEEDED');
        }
      } catch (parseError) {
        // Continue with generic error
      }
      
      throw new Error(`Gemini API falhou: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return {
        message: data.candidates[0].content.parts[0].text,
        success: true
      };
    } else {
      throw new Error('Formato de resposta inválido do Gemini');
    }
  }

  private generateFallbackResponse(message: string, rateLimitReason?: string): ChatResponse {
    const lowerMessage = message.toLowerCase();

    // Se há uma razão de rate limit, inclua na resposta
    if (rateLimitReason) {
      const baseResponse = this.getBasicResponse(lowerMessage);
      return {
        message: `${baseResponse.message}\n\n💡 ${rateLimitReason}`,
        success: true,
        isFromAPI: false
      };
    }
    
    return this.getBasicResponse(lowerMessage);
  }

  private getBasicResponse(lowerMessage: string): ChatResponse {
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
        message: 'A Igreja Adonai Cenáculo da Salvação é uma comunidade acolhedora onde você pode crescer em sua fé! Temos cultos regulares e nosso Pastor está sempre disponível para orientação pastoral. Venha nos visitar! 🏛️',
        success: true
      };
    }

    // Respostas para dúvidas sobre Jesus
    if (lowerMessage.includes('jesus') || lowerMessage.includes('cristo') || lowerMessage.includes('salvador')) {
      return {
        message: 'Jesus Cristo é o centro da nossa fé! Ele é o Filho de Deus que veio ao mundo para nos salvar. Como está escrito em João 3:16: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna." ✝️',
        success: true
      };
    }

    // Respostas para dúvidas sobre a Bíblia
    if (lowerMessage.includes('bíblia') || lowerMessage.includes('biblia') || lowerMessage.includes('escritura') || lowerMessage.includes('versículo')) {
      return {
        message: 'A Bíblia é a Palavra de Deus e nossa fonte de sabedoria e orientação! Recomendo começar lendo o Evangelho de João para conhecer melhor Jesus. "Toda Escritura é inspirada por Deus e útil para o ensino" (2 Timóteo 3:16) 📖',
        success: true
      };
    }

    // Resposta padrão
    return {
      message: 'Obrigado por sua pergunta! Encorajo você a buscar orientação na Palavra de Deus e em oração. Nosso Pastor também está disponível para conversas mais aprofundadas. "Confie no Senhor de todo o seu coração" (Provérbios 3:5-6) 🙏\n\n💡 Para respostas mais personalizadas, aguarde alguns momentos entre as perguntas para que eu possa consultar a IA.',
      success: true
    };
  }

  generateMessageId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  // Método para verificar status da quota
  getRateLimitStatus(): { 
    canUseAPI: boolean; 
    dailyUsed: number; 
    dailyLimit: number; 
    nextResetTime?: Date 
  } {
    const info = this.getRateLimitInfo();
    const rateLimitCheck = this.canMakeRequest();
    
    const nextReset = new Date();
    nextReset.setDate(nextReset.getDate() + 1);
    nextReset.setHours(0, 0, 0, 0);
    
    return {
      canUseAPI: rateLimitCheck.canRequest,
      dailyUsed: info.dailyRequestCount,
      dailyLimit: this.MAX_REQUESTS_PER_DAY,
      nextResetTime: nextReset
    };
  }
}

export const aiChatService = new AIChatService();
export type { ChatMessage, ChatResponse };