export interface BibleBook {
  id: string;
  name: string;
  testament: 'VT' | 'NT';
  chapters: number;
  abbrev: string;
}

export interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface SearchResult {
  verses: BibleVerse[];
  total: number;
}

// Base de dados de versículos populares para fallback
const popularVerses = [
  {
    book_id: "john",
    book_name: "João",
    chapter: 3,
    verse: 16,
    text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna."
  },
  {
    book_id: "psalms",
    book_name: "Salmos",
    chapter: 23,
    verse: 1,
    text: "O Senhor é o meu pastor; nada me faltará."
  },
  {
    book_id: "romans",
    book_name: "Romanos",
    chapter: 8,
    verse: 28,
    text: "E sabemos que todas as coisas contribuem juntamente para o bem daqueles que amam a Deus, daqueles que são chamados por seu decreto."
  },
  {
    book_id: "philippians",
    book_name: "Filipenses",
    chapter: 4,
    verse: 13,
    text: "Posso todas as coisas em Cristo que me fortalece."
  },
  {
    book_id: "jeremiah",
    book_name: "Jeremias",
    chapter: 29,
    verse: 11,
    text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal, para vos dar o fim que esperais."
  },
  {
    book_id: "proverbs",
    book_name: "Provérbios",
    chapter: 3,
    verse: 5,
    text: "Confia no Senhor de todo o teu coração, e não te estribes no teu próprio entendimento."
  },
  {
    book_id: "matthew",
    book_name: "Mateus",
    chapter: 11,
    verse: 28,
    text: "Vinde a mim, todos os que estais cansados e oprimidos, e eu vos aliviarei."
  },
  {
    book_id: "isaiah",
    book_name: "Isaías",
    chapter: 40,
    verse: 31,
    text: "Mas os que esperam no Senhor renovarão as forças, subirão com asas como águias; correrão, e não se cansarão; caminharão, e não se fatigarão."
  },
  {
    book_id: "psalms",
    book_name: "Salmos",
    chapter: 46,
    verse: 1,
    text: "Deus é o nosso refúgio e fortaleza, socorro bem presente na angústia."
  },
  {
    book_id: "joshua",
    book_name: "Josué",
    chapter: 1,
    verse: 9,
    text: "Não to mandei eu? Esforça-te, e tem bom ânimo; não temas, nem te espantes; porque o Senhor teu Deus é contigo, por onde quer que andares."
  }
];

