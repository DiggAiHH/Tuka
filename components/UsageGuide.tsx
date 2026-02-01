import React from 'react';

const UsageGuide: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="min-h-screen bg-pink-50 p-4 font-kids flex flex-col items-center">
            <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl p-8 space-y-8 animate-in fade-in slide-in-from-bottom-5">

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl text-blue-600 font-bold">📚 So nutzt du die App</h1>
                    <button
                        onClick={onBack}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full font-bold transition-colors"
                    >
                        Zurück
                    </button>
                </div>

                <div className="space-y-6">

                    <section className="flex gap-4 items-start">
                        <div className="bg-pink-100 text-pink-600 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</div>
                        <div>
                            <h3 className="text-xl text-gray-800 font-bold mb-2">Aufgaben hochladen 📸</h3>
                            <p className="text-gray-600 text-lg">
                                Hast du ein Arbeitsblatt aus der Schule? Mache ein Foto davon und lade es hoch!
                                Unsere KI-Zauberin Tuka schaut es sich an und erstellt ähnliche Aufgaben für dich.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-4 items-start">
                        <div className="bg-orange-100 text-orange-600 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</div>
                        <div>
                            <h3 className="text-xl text-gray-800 font-bold mb-2">Levels Aufsteigen 🚀</h3>
                            <p className="text-gray-600 text-lg">
                                Du startest im "Leicht"-Modus. Wenn du Aufgaben richtig löst, schaltest du
                                <strong> Mittel</strong>, <strong> Schwer</strong> und die <strong> Prüfung</strong> frei.
                            </p>
                        </div>
                    </section>

                    <section className="flex gap-4 items-start">
                        <div className="bg-green-100 text-green-600 text-2xl w-12 h-12 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</div>
                        <div>
                            <h3 className="text-xl text-gray-800 font-bold mb-2">Offline Üben ✈️</h3>
                            <p className="text-gray-600 text-lg">
                                Deine freigeschalteten Levels werden auf deinem Handy gespeichert.
                                Du kannst die App auch ohne Internet öffnen, um deine Erfolge zu sehen!
                                (Für neue Aufgaben brauchst du kurz Internet).
                            </p>
                        </div>
                    </section>

                    <section className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                        <h3 className="text-lg text-blue-800 font-bold mb-2 flex items-center">
                            <span className="mr-2">💡</span> Eltern-Tipp
                        </h3>
                        <p className="text-blue-700">
                            Installiert die App über das "Teilen"-Menü auf dem Homescreen.
                            Dann läuft sie im Vollbildmodus ohne Browser-Leiste – wie eine echte App!
                        </p>
                    </section>

                </div>

                <button
                    onClick={onBack}
                    className="w-full bg-pink-500 hover:bg-pink-600 text-white text-xl font-bold py-4 rounded-2xl shadow-lg transition-transform active:scale-95"
                >
                    Alles klar, los geht's! 🌟
                </button>

            </div>
        </div>
    );
};

export default UsageGuide;
