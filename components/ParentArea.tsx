import React, { useMemo, useState } from 'react';
import { clearParentAuth, loadHistory, loadParentAuth, loadProgressEvents, saveParentAuth } from '../services/persistence';
import { createParentAuthRecord, isParentCryptoAvailable, maskUsername, validatePasswordStrength, verifyParentCredentials } from '../services/parentAuth';
import { DifficultyLevel } from '../types';

interface ParentAreaProps {
  onClose: () => void;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString('de-DE');
  } catch {
    return iso;
  }
}

function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}

function computeLearningScore(events: { correct: number; total: number; date: string }[]): number {
  if (events.length === 0) return 0;
  const recent = events.slice(0, 10);
  const accuracy = recent.reduce((acc, e) => acc + (e.total ? e.correct / e.total : 0), 0) / recent.length;
  const days = (() => {
    const first = new Date(recent[recent.length - 1]?.date || Date.now()).getTime();
    const last = new Date(recent[0]?.date || Date.now()).getTime();
    return Math.max(1, Math.round((last - first) / (1000 * 60 * 60 * 24)));
  })();
  const consistencyBonus = clamp(1 - (days / 30), 0, 1) * 0.15;
  return Math.round(clamp((accuracy + consistencyBonus), 0, 1) * 100);
}

