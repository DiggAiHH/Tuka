import { DifficultyLevel, UserProfile } from '../../types';
import { loadUnlockedLevels, saveUnlockedLevels, loadProfile, saveProfile, loadHistory, saveHistory } from '../persistence';

const baseHistoryItem = {
  date: new Date('2024-01-01T00:00:00.000Z').toISOString(),
  score: 3,
  total: 5,
  level: DifficultyLevel.LEICHT
};

describe('persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('loadUnlockedLevels defaults to LEICHT', () => {
    expect(loadUnlockedLevels()).toEqual([DifficultyLevel.LEICHT]);
  });

  test('saveUnlockedLevels persists values', () => {
    saveUnlockedLevels([DifficultyLevel.LEICHT, DifficultyLevel.MITTEL]);
    expect(loadUnlockedLevels()).toEqual([DifficultyLevel.LEICHT, DifficultyLevel.MITTEL]);
  });

  test('saveProfile and loadProfile roundtrip', () => {
    const profile: UserProfile = { name: 'Tuka', birthday: '2016-02-01', language: 'de' };
    saveProfile(profile);
    expect(loadProfile()).toEqual(profile);
  });

  test('saveHistory prepends and caps at 50', () => {
    for (let i = 0; i < 55; i += 1) {
      saveHistory({ ...baseHistoryItem, date: new Date(2024, 0, i + 1).toISOString() });
    }
    const history = loadHistory();
    expect(history.length).toBe(50);
    expect(history[0].date).toBe(new Date(2024, 0, 55).toISOString());
  });
});
