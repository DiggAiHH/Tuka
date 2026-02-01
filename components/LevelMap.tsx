
import React, { useState } from 'react';
import { DifficultyLevel } from '../types';

interface LevelMapProps {
  topic: string;
  unlockedLevels: DifficultyLevel[];
  onSelectLevel: (level: DifficultyLevel) => void;
}

const LevelMap: React.FC<LevelMapProps> = ({ topic, unlockedLevels, onSelectLevel }) => {
  const [selectedForConfirm, setSelectedForConfirm] = useState<DifficultyLevel | null>(null);

  const levels = [
    { id: DifficultyLevel.LEICHT, icon: "🌱", label: "Leicht", color: "bg-green-400", borderColor: "border-green-600" },
    { id: DifficultyLevel.MITTEL, icon: "🌿", label: "Mittel", color: "bg-yellow-400", borderColor: "border-yellow-600" },
    { id: DifficultyLevel.SCHWER, icon: "🌳", label: "Schwer", color: "bg-orange-500", borderColor: "border-orange-700" },
    { id: DifficultyLevel.PRUEFUNG, icon: "🏆", label: "Tukas Prüfung", color: "bg-purple-600", borderColor: "border-purple-800" }
  ];

  const currentLevelData = levels.find(l => l.id === selectedForConfirm);

  return (
    <div className="space-y-12 py-6 relative">
      <div className="text-center space-y-2">
        <h2 className="text-sm uppercase tracking-widest text-pink-500 font-bold tracking-widest">Tukas Lernreise</h2>
        <h3 className="text-3xl font-kids text-blue-800">{topic}</h3>
        <p className="text-gray-500">Tuka, schlage alle Level für deine 1!</p>
      </div>

      <div className="relative flex flex-col items-center space-y-12">
        {/* Connection line */}
        <div className="absolute top-0 bottom-0 w-2 bg-pink-100 -z-10 rounded-full"></div>

        {levels.map((level, index) => {
          const isUnlocked = unlockedLevels.includes(level.id);
          return (
            <div key={level.id} className={`relative flex items-center w-full max-w-sm ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <button
                disabled={!isUnlocked}
                onClick={() => setSelectedForConfirm(level.id)}
                className={`
                  w-24 h-24 rounded-full flex items-center justify-center text-4xl shadow-xl transition-all transform
                  ${isUnlocked ? `${level.color} hover:scale-110 cursor-pointer text-white` : 'bg-gray-200 cursor-not-allowed text-gray-400'}
                  border-4 border-white
                `}
              >
                {isUnlocked ? level.icon : "🔒"}
              </button>
              
              <div className={`flex-1 px-6 ${index % 2 === 0 ? 'text-left' : 'text-right'}`}>
                <h4 className={`text-xl font-kids ${isUnlocked ? 'text-gray-800' : 'text-gray-300'}`}>
                  {level.label}
                </h4>
                {isUnlocked ? (
                  <span className="text-xs font-bold text-pink-500 uppercase">Bereit!</span>
                ) : (
                  <span className="text-xs font-bold text-gray-300 uppercase">Noch gesperrt</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal Overlay */}
      {selectedForConfirm && currentLevelData && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full text-center space-y-6 transform animate-in zoom-in-95 duration-200 border-4 border-pink-100">
            <div className={`w-24 h-24 ${currentLevelData.color} mx-auto rounded-full flex items-center justify-center text-5xl shadow-lg border-4 border-white`}>
              {currentLevelData.icon}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-2xl font-kids text-gray-800">Tuka, bist du bereit?</h3>
              <p className="text-gray-500">Möchtest du das Level <span className="font-bold text-pink-600">"{currentLevelData.label}"</span> jetzt starten?</p>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={() => {
                  onSelectLevel(selectedForConfirm);
                  setSelectedForConfirm(null);
                }}
                className={`${currentLevelData.color} text-white font-kids text-xl py-4 rounded-2xl shadow-lg hover:brightness-110 active:scale-95 transition-all border-b-4 ${currentLevelData.borderColor}`}
              >
                Ja, Tuka schafft das! 🚀
              </button>
              <button
                onClick={() => setSelectedForConfirm(null)}
                className="bg-gray-100 text-gray-500 font-bold py-3 rounded-2xl hover:bg-gray-200 transition-colors"
              >
                Noch einen Moment 🎈
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelMap;
