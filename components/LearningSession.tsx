
import React, { useState, useEffect } from 'react';
import { MathProblem, UserProfile } from '../types';
import { translateProblem } from '../services/geminiService';
import { SUPPORTED_LANGUAGES, getTranslation, Language } from '../services/translations';

interface LearningSessionProps {
  problems: MathProblem[];
  topic: string;
  onComplete: () => void;
  userProfile?: UserProfile;
  onUpdateProfile?: (profile: UserProfile) => void;
}

const LearningSession: React.FC<LearningSessionProps> = ({ problems, topic, onComplete, userProfile, onUpdateProfile }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [localProblems, setLocalProblems] = useState<MathProblem[]>(problems);

  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [shake, setShake] = useState(false);

  // Bilingual State
  const [userLanguage, setUserLanguage] = useState<string>(userProfile?.language || 'en');
  const [showTwoLang, setShowTwoLang] = useState(true); // Default ON based on User Request
  const [showHint, setShowHint] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const currentProblem = localProblems[currentIndex];

  useEffect(() => {
    if (userLanguage && userLanguage !== 'de') {
      // Check if current problem lacks granular data?
      if (!currentProblem.question_second_lang) {
        // Missing translation, fetch it!
        const fetchTrans = async () => {
          setIsTranslating(true);
          const updated = await translateProblem(currentProblem, userLanguage);
          setLocalProblems(p => {
            const copy = [...p];
            copy[currentIndex] = updated;
            return copy;
          });
          setIsTranslating(false);
        };
        fetchTrans();
      }
    }
  }, [currentIndex, userLanguage]);

  // UI Helpers
  const t = (key: any) => getTranslation(userLanguage, key);

  // Calculate Feedback Message based on correctness
  let feedback = null;
  if (isCorrect === true) feedback = "Richtig gelöst!";
  if (isCorrect === false) feedback = "Leider falsch!";

  useEffect(() => {
    setUserAnswer('');
    setIsCorrect(null);
    setShowSteps(false);
    setCurrentStep(0);
    // Persist language toggle preference during session? No, reset per problem or keep? 
    // Usually keep. But existing logic reset it. Let's keep it if set.
    // setShowTwoLang(false); // Let's keep it persistent across questions!
    setShowHint(false);
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
      <div className="flex justify-between items-center bg-blue-600 text-white p-6 rounded-[2rem] shadow-lg sticky top-0 z-50">
        <div className="flex items-center space-x-2">
          {/* Language Dropdown */}
          <select
            value={userLanguage}
            onChange={(e) => {
              const newLang = e.target.value;
              setUserLanguage(newLang);
              // Sync with Profile!
              if (userProfile && onUpdateProfile) {
                onUpdateProfile({ ...userProfile, language: newLang });
              }
            }}
            className="bg-blue-700 text-white font-bold rounded-xl px-2 py-1 border-none focus:ring-2 focus:ring-white outline-none cursor-pointer"
          >
            <option value="de">🇩🇪 Deutsch</option>
            {SUPPORTED_LANGUAGES.map(l => (
              <option key={l.code} value={l.code}>{l.flag} {l.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-3">
          {/* Global Translation Toggle */}
          {userLanguage !== 'de' && (
            <button
              onClick={() => setShowTwoLang(!showTwoLang)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${showTwoLang ? 'bg-white text-blue-600 rotate-180' : 'bg-blue-700 text-white hover:bg-blue-500'}`}
              title="Bilingual Mode"
            >
              <span className="text-2xl">🌍</span>
            </button>
          )}

          <div className="bg-blue-700 px-4 py-2 rounded-xl text-lg font-bold flex-shrink-0">
            {currentIndex + 1} / {problems.length}
          </div>
        </div>
      </div>

      <div className={`bg-white p-8 rounded-[3rem] shadow-xl border-b-8 border-gray-100 transition-all ${shake ? 'animate-bounce' : ''}`}>

        {isTranslating && (
          <div className="absolute inset-0 bg-white/80 z-40 flex items-center justify-center rounded-[3rem]">
            <div className="animate-spin text-4xl mr-3">🌍</div>
            <p className="font-kids text-xl text-blue-600">{t('loading_trans')}</p>
          </div>
        )}

        <div className="space-y-8 text-center">
          <div className="space-y-1">
            <h4 className="text-gray-400 font-bold uppercase text-sm tracking-widest">{t('training')}</h4>
            <h4 className="text-gray-300 font-bold uppercase text-xs tracking-widest">{t('task_header')}</h4>
          </div>

          {/* Question Area */}
          <div className="space-y-4">
            <p className="text-3xl md:text-4xl font-kids text-gray-800 py-2 leading-relaxed">
              {currentProblem.question}
            </p>

            {showTwoLang && currentProblem.question_second_lang && userLanguage !== 'de' && (
              <div className="bg-indigo-50 p-4 rounded-2xl border-2 border-indigo-100 animate-in fade-in slide-in-from-top-2">
                <p className="text-xl md:text-2xl font-kids text-indigo-700">
                  {currentProblem.question_second_lang}
                </p>
              </div>
            )}
          </div>

          {/* HINTS Section */}
          {(currentProblem.hints.length > 0 || (currentProblem.hints_blocks && currentProblem.hints_blocks.length > 0)) && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowHint(prev => !prev)}
                className="text-orange-500 font-bold hover:text-orange-600 transition-colors flex items-center space-x-2 bg-orange-50 px-6 py-3 rounded-full"
              >
                <span>💡 {t('hint_btn')}</span>
              </button>
            </div>
          )}

          {showHint && (
            <div className="space-y-3 animate-in fade-in slide-in-from-top-2">
              {showTwoLang && currentProblem.hints_blocks && userLanguage !== 'de' ? (
                currentProblem.hints_blocks.map((hint, i) => (
                  <div key={i} className="flex gap-4 items-start bg-orange-50 p-4 rounded-2xl border border-orange-100 text-left">
                    <div className="flex-1 text-orange-800 font-medium">🇩🇪 {hint.de}</div>
                    <div className="flex-1 text-orange-600 font-medium">🌍 {hint.second_lang}</div>
                  </div>
                ))
              ) : (
                (currentProblem.hints || []).map((hint, i) => (
                  <div key={i} className="bg-orange-50 p-4 rounded-2xl border border-orange-100 text-orange-800 font-medium italic">
                    💡 {hint}
                  </div>
                ))
              )}
            </div>
          )}

          {!isCorrect && (
            <div className="max-w-xs mx-auto space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="?"
                  className="w-full text-center text-4xl font-black py-6 rounded-[2rem] border-4 border-gray-100 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-inner text-blue-600 placeholder-gray-200"
                  onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
                />
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleCheck}
                  disabled={!userAnswer}
                  className="w-full bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-black text-xl py-6 rounded-[2rem] shadow-lg shadow-green-200 transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!showTwoLang || userLanguage === 'de' ? "Prüfen! 🚀" : (
                    <div className="flex flex-col leading-tight">
                      <span>Prüfen! 🚀</span>
                      <span className="text-sm opacity-90">{t('check_btn')}</span>
                    </div>
                  )}
                </button>

                {!showSteps && (
                  <button
                    onClick={() => setShowSteps(true)}
                    className="text-blue-500 font-bold hover:underline py-2"
                  >
                    <div className="flex flex-col leading-tight">
                      <span>Hilfe / Schritte zeigen 🧩</span>
                      {showTwoLang && userLanguage !== 'de' && <span className="text-sm opacity-80">{t('show_steps_btn')}</span>}
                    </div>
                  </button>
                )}
              </div>

              {isCorrect === false && !showSteps && (
                <div className="text-red-500 font-bold animate-pulse text-lg">
                  <p>Fast richtig!</p>
                  {showTwoLang && userLanguage !== 'de' && <p className="text-sm opacity-80">{t('nearly_correct')}</p>}
                </div>
              )}
            </div>
          )}

          {/* Correct State */}
          {isCorrect && (
            <div className="bg-green-100 p-8 rounded-[2.5rem] border-2 border-green-300 animate-in zoom-in duration-300">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="text-3xl font-kids text-green-700">
                {userProfile?.name ? `Richtig gelöst, ${userProfile.name}!` : "Richtig gelöst!"}
              </h3>
              {showTwoLang && userLanguage !== 'de' && <h4 className="text-xl font-kids text-green-600 mt-2">{t('correct_title')}</h4>}

              {showTwoLang && currentProblem.feedback_correct && (
                <h4 className="text-lg font-kids text-green-600 mt-2 italic">"{currentProblem.feedback_correct.second_lang}"</h4>
              )}
            </div>
          )}

          {/* STEPS LIST */}
          {showSteps && (
            <div className="mt-10 space-y-6 pt-8 border-t-2 border-dashed border-gray-100 animate-in fade-in slide-in-from-top-4 duration-500">
              <h5 className="text-blue-500 font-bold uppercase text-xs tracking-widest text-center">So geht's Schritt für Schritt:</h5>
              <div className="space-y-4">
                {showTwoLang && currentProblem.steps_blocks && userLanguage !== 'de' ? (
                  currentProblem.steps_blocks.slice(0, isCorrect ? currentProblem.steps_blocks.length : currentStep + 1).map((step, i) => (
                    <div key={i} className="flex flex-col md:flex-row gap-4 items-start bg-yellow-50 p-6 rounded-3xl border border-yellow-200 shadow-sm animate-in slide-in-from-left duration-300">
                      <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-sm text-xl mb-2 md:mb-0">
                        {i + 1}
                      </div>
                      <div className="flex-1 space-y-2 text-left">
                        <p className="text-xl text-yellow-900 leading-tight">{step.de}</p>
                        <p className="text-lg text-yellow-700 leading-tight border-t border-yellow-200 pt-2">{step.second_lang}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  currentProblem.steps.slice(0, currentStep + 1).map((step, i) => (
                    <div key={i} className="flex items-start space-x-4 bg-yellow-50 p-6 rounded-3xl border border-yellow-200 shadow-sm animate-in slide-in-from-left duration-300">
                      <div className="bg-yellow-400 text-white w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold shadow-sm text-xl">
                        {i + 1}
                      </div>
                      <p className="text-xl text-yellow-900 leading-tight pt-1">{step}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Next Step Button */}
              {!isCorrect && currentStep < currentProblem.steps.length - 1 && (
                <button
                  onClick={handleNextStep}
                  className="w-full bg-blue-100 text-blue-600 font-bold py-5 rounded-3xl hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2 text-xl"
                >
                  <div className="flex flex-col leading-tight items-center">
                    <span>Nächster Schritt</span>
                    {showTwoLang && userLanguage !== 'de' && <span className="text-sm opacity-80">{t('next_step_btn')}</span>}
                  </div>
                </button>
              )}

              {/* Final Explanation & Next Button */}
              {(isCorrect || currentStep === currentProblem.steps.length - 1) && (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-8 rounded-[2.5rem] border-2 border-blue-200">
                    <div className="flex items-center justify-center space-x-4 mb-4">
                      <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold uppercase">Result</span>
                      <p className="text-5xl font-kids text-blue-700">{currentProblem.answer}</p>
                    </div>

                    {/* Bilingual Granular Explanation Table */}
                    {showTwoLang && currentProblem.explanation_blocks && userLanguage !== 'de' ? (
                      <div className="bg-white rounded-3xl border-2 border-indigo-100 shadow-sm overflow-hidden mt-6">
                        <div className="grid grid-cols-2 bg-indigo-50 border-b border-indigo-100 p-3">
                          <h6 className="uppercase text-xs font-bold text-gray-400 text-center">Deutsch 🇩🇪</h6>
                          <h6 className="uppercase text-xs font-bold text-indigo-400 text-center">{t('result_label')} 🌍</h6>
                        </div>
                        <div className="divide-y divide-indigo-50">
                          {currentProblem.explanation_blocks.map((block, idx) => (
                            <div key={idx} className="grid grid-cols-2 group hover:bg-blue-50 transition-colors">
                              <div className="p-4 text-sm text-gray-700 leading-relaxed border-r border-indigo-50 group-hover:text-blue-900">
                                {block.de}
                              </div>
                              <div className="p-4 text-sm text-indigo-800 leading-relaxed group-hover:text-indigo-900 font-medium">
                                {block.second_lang}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-600 italic text-lg text-center leading-relaxed">
                        "{currentProblem.explanation}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={nextProblem}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-kids text-3xl py-6 rounded-3xl shadow-xl border-b-8 border-blue-900 active:border-b-0 active:translate-y-2 transition-all mt-6"
                  >
                    <div className="flex flex-col leading-tight items-center">
                      <span>Weiter geht's! ➡️</span>
                      {showTwoLang && userLanguage !== 'de' && <span className="text-sm opacity-80">{t('next_problem_btn')}</span>}
                    </div>
                  </button>
                </div>
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
    </div>
  );
};

export default LearningSession;
