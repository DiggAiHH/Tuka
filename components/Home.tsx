
import React, { useState, useEffect } from 'react';
import InstallGuide from './InstallGuide';
import { UserProfile } from '../types';

interface HomeProps {
  userProfile: UserProfile | null;
  onStart: (topic: string) => void; // Standard Training
  onStartUpload?: () => void; // Legacy or specific
  onStartKangaroo?: () => void; // Legacy or specific
  onEditProfile: () => void;
  onShowGuide: () => void;
  onShowFeatures: () => void;
}

const Home: React.FC<HomeProps> = ({ userProfile, onStart, onStartUpload, onStartKangaroo, onEditProfile, onShowGuide, onShowFeatures }) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  return (
    <div className="max-w-5xl mx-auto text-center space-y-10 py-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* Hero-Sektion v19 */}
      <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[3rem] p-10 shadow-2xl border-4 border-white text-white">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
        <div className="relative z-10 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-black/10 backdrop-blur-sm px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            <span>App-Modus bereit</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-kids leading-tight drop-shadow-md text-white">
            Hallo <span className="text-blue-700">{userProfile?.name ? userProfile.name.split(' ')[0] : "Heldin"}</span>! 👋
          </h1>
          <p className="text-xl md:text-2xl font-medium max-w-2xl mx-auto text-orange-900/80 mb-6 font-kids">
            Tukas Mathe-Welt erwartet dich! 👑
          </p>

          <div className="flex justify-center space-x-3">
            <button
              onClick={onShowFeatures}
              className="bg-purple-600/80 hover:bg-purple-700 text-white border-2 border-white/50 px-6 py-2 rounded-full font-bold text-sm backdrop-blur-sm transition-all active:scale-95 flex items-center gap-2"
            >
              ✨ Was ist neu?
            </button>
            <button
              onClick={onShowGuide}
              className="bg-white/20 hover:bg-white/30 text-white border-2 border-white/50 px-6 py-2 rounded-full font-bold text-sm backdrop-blur-sm transition-all active:scale-95"
            >
              📚 Hilfe
            </button>
          </div>
        </div>
      </div>

      {/* Haupt-Menü */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <button
          onClick={() => onStart('leicht')}
          className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-b-[12px] border-green-400 flex flex-col items-center space-y-6 active:scale-95 transition-all hover:-translate-y-2"
        >
          <div className="text-8xl group-hover:scale-110 transition-transform">🚀</div>
          <h3 className="text-2xl font-kids text-gray-800">Training</h3>
        </button>

        <button
          onClick={onStartUpload}
          className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-b-[12px] border-pink-400 flex flex-col items-center space-y-6 active:scale-95 transition-all hover:-translate-y-2"
        >
          <div className="text-8xl group-hover:scale-110 transition-transform">📸</div>
          <h3 className="text-2xl font-kids text-gray-800">Hausaufgabe</h3>
        </button>

        <button
          onClick={onStartKangaroo}
          className="group bg-white p-10 rounded-[3.5rem] shadow-xl border-b-[12px] border-blue-400 flex flex-col items-center space-y-6 active:scale-95 transition-all hover:-translate-y-2"
        >
          <div className="text-8xl group-hover:scale-110 transition-transform">🦘</div>
          <h3 className="text-2xl font-kids text-gray-800">Känguru</h3>
        </button>
      </div>

      <p className="text-[10px] text-gray-300 font-bold tracking-widest uppercase">
        Mathe-Heldin v19.0 • Made with ❤️ by Dad
      </p>
    </div>
  );
};

export default Home;
