import React, { useState } from 'react';
import InstallGuide from './InstallGuide';
import { setBannerDismissed } from '../services/persistence';

interface InstallBannerProps {
    onDismiss: () => void;
}

const InstallBanner: React.FC<InstallBannerProps> = ({ onDismiss }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleDismiss = () => {
        setBannerDismissed();
        onDismiss();
    };

    if (isExpanded) {
        return (
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-end sm:items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
                <div className="bg-white rounded-t-[2rem] sm:rounded-[2rem] p-6 w-full max-w-lg shadow-2xl animate-in slide-in-from-bottom-10 max-h-[90vh] overflow-y-auto relative">
                    <button
                        onClick={() => setIsExpanded(false)}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-bold"
                    >
                        ✕
                    </button>

                    <h3 className="font-kids text-2xl text-blue-600 mb-4 text-center">App Installation 📲</h3>
                    <InstallGuide embedded />

                    <button
                        onClick={() => setIsExpanded(false)}
                        className="w-full mt-6 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-200"
                    >
                        Schließen
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 left-4 right-4 z-[90] animate-in slide-in-from-bottom-20 duration-700">
            <div className="bg-white/90 backdrop-blur-md border border-blue-200 shadow-xl rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0">
                        📲
                    </div>
                    <div>
                        <p className="font-bold text-gray-800 text-sm">App installieren?</p>
                        <p className="text-xs text-blue-500">Für Vollbild & Offline</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 shadow-md active:scale-95 transition-all"
                    >
                        Anleitung
                    </button>
                    <button
                        onClick={handleDismiss}
                        className="text-gray-400 hover:text-red-400 p-2"
                    >
                        ✕
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallBanner;