export const bibleApi = {
  getBooks: async (): Promise<BibleBook[]> => {
    const books: BibleBook[] = [
      // Antigo Testamento
      { id: "genesis", name: "Gênesis", testament: "VT", chapters: 50, abbrev: "Gn" },
      { id: "exodus", name: "Êxodo", testament: "VT", chapters: 40, abbrev: "Ex" },
      { id: "leviticus", name: "Levítico", testament: "VT", chapters: 27, abbrev: "Lv" },
      { id: "numbers", name: "Números", testament: "VT", chapters: 36, abbrev: "Nm" },
      { id: "deuteronomy", name: "Deuteronômio", testament: "VT", chapters: 34, abbrev: "Dt" },
      { id: "joshua", name: "Josué", testament: "VT", chapters: 24, abbrev: "Js" },
      { id: "judges", name: "Juízes", testament: "VT", chapters: 21, abbrev: "Jz" },
      { id: "ruth", name: "Rute", testament: "VT", chapters: 4, abbrev: "Rt" },
      { id: "1samuel", name: "1 Samuel", testament: "VT", chapters: 31, abbrev: "1Sm" },
      { id: "2samuel", name: "2 Samuel", testament: "VT", chapters: 24, abbrev: "2Sm" },
      { id: "1kings", name: "1 Reis", testament: "VT", chapters: 22, abbrev: "1Rs" },
      { id: "2kings", name: "2 Reis", testament: "VT", chapters: 25, abbrev: "2Rs" },
      { id: "1chronicles", name: "1 Crônicas", testament: "VT", chapters: 29, abbrev: "1Cr" },
      { id: "2chronicles", name: "2 Crônicas", testament: "VT", chapters: 36, abbrev: "2Cr" },
      { id: "ezra", name: "Esdras", testament: "VT", chapters: 10, abbrev: "Ed" },
      { id: "nehemiah", name: "Neemias", testament: "VT", chapters: 13, abbrev: "Ne" },
      { id: "esther", name: "Ester", testament: "VT", chapters: 10, abbrev: "Et" },
      { id: "job", name: "Jó", testament: "VT", chapters: 42, abbrev: "Jó" },
      { id: "psalms", name: "Salmos", testament: "VT", chapters: 150, abbrev: "Sl" },
      { id: "proverbs", name: "Provérbios", testament: "VT", chapters: 31, abbrev: "Pv" },
      { id: "ecclesiastes", name: "Eclesiastes", testament: "VT", chapters: 12, abbrev: "Ec" },
      { id: "songofsongs", name: "Cânticos", testament: "VT", chapters: 8, abbrev: "Ct" },
      { id: "isaiah", name: "Isaías", testament: "VT", chapters: 66, abbrev: "Is" },
      { id: "jeremiah", name: "Jeremias", testament: "VT", chapters: 52, abbrev: "Jr" },
      { id: "lamentations", name: "Lamentações", testament: "VT", chapters: 5, abbrev: "Lm" },
      { id: "ezekiel", name: "Ezequiel", testament: "VT", chapters: 48, abbrev: "Ez" },
      { id: "daniel", name: "Daniel", testament: "VT", chapters: 12, abbrev: "Dn" },
      { id: "hosea", name: "Oséias", testament: "VT", chapters: 14, abbrev: "Os" },
      { id: "joel", name: "Joel", testament: "VT", chapters: 3, abbrev: "Jl" },
      { id: "amos", name: "Amós", testament: "VT", chapters: 9, abbrev: "Am" },
      { id: "obadiah", name: "Obadias", testament: "VT", chapters: 1, abbrev: "Ob" },
      { id: "jonah", name: "Jonas", testament: "VT", chapters: 4, abbrev: "Jn" },
      { id: "micah", name: "Miqueias", testament: "VT", chapters: 7, abbrev: "Mq" },
      { id: "nahum", name: "Naum", testament: "VT", chapters: 3, abbrev: "Na" },
      { id: "habakkuk", name: "Habacuque", testament: "VT", chapters: 3, abbrev: "Hc" },
      { id: "zephaniah", name: "Sofonias", testament: "VT", chapters: 3, abbrev: "Sf" },
      { id: "haggai", name: "Ageu", testament: "VT", chapters: 2, abbrev: "Ag" },
      { id: "zechariah", name: "Zacarias", testament: "VT", chapters: 14, abbrev: "Zc" },
      { id: "malachi", name: "Malaquias", testament: "VT", chapters: 4, abbrev: "Ml" },
      
      // Novo Testamento
      { id: "matthew", name: "Mateus", testament: "NT", chapters: 28, abbrev: "Mt" },
      { id: "mark", name: "Marcos", testament: "NT", chapters: 16, abbrev: "Mc" },
      { id: "luke", name: "Lucas", testament: "NT", chapters: 24, abbrev: "Lc" },
      { id: "john", name: "João", testament: "NT", chapters: 21, abbrev: "Jo" },
      { id: "acts", name: "Atos", testament: "NT", chapters: 28, abbrev: "At" },
      { id: "romans", name: "Romanos", testament: "NT", chapters: 16, abbrev: "Rm" },
      { id: "1corinthians", name: "1 Coríntios", testament: "NT", chapters: 16, abbrev: "1Co" },
      { id: "2corinthians", name: "2 Coríntios", testament: "NT", chapters: 13, abbrev: "2Co" },
      { id: "galatians", name: "Gálatas", testament: "NT", chapters: 6, abbrev: "Gl" },
      { id: "ephesians", name: "Efésios", testament: "NT", chapters: 6, abbrev: "Ef" },
      { id: "philippians", name: "Filipenses", testament: "NT", chapters: 4, abbrev: "Fp" },
      { id: "colossians", name: "Colossenses", testament: "NT", chapters: 4, abbrev: "Cl" },
      { id: "1thessalonians", name: "1 Tessalonicenses", testament: "NT", chapters: 5, abbrev: "1Ts" },
      { id: "2thessalonians", name: "2 Tessalonicenses", testament: "NT", chapters: 3, abbrev: "2Ts" },
      { id: "1timothy", name: "1 Timóteo", testament: "NT", chapters: 6, abbrev: "1Tm" },
      { id: "2timothy", name: "2 Timóteo", testament: "NT", chapters: 4, abbrev: "2Tm" },
      { id: "titus", name: "Tito", testament: "NT", chapters: 3, abbrev: "Tt" },
      { id: "philemon", name: "Filemon", testament: "NT", chapters: 1, abbrev: "Fm" },
      { id: "hebrews", name: "Hebreus", testament: "NT", chapters: 13, abbrev: "Hb" },
      { id: "james", name: "Tiago", testament: "NT", chapters: 5, abbrev: "Tg" },
      { id: "1peter", name: "1 Pedro", testament: "NT", chapters: 5, abbrev: "1Pe" },
      { id: "2peter", name: "2 Pedro", testament: "NT", chapters: 3, abbrev: "2Pe" },
      { id: "1john", name: "1 João", testament: "NT", chapters: 5, abbrev: "1Jo" },
      { id: "2john", name: "2 João", testament: "NT", chapters: 1, abbrev: "2Jo" },
      { id: "3john", name: "3 João", testament: "NT", chapters: 1, abbrev: "3Jo" },
      { id: "jude", name: "Judas", testament: "NT", chapters: 1, abbrev: "Jd" },
      { id: "revelation", name: "Apocalipse", testament: "NT", chapters: 22, abbrev: "Ap" },
    ];
    
    return books;
  },

  getRandomVerse: async (): Promise<BibleVerse> => {
    try {
      // Tentativa com API Bible.com
      const response = await fetch('https://bible-api.com/?random=verse&translation=almeida');
      
      if (!response.ok) {
        throw new Error('API response not ok');
      }
      
      const data = await response.json();
      
      // Verificar se os dados estão completos
      if (data && data.text && data.book_name && data.chapter && data.verse) {
        return {
          book_id: data.book_id || 'unknown',
          book_name: data.book_name,
          chapter: parseInt(data.chapter),
          verse: parseInt(data.verse),
          text: data.text.trim()
        };
      } else {
        throw new Error('Incomplete data from API');
      }
    } catch (error) {
      console.error('Error fetching random verse from API:', error);
      
      // Fallback: retorna um versículo aleatório da nossa base
      const randomIndex = Math.floor(Math.random() * popularVerses.length);
      return popularVerses[randomIndex];
    }
  },

  getChapter: async (bookId: string, chapter: number): Promise<BibleVerse[]> => {
    try {
      // Primeira tentativa com bible-api.com
      let response = await fetch(`https://bible-api.com/${bookId}+${chapter}?translation=almeida`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.verses && Array.isArray(data.verses)) {
          return data.verses.map((verse: any, index: number) => ({
            book_id: bookId,
            book_name: data.book_name || 'Livro Desconhecido',
            chapter: chapter,
            verse: verse.verse || (index + 1),
            text: verse.text || 'Texto não disponível'
          }));
        }
      }

      // Segunda tentativa com uma API alternativa
      response = await fetch(`https://api.scripture.api.bible/v1/bibles/aa89e21145c5b12c-01/chapters/${bookId}.${chapter}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`, {
        headers: {
          'api-key': '7c4e5b5e6f5d4c3b2a1'
        }
      });

      if (response.ok) {
        //const data = await response.json();
        // Processar dados da API alternativa se disponível
      }

    } catch (error) {
      console.error('Error fetching chapter:', error);
    }
    
    // Fallback: retorna versículos de exemplo
    return bibleApi.getFallbackChapter(bookId, chapter);
  },

  getFallbackChapter: (bookId: string, chapter: number): BibleVerse[] => {
    // Retorna versículos de exemplo baseados no livro e capítulo
    //const books = bibleApi.getBooks();
    //const book = books.then(b => b.find(book => book.id === bookId));
    
    // Para demonstração, retornamos alguns versículos de exemplo
    if (bookId === 'psalms' && chapter === 23) {
      return [
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 1,
          text: 'O Senhor é o meu pastor; nada me faltará.'
        },
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 2,
          text: 'Deitar-me faz em verdes pastos, guia-me mansamente a águas repousantes.'
        },
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 3,
          text: 'Refrigera a minha alma; guia-me pelas veredas da justiça, por amor do seu nome.'
        },
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 4,
          text: 'Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam.'
        },
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 5,
          text: 'Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda.'
        },
        {
          book_id: bookId,
          book_name: 'Salmos',
          chapter: 23,
          verse: 6,
          text: 'Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na casa do Senhor por longos dias.'
        }
      ];
    }

    // Retorna versículos genéricos para outros capítulos
    return Array.from({ length: Math.min(15, Math.floor(Math.random() * 20) + 5) }, (_, i) => ({
      book_id: bookId,
      book_name: 'Livro Bíblico',
      chapter: chapter,
      verse: i + 1,
      text: `Este é o versículo ${i + 1} do capítulo ${chapter}. O texto completo estará disponível em breve.`
    }));
  },

  searchVerses: async (query: string): Promise<SearchResult> => {
    if (!query.trim()) return { verses: [], total: 0 };

    try {
      // Buscar na API principal
      const response = await fetch(`https://bible-api.com/search?query=${encodeURIComponent(query)}&translation=almeida`);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.verses && Array.isArray(data.verses)) {
          return {
            verses: data.verses.map((verse: any) => ({
              book_id: verse.book_id || 'unknown',
              book_name: verse.book_name || 'Livro Desconhecido',
              chapter: parseInt(verse.chapter) || 1,
              verse: parseInt(verse.verse) || 1,
              text: verse.text || 'Texto não disponível'
            })),
            total: data.verses.length
          };
        }
      }
    } catch (error) {
      console.error('Error searching verses:', error);
    }

    // Fallback: busca nos versículos populares
    const lowerQuery = query.toLowerCase();
    const matchingVerses = popularVerses.filter(verse => 
      verse.text.toLowerCase().includes(lowerQuery) ||
      verse.book_name.toLowerCase().includes(lowerQuery)
    );

    return {
      verses: matchingVerses,
      total: matchingVerses.length
    };
  }
};