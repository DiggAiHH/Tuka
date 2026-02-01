import React, { useState } from 'react';
import InstallGuide from './InstallGuide';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);

  if (!isOpen) return null;

  if (!isOpen) return null;

  const url = "https://mathe-heldin-app.netlify.app";
  const shareText = "Hallo! Hier ist Tukas tolle Mathe-App zum Üben. Probier sie doch auch mal aus! ✨";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-blue-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[3rem] shadow-2xl p-8 max-w-md w-full text-center space-y-6 transform animate-in zoom-in-95 duration-300 border-4 border-pink-100 relative overflow-y-auto max-h-[90vh]">

        <div className="relative z-10 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-kids text-blue-600">
              {showInstallGuide ? 'App installieren' : 'Teilen & App 📲'}
            </h3>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-3xl font-bold">×</button>
          </div>

          {!showInstallGuide ? (
            <>
              <div className="bg-white p-4 rounded-3xl border-2 border-dashed border-pink-200 inline-block">
                <img src={qrUrl} alt="QR Code" className="w-40 h-40 mx-auto" />
                <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">Scannen zum Öffnen</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + url)}`, '_blank')}
                  className="bg-green-500 hover:bg-green-600 text-white font-kids py-4 rounded-2xl shadow-md flex items-center justify-center space-x-3 transition-all active:scale-95"
                >
                  <span className="text-xl">💬</span>
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={copyToClipboard}
                  className={`${copied ? 'bg-blue-600' : 'bg-blue-400'} text-white font-kids py-4 rounded-2xl shadow-md flex items-center justify-center space-x-3 transition-all active:scale-95`}
                >
                  <span className="text-xl">{copied ? '✅' : '🔗'}</span>
                  <span>{copied ? 'Kopiert!' : 'Link kopieren'}</span>
                </button>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <button
                  onClick={() => setShowInstallGuide(true)}
                  className="w-full bg-orange-100 hover:bg-orange-200 text-orange-700 font-bold py-4 rounded-2xl flex flex-col items-center transition-all"
                >
                  <span className="text-sm">App auf dem Handy installieren?</span>
                  <span className="text-xs font-normal">Hier klicken für die Anleitung</span>
                </button>
              </div>
            </>
          ) : (
            <InstallGuide onBack={() => setShowInstallGuide(false)} />
          )}

          <button
            onClick={onClose}
            className="text-gray-400 font-bold text-sm hover:underline pt-4"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
