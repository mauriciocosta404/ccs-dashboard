interface BibleVerse {
  book: {
    abbrev: string;
    name: string;
  };
  chapter: number;
  number: number;
  text: string;
}

interface BibleChapter {
  book: {
    abbrev: string;
    name: string;
  };
  chapter: {
    number: number;
    verses: number;
  };
  verses: BibleVerse[];
}

interface BibleBook {
  abbrev: string;
  author: string;
  chapters: number;
  group: string;
  name: string;
  testament: string;
}

interface SearchResult {
  occurrence: number;
  version: string;
  verses: BibleVerse[];
}

class BibleApiService {
  private baseUrl = 'https://www.abibliadigital.com.br/api';
  private version = 'nvi'; // Nova Versão Internacional

  async getBooks(): Promise<BibleBook[]> {
    try {
      const response = await fetch(`${this.baseUrl}/books`);
      if (!response.ok) {
        // Fallback para dados locais se a API não estiver disponível
        return this.getFallbackBooks();
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar livros da API, usando dados locais:', error);
      return this.getFallbackBooks();
    }
  }

  async getChapter(bookAbbrev: string, chapter: number): Promise<BibleChapter | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${this.version}/${bookAbbrev}/${chapter}`);
      if (!response.ok) {
        return this.getFallbackChapter(bookAbbrev, chapter);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar capítulo da API, usando dados locais:', error);
      return this.getFallbackChapter(bookAbbrev, chapter);
    }
  }

  async getVerse(bookAbbrev: string, chapter: number, verse: number): Promise<BibleVerse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${this.version}/${bookAbbrev}/${chapter}/${verse}`);
      if (!response.ok) {
        return this.getFallbackVerse(bookAbbrev, chapter, verse);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versículo da API, usando dados locais:', error);
      return this.getFallbackVerse(bookAbbrev, chapter, verse);
    }
  }

  async searchVerses(query: string): Promise<SearchResult | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/search?version=${this.version}&search=${encodeURIComponent(query)}`);
      if (!response.ok) {
        return this.getFallbackSearch(query);
      }
      return await response.json();
    } catch (error) {
      console.error('Erro na busca da API, usando dados locais:', error);
      return this.getFallbackSearch(query);
    }
  }

  async getRandomVerse(): Promise<BibleVerse | null> {
    try {
      const response = await fetch(`${this.baseUrl}/verses/${this.version}/random`);
      if (!response.ok) {
        return this.getFallbackRandomVerse();
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar versículo aleatório da API, usando dados locais:', error);
      return this.getFallbackRandomVerse();
    }
  }

  // Métodos de fallback com dados locais
  private getFallbackBooks(): BibleBook[] {
    return [
      // Antigo Testamento
      { abbrev: 'gn', name: 'Gênesis', author: 'Moisés', chapters: 50, group: 'Pentateuco', testament: 'VT' },
      { abbrev: 'ex', name: 'Êxodo', author: 'Moisés', chapters: 40, group: 'Pentateuco', testament: 'VT' },
      { abbrev: 'lv', name: 'Levítico', author: 'Moisés', chapters: 27, group: 'Pentateuco', testament: 'VT' },
      { abbrev: 'nm', name: 'Números', author: 'Moisés', chapters: 36, group: 'Pentateuco', testament: 'VT' },
      { abbrev: 'dt', name: 'Deuteronômio', author: 'Moisés', chapters: 34, group: 'Pentateuco', testament: 'VT' },
      { abbrev: 'js', name: 'Josué', author: 'Josué', chapters: 24, group: 'Históricos', testament: 'VT' },
      { abbrev: 'jz', name: 'Juízes', author: 'Samuel', chapters: 21, group: 'Históricos', testament: 'VT' },
      { abbrev: 'rt', name: 'Rute', author: 'Samuel', chapters: 4, group: 'Históricos', testament: 'VT' },
      { abbrev: '1sm', name: '1 Samuel', author: 'Samuel', chapters: 31, group: 'Históricos', testament: 'VT' },
      { abbrev: '2sm', name: '2 Samuel', author: 'Samuel', chapters: 24, group: 'Históricos', testament: 'VT' },
      { abbrev: '1rs', name: '1 Reis', author: 'Jeremias', chapters: 22, group: 'Históricos', testament: 'VT' },
      { abbrev: '2rs', name: '2 Reis', author: 'Jeremias', chapters: 25, group: 'Históricos', testament: 'VT' },
      { abbrev: '1cr', name: '1 Crônicas', author: 'Esdras', chapters: 29, group: 'Históricos', testament: 'VT' },
      { abbrev: '2cr', name: '2 Crônicas', author: 'Esdras', chapters: 36, group: 'Históricos', testament: 'VT' },
      { abbrev: 'ed', name: 'Esdras', author: 'Esdras', chapters: 10, group: 'Históricos', testament: 'VT' },
      { abbrev: 'ne', name: 'Neemias', author: 'Neemias', chapters: 13, group: 'Históricos', testament: 'VT' },
      { abbrev: 'et', name: 'Ester', author: 'Mardoqueu', chapters: 10, group: 'Históricos', testament: 'VT' },
      { abbrev: 'jo', name: 'Jó', author: 'Desconhecido', chapters: 42, group: 'Poéticos', testament: 'VT' },
      { abbrev: 'sl', name: 'Salmos', author: 'Davi e outros', chapters: 150, group: 'Poéticos', testament: 'VT' },
      { abbrev: 'pv', name: 'Provérbios', author: 'Salomão', chapters: 31, group: 'Poéticos', testament: 'VT' },
      { abbrev: 'ec', name: 'Eclesiastes', author: 'Salomão', chapters: 12, group: 'Poéticos', testament: 'VT' },
      { abbrev: 'ct', name: 'Cânticos', author: 'Salomão', chapters: 8, group: 'Poéticos', testament: 'VT' },
      { abbrev: 'is', name: 'Isaías', author: 'Isaías', chapters: 66, group: 'Profetas Maiores', testament: 'VT' },
      { abbrev: 'jr', name: 'Jeremias', author: 'Jeremias', chapters: 52, group: 'Profetas Maiores', testament: 'VT' },
      { abbrev: 'lm', name: 'Lamentações', author: 'Jeremias', chapters: 5, group: 'Profetas Maiores', testament: 'VT' },
      { abbrev: 'ez', name: 'Ezequiel', author: 'Ezequiel', chapters: 48, group: 'Profetas Maiores', testament: 'VT' },
      { abbrev: 'dn', name: 'Daniel', author: 'Daniel', chapters: 12, group: 'Profetas Maiores', testament: 'VT' },
      { abbrev: 'os', name: 'Oséias', author: 'Oséias', chapters: 14, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'jl', name: 'Joel', author: 'Joel', chapters: 3, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'am', name: 'Amós', author: 'Amós', chapters: 9, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'ob', name: 'Obadias', author: 'Obadias', chapters: 1, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'jn', name: 'Jonas', author: 'Jonas', chapters: 4, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'mq', name: 'Miquéias', author: 'Miquéias', chapters: 7, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'na', name: 'Naum', author: 'Naum', chapters: 3, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'hc', name: 'Habacuque', author: 'Habacuque', chapters: 3, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'sf', name: 'Sofonias', author: 'Sofonias', chapters: 3, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'ag', name: 'Ageu', author: 'Ageu', chapters: 2, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'zc', name: 'Zacarias', author: 'Zacarias', chapters: 14, group: 'Profetas Menores', testament: 'VT' },
      { abbrev: 'ml', name: 'Malaquias', author: 'Malaquias', chapters: 4, group: 'Profetas Menores', testament: 'VT' },
      
      // Novo Testamento
      { abbrev: 'mt', name: 'Mateus', author: 'Mateus', chapters: 28, group: 'Evangelhos', testament: 'NT' },
      { abbrev: 'mc', name: 'Marcos', author: 'Marcos', chapters: 16, group: 'Evangelhos', testament: 'NT' },
      { abbrev: 'lc', name: 'Lucas', author: 'Lucas', chapters: 24, group: 'Evangelhos', testament: 'NT' },
      { abbrev: 'jo', name: 'João', author: 'João', chapters: 21, group: 'Evangelhos', testament: 'NT' },
      { abbrev: 'at', name: 'Atos', author: 'Lucas', chapters: 28, group: 'Histórico', testament: 'NT' },
      { abbrev: 'rm', name: 'Romanos', author: 'Paulo', chapters: 16, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: '1co', name: '1 Coríntios', author: 'Paulo', chapters: 16, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: '2co', name: '2 Coríntios', author: 'Paulo', chapters: 13, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: 'gl', name: 'Gálatas', author: 'Paulo', chapters: 6, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: 'ef', name: 'Efésios', author: 'Paulo', chapters: 6, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: 'fp', name: 'Filipenses', author: 'Paulo', chapters: 4, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: 'cl', name: 'Colossenses', author: 'Paulo', chapters: 4, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: '1ts', name: '1 Tessalonicenses', author: 'Paulo', chapters: 5, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: '2ts', name: '2 Tessalonicenses', author: 'Paulo', chapters: 3, group: 'Cartas Paulinas', testament: 'NT' },
      { abbrev: '1tm', name: '1 Timóteo', author: 'Paulo', chapters: 6, group: 'Cartas Pastorais', testament: 'NT' },
      { abbrev: '2tm', name: '2 Timóteo', author: 'Paulo', chapters: 4, group: 'Cartas Pastorais', testament: 'NT' },
      { abbrev: 'tt', name: 'Tito', author: 'Paulo', chapters: 3, group: 'Cartas Pastorais', testament: 'NT' },
      { abbrev: 'fm', name: 'Filemom', author: 'Paulo', chapters: 1, group: 'Cartas Pastorais', testament: 'NT' },
      { abbrev: 'hb', name: 'Hebreus', author: 'Desconhecido', chapters: 13, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: 'tg', name: 'Tiago', author: 'Tiago', chapters: 5, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: '1pe', name: '1 Pedro', author: 'Pedro', chapters: 5, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: '2pe', name: '2 Pedro', author: 'Pedro', chapters: 3, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: '1jo', name: '1 João', author: 'João', chapters: 5, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: '2jo', name: '2 João', author: 'João', chapters: 1, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: '3jo', name: '3 João', author: 'João', chapters: 1, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: 'jd', name: 'Judas', author: 'Judas', chapters: 1, group: 'Cartas Gerais', testament: 'NT' },
      { abbrev: 'ap', name: 'Apocalipse', author: 'João', chapters: 22, group: 'Profético', testament: 'NT' }
    ];
  }

  private getFallbackChapter(bookAbbrev: string, chapter: number): BibleChapter | null {
    const books = this.getFallbackBooks();
    const book = books.find(b => b.abbrev === bookAbbrev);
    if (!book) return null;

    // Gerar versículos de exemplo
    const verseCount = Math.floor(Math.random() * 30) + 10;
    const verses: BibleVerse[] = [];
    
    for (let i = 1; i <= verseCount; i++) {
      verses.push({
        book: { abbrev: book.abbrev, name: book.name },
        chapter,
        number: i,
        text: `Este é o versículo ${i} do capítulo ${chapter} de ${book.name}. Conteúdo bíblico de exemplo para demonstração da funcionalidade.`
      });
    }

    return {
      book: { abbrev: book.abbrev, name: book.name },
      chapter: { number: chapter, verses: verseCount },
      verses
    };
  }

  private getFallbackVerse(bookAbbrev: string, chapter: number, verse: number): BibleVerse | null {
    const books = this.getFallbackBooks();
    const book = books.find(b => b.abbrev === bookAbbrev);
    if (!book) return null;

    return {
      book: { abbrev: book.abbrev, name: book.name },
      chapter,
      number: verse,
      text: `Versículo ${verse} do capítulo ${chapter} de ${book.name}. Conteúdo bíblico de exemplo.`
    };
  }

  private getFallbackSearch(query: string): SearchResult {
    const sampleVerses: BibleVerse[] = [
      {
        book: { abbrev: 'jo', name: 'João' },
        chapter: 3,
        number: 16,
        text: `Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna. (Resultado de busca para: ${query})`
      },
      {
        book: { abbrev: 'sl', name: 'Salmos' },
        chapter: 23,
        number: 1,
        text: `O Senhor é o meu pastor; nada me faltará. (Resultado de busca para: ${query})`
      }
    ];

    return {
      occurrence: sampleVerses.length,
      version: 'nvi',
      verses: sampleVerses
    };
  }

  private getFallbackRandomVerse(): BibleVerse {
    const verses = [
      {
        book: { abbrev: 'jo', name: 'João' },
        chapter: 3,
        number: 16,
        text: "Porque Deus tanto amou o mundo que deu o seu Filho Unigênito, para que todo o que nele crer não pereça, mas tenha a vida eterna."
      },
      {
        book: { abbrev: 'sl', name: 'Salmos' },
        chapter: 23,
        number: 1,
        text: "O Senhor é o meu pastor; nada me faltará."
      },
      {
        book: { abbrev: 'pv', name: 'Provérbios' },
        chapter: 3,
        number: 5,
        text: "Confie no Senhor de todo o seu coração e não se apoie em seu próprio entendimento."
      },
      {
        book: { abbrev: 'fp', name: 'Filipenses' },
        chapter: 4,
        number: 13,
        text: "Tudo posso naquele que me fortalece."
      },
      {
        book: { abbrev: 'rm', name: 'Romanos' },
        chapter: 8,
        number: 28,
        text: "Sabemos que Deus age em todas as coisas para o bem daqueles que o amam, dos que foram chamados de acordo com o seu propósito."
      }
    ];

    return verses[Math.floor(Math.random() * verses.length)];
  }
}

export const bibleApi = new BibleApiService();
export type { BibleVerse, BibleChapter, BibleBook, SearchResult };