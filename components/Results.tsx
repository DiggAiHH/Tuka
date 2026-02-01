
import React from 'react';
import { UserProfile } from '../types';

interface ResultsProps {
  results: { score: number, total: number, history: any[] };
  onRestart: () => void;
  onPracticeAgain: () => void;
  onCorrectWrong: () => void;
  userProfile?: UserProfile;
}

const Results: React.FC<ResultsProps> = ({ results, onRestart, onPracticeAgain, onCorrectWrong, userProfile }) => {
  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : '';
  const childName = firstName || 'Tuka';
  const possessive = `${childName}s`;

  const percentage = (results.score / results.total) * 100;
  const wrongCount = results.total - results.score;
  
  let grade = 6;
  let colorClass = "text-red-500";
  let starIcon = "⭐";

  if (percentage >= 96) { grade = 1; colorClass = "text-green-600"; starIcon = "🏆"; }
  else if (percentage >= 85) { grade = 2; colorClass = "text-green-500"; starIcon = "🌟"; }
  else if (percentage >= 70) { grade = 3; colorClass = "text-yellow-600"; starIcon = "✨"; }
  else if (percentage >= 50) { grade = 4; colorClass = "text-orange-500"; starIcon = "👍"; }
  else if (percentage >= 25) { grade = 5; colorClass = "text-red-400"; starIcon = "💪"; }

  const getEncouragement = () => {
    if (grade === 1) return `${childName}, du bist eine echte Mathe-Königin! 👑🥇`;
    if (grade === 2) return `${childName}, super gemacht! Nur ein kleiner Schritt bis zur 1! 🥈`;
    if (grade === 3) return `Gut gemacht, ${childName}! Du wirst immer besser! 🥉`;
    return `${childName}, nicht traurig sein! Wir üben das einfach nochmal zusammen. 🦁`;
  };

  return (
    <div className="space-y-8 animate-in zoom-in duration-500 pb-20">
      <div className="text-center space-y-4">
        <div className="inline-block relative">
          <span className="text-9xl">{starIcon}</span>
          <div className="absolute -top-4 -right-4 bg-pink-400 text-white w-16 h-16 rounded-full flex items-center justify-center font-kids text-2xl border-4 border-white shadow-lg animate-pulse">
            {results.score}
          </div>
        </div>
        <h2 className="text-4xl font-kids text-blue-700 px-4">{getEncouragement()}</h2>
        
        <div className="flex justify-center items-center space-x-6">
          <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border-b-8 border-green-100 flex flex-col items-center">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">{possessive} Note</span>
            <span className={`text-6xl font-kids ${colorClass}`}>{grade}</span>
          </div>
          <div className="bg-white px-8 py-4 rounded-3xl shadow-xl border-b-8 border-yellow-100 flex flex-col items-center">
            <span className="text-gray-400 font-bold uppercase text-xs tracking-widest">Sterne</span>
            <span className="text-4xl font-kids text-yellow-500">
              {results.score > 0 ? "⭐".repeat(Math.min(results.score, 5)) : "🥚"}
            </span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl p-8 border-4 border-pink-50">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-kids text-gray-800 flex items-center">
            <span className="mr-3">🧐</span> {possessive} Analyse:
          </h3>
          {wrongCount > 0 && (
            <button 
              onClick={onCorrectWrong}
              className="bg-orange-400 hover:bg-orange-500 text-white font-kids px-6 py-3 rounded-2xl shadow-lg border-b-4 border-orange-700 active:border-b-0 transition-all text-sm"
            >
              Fehler korrigieren! ✏️
            </button>
          )}
        </div>
        <div className="space-y-4">
          {results.history.map((item, i) => (
            <div key={i} className={`p-6 rounded-2xl border-2 transition-all ${item.isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200 shadow-inner'}`}>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="text-xl font-bold text-gray-800 mb-1">{item.problem.question}</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Deine Antwort:</span>
                    <span className={`font-kids text-lg ${item.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                      {item.userAnswer}
                    </span>
                  </div>
                  {!item.isCorrect && (
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-bold text-green-700 bg-green-100 inline-block px-3 py-1 rounded-full">
                        Richtig: {item.problem.answer}
                      </p>
                      <div className="bg-white p-4 rounded-xl border border-red-100 text-sm text-gray-600 leading-relaxed shadow-sm">
                        <span className="font-bold text-pink-500 mr-1">Tipp für {childName}:</span>
                        {item.problem.explanation}
                      </div>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0">
                  {item.isCorrect ? (
                    <div className="bg-green-500 text-white p-2 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : (
                    <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          onClick={onPracticeAgain}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-kids text-2xl py-6 rounded-3xl shadow-xl transition-all border-b-8 border-blue-900 flex items-center justify-center space-x-3"
        >
          <span>Einfach nochmal!</span>
        </button>
        <button 
          onClick={onRestart}
          className="flex-1 bg-pink-400 hover:bg-pink-500 text-white font-kids text-2xl py-6 rounded-3xl shadow-xl transition-all border-b-8 border-pink-700 flex items-center justify-center space-x-3"
        >
          <span>Hauptmenü</span>
        </button>
      </div>
    </div>
  );
};

export default Results;
