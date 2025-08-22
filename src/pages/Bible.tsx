import { BookOpen, Loader, Search, Shuffle, ChevronLeft, ChevronRight, Heart, Book, Star } from "lucide-react";
import { useEffect, useState } from "react";

// Interfaces
interface BibleBook {
  id: string;
  name: string;
  testament: 'VT' | 'NT';
  chapters: number;
  abbrev: string;
}

interface BibleVerse {
  book_id: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
}

interface SearchResult {
  verses: BibleVerse[];
  total: number;
}

// Base de dados de versículos populares
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
  }
];

// API melhorada
const bibleApi = {
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
      const response = await fetch('https://bible-api.com/?random=verse&translation=almeida');
      
      if (!response.ok) {
        throw new Error('API response not ok');
      }
      
      const data = await response.json();
      
      if (data && data.text && data.book_name && data.chapter && data.verse) {
        return {
          book_id: data.book_id || 'unknown',
          book_name: data.book_name,
          chapter: parseInt(data.chapter) || 1,
          verse: parseInt(data.verse) || 1,
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
      const response = await fetch(`https://bible-api.com/${bookId}+${chapter}?translation=almeida`);
      
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
    } catch (error) {
      console.error('Error fetching chapter:', error);
    }
    
    // Fallback: retorna versículos de exemplo
    return getFallbackChapter(bookId, chapter);
  },

  searchVerses: async (query: string): Promise<SearchResult> => {
    if (!query.trim()) return { verses: [], total: 0 };

    try {
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

// Função helper para capítulos de fallback
const getFallbackChapter = (bookId: string, chapter: number): BibleVerse[] => {
  // Salmo 23 completo
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

  // João 3 (alguns versículos)
  if (bookId === 'john' && chapter === 3) {
    return [
      {
        book_id: bookId,
        book_name: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.'
      },
      {
        book_id: bookId,
        book_name: 'João',
        chapter: 3,
        verse: 17,
        text: 'Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele.'
      },
      {
        book_id: bookId,
        book_name: 'João',
        chapter: 3,
        verse: 18,
        text: 'Quem crê nele não é condenado; mas quem não crê já está condenado, porquanto não crê no nome do unigênito Filho de Deus.'
      }
    ];
  }

  // Retorna versículos genéricos para outros capítulos
  const bookName = bookId.charAt(0).toUpperCase() + bookId.slice(1);
  return Array.from({ length: Math.min(15, Math.floor(Math.random() * 10) + 5) }, (_, i) => ({
    book_id: bookId,
    book_name: bookName,
    chapter: chapter,
    verse: i + 1,
    text: `Versículo ${i + 1} do capítulo ${chapter} de ${bookName}. O texto completo estará disponível em breve através da API da Bíblia.`
  }));
};

export function Bible() {
  const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [activeTestament, setActiveTestament] = useState<'old' | 'new' | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [chapterVerses, setChapterVerses] = useState<BibleVerse[]>([]);
  const [favorites, setFavorites] = useState<BibleVerse[]>([]);
  const [activeTab, setActiveTab] = useState<'read' | 'search' | 'favorites'>('read');
  const [isLoadVerse, setIsLoadVerse] = useState(false);

  const loadRandomVerse = async () => {
    setIsLoadVerse(true);
    try {
      const verse = await bibleApi.getRandomVerse();
      setRandomVerse(verse);
    } catch (error) {
      console.error('Error loading random verse:', error);
      // Use fallback verse
      setRandomVerse(popularVerses[0]);
    }
    setIsLoadVerse(false);
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const results = await bibleApi.searchVerses(searchTerm);
      setSearchResults(results);
      setActiveTab('search');
    } catch (error) {
      console.error('Error searching:', error);
    }
    setLoading(false);
  };

  const loadBooks = async () => {
    try {
      const booksData = await bibleApi.getBooks();
      setBooks(booksData);
      if (booksData.length > 0) {
        setSelectedBook(booksData[0]);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    }
  };

  const loadChapter = async (bookId: string, chapter: number) => {
    setLoading(true);
    try {
      const verses = await bibleApi.getChapter(bookId, chapter);
      setChapterVerses(verses);
    } catch (error) {
      console.error('Error loading chapter:', error);
      setChapterVerses([]);
    }
    setLoading(false);
  };

  const toggleFavorite = (verse: BibleVerse) => {
    const isFavorite = favorites.some(
      fav => fav.book_id === verse.book_id && 
             fav.chapter === verse.chapter && 
             fav.verse === verse.verse
    );

    if (isFavorite) {
      setFavorites(favorites.filter(
        fav => !(fav.book_id === verse.book_id && 
                fav.chapter === verse.chapter && 
                fav.verse === verse.verse)
      ));
    } else {
      setFavorites([...favorites, verse]);
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesTestament = activeTestament === 'all' || 
      (activeTestament === 'old' && book.testament === 'VT') ||
      (activeTestament === 'new' && book.testament === 'NT');
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTestament && (searchTerm ? matchesSearch : true);
  });

  useEffect(() => {
    loadRandomVerse();
    loadBooks();
  }, []);

  useEffect(() => {
    if (selectedBook) {
      loadChapter(selectedBook.id, selectedChapter);
    }
  }, [selectedBook, selectedChapter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen className="h-12 w-12 text-indigo-600 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Bíblia Sagrada</h1>
          </div>
          <p className="text-lg text-gray-600">
            Explore a Palavra de Deus - Nova Versão Internacional
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg shadow-md p-1 flex space-x-1">
            <button
              onClick={() => setActiveTab('read')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'read'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Book className="h-4 w-4" />
              <span>Ler</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'search'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </button>
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeTab === 'favorites'
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Star className="h-4 w-4" />
              <span>Favoritos ({favorites.length})</span>
            </button>
          </div>
        </div>

        {/* Random Verse */}
        <div className="mb-8">
          {randomVerse ? (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Versículo do Dia</h3>
                <button
                  onClick={loadRandomVerse}
                  disabled={isLoadVerse}
                  className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors disabled:opacity-50"
                >
                  {isLoadVerse ? (
                    <Loader className="h-5 w-5 animate-spin" />
                  ) : (
                    <Shuffle className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-lg leading-relaxed mb-3">
                "{randomVerse.text}"
              </p>
              <p className="text-indigo-200 font-medium">
                {randomVerse.book_name} {randomVerse.chapter}:{randomVerse.verse}
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 text-white flex justify-center">
              <Loader className="h-8 w-8 animate-spin" />
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar versículos ou livros..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={!searchTerm.trim() || loading}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              {loading ? <Loader className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
              <span>Buscar</span>
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTestament('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTestament === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setActiveTestament('old')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTestament === 'old'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                AT
              </button>
              <button
                onClick={() => setActiveTestament('new')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTestament === 'new'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                NT
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'read' && (
          <div className="space-y-6">
            {/* Book and Chapter Selection */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <select
                value={selectedBook?.id || ''}
                onChange={(e) => {
                  const book = books.find(b => b.id === e.target.value);
                  if (book) {
                    setSelectedBook(book);
                    setSelectedChapter(1);
                  }
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                {filteredBooks.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.name} ({book.abbrev})
                  </option>
                ))}
              </select>

              <select
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
              >
                {selectedBook && Array.from({ length: selectedBook.chapters }, (_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Capítulo {i + 1}
                  </option>
                ))}
              </select>

              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedChapter(prev => Math.max(1, prev - 1))}
                  disabled={selectedChapter <= 1}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedChapter(prev => Math.min(selectedBook?.chapters || 1, prev + 1))}
                  disabled={selectedChapter >= (selectedBook?.chapters || 1)}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chapter Content */}
            {loading ? (
              <div className="text-center py-8">
                <Loader className="h-8 w-8 animate-spin mx-auto text-indigo-600" />
                <p className="mt-2 text-gray-500">Carregando...</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {selectedBook?.name} {selectedChapter}
                </h3>
                <div className="space-y-4">
                  {chapterVerses.map((verse) => (
                    <div key={`${verse.chapter}-${verse.verse}`} className="group flex items-start gap-3">
                      <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-medium">
                        {verse.verse}
                      </span>
                      <p className="flex-1 text-gray-700 leading-relaxed">{verse.text}</p>
                      <button
                        onClick={() => toggleFavorite(verse)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                      >
                        <Heart
                          className={`h-5 w-5 ${
                            favorites.some(
                              fav => fav.book_id === verse.book_id && 
                                     fav.chapter === verse.chapter && 
                                     fav.verse === verse.verse
                            ) ? 'fill-red-500 text-red-500' : ''
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'search' && (
          <div className="space-y-6">
            {searchResults ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Resultados da busca: {searchResults.total} versículo{searchResults.total !== 1 ? 's' : ''} encontrado{searchResults.total !== 1 ? 's' : ''}
                </h3>
                <div className="space-y-4">
                  {searchResults.verses.map((verse) => (
                    <div key={`${verse.book_id}-${verse.chapter}-${verse.verse}`} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-indigo-600">
                          {verse.book_name} {verse.chapter}:{verse.verse}
                        </h4>
                        <button
                          onClick={() => toggleFavorite(verse)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <Heart
                            className={`h-5 w-5 ${
                              favorites.some(
                                fav => fav.book_id === verse.book_id && 
                                       fav.chapter === verse.chapter && 
                                       fav.verse === verse.verse
                              ) ? 'fill-red-500 text-red-500' : ''
                            }`}
                          />
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{verse.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Digite algo para buscar na Bíblia</p>
                <p className="text-sm">Use palavras-chave, nomes de livros ou temas específicos</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-6">
            {favorites.length > 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4">
                  Seus versículos favoritos ({favorites.length})
                </h3>
                <div className="space-y-4">
                  {favorites.map((verse) => (
                    <div key={`${verse.book_id}-${verse.chapter}-${verse.verse}`} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-indigo-600">
                          {verse.book_name} {verse.chapter}:{verse.verse}
                        </h4>
                        <button
                          onClick={() => toggleFavorite(verse)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Heart className="h-5 w-5 fill-red-500" />
                        </button>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{verse.text}</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg">Você ainda não tem versículos favoritos</p>
                <p className="text-sm">Adicione alguns durante a leitura clicando no ícone do coração!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
)
};