import { BookOpen, Loader, Search, Shuffle } from "lucide-react"
import { useEffect, useState } from "react";
import { bibleApi, BibleVerse, /*SearchResult*/ } from "../services/bible-service";

export const Bible= () => {
    const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    //const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
    const [activeTestament, setActiveTestament] = useState<'old' | 'new' | 'all'>('all');
    const [loading, setLoading] = useState(false);
    //const [/*showSearch,*/ setShowSearch] = useState(false);

    const loadRandomVerse = async () => {
        const verse = await bibleApi.getRandomVerse();
        setRandomVerse(verse);
    };

    const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    //setShowSearch(true);
    //const results = await bibleApi.searchVerses(searchTerm);
    //setSearchResults(results);
    setLoading(false);
  };

  /*const filteredBooks = books.filter(book => {
    const matchesTestament = activeTestament === 'all' || 
      (activeTestament === 'old' && book.testament === 'VT') ||
      (activeTestament === 'new' && book.testament === 'NT');
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTestament && matchesSearch;
  });*/

    useEffect(() => {
        loadRandomVerse();
    }, []);

    return (
        <div className="bg-white">
            <div className="min-h-screen py-8 w-5/6 mx-auto">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center mb-4">
                            <BookOpen className="h-12 w-12 text-indigo-600 mr-3" />
                            <h1 className="text-4xl font-bold text-gray-900">Bíblia Sagrada</h1>
                        </div>
                        <p className="text-lg text-gray-600">
                            Explore a Palavra de Deus - Nova Versão Internacional
                        </p>
                    </div>
                </div>

                {randomVerse && (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Versículo do Dia</h3>
                        <button
                            onClick={loadRandomVerse}
                            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
                        >
                            <Shuffle className="h-5 w-5" />
                        </button>
                    </div>
                    <p className="text-lg leading-relaxed mb-3">
                        "{randomVerse.text}"
                    </p>
                    <p className="text-indigo-200 font-medium">
                        {randomVerse.book.name} {randomVerse.chapter}:{randomVerse.number}
                    </p>
                </div>
                )}

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
                        className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
                        >
                        {loading ? <Loader className="h-5 w-5 animate-spin" /> : 'Buscar'}
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

            </div>
        </div>
    )
}