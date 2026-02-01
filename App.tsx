import React, { useState, useEffect } from 'react';
import { AppState, MathProblem, DifficultyLevel, UserProfile } from './types';
import { analyzeAndLevelUp, generateLevelProblems, generateKangarooProblems } from './services/geminiService';
import { loadUnlockedLevels, saveUnlockedLevels, saveHistory, loadProfile, isBannerDismissed, isPrivacyAccepted, setPrivacyAccepted, saveProgressEvent } from './services/persistence';
import { getOfflineProblems, cacheProblemsIntoOfflineBank } from './services/offlineProblems';
import Header from './components/Header';
import Home from './components/Home';
import Uploader from './components/Uploader';
import LevelMap from './components/LevelMap';
import LearningSession from './components/LearningSession';
import ExamSession from './components/ExamSession';
import Results from './components/Results';
import ShareModal from './components/ShareModal';
import UsageGuide from './components/UsageGuide';
import Features from './components/Features';
import InstallBanner from './components/InstallBanner';
import ProfileSettings from './components/ProfileSettings';
import PrivacyPolicy from './components/PrivacyPolicy';
import ParentArea from './components/ParentArea';

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.HOME);
  const [currentLevel, setCurrentLevel] = useState<DifficultyLevel>(DifficultyLevel.LEICHT);
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [topic, setTopic] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [unlockedLevels, setUnlockedLevels] = useState<DifficultyLevel[]>(() => loadUnlockedLevels());
  const [sessionResults, setSessionResults] = useState<{ score: number, total: number, history: any[] } | null>(null);

  // New State for Profile & Banner
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => loadProfile());
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(() => !isBannerDismissed());

  const firstName = userProfile?.name ? userProfile.name.split(' ')[0] : '';
  const childName = firstName || 'Tuka';

  const [isOnline, setIsOnline] = useState<boolean>(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const privacyAccepted = isPrivacyAccepted();

  // Require privacy acceptance on first run
  useEffect(() => {
    if (!privacyAccepted) {
      setCurrentState(AppState.PRIVACY);
    }
  }, []);

  // Track online/offline
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Save unlocked levels
  useEffect(() => {
    saveUnlockedLevels(unlockedLevels);
  }, [unlockedLevels]);

  const handleImageUpload = async (base64: string) => {
    setIsLoading(true);
    setCurrentState(AppState.ANALYZING);
    try {
      const data = await analyzeAndLevelUp(base64, userProfile);
      setTopic(data.topic);
      setProblems(data.initialProblems);
      setCurrentState(AppState.LEVEL_MAP);
    } catch (error) {
      console.error(error);
      setCurrentState(AppState.HOME);
    } finally {
      setIsLoading(false);
    }
  };

  const startStandardTraining = () => {
    setTopic("Mathe-Meisterin: 3. Klasse Abenteuer");
    setUnlockedLevels([DifficultyLevel.LEICHT]);
    setCurrentState(AppState.LEVEL_MAP);
  };

  const startLevel = async (level: DifficultyLevel) => {
    setIsLoading(true);
    setCurrentLevel(level);
    try {
      if (!navigator.onLine) {
        const offline = getOfflineProblems(level, 5);
        setProblems(offline);
        setCurrentState(level === DifficultyLevel.PRUEFUNG ? AppState.EXAM : AppState.LEARNING);
        return;
      }
      const levelProblems = await generateLevelProblems(topic, level, userProfile);
      cacheProblemsIntoOfflineBank(levelProblems);
      setProblems(levelProblems);
      setCurrentState(level === DifficultyLevel.PRUEFUNG ? AppState.EXAM : AppState.LEARNING);
    } catch (error) {
      console.error(error);
      const offline = getOfflineProblems(level, 5);
      setProblems(offline);
      setCurrentState(level === DifficultyLevel.PRUEFUNG ? AppState.EXAM : AppState.LEARNING);
    } finally {
      setIsLoading(false);
    }
  };

  const startKangarooTraining = async () => {
    setIsLoading(true);
    try {
      const kangarooProblems = await generateKangarooProblems(userProfile);
      setProblems(kangarooProblems);
      setTopic("Känguru-Wettbewerb Training 🦘");
      setCurrentState(AppState.EXAM);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const completeLearning = () => {
    const order = [DifficultyLevel.LEICHT, DifficultyLevel.MITTEL, DifficultyLevel.SCHWER, DifficultyLevel.PRUEFUNG];
    const currentIndex = order.indexOf(currentLevel);
    if (currentIndex < order.length - 1) {
      const nextLevel = order[currentIndex + 1];
      if (!unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels([...unlockedLevels, nextLevel]);
      }
    }
    setCurrentState(AppState.LEVEL_MAP);
  };

  const finishExam = (score: number, total: number, history: any[]) => {
    setSessionResults({ score, total, history });
    saveHistory({
      date: new Date().toISOString(),
      score,
      total,
      level: currentLevel
    });

    saveProgressEvent({
      id: (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? globalThis.crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`,
      type: 'exam',
      date: new Date().toISOString(),
      level: currentLevel,
      topic,
      correct: score,
      total,
      wrongProblemIds: (history || []).filter((h: any) => !h?.isCorrect).map((h: any) => h?.problem?.id).filter(Boolean)
    });
    setCurrentState(AppState.RESULTS);
  };

  const startCorrection = () => {
    if (!sessionResults) return;
    const wrongProblems = sessionResults.history
      .filter(item => !item.isCorrect)
      .map(item => item.problem);

    if (wrongProblems.length > 0) {
      setProblems(wrongProblems);
      setCurrentState(AppState.LEARNING);
    } else {
      setCurrentState(AppState.LEVEL_MAP);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-pink-50/30">
      <Header
        onHomeClick={() => setCurrentState(AppState.HOME)}
        onShareClick={() => setIsShareModalOpen(true)}
        onProfileClick={() => setIsProfileOpen(true)}
        profileName={userProfile?.name}
        profileGender={userProfile?.gender}
      />

      {!isOnline && isPrivacyAccepted() && (
        <div className="bg-yellow-50 border-b border-yellow-200 text-yellow-900 text-sm px-4 py-2 text-center font-bold">
          Offline-Modus: Es gibt nur lokale Übungsaufgaben. 📵
        </div>
      )}

      <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
        {currentState === AppState.HOME && (
          <Home
            userProfile={userProfile}
            onStart={(t) => startStandardTraining()} // Standard Trigger
            onStartUpload={() => setCurrentState(AppState.UPLOAD)}
            onStartKangaroo={startKangarooTraining}
            onEditProfile={() => setIsProfileOpen(true)}
            onShowGuide={() => setCurrentState(AppState.GUIDE)}
            onShowFeatures={() => setCurrentState(AppState.WHATS_NEW)}
            onShowPrivacy={() => setCurrentState(AppState.PRIVACY)}
            onOpenParent={() => setCurrentState(AppState.PARENT)}
          />
        )}

        {currentState === AppState.GUIDE && (
          <UsageGuide onClose={() => setCurrentState(AppState.HOME)} />
        )}

        {currentState === AppState.WHATS_NEW && (
          <Features onClose={() => setCurrentState(AppState.HOME)} />
        )}

        {currentState === AppState.PRIVACY && (
          <PrivacyPolicy
            onAccept={() => {
              setPrivacyAccepted();
              setCurrentState(AppState.HOME);
            }}
            onClose={privacyAccepted ? () => setCurrentState(AppState.HOME) : undefined}
            showClose={privacyAccepted}
          />
        )}

        {currentState === AppState.PARENT && (
          <ParentArea onClose={() => setCurrentState(AppState.HOME)} />
        )}

        {currentState === AppState.UPLOAD && <Uploader onUpload={handleImageUpload} />}

        {currentState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center space-y-6 mt-20">
            <div className="w-24 h-24 border-8 border-pink-400 border-t-blue-500 rounded-full animate-spin"></div>
            <h2 className="text-2xl font-kids text-blue-600">Magie für {childName}... 🪄✨</h2>
            <p className="text-gray-600 text-center">Ich lese dein Blatt und bereite alles vor!</p>
          </div>
        )}

        {isLoading && currentState !== AppState.ANALYZING && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-kids text-pink-600">{childName}, ich bereite deine Aufgaben vor...</p>
            </div>
          </div>
        )}

        {currentState === AppState.LEVEL_MAP && (
          <LevelMap
            topic={topic}
            unlockedLevels={unlockedLevels}
            onSelectLevel={startLevel}
            userProfile={userProfile || undefined}
          />
        )}

        {currentState === AppState.LEARNING && (
          <LearningSession
            problems={problems}
            topic={topic}
            onComplete={(summary) => {
              if (summary) {
                saveProgressEvent({
                  id: (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? globalThis.crypto.randomUUID() : `${Date.now()}_${Math.random().toString(16).slice(2)}`,
                  type: 'learning',
                  date: new Date().toISOString(),
                  level: currentLevel,
                  topic,
                  correct: summary.correct,
                  total: summary.total,
                  wrongProblemIds: summary.wrongProblemIds
                });
              }
              completeLearning();
            }}
            userProfile={userProfile || undefined}
            onUpdateProfile={(p) => setUserProfile(p)}
          />
        )}

        {currentState === AppState.EXAM && (
          <ExamSession problems={problems} onFinish={finishExam} userProfile={userProfile || undefined} />
        )}

        {currentState === AppState.RESULTS && sessionResults && (
          <Results
            results={sessionResults}
            onRestart={() => setCurrentState(AppState.HOME)}
            onPracticeAgain={() => setCurrentState(AppState.LEVEL_MAP)}
            onCorrectWrong={startCorrection}
            userProfile={userProfile || undefined}
          />
        )}
      </main>

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      {/* Floating Install Banner */}
      {showBanner && currentState === AppState.HOME && privacyAccepted && (
        <InstallBanner onDismiss={() => setShowBanner(false)} />
      )}

      {/* Profile Modal */}
      {isProfileOpen && (
        <ProfileSettings
          initialProfile={userProfile}
          onSave={setUserProfile}
          onClose={() => setIsProfileOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
