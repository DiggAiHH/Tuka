
import React, { useState } from 'react';
import { MathProblem, UserProfile } from '../types';

interface ExamSessionProps {
  problems: MathProblem[];
  onFinish: (score: number, total: number, history: any[]) => void;
  userProfile?: UserProfile;
}

const ExamSession: React.FC<ExamSessionProps> = ({ problems, onFinish, userProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : '';
  const childName = firstName || 'Tuka';

  const currentProblem = problems[currentIndex];

  const handleSubmit = (selectedAnswer?: string) => {
    // If it's multiple choice, 'answer' in DB is likely A, B, C, D, E.
    // selectedAnswer here would be the full option text or just the letter.
    // Let's assume we want to match the letter.
    
    let answerToValidate = (selectedAnswer || userAnswer).trim();
    if (!answerToValidate) return;

    // Clean match
    const isCorrect = answerToValidate.toLowerCase() === currentProblem.answer.toLowerCase();
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    const result = {
      problem: currentProblem,
      userAnswer: answerToValidate,
      isCorrect
    };

    const newHistory = [...history, result];
    setHistory(newHistory);

    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setUserAnswer('');
    } else {
      onFinish(newScore, problems.length, newHistory);
    }
  };

  return (
    <div className="space-y-8 max-w-2xl mx-auto pb-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-kids text-purple-600">
          {currentProblem.options ? "🦘 Känguru-Herausforderung!" : "Das große Mathe-Quiz! 🏆"}
        </h2>
        <p className="text-gray-500 italic">{childName}, du schaffst das!</p>
      </div>

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-100">
        <div className="bg-purple-600 p-2 flex justify-between px-6 text-white text-sm font-bold">
          <span>Aufgabe {currentIndex + 1} von {problems.length}</span>
          <span>Sterne: {score} ⭐</span>
        </div>

        <div className="p-8 space-y-8">
          <div className="text-center">
            <h3 className="text-sm text-gray-400 font-bold uppercase mb-4">Aufgabe:</h3>
            <p className="text-2xl md:text-3xl font-kids text-gray-800 leading-relaxed">
              {currentProblem.question}
            </p>
          </div>

          {currentProblem.options ? (
            <div className="grid grid-cols-1 gap-3">
              {currentProblem.options.map((option, idx) => {
                const letter = String.fromCharCode(65 + idx);
                return (
                  <button
                    key={idx}
                    onClick={() => handleSubmit(letter)}
                    className="w-full text-left p-4 rounded-2xl border-4 border-purple-50 hover:border-purple-400 hover:bg-purple-50 transition-all font-medium text-lg flex items-center space-x-4 group"
                  >
                    <span className="bg-purple-100 text-purple-600 w-10 h-10 rounded-full flex items-center justify-center font-bold group-hover:bg-purple-500 group-hover:text-white transition-colors">
                      {letter}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4">
              <input 
                type="number" 
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Zahl eingeben..."
                className="w-full text-4xl text-center py-6 bg-gray-50 rounded-2xl border-4 border-purple-100 focus:border-purple-400 focus:outline-none font-kids"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              />
              <button 
                onClick={() => handleSubmit()}
                disabled={!userAnswer.trim()}
                className="w-full bg-purple-500 hover:bg-purple-600 disabled:bg-gray-200 text-white font-kids text-2xl py-5 rounded-2xl shadow-xl border-b-8 border-purple-800 active:border-b-0 active:translate-y-2 transition-all"
              >
                Fertig! ✅
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center space-x-2">
        {problems.map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full transition ${i === currentIndex ? 'bg-purple-600 w-8' : 'bg-gray-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ExamSession;
