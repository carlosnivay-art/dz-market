
import React, { useState } from 'react';
import { Check, Sparkles, ShoppingBag } from 'lucide-react';
import { INTEREST_CATEGORIES, Language, TRANSLATIONS } from '../constants';

interface InterestsSelectionScreenProps {
  onComplete: (selectedIds: string[]) => void;
  currentLang: Language;
}

const InterestsSelectionScreen: React.FC<InterestsSelectionScreenProps> = ({ onComplete, currentLang }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const t = TRANSLATIONS[currentLang];

  const toggleInterest = (id: string) => {
    setSelectedInterests(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col font-['Cairo'] overflow-hidden" dir={t.dir}>
      <div className="bg-dz-green p-8 pb-16 text-center text-white relative">
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-dz-orange p-3 rounded-2xl shadow-xl mb-4 rotate-12">
            <ShoppingBag size={32} />
          </div>
          <h2 className="text-3xl font-black mb-2">{t.interestsTitle}</h2>
          <p className="text-white/70 text-sm max-w-xs mx-auto font-medium">{t.interestsSubtitle}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 -mt-8 bg-white rounded-t-[3rem] shadow-inner">
        <div className="grid grid-cols-2 gap-4 pb-24">
          {INTEREST_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => toggleInterest(cat.id)}
              className={`p-6 rounded-3xl flex flex-col items-center gap-3 transition-all border-2 relative ${
                selectedInterests.includes(cat.id)
                ? 'bg-dz-green text-white border-dz-green shadow-lg scale-[1.02]'
                : 'bg-white text-dz-text border-dz-border hover:border-dz-green shadow-sm'
              }`}
            >
              <span className="text-4xl">{cat.emoji}</span>
              <span className={`text-[11px] font-black uppercase text-center leading-tight ${selectedInterests.includes(cat.id) ? 'text-white' : 'text-gray-600'}`}>
                {cat.label}
              </span>
              {selectedInterests.includes(cat.id) && (
                <div className="absolute top-2 right-2 bg-white text-dz-green p-1 rounded-full shadow-sm">
                  <Check size={12} strokeWidth={4} />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white/90 to-transparent flex justify-center">
        <button
          onClick={() => onComplete(selectedInterests)}
          disabled={selectedInterests.length === 0}
          className={`w-full max-w-sm py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-2 ${
            selectedInterests.length > 0 ? 'bg-dz-orange text-white hover:scale-105 active:scale-95' : 'bg-gray-200 text-gray-400'
          }`}
        >
          {t.continue} <Sparkles size={20} />
        </button>
      </div>
    </div>
  );
};

export default InterestsSelectionScreen;
