
export enum DifficultyLevel {
  LEICHT = 'Leicht',
  MITTEL = 'Mittel',
  SCHWER = 'Schwer',
  PRUEFUNG = 'Prüfung'
}

export interface UserProfile {
  name: string;
  birthday: string;
  language?: string; // e.g. 'en', 'tr', 'ar'
}

export interface MathProblem {
  id: string;
  question: string;
  answer: string; // Should be a number (stringified) or a letter for Multiple Choice
  options?: string[];
  steps: string[];
  explanation: string;
  explanation_second_lang?: string; // Legacy/Fallback
  question_second_lang?: string;
  explanation_blocks?: { de: string; second_lang: string; }[];
  steps_blocks?: { de: string; second_lang: string; }[];
  hints_blocks?: { de: string; second_lang: string; }[];
  options_second_lang?: string[]; // Parallel to options
  feedback_correct?: { de: string; second_lang: string; };
  feedback_incorrect?: { de: string; second_lang: string; };
  hints: string[];
}

export enum AppState {
  HOME = 'HOME',
  UPLOAD = 'UPLOAD',
  ANALYZING = 'ANALYZING',
  LEVEL_MAP = 'LEVEL_MAP',
  LEARNING = 'LEARNING',
  EXAM = 'EXAM',
  RESULTS = 'RESULTS',
  KANGAROO = 'KANGAROO',
  CORRECTION = 'CORRECTION',
  GUIDE = 'GUIDE'
}