const ParentArea: React.FC<ParentAreaProps> = ({ onClose }) => {
  const existing = loadParentAuth();

  const [mode, setMode] = useState<'setup' | 'login' | 'dashboard'>(() => (existing ? 'login' : 'setup'));
  const [error, setError] = useState<string>('');

  // Setup
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPassword2, setNewPassword2] = useState('');

  // Login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const cryptoOk = isParentCryptoAvailable();

  const events = useMemo(() => {
    const list = loadProgressEvents();
    return [...list].sort((a, b) => (b.date || '').localeCompare(a.date || ''));
  }, [mode]);

  const history = useMemo(() => loadHistory(), [mode]);

  const totals = useMemo(() => {
    const totalSessions = events.length;
    const totalCorrect = events.reduce((acc, e) => acc + (e.correct || 0), 0);
    const totalQuestions = events.reduce((acc, e) => acc + (e.total || 0), 0);
    const overallAccuracy = totalQuestions ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

    const perLevel: Record<string, { correct: number; total: number }> = {};
    for (const e of events) {
      const key = e.level || '—';
      perLevel[key] = perLevel[key] || { correct: 0, total: 0 };
      perLevel[key].correct += e.correct || 0;
      perLevel[key].total += e.total || 0;
    }

    const score = computeLearningScore(events.map(e => ({ correct: e.correct, total: e.total, date: e.date })));

    return { totalSessions, totalCorrect, totalQuestions, overallAccuracy, perLevel, score };
  }, [events]);

  const recommendations = useMemo(() => {
    const recs: string[] = [];
    if (events.length === 0) {
      recs.push('Starte 3 kurze Sessions (5–10 Min.) pro Woche für einen guten Rhythmus.');
      recs.push('Beginne mit „Leicht“ und steigere erst ab ~85% Trefferquote.');
      return recs;
    }

    const recent = events.slice(0, 5);
    const recentTotal = recent.reduce((a, e) => a + e.total, 0);
    const recentCorrect = recent.reduce((a, e) => a + e.correct, 0);
    const recentAcc = recentTotal ? (recentCorrect / recentTotal) * 100 : 0;

    if (recentAcc < 60) {
      recs.push('Trefferquote zuletzt < 60%: Wiederhole „Leicht“/„Mittel“ und nutze Schritt-für-Schritt-Hilfe.');
      recs.push('Trainiere kurze Blöcke: 5 Aufgaben, dann Pause.');
    } else if (recentAcc >= 85) {
      recs.push('Trefferquote zuletzt ≥ 85%: Steigere die Schwierigkeit oder probiere „Prüfung“.');
      recs.push('Baue 1 Knobel-Session (Känguru) pro Woche ein.');
    } else {
      recs.push('Gute Richtung: Bleib 2–3 Sessions auf dem aktuellen Level, dann steigern.');
    }

    const lastDate = new Date(events[0].date).getTime();
    const daysSince = Math.round((Date.now() - lastDate) / (1000 * 60 * 60 * 24));
    if (daysSince >= 3) recs.push('Tipp: Kleine tägliche Routine (5–10 Min.) wirkt besser als seltene lange Sessions.');

    return recs;
  }, [events]);

  const handleSetup = async () => {
    setError('');
    if (!cryptoOk) {
      setError('Dein Browser unterstützt keine sichere lokale Passwort-Funktion (crypto.subtle).');
      return;
    }
    if (!newUsername.trim()) {
      setError('Bitte Username eingeben.');
      return;
    }
    const pwErr = validatePasswordStrength(newPassword);
    if (pwErr) {
      setError(pwErr);
      return;
    }
    if (newPassword !== newPassword2) {
      setError('Passwörter stimmen nicht überein.');
      return;
    }

    const record = await createParentAuthRecord(newUsername, newPassword);
    saveParentAuth(record);
    setMode('dashboard');
    setUsername('');
    setPassword('');
  };

  const handleLogin = async () => {
    setError('');
    const record = loadParentAuth();
    if (!record) {
      setMode('setup');
      return;
    }

    const ok = await verifyParentCredentials(record, username, password);
    if (!ok) {
      setError('Login fehlgeschlagen. Username oder Passwort ist falsch.');
      return;
    }

    setMode('dashboard');
    setPassword('');
  };

  const handleReset = () => {
    const confirmText = prompt('Zum Zurücksetzen bitte "RESET" eingeben.');
    if (confirmText !== 'RESET') return;
    clearParentAuth();
    setMode('setup');
    setError('');
    setUsername('');
    setPassword('');
    setNewUsername('');
    setNewPassword('');
    setNewPassword2('');
  };

  const title = mode === 'dashboard' ? '👪 Elternbereich' : '🔐 Elternbereich (geschützt)';

  return (
    <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col border-4 border-white">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 flex-shrink-0">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-2xl font-kids text-white">{title}</h2>
              <p className="text-white/80 text-sm font-bold mt-1">Nur lokal gespeichert. Kein Cloud-Account.</p>
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

        <div className="overflow-y-auto p-8 bg-gray-50 flex-grow font-kids space-y-6">
          {!cryptoOk && (
            <div className="bg-red-50 border-2 border-red-200 p-4 rounded-2xl text-red-700 font-bold">
              Dieser Browser unterstützt kein sicheres lokales Passwort-Hashing (crypto.subtle). Elternbereich ist deaktiviert.
            </div>
          )}

          {error && (
            <div className="bg-orange-50 border-2 border-orange-200 p-4 rounded-2xl text-orange-800 font-bold">
              {error}
            </div>
          )}

          {mode === 'setup' && cryptoOk && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
              <h3 className="text-lg font-bold text-emerald-700">Erstes Mal: Zugang einrichten</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Lege jetzt einen lokalen Username + Passwort fest. Diese Daten bleiben nur auf diesem Gerät.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                  <input
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 font-bold text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    placeholder="z.B. MamaPapa"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Passwort</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 font-bold text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    placeholder="mind. 6 Zeichen"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Passwort wiederholen</label>
                  <input
                    type="password"
                    value={newPassword2}
                    onChange={(e) => setNewPassword2(e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 font-bold text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    placeholder="nochmal eingeben"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleSetup}
                    className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95"
                  >
                    Speichern & öffnen
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'login' && cryptoOk && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 space-y-4">
              <h3 className="text-lg font-bold text-emerald-700">Login</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Username und Passwort werden lokal geprüft.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 font-bold text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    placeholder={existing ? maskUsername(existing.username) : 'Username'}
                    autoCapitalize="off"
                    autoCorrect="off"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Passwort</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-emerald-50 border-2 border-emerald-100 rounded-xl px-4 py-3 font-bold text-emerald-900 focus:border-emerald-400 focus:outline-none"
                    placeholder="Passwort"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleLogin}
                  className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-all active:scale-95"
                >
                  Einloggen
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
                >
                  Zugang zurücksetzen
                </button>
              </div>

              <p className="text-xs text-gray-500">
                Hinweis: Zurücksetzen löscht die lokalen Zugangsdaten.
              </p>
            </div>
          )}

          {mode === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-emerald-700">Übersicht</h3>
                    <p className="text-gray-700 text-sm">Lokal gespeicherte Lern-Statistik</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-2.5 px-4 rounded-xl transition-all active:scale-95"
                  >
                    Zugang zurücksetzen
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <div className="bg-emerald-50 border-2 border-emerald-100 rounded-2xl p-4">
                    <div className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Lern-Score</div>
                    <div className="text-4xl font-kids text-emerald-800 mt-2">{totals.score}</div>
                    <div className="text-xs text-emerald-700 font-bold mt-1">(0–100)</div>
                  </div>
                  <div className="bg-blue-50 border-2 border-blue-100 rounded-2xl p-4">
                    <div className="text-xs font-bold text-blue-700 uppercase tracking-wider">Trefferquote</div>
                    <div className="text-4xl font-kids text-blue-800 mt-2">{totals.overallAccuracy}%</div>
                    <div className="text-xs text-blue-700 font-bold mt-1">über alle Sessions</div>
                  </div>
                  <div className="bg-purple-50 border-2 border-purple-100 rounded-2xl p-4">
                    <div className="text-xs font-bold text-purple-700 uppercase tracking-wider">Sessions</div>
                    <div className="text-4xl font-kids text-purple-800 mt-2">{totals.totalSessions}</div>
                    <div className="text-xs text-purple-700 font-bold mt-1">gespeichert</div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-700">Empfohlene nächste Schritte</h3>
                <ul className="list-disc pl-5 text-gray-700 text-sm leading-relaxed space-y-2 mt-3">
                  {recommendations.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 mt-3">
                  Hinweis: Das sind Heuristiken aus den lokalen Ergebnissen (kein medizinischer/psychologischer Test).
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-700">Pro Level</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {Object.entries(totals.perLevel as Record<string, { correct: number; total: number }>).map(([level, v]) => {
                    const acc = v.total ? Math.round((v.correct / v.total) * 100) : 0;
                    return (
                      <div key={level} className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div className="font-bold text-gray-800">{level === '—' ? 'Unbekannt' : level}</div>
                          <div className="font-bold text-gray-700">{acc}%</div>
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{v.correct}/{v.total} richtig</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-700">Letzte Sessions</h3>
                <div className="divide-y divide-gray-100 mt-3">
                  {events.slice(0, 10).map((e) => (
                    <div key={e.id} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-gray-800">
                          {e.type === 'exam' ? 'Quiz/Prüfung' : 'Training'}
                          {e.level ? ` • ${e.level}` : ''}
                          {e.topic ? ` • ${e.topic}` : ''}
                        </div>
                        <div className="text-xs text-gray-500">{formatDate(e.date)}</div>
                      </div>
                      <div className="font-bold text-gray-800">{e.correct}/{e.total}</div>
                    </div>
                  ))}
                  {events.length === 0 && <div className="text-sm text-gray-500 py-3">Noch keine Daten.</div>}
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <h3 className="text-lg font-bold text-emerald-700">Prüfungs-Historie (alt)</h3>
                <p className="text-xs text-gray-500">Diese Liste ist aus dem bisherigen Verlauf (max 50).</p>
                <div className="divide-y divide-gray-100 mt-3">
                  {history.slice(0, 10).map((h, idx) => (
                    <div key={idx} className="py-3 flex items-start justify-between gap-4">
                      <div>
                        <div className="font-bold text-gray-800">{h.level || DifficultyLevel.LEICHT}</div>
                        <div className="text-xs text-gray-500">{formatDate(h.date)}</div>
                      </div>
                      <div className="font-bold text-gray-800">{h.score}/{h.total}</div>
                    </div>
                  ))}
                  {history.length === 0 && <div className="text-sm text-gray-500 py-3">Noch keine Daten.</div>}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-white border-t border-gray-100 flex justify-center">
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

export default ParentArea;
