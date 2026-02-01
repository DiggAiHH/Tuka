import React, { useState } from 'react';
import { UserProfile, saveProfile } from '../services/persistence';

interface ProfileSettingsProps {
    initialProfile: UserProfile | null;
    onSave: (p: UserProfile) => void;
    onClose: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ initialProfile, onSave, onClose }) => {
    const [name, setName] = useState(initialProfile?.name || '');
    const [birthday, setBirthday] = useState(initialProfile?.birthday || '');

    const handleSave = () => {
        if (!name.trim()) return;
        const newProfile: UserProfile = { name, birthday };
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
                    <div className="text-6xl mb-4">👧</div>
                    <h2 className="text-2xl font-kids text-blue-600">Dein Profil</h2>
                    <p className="text-gray-500 text-sm">Damit Tuka dich kennt!</p>
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
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Wann hast du Geburtstag?</label>
                        <input
                            type="date"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full bg-pink-50 border-2 border-pink-100 rounded-xl px-4 py-3 font-bold text-pink-900 focus:border-pink-400 focus:outline-none"
                        />
                    </div>

                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
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
