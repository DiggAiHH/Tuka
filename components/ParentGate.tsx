import React, { useMemo, useState } from 'react';
import { clearParentAuth, loadParentAuth, saveParentAuth } from '../services/persistence';
import { randomSaltHex, sha256Hex } from '../services/crypto';

interface ParentGateProps {
  onAuthenticated: () => void;
  onClose: () => void;
}

const ParentGate: React.FC<ParentGateProps> = ({ onAuthenticated, onClose }) => {
  const existing = useMemo(() => loadParentAuth(), []);

  // Setup fields
  const [setupUsername, setSetupUsername] = useState('');
  const [setupPassword, setSetupPassword] = useState('');
  const [setupPassword2, setSetupPassword2] = useState('');

  // Login fields
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const isSetupMode = !existing;

  const handleSetup = async () => {
    setError(null);
    if (!setupUsername.trim()) return setError('Bitte einen Benutzernamen eingeben.');
    if (!setupPassword) return setError('Bitte ein Passwort eingeben.');
    if (setupPassword.length < 6) return setError('Passwort muss mindestens 6 Zeichen haben.');
    if (setupPassword !== setupPassword2) return setError('Passwörter stimmen nicht überein.');

    setBusy(true);
    try {
      const salt = randomSaltHex(16);
      const hash = await sha256Hex(`${salt}:${setupPassword}`);
      saveParentAuth({ username: setupUsername.trim(), passwordSalt: salt, passwordHashHex: hash });
      onAuthenticated();
    } catch (e) {
      console.error(e);
      setError('Konnte Eltern-Zugang nicht speichern.');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async () => {
    setError(null);
    if (!existing) return;
    if (!loginUsername.trim()) return setError('Bitte Benutzernamen eingeben.');
    if (!loginPassword) return setError('Bitte Passwort eingeben.');

    setBusy(true);
    try {
      if (loginUsername.trim() !== existing.username) {
        setError('Benutzername oder Passwort ist falsch.');
        return;
      }
      const hash = await sha256Hex(`${existing.passwordSalt}:${loginPassword}`);
      if (hash !== existing.passwordHashHex) {
        setError('Benutzername oder Passwort ist falsch.');
        return;
      }
      onAuthenticated();
    } catch (e) {
      console.error(e);
      setError('Login fehlgeschlagen.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border-4 border-white">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-600 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-kids text-white">👨‍👩‍👧 Elternbereich</h2>
              <p className="text-white/80 text-sm mt-1">Passwortgeschützt (lokal gespeichert)</p>
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

        <div className="p-6 bg-gray-50 font-kids space-y-4">
          {isSetupMode ? (
            <>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-emerald-800">Erstes Mal: Zugang anlegen</h3>
                <p className="text-sm text-gray-600 mt-1">Lege Benutzername und Passwort fest. Beides bleibt nur auf diesem Gerät.</p>
              </div>

              <div className="space-y-3">
                <input
                  value={setupUsername}
                  onChange={(e) => setSetupUsername(e.target.value)}
                  placeholder="Benutzername"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="password"
                  value={setupPassword}
                  onChange={(e) => setSetupPassword(e.target.value)}
                  placeholder="Passwort (min. 6 Zeichen)"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="password"
                  value={setupPassword2}
                  onChange={(e) => setSetupPassword2(e.target.value)}
                  placeholder="Passwort wiederholen"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-emerald-400 focus:outline-none"
                />

                {error && <div className="text-sm font-bold text-red-600">{error}</div>}

                <button
                  disabled={busy}
                  onClick={handleSetup}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-kids text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Zugang speichern ✅
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-emerald-800">Login</h3>
                <p className="text-sm text-gray-600 mt-1">Gib Benutzername und Passwort ein, um den Elternbereich zu öffnen.</p>
              </div>

              <div className="space-y-3">
                <input
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  placeholder="Benutzername"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-emerald-400 focus:outline-none"
                />
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="Passwort"
                  className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-800 focus:border-emerald-400 focus:outline-none"
                />

                {error && <div className="text-sm font-bold text-red-600">{error}</div>}

                <button
                  disabled={busy}
                  onClick={handleLogin}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-kids text-xl py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Öffnen 🔓
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const ok = confirm('Eltern-Zugang wirklich zurücksetzen? Danach muss ein neuer Benutzername/Passwort angelegt werden.');
                    if (!ok) return;
                    clearParentAuth();
                    location.reload();
                  }}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-2xl transition-colors"
                >
                  Zugang zurücksetzen
                </button>
              </div>
            </>
          )}

          <p className="text-[11px] text-gray-400">
            Hinweis: Der Eltern-Zugang ist nur auf diesem Gerät gespeichert (LocalStorage).
          </p>
        </div>
      </div>
    </div>
  );
};

export default ParentGate;
