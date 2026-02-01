import { AppState, DifficultyLevel, MathProblem } from '../types';

const STORAGE_KEYS = {
    UNLOCKED_LEVELS: 'mathe_heldin_unlocked_levels',
    HISTORY: 'mathe_heldin_history',
    USER_SETTINGS: 'mathe_heldin_settings',
    PROFILE: 'mathe_heldin_profile',
    BANNER_DISMISSED: 'mathe_heldin_banner_dismissed'
};

export interface UserProfile {
    name: string;
    birthday: string;
}

export interface UserHistoryItem {
    date: string;
    score: number;
    total: number;
    level: DifficultyLevel;
}

export const saveUnlockedLevels = (levels: DifficultyLevel[]) => {
    try {
        localStorage.setItem(STORAGE_KEYS.UNLOCKED_LEVELS, JSON.stringify(levels));
    } catch (e) {
        console.error('Failed to save levels', e);
    }
};

export const loadUnlockedLevels = (): DifficultyLevel[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.UNLOCKED_LEVELS);
        return data ? JSON.parse(data) : [DifficultyLevel.LEICHT];
    } catch (e) {
        return [DifficultyLevel.LEICHT];
    }
};

export const saveHistory = (item: UserHistoryItem) => {
    try {
        const current = loadHistory();
        const updated = [item, ...current].slice(0, 50); // Keep last 50
        localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save history', e);
    }
};

export const loadHistory = (): UserHistoryItem[] => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.HISTORY);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        return [];
    }
};

export const saveProfile = (profile: UserProfile) => {
    try {
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
    } catch (e) {
        console.error('Failed to save profile', e);
    }
};

export const loadProfile = (): UserProfile | null => {
    try {
        const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
        return data ? JSON.parse(data) : null;
    } catch (e) {
        return null;
    }
};

export const setBannerDismissed = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.BANNER_DISMISSED, 'true');
    } catch (e) {
        console.error('Failed to save banner state', e);
    }
};

export const isBannerDismissed = (): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEYS.BANNER_DISMISSED) === 'true';
    } catch (e) {
        return false;
    }
};
