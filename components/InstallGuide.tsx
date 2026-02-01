import React, { useState } from 'react';

type OS = 'ios' | 'android' | 'windows' | 'macos';
type Browser = 'safari' | 'chrome' | 'firefox' | 'opera' | 'edge' | 'samsung';

interface Step {
    icon: string;
    text: string;
}

const OS_BROWSERS: Record<OS, Browser[]> = {
    ios: ['safari', 'chrome', 'firefox', 'opera', 'edge'],
    android: ['chrome', 'firefox', 'opera', 'samsung', 'edge'],
    windows: ['chrome', 'edge', 'firefox', 'opera'],
    macos: ['safari', 'chrome', 'firefox', 'edge', 'opera'],
};

const INSTRUCTIONS: Record<OS, Record<string, Step[]>> = {
    ios: {
        safari: [
            { icon: 'share', text: 'Tippe unten auf das "Teilen"-Symbol (Viereck mit Pfeil)' },
            { icon: 'plus-square', text: 'Scrolle runter zu "Zum Home-Bildschirm"' },
            { icon: 'add', text: 'Tippe oben rechts auf "Hinzufügen"' },
        ],
        default: [
            { icon: 'info', text: 'Auf dem iPhone brauchst du Safari!' },
            { icon: 'compass', text: 'Öffne diese Seite in der Safari-App.' },
        ],
    },
    android: {
        chrome: [
            { icon: 'more-vertical', text: 'Tippe oben rechts auf die 3 Punkte' },
            { icon: 'download', text: 'Wähle "App installieren" oder "Zum Startbildschirm higzufügen"' },
            { icon: 'check', text: 'Bestätige mit "Installieren"' },
        ],
        samsung: [
            { icon: 'menu', text: 'Tippe unten rechts auf das Menü (3 Striche)' },
            { icon: 'plus', text: 'Wähle "Seite hinzufügen zu"' },
            { icon: 'home', text: 'Wähle "Startbildschirm"' },
        ],
        default: [
            { icon: 'more-vertical', text: 'Suche im Browser-Menü nach "Installieren"' },
        ],
    },
    windows: {
        chrome: [
            { icon: 'download', text: 'Klicke rechts in der Adressleiste auf das Installieren-Icon' },
            { icon: 'check', text: 'Bestätige die Installation' },
        ],
        edge: [
            { icon: 'grid', text: 'Klicke rechts in der Adressleiste auf das App-Icon' },
            { icon: 'check', text: 'Klicke auf "Installieren"' },
        ],
        default: [
            { icon: 'more-horizontal', text: 'Öffne das Browsermenü' },
            { icon: 'grid', text: 'Suche nach "Apps" > "Installieren"' },
        ],
    },
    macos: {
        safari: [
            { icon: 'share', text: 'Klicke auf das Teilen-Symbol' },
            { icon: 'dock', text: 'Wähle "Zum Dock hinzufügen"' },
        ],
        chrome: [
            { icon: 'download', text: 'Klicke rechts in der Adressleiste auf das Installieren-Icon' },
        ],
        default: [
            { icon: 'info', text: 'Nutze am besten Chrome oder Safari für die Installation.' },
        ],
    },
};

const InstallGuide: React.FC<{ onBack?: () => void; embedded?: boolean }> = ({ onBack, embedded = false }) => {
    const [os, setOs] = useState<OS | null>(null);
    const [browser, setBrowser] = useState<Browser | null>(null);

    const getInstructions = (): Step[] => {
        if (!os || !browser) return [];

        // Check if the specific browser has instructions for this OS
        // Special case for iOS non-Safari browsers (Apple restriction)
        if (os === 'ios' && browser !== 'safari') {
            return INSTRUCTIONS.ios.default;
        }

        const osInstructions = INSTRUCTIONS[os];
        // @ts-ignore - dynamic access
        return osInstructions[browser] || osInstructions.default || [];
    };

    const steps = getInstructions();

    return (
        <div className={`text-left space-y-6 ${!embedded ? 'animate-in slide-in-from-right duration-300' : ''}`}>
            {!embedded && onBack && (
                <button
                    onClick={onBack}
                    className="text-blue-500 font-bold flex items-center hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                >
                    ← Zurück
                </button>
            )}

            <div className="space-y-2">
                <h4 className="font-kids text-xl text-blue-600">
                    {embedded ? 'Wähle dein Gerät für die Anleitung:' : 'App installieren 📱'}
                </h4>
                {!embedded && <p className="text-sm text-gray-600">Wähle dein Gerät, um die Anleitung zu sehen:</p>}
            </div>

            <div className="space-y-4">
                {/* OS Selection */}
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dein Gerät</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['android', 'ios', 'windows', 'macos'] as OS[]).map((item) => (
                            <button
                                key={item}
                                onClick={() => { setOs(item); setBrowser(null); }}
                                className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center space-x-2
                  ${os === item
                                        ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-sm'
                                        : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-gray-300'}`}
                            >
                                <span>{item === 'ios' ? '📱 iPhone' : item === 'android' ? '🤖 Android' : item === 'macos' ? '💻 Mac' : '🖥️ Windows'}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Browser Selection (Conditional) */}
                {os && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Dein Browser</label>
                        <select
                            value={browser || ''}
                            onChange={(e) => setBrowser(e.target.value as Browser)}
                            className="w-full p-3 rounded-xl border-2 border-gray-200 bg-white font-medium text-gray-700 focus:border-blue-400 focus:outline-none"
                        >
                            <option value="" disabled>Bitte wählen...</option>
                            {OS_BROWSERS[os].map((b) => (
                                <option key={b} value={b}>
                                    {b.charAt(0).toUpperCase() + b.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Instructions Steps */}
                {os && browser && (
                    <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 animate-in zoom-in-95 duration-200 mt-4">
                        <h5 className="font-bold text-blue-800 mb-3 flex items-center">
                            <span className="bg-blue-200 text-blue-700 w-6 h-6 rounded-full flex items-center justify-center text-xs mr-2">i</span>
                            So geht's:
                        </h5>
                        <ol className="space-y-3">
                            {steps.map((step, idx) => (
                                <li key={idx} className="flex items-start space-x-3 text-sm text-gray-700 bg-white p-3 rounded-lg shadow-sm">
                                    <span className="font-bold text-pink-400 mt-0.5">{idx + 1}.</span>
                                    <span>{step.text}</span>
                                </li>
                            ))}
                        </ol>
                        {/* Download Button (Fake action, just guides them) */}
                        <div className="mt-4 pt-4 border-t border-blue-200 text-center">
                            <p className="text-xs text-blue-600 italic">Folge diesen Schritten in deinem Browser Menü!</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InstallGuide;
