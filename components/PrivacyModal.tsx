import React from 'react';

interface PrivacyModalProps {
  mode: 'blocking' | 'nonBlocking';
  onAccept: () => void;
  onClose?: () => void;
}

const PrivacyModal: React.FC<PrivacyModalProps> = ({ mode, onAccept, onClose }) => {
  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">
        <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-kids text-white">🔒 Datenschutz & Transparenz</h2>
              <p className="text-white/80 text-sm mt-1">
                Diese App nutzt Online-KI (Gemini) für Aufgaben/Analysen.
              </p>
            </div>
            {mode === 'nonBlocking' && onClose && (
              <button
                onClick={onClose}
                className="bg-white/15 hover:bg-white/25 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-95"
                aria-label="Schließen"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <div className="overflow-y-auto p-8 bg-gray-50 flex-grow font-kids space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Was wird gespeichert (lokal auf deinem Gerät)?</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>Profil: Name, Geburtstag (für Alter), optionale Zweitsprache, Mädchen/Junge-Auswahl.</li>
              <li>Lernverlauf: Ergebnisse und Fortschritt (lokal in deinem Browser/Handy gespeichert).</li>
              <li>Deine Zustimmung zum Datenschutz (damit du nicht jedes Mal gefragt wirst).</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Was wird an Gemini (Google) gesendet?</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>Bei „Hausaufgabe“: das Foto (Bilddaten), damit die KI die Aufgaben erkennt.</li>
              <li>Für passende Aufgaben: Alter (aus Geburtstag), Name (für Ansprache), und ggf. Zweitsprache.</li>
              <li>Thema/Schwierigkeit, damit die KI passende Matheaufgaben erzeugt.</li>
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Hinweis: Die KI ist ein externer Online-Dienst. Wenn du offline bist, nutzt die App einen lokalen „Limited Mode“ mit gespeicherten Standard-Aufgaben.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Tracking / Werbung</h3>
            <p className="mt-3 text-sm text-gray-700">
              Es gibt in dieser App kein bewusstes Werbe-Tracking. Die Daten werden lokal gespeichert und nur dann an Gemini gesendet, wenn du Funktionen nutzt, die KI brauchen.
            </p>
          </div>

          {mode === 'blocking' && (
            <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-amber-900 text-sm">
              Ohne Zustimmung kann die App nicht genutzt werden.
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-end gap-3">
          {mode === 'nonBlocking' && onClose && (
            <button
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full shadow-sm transition-all active:scale-95"
            >
              Schließen
            </button>
          )}
          <button
            onClick={onAccept}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition-all active:scale-95"
          >
            Ich stimme zu ✅
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;
