
import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, Camera, Send, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { suggestPostCaption } from '../services/geminiService';
import { Language, TRANSLATIONS } from '../constants';

interface CreatePostScreenProps {
  onClose: () => void;
  onPublish: (post: { text: string; image: string }) => void;
  currentLang: Language;
}

const CreatePostScreen: React.FC<CreatePostScreenProps> = ({ onClose, onPublish, currentLang }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[currentLang];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSuggest = async () => {
    if (!text && !image) return;
    setIsSuggesting(true);
    const suggestion = await suggestPostCaption(text, image || undefined);
    if (suggestion) setText(suggestion);
    setIsSuggesting(false);
  };

  const handlePublish = () => {
    if (!text && !image) return;
    onPublish({ text, image: image || '' });
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white dark:bg-gray-950 flex flex-col font-['Cairo'] animate-in slide-in-from-bottom duration-500" dir={t.dir}>
      {/* Header */}
      <div className="p-6 flex items-center justify-between border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-all">
            <ArrowRight size={24} className={t.dir === 'rtl' ? '' : 'rotate-180'} />
          </button>
          <h2 className="text-xl font-black text-dz-text dark:text-white">{t.createPost}</h2>
        </div>
        <button 
          onClick={handlePublish}
          disabled={!text && !image}
          className="bg-dz-green text-white px-6 py-2.5 rounded-2xl font-black text-sm shadow-lg shadow-dz-green/20 disabled:opacity-50 disabled:shadow-none transition-all flex items-center gap-2"
        >
          <Send size={18} className={t.dir === 'rtl' ? 'rotate-180' : ''} /> {t.publishPost}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Text Input Area */}
        <div className="relative">
          <textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t.postPlaceholder}
            className="w-full h-40 bg-gray-50 dark:bg-gray-900 border-none rounded-[2rem] p-6 text-sm font-bold outline-none focus:ring-2 focus:ring-dz-green dark:text-white resize-none"
          />
          <button 
            onClick={handleSuggest}
            disabled={isSuggesting}
            className="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-2 px-4 rounded-xl shadow-md flex items-center gap-2 text-[10px] font-black text-dz-orange hover:scale-105 active:scale-95 transition-all border border-dz-orange/20"
          >
            {isSuggesting ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            {t.aiSuggest}
          </button>
        </div>

        {/* Image Display */}
        {image ? (
          <div className="relative rounded-[2.5rem] overflow-hidden border-4 border-gray-100 dark:border-gray-800 group shadow-xl">
            <img src={image} className="w-full aspect-square object-cover" alt="Selected" />
            <button 
              onClick={() => setImage(null)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-all"
            >
              <X size={20} />
            </button>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-full aspect-square bg-gray-50 dark:bg-gray-900 border-4 border-dashed border-gray-200 dark:border-gray-800 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-dz-green/5 hover:border-dz-green/50 transition-all group"
          >
            <div className="bg-white dark:bg-gray-800 p-6 rounded-[2rem] shadow-lg text-gray-400 group-hover:text-dz-green transition-colors">
              <ImageIcon size={48} strokeWidth={1.5} />
            </div>
            <div className="text-center">
              <p className="font-black text-gray-500 dark:text-gray-400">إضافة صورة للمنشور</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold mt-1">PNG, JPG حتى 5MB</p>
            </div>
          </div>
        )}
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageSelect} />

        {/* Bottom Quick Tools */}
        <div className="flex gap-4">
           <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs text-gray-600 dark:text-gray-300">
             <ImageIcon size={18} /> المعرض
           </button>
           <button className="flex-1 bg-gray-100 dark:bg-gray-800 p-4 rounded-2xl flex items-center justify-center gap-3 font-black text-xs text-gray-600 dark:text-gray-300">
             <Camera size={18} /> الكاميرا
           </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePostScreen;
