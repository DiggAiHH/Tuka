
import React, { useRef, useState } from 'react';

interface UploaderProps {
  onUpload: (base64: string) => void;
}

const Uploader: React.FC<UploaderProps> = ({ onUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onUpload(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 bg-white p-12 rounded-3xl shadow-xl border-dashed border-4 border-blue-200">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-kids text-blue-600">Hausaufgaben zeigen 📸</h2>
        <p className="text-gray-500">Wähle ein Foto oder mache eins mit der Kamera.</p>
      </div>

      <div 
        onClick={() => fileInputRef.current?.click()}
        className="w-full max-w-md aspect-video bg-blue-50 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-blue-100 transition border-2 border-blue-200 border-dashed relative overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt="Vorschau" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-blue-500 font-bold">Foto auswählen</span>
          </div>
        )}
      </div>

      <input 
        type="file" 
        accept="image/*" 
        capture="environment"
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      <p className="text-sm text-gray-400">Tipp: Achte auf gutes Licht für dein Foto!</p>
    </div>
  );
};

export default Uploader;
