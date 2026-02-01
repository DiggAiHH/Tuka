import React, { useState } from 'react';
import { UserProfile } from '../types';
import { saveProfile } from '../services/persistence';

interface ProfileSettingsProps {
    initialProfile: UserProfile | null;
    onSave: (p: UserProfile) => void;
    onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ initialProfile, onSave, onClose }) => {
    const [name, setName] = useState(initialProfile?.name || '');
    const [birthday, setBirthday] = useState(initialProfile?.birthday || '');
    const [language, setLanguage] = useState(initialProfile?.language || '');
    const [gender, setGender] = useState<UserProfile['gender']>(initialProfile?.gender || 'girl');

    const today = new Date();
    const maxBirthdayDate = new Date(today);
    maxBirthdayDate.setFullYear(maxBirthdayDate.getFullYear() - 3);
    const maxBirthday = maxBirthdayDate.toISOString().slice(0, 10);

    const tooYoung = (() => {
        if (!birthday) return true;
        const b = new Date(birthday);
        if (Number.isNaN(b.getTime())) return true;
        return b > maxBirthdayDate;
    })();

    const handleSave = () => {
        if (!name.trim()) return;
        if (tooYoung) return;
        const newProfile: UserProfile = { name, birthday, language, gender };
        saveProfile(newProfile);
        onSave(newProfile);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[150] flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative animate-in zoom-in-95 duration-300">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center text-xl font-bold"
                >
                    ✕
                </button>

                <div className="text-center mb-6">
                    <div className="text-6xl mb-4">{gender === 'boy' ? '👦' : '👧'}</div>
                    <h2 className="text-2xl font-kids text-blue-600">Dein Profil</h2>
                    <p className="text-gray-500 text-sm">Damit wir dich richtig ansprechen können.</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Wie heißt du?</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Dein Name..."
                            className="w-full bg-blue-50 border-2 border-blue-100 rounded-xl px-4 py-3 font-bold text-blue-900 focus:border-blue-400 focus:outline-none placeholder-blue-200"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Bist du ein Mädchen oder ein Junge?</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setGender('girl')}
                                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all active:scale-95 ${gender === 'girl' ? 'bg-pink-100 border-pink-300 text-pink-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                👧 Mädchen
                            </button>
                            <button
                                type="button"
                                onClick={() => setGender('boy')}
                                className={`px-4 py-3 rounded-xl border-2 font-bold transition-all active:scale-95 ${gender === 'boy' ? 'bg-blue-100 border-blue-300 text-blue-900' : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                            >
                                👦 Junge
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Wann hast du Geburtstag?</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            max={maxBirthday}
                            className="w-full bg-pink-50 border-2 border-pink-100 rounded-xl px-4 py-3 font-bold text-pink-900 focus:border-pink-400 focus:outline-none"
                        />
                        {tooYoung && (
                            <p className="mt-2 text-xs font-bold text-red-600">
                                Diese App ist erst ab 3 Jahren geeignet. Bitte wähle einen Geburtstag spätestens am {maxBirthday}.
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Zweitsprache (optional)</label>
                        <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full bg-green-50 border-2 border-green-100 rounded-xl px-4 py-3 font-bold text-green-900 focus:border-green-400 focus:outline-none"
                        >
                            <option value="">Keine</option>
                            <option value="en">🇬🇧 Englisch</option>
                            <option value="tr">🇹🇷 Türkisch</option>
                            <option value="ar">🇸🇦 Arabisch</option>
                            <option value="ru">🇷🇺 Russisch</option>
                            <option value="uk">🇺🇦 Ukrainisch</option>
                            <option value="es">🇪🇸 Spanisch</option>
                            <option value="fr">🇫🇷 Französisch</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!name.trim() || tooYoung}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-kids text-xl py-4 rounded-2xl shadow-lg mt-4 transition-all active:scale-95"
                    >
                        Speichern ✅
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileSettings;
