import React from 'react';

const WhatsNew: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 flex-shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-kids text-white">✨ Was ist neu?</h2>
              <p className="text-white/80 text-sm mt-1">Updates & Verbesserungen</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-95"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-8 bg-gray-50 flex-grow font-kids space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700">Neu in dieser Version</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>Profil: Mädchen/Junge auswählen (Avatar + Ansprache passend).</li>
              <li>Kindersicherheit: App ist erst ab 3 Jahren geeignet (Geburtstag wird geprüft).</li>
              <li>„Was ist neu?“ und „Hilfe“ sind getrennt und klarer.</li>
              <li>Datenschutz-Hinweis beim Start (transparent, was lokal bleibt und was an Gemini geht).</li>
              <li>Elternbereich (passwortgeschützt) für Lernfortschritt und nächste Schritte.</li>
              <li>Offline „Limited Mode“ mit gespeicherten Standard-Aufgaben.</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
            <h3 className="text-lg font-bold text-purple-700">Nächste Updates (geplant)</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
              <li>Mehr Auswertungen im Elternbereich (Themen/Fehlerarten, Wochen-Trends).</li>
              <li>Mehr Tests (LearningSession / Gemini-Service-Mocking).</li>
              <li>Sicherere KI-Key-Architektur (serverseitige Kapselung).</li>
            </ul>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Zurück
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatsNew;
