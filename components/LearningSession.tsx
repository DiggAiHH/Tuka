
import React, { useState, useEffect } from 'react';
import { MathProblem } from '../types';

interface LearningSessionProps {
  problems: MathProblem[];
  topic: string;
  onComplete: () => void;
}

const LearningSession: React.FC<LearningSessionProps> = ({ problems, topic, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shake, setShake] = useState(false);

  const currentProblem = problems[currentIndex];

  useEffect(() => {
    // Reset state for new problem
    setUserAnswer('');
    setIsCorrect(null);
    setShowSteps(false);
    setCurrentStep(0);
  }, [currentIndex]);

  const handleCheck = () => {
    const cleanUserAnswer = userAnswer.trim().toLowerCase();
    const cleanRealAnswer = currentProblem.answer.trim().toLowerCase();
    
    if (cleanUserAnswer === cleanRealAnswer) {
      setIsCorrect(true);
      setShowSteps(true);
      setCurrentStep(currentProblem.steps.length);
    } else {
      setIsCorrect(false);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  const nextProblem = () => {
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const handleNextStep = () => {
    if (currentStep < currentProblem.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <div className="space-y-6 pb-10 max-w-2xl mx-auto">
      <div className="flex justify-between items-center bg-blue-600 text-white p-6 rounded-[2rem] shadow-lg">
        <div>
          <h2 className="text-sm uppercase tracking-widest opacity-80 font-bold">Training</h2>
          <h3 className="text-xl font-kids line-clamp-1">{topic}</h3>
        </div>
        <div className="bg-blue-700 px-4 py-2 rounded-xl text-lg font-bold flex-shrink-0">
          {currentIndex + 1} / {problems.length}
        </div>
      </div>

      <div className={`bg-white p-8 rounded-[3rem] shadow-xl border-b-8 border-gray-100 transition-all ${shake ? 'animate-bounce' : ''}`}>
        <div className="space-y-8 text-center">
          <h4 className="text-gray-400 font-bold uppercase text-sm tracking-widest">Deine Aufgabe:</h4>
          <p className="text-3xl md:text-4xl font-kids text-gray-800 py-2 leading-relaxed">
            {currentProblem.question}
          </p>

          {!isCorrect && (
            <div className="max-w-xs mx-auto space-y-6">
              <input 
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="?"
                className={`w-full text-center text-5xl font-kids py-6 rounded-3xl border-4 transition-all focus:outline-none ${
                  isCorrect === false ? 'border-red-400 bg-red-50 text-red-600' : 'border-blue-100 bg-blue-50 focus:border-blue-400 text-blue-600'
                }`}
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleCheck()}
              />
              
              <div className="flex flex-col space-y-3">
                <button 
                  onClick={handleCheck}
                  disabled={!userAnswer.trim()}
                  className="bg-green-500 hover:bg-green-600 disabled:bg-gray-200 text-white font-kids text-2xl py-5 rounded-3xl shadow-xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all"
                >
                  Prüfen! ✅
                </button>
                
                {!showSteps && (
                  <button 
                    onClick={() => setShowSteps(true)}
                    className="text-blue-500 font-bold hover:underline py-2"
                  >
                    Hilfe / Schritte zeigen 🧩
                  </button>
                )}
              </div>
            </div>
          )}

          {isCorrect && (
            <div className="bg-green-100 p-8 rounded-[2.5rem] border-2 border-green-300 animate-in zoom-in duration-300">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-3xl font-kids text-green-700">Richtig gelöst!</h3>
              <p className="text-green-600 text-lg">Tuka, das war klasse!</p>
            </div>
          )}

          {isCorrect === false && !showSteps && (
            <p className="text-red-500 font-bold animate-pulse text-lg">Fast richtig! Versuch es nochmal, Tuka.</p>
          )}
        </div>

        {showSteps && (
          <div className="mt-10 space-y-6 pt-8 border-t-2 border-dashed border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
            <h5 className="text-blue-500 font-bold uppercase text-xs tracking-widest text-center">So geht's Schritt für Schritt:</h5>
            <div className="space-y-4">
              {currentProblem.steps.slice(0, currentStep + 1).map((step, i) => (
                <div key={i} className="flex items-start space-x-4 bg-yellow-50 p-6 rounded-3xl border border-yellow-200 shadow-sm animate-in slide-in-from-left duration-300">
                  <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-sm text-xl">
                    {i + 1}
                  </div>
                  <p className="text-xl text-yellow-900 leading-tight pt-1">{step}</p>
                </div>
              ))}
            </div>

            {currentStep < currentProblem.steps.length - 1 ? (
              <button 
                onClick={handleNextStep}
                className="w-full bg-blue-100 text-blue-600 font-bold py-5 rounded-3xl hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2 text-xl"
              >
                <span>Nächster Schritt</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            ) : (
              <div className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-200 space-y-4">
                <div className="flex items-center justify-center space-x-4">
                   <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">Ergebnis</span>
                   <p className="text-5xl font-kids text-blue-700">{currentProblem.answer}</p>
                </div>
                <p className="text-gray-600 italic text-lg text-center leading-relaxed">
                  "{currentProblem.explanation}"
                </p>
              </div>
            )}
            
            {(isCorrect || currentStep === currentProblem.steps.length - 1) && (
              <button 
                onClick={nextProblem}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-kids text-3xl py-6 rounded-3xl shadow-xl border-b-8 border-blue-900 active:border-b-0 active:translate-y-2 transition-all mt-6"
              >
                Weiter geht's! ➡️
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-2 opacity-50">
         {problems.map((_, i) => (
           <div key={i} className={`h-3 rounded-full transition-all ${i === currentIndex ? 'w-10 bg-blue-500' : 'w-3 bg-gray-300'}`} />
         ))}
      </div>
    </div>
  );
};

export default LearningSession;
