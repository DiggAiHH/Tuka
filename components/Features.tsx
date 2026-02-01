
import React from 'react';

interface FeaturesProps {
    onClose: () => void;
}

const Features: React.FC<FeaturesProps> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto border-4 border-purple-100 flex flex-col">

                {/* Header */}
                <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-8 text-white text-center sticky top-0 z-10">
                    <h2 className="text-3xl font-kids mb-2">Was ist neu? ✨</h2>
                    <p className="opacity-90 font-medium">Deine Vorteile in der Mathe-Heldin App!</p>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="p-8 space-y-8">

                    {/* Benefit 1: Bilingual */}
                    <div className="flex gap-6 items-start">
                        <div className="bg-purple-100 text-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                            🌍
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Mathe in deiner Sprache</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Egal ob Türkisch, Spanisch oder Englisch: Du kannst jetzt die Mathe-Aufgaben auch in deiner Familiensprache sehen!
                                Wechsle die Sprache direkt im Training – so lernst du Mathe & Sprachen gleichzeitig.
                            </p>
                        </div>
                    </div>

                    {/* Benefit 2: Dynamic Levels */}
                    <div className="flex gap-6 items-start">
                        <div className="bg-blue-100 text-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                            🎯
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Passt genau zu dir</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Die App kennt dein Alter und deine Klasse. Die Aufgaben sind nie zu schwer und nie zu leicht – genau richtig, um besser zu werden!
                            </p>
                        </div>
                    </div>

                    {/* Benefit 3: Känguru */}
                    <div className="flex gap-6 items-start">
                        <div className="bg-orange-100 text-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                            🦘
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Känguru-Wettbewerb</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Trainiere spezielle Knobelaufgaben für den Känguru-Wettbewerb. Lern logisches Denken und hol dir den weitesten Sprung!
                            </p>
                        </div>
                    </div>

                    {/* Benefit 4: Fun */}
                    <div className="flex gap-6 items-start">
                        <div className="bg-green-100 text-green-600 w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                            🎉
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Spaß beim Lernen</h3>
                            <p className="text-gray-600 leading-relaxed">
                                Sammle Konfetti, feiere Erfolge und werde zur echten Mathe-Heldin. Lernen muss nicht langweilig sein!
                            </p>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-center rounded-b-[2rem]">
                    <button
                        onClick={onClose}
                        className="bg-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:bg-purple-700 transition-all transform hover:-translate-y-1 active:scale-95"
                    >
                        Cool, verstanden! 🚀
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Features;
