import React, { useMemo } from 'react';
import { loadHistory, loadProgressEvents } from '../services/persistence';

interface ParentDashboardProps {
  onClose: () => void;
}

function pct(correct: number, total: number): number {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

const ParentDashboard: React.FC<ParentDashboardProps> = ({ onClose }) => {
  const progress = useMemo(() => loadProgressEvents(), []);
  const history = useMemo(() => loadHistory(), []);

  const last30 = progress.slice(0, 30);
  const total = last30.reduce((acc, e) => acc + e.total, 0);
  const correct = last30.reduce((acc, e) => acc + e.correct, 0);

  const last7Days = (() => {
    const now = Date.now();
    const seven = 7 * 24 * 60 * 60 * 1000;
    const recent = progress.filter((e) => {
      const d = new Date(e.date).getTime();
      return now - d <= seven;
    });
    const t = recent.reduce((acc, e) => acc + e.total, 0);
    const c = recent.reduce((acc, e) => acc + e.correct, 0);
    return { count: recent.length, total: t, correct: c };
  })();

  const nextSteps = (() => {
    const p = pct(correct, total);
    if (total < 10) {
      return ['Mehr Training sammeln (mind. 10 Aufgaben).', 'Dann zeigt die App Trends und nächste Schritte an.'];
    }
    if (p >= 90) {
      return ['Niveau steigern: „Mittel“ oder „Schwer“ ausprobieren.', 'Mehr gemischte Aufgaben (Prüfung) für Stabilität.'];
    }
    if (p >= 70) {
      return ['Gezielt üben: 10–15 Aufgaben pro Tag.', 'Fehler-Themen wiederholen (Korrekturmodus nutzen).'];
    }
    return ['Zurück zu „Leicht“ für sichere Grundlagen.', 'Kurze Sessions (5 Aufgaben) dafür regelmäßig.', 'Eltern: gemeinsam Rechenweg laut sprechen lassen.'];
  })();

  return (
    <div className="fixed inset-0 z-[230] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-6 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-kids text-white">📈 Eltern-Dashboard</h2>
              <p className="text-white/80 text-sm mt-1">Fortschritt lokal gespeichert</p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-all active:scale-95"
              aria-label="Schließen"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="overflow-y-auto p-6 bg-gray-50 flex-grow font-kids space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Letzte 30 Einträge</div>
              <div className="mt-2 text-4xl font-kids text-emerald-700">{pct(correct, total)}%</div>
              <div className="text-sm text-gray-600 mt-1">{correct} richtig von {total}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Letzte 7 Tage</div>
              <div className="mt-2 text-4xl font-kids text-emerald-700">{pct(last7Days.correct, last7Days.total)}%</div>
              <div className="text-sm text-gray-600 mt-1">{last7Days.correct} richtig von {last7Days.total} ({last7Days.count} Sessions)</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-xs uppercase tracking-widest text-gray-400 font-bold">Quiz-Historie</div>
              <div className="mt-2 text-4xl font-kids text-emerald-700">{history.length}</div>
              <div className="text-sm text-gray-600 mt-1">gespeicherte Prüfungen</div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800">Nächste Schritte (wissenschaftlich-praktisch)</h3>
            <ul className="mt-3 text-sm text-gray-700 space-y-2 list-disc pl-5">
              {nextSteps.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-gray-500">
              Hinweis: Das ist ein Lernfortschritts-Modell (keine echte IQ-Messung). Ziel ist systematisches Üben + passende Schwierigkeit.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
            <h3 className="text-lg font-bold text-emerald-800">Datenspeicherung</h3>
            <p className="text-sm text-gray-700 mt-2">
              Der Fortschritt wird lokal auf dem Gerät gespeichert. Es gibt keinen Cloud-Account.
              Wenn der Browser/Handy-Speicher gelöscht wird, gehen die Daten verloren.
            </p>
          </div>
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-900 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-black transition-all active:scale-95"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ParentDashboard;
