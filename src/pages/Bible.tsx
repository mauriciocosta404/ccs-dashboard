import { BookOpen, Shuffle } from "lucide-react"
import { useEffect, useState } from "react";
import { bibleApi, BibleVerse } from "../services/bible-service";

export const Bible= () => {
    const [randomVerse, setRandomVerse] = useState<BibleVerse | null>(null);

    const loadRandomVerse = async () => {
        const verse = await bibleApi.getRandomVerse();
        setRandomVerse(verse);
    };

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
            </div>
        </div>
    )
}