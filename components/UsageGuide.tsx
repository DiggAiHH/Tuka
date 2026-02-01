import React, { useState } from 'react';

const UsageGuide: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [tab, setTab] = useState<'guide' | 'features'>('features'); // Start with Features/Why

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">

                {/* Header with Tabs */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex-shrink-0">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-kids text-white">
                            {tab === 'guide' ? '📚 Schritt für Schritt' : '🌍 Warum Mathe-Heldin?'}
                        </h2>
                        <button
                            onClick={onClose}
                            className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setTab('features')}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${tab === 'features' ? 'bg-white text-purple-600 shadow-lg' : 'bg-purple-800/40 text-purple-100 hover:bg-purple-800/60'}`}
                        >
                            🌍 Darum ist es gut!
                        </button>
                        <button
                            onClick={() => setTab('guide')}
                            className={`px-4 py-2 rounded-full font-bold text-sm transition-all ${tab === 'guide' ? 'bg-white text-blue-600 shadow-lg' : 'bg-blue-800/40 text-blue-100 hover:bg-blue-800/60'}`}
                        >
                            📚 Anleitung
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8 bg-gray-50 flex-grow font-kids">

                    {tab === 'features' && (
                        <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex gap-4">
                                <div className="text-4xl">🤝</div>
                                <div>
                                    <h3 className="text-lg font-bold text-purple-700">Gemeinsam lernen</h3>
                                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                        Kinder aus verschiedenen Ländern können jetzt zusammen lernen! Wenn dein Kind die Aufgabe auf Deutsch sieht,
                                        kann ein Freund sie auf Türkisch oder Spanisch lesen. So verbinden wir Kinder durch Mathe.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex gap-4">
                                <div className="text-4xl">🗣️</div>
                                <div>
                                    <h3 className="text-lg font-bold text-purple-700">Sprachen spielerisch lernen</h3>
                                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                        Dein Kind lernt neue Sprachen ganz nebenbei. Wenn es Lust hat, schaltet es einfach um
                                        und lernt, wie man auf Englisch oder Französisch rechnet. Das hilft später auch mit Kollegen und Freunden aus aller Welt!
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex gap-4">
                                <div className="text-4xl">🏠</div>
                                <div>
                                    <h3 className="text-lg font-bold text-purple-700">Für die Familie</h3>
                                    <p className="text-gray-600 text-sm mt-1 leading-relaxed">
                                        Auch Oma und Opa verstehen jetzt die Hausaufgaben, egal welche Sprache sie sprechen.
                                        Mathe verbindet alle!
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'guide' && (
                        <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
                            <h3 className="text-xl font-bold text-gray-800 border-b pb-2">So funktioniert's:</h3>

                            <section className="flex gap-4 items-start">
                                <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                                <div>
                                    <h3 className="text-lg text-gray-800 font-bold mb-1">Training starten</h3>
                                    <p className="text-gray-600 text-sm">
                                        Klicke auf die Rakete 🚀. Die App stellt dir Aufgaben, die genau zu deiner Klasse passen.
                                    </p>
                                </div>
                            </section>

                            <section className="flex gap-4 items-start">
                                <div className="bg-pink-100 text-pink-600 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                                <div>
                                    <h3 className="text-lg text-gray-800 font-bold mb-1">Sprache wählen</h3>
                                    <p className="text-gray-600 text-sm">
                                        Oben rechts kannst du die Flagge ändern. Der Text ändert sich sofort!
                                        Klicke auf die Erde 🌍, um beide Sprachen gleichzeitig zu sehen.
                                    </p>
                                </div>
                            </section>

                            <section className="flex gap-4 items-start">
                                <div className="bg-green-100 text-green-600 w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                                <div>
                                    <h3 className="text-lg text-gray-800 font-bold mb-1">Hausaufgabe hochladen</h3>
                                    <p className="text-gray-600 text-sm">
                                        Klicke auf die Kamera 📸 im Hauptmenü. Fotografiere dein Blatt.
                                        DigitalTuka hilft dir beim Lösen!
                                    </p>
                                </div>
                            </section>
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
                    <button
                        onClick={onClose}
                        className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black transition-all active:scale-95"
                    >
                        Alles klar! 👍
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UsageGuide;
