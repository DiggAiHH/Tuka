import { DifficultyLevel, UserProfile } from '../types';

const STORAGE_KEYS = {
    UNLOCKED_LEVELS: 'mathe_heldin_unlocked_levels',
    HISTORY: 'mathe_heldin_history',
    USER_SETTINGS: 'mathe_heldin_settings',
    PROFILE: 'mathe_heldin_profile',
    BANNER_DISMISSED: 'mathe_heldin_banner_dismissed',
    PRIVACY_ACCEPTED: 'mathe_heldin_privacy_accepted',
    PROGRESS_EVENTS: 'mathe_heldin_progress_events',
    OFFLINE_BANK: 'mathe_heldin_offline_bank_v1',
    PARENT_AUTH: 'mathe_heldin_parent_auth_v1'
};

function safeParseJson<T>(raw: string | null): T | null {
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
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
        const data = safeParseJson<UserProfile>(localStorage.getItem(STORAGE_KEYS.PROFILE));
        if (!data) return null;
        return {
            ...data,
            gender: data.gender || 'girl'
        };
    } catch (e) {
        return null;
    }
};

export const isPrivacyAccepted = (): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEYS.PRIVACY_ACCEPTED) === 'true';
    } catch {
        return false;
    }
};

export const setPrivacyAccepted = () => {
    try {
        localStorage.setItem(STORAGE_KEYS.PRIVACY_ACCEPTED, 'true');
    } catch (e) {
        console.error('Failed to save privacy acceptance', e);
    }
};

export type ProgressEventType = 'learning' | 'exam';

export interface ProgressEvent {
    id: string;
    type: ProgressEventType;
    date: string; // ISO
    level?: DifficultyLevel;
    topic?: string;
    correct: number;
    total: number;
    wrongProblemIds?: string[];
}

export const loadProgressEvents = (): ProgressEvent[] => {
    try {
        const data = safeParseJson<ProgressEvent[]>(localStorage.getItem(STORAGE_KEYS.PROGRESS_EVENTS));
        return data || [];
    } catch {
        return [];
    }
};

export const saveProgressEvent = (event: ProgressEvent) => {
    try {
        const current = loadProgressEvents();
        const updated = [event, ...current].slice(0, 500);
        localStorage.setItem(STORAGE_KEYS.PROGRESS_EVENTS, JSON.stringify(updated));
    } catch (e) {
        console.error('Failed to save progress event', e);
    }
};

export interface OfflineProblemBank {
    createdAt: string;
    version: 1;
    problems: any[];
}

export const loadOfflineBank = (): OfflineProblemBank | null => {
    try {
        return safeParseJson<OfflineProblemBank>(localStorage.getItem(STORAGE_KEYS.OFFLINE_BANK));
    } catch {
        return null;
    }
};

export const saveOfflineBank = (bank: OfflineProblemBank) => {
    try {
        localStorage.setItem(STORAGE_KEYS.OFFLINE_BANK, JSON.stringify(bank));
    } catch (e) {
        console.error('Failed to save offline bank', e);
    }
};

export interface ParentAuthRecord {
    username: string;
    passwordSalt: string;
    passwordHashHex: string;
}

export const loadParentAuth = (): ParentAuthRecord | null => {
    try {
        return safeParseJson<ParentAuthRecord>(localStorage.getItem(STORAGE_KEYS.PARENT_AUTH));
    } catch {
        return null;
    }
};

export const saveParentAuth = (record: ParentAuthRecord) => {
    try {
        localStorage.setItem(STORAGE_KEYS.PARENT_AUTH, JSON.stringify(record));
    } catch (e) {
        console.error('Failed to save parent auth', e);
    }
};

export const clearParentAuth = () => {
    try {
        localStorage.removeItem(STORAGE_KEYS.PARENT_AUTH);
    } catch (e) {
        console.error('Failed to clear parent auth', e);
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
