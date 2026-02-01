import React from 'react';

interface PrivacyPolicyProps {
  onAccept: () => void;
  onClose?: () => void;
  showClose?: boolean;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onAccept, onClose, showClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-kids text-white">🔒 Datenschutz</h2>
              <p className="text-white/80 text-sm font-bold mt-1">Transparent & kinderfreundlich erklärt</p>
            </div>
            {(showClose && onClose) && (
              <button
                onClick={onClose}
                className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-95"
                aria-label="Schließen"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto p-8 bg-gray-50 flex-grow font-kids space-y-6">
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Was passiert mit den Daten?</h3>
            <ul className="text-gray-700 text-sm leading-relaxed list-disc pl-5 space-y-2">
              <li><span className="font-bold">Lokal auf dem Handy/Browser:</span> Profil (Name, Geburtstag, Sprache, Mädchen/Junge), Lern-Verlauf und Ergebnisse.</li>
              <li><span className="font-bold">An Gemini (Google) gesendet:</span> Wenn du Online-Aufgaben generierst oder Hausaufgaben analysierst, werden Inhalte über eine Server-Funktion (Serverless) an Gemini geschickt, damit Aufgaben/Erklärungen erstellt werden. Der API-Schlüssel liegt nicht auf deinem Gerät.</li>
              <li><span className="font-bold">Keine Werbung/Tracker:</span> Die App nutzt kein Tracking für Werbung.</li>
            </ul>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Welche Daten gehen an Gemini?</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Je nach Funktion können gesendet werden:
            </p>
            <ul className="text-gray-700 text-sm leading-relaxed list-disc pl-5 space-y-2 mt-2">
              <li>Name (damit die App freundlich ansprechen kann)</li>
              <li>Geburtstag bzw. Alter (damit die Aufgaben altersgerecht sind)</li>
              <li>Ausgewählte Sprache (für zweisprachige Erklärungen)</li>
              <li>Bei „Hausaufgabe“: das Foto (Bilddaten) der Aufgabe</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              Hinweis: Die Verarbeitung bei Gemini erfolgt nach den Richtlinien des jeweiligen Anbieters.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Offline-Modus</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Wenn du offline bist, nutzt die App lokale Übungsaufgaben. Dann wird nichts an Gemini gesendet.
            </p>
          </section>

          <section className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700 mb-2">Kontakt</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Für Bug-Meldungen, Feature-Wünsche oder Kooperation:
              <a className="text-blue-600 font-bold ml-2 hover:underline" href="mailto:laith.alshdaifat@hotmail.com?subject=Tukas%20Mathe-Welt%20Datenschutz%20Frage">
                laith.alshdaifat@hotmail.com
              </a>
            </p>
          </section>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-center">
          {(showClose && onClose) && (
            <button
              onClick={onClose}
              className="bg-gray-100 text-gray-700 font-bold py-3 px-8 rounded-full hover:bg-gray-200 transition-all active:scale-95"
            >
              Zurück
            </button>
          )}
          <button
            onClick={onAccept}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-10 rounded-full shadow-lg transition-all active:scale-95"
          >
            Verstanden & weiter
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
