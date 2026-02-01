
import React from 'react';

interface HeaderProps {
  onHomeClick: () => void;
  onShareClick: () => void;
  onProfileClick?: () => void;
  profileName?: string | null;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onShareClick, onProfileClick, profileName }) => {
  return (
    <header className="bg-white shadow-md p-4 sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-3">
        <button
          onClick={onHomeClick}
          className="flex items-center space-y-1 hover:opacity-80 transition"
        >
          <div className="bg-pink-400 p-2 rounded-xl mr-3 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-2xl font-kids text-blue-600">Tukas Mathe-Welt</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={onShareClick}
            className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white px-5 py-2.5 rounded-full shadow-lg transition-all active:scale-95 border-b-4 border-pink-700"
            title="App mit anderen teilen"
          >
            <span className="text-xl">✨</span>
            <span className="font-kids text-sm">Teilen</span>
          </button>

          <button
            onClick={onProfileClick}
            className="flex items-center space-x-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors active:scale-95"
            title="Mein Profil"
          >
            <span className="text-blue-600 font-semibold hidden xs:inline">Hallo {profileName || 'Tuka'}! 👋</span>
            <span className="text-2xl">👧</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
