
export enum DifficultyLevel {
  LEICHT = 'Leicht',
  MITTEL = 'Mittel',
  SCHWER = 'Schwer',
  PRUEFUNG = 'Prüfung'
}

export interface MathProblem {
  id: string;
  question: string;
  answer: string; // Should be a number (stringified) or a letter for Multiple Choice
  options?: string[];
  steps: string[];
  explanation: string;
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
