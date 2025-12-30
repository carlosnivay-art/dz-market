
import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles, Link as LinkIcon, ExternalLink, Camera, Image as ImageIcon, Mic, MicOff, Volume2, Loader2, Trash2, Megaphone } from 'lucide-react';
import { multimodalAIChat, generateSpeech, decodeAudio, decodeAudioData } from '../services/geminiService';
import { Product } from '../types';

interface ChatSystemProps {
  onClose: () => void;
  activeProduct?: Product | null;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
  image?: string;
  sources?: any[];
  isSpeaking?: boolean;
}

const ChatSystem: React.FC<ChatSystemProps> = ({ onClose, activeProduct }) => {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'ai', 
      text: activeProduct 
        ? `مرحباً! أنا "VEX"، المساعد الذكي لهذا المنتج. يمكنك سؤالي كتابةً أو صوتاً، أو حتى إرسال صورة للمقارنة!`
        : 'أهلاً بك في DZ Market! أنا "VEX". يمكنني فهم صورك، صوتك، وأسئلتك حول السوق الجزائري 🇩🇿' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Audio context persistent for performance
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping, selectedImage]);

  const handleSend = async (textOverride?: string) => {
    const userMsg = textOverride || input;
    if (!userMsg.trim() && !selectedImage) return;

    const currentImage = selectedImage;
    setMessages(prev => [...prev, { role: 'user', text: userMsg, image: currentImage || undefined }]);
    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    let base64Data = "";
    if (currentImage) {
      base64Data = currentImage.split(',')[1];
    }

    const result = await multimodalAIChat(userMsg || "ماذا يوجد في هذه الصورة؟", base64Data, activeProduct as any);
    
    setIsTyping(false);
    setMessages(prev => [...prev, { 
      role: 'ai', 
      text: result?.text || 'عذراً، VEX واجه مشكلة تقنية.',
      sources: result?.sources
    }]);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
      recorder.onstop = async () => {
        handleSend("استفسار صوتي (جاري التحليل...)");
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      alert("يرجى السماح بالوصول للميكروفون");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const playResponse = async (text: string, index: number) => {
    // Prevent multiple clicks
    if (messages[index].isSpeaking) return;

    setMessages(prev => prev.map((m, i) => i === index ? { ...m, isSpeaking: true } : m));
    
    const audioBase64 = await generateSpeech(text);
    if (audioBase64) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        const audioData = decodeAudio(audioBase64);
        const buffer = await decodeAudioData(audioData, ctx);
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        
        // SPEED UP playback for better responsiveness (1.15x is a sweet spot)
        source.playbackRate.value = 1.15;
        
        source.connect(ctx.destination);
        source.onended = () => {
          setMessages(prev => prev.map((m, i) => i === index ? { ...m, isSpeaking: false } : m));
        };
        source.start(0);
      } catch (e) {
        console.error("Playback error", e);
        setMessages(prev => prev.map((m, i) => i === index ? { ...m, isSpeaking: false } : m));
      }
    } else {
      setMessages(prev => prev.map((m, i) => i === index ? { ...m, isSpeaking: false } : m));
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[600px] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl z-50 flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800 animate-in slide-in-from-bottom-10 duration-300">
      {/* Hidden Inputs */}
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileSelect} />
      <input type="file" ref={cameraInputRef} className="hidden" accept="image/*" capture="environment" onChange={handleFileSelect} />

      <div className="bg-dz-green p-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 p-2 rounded-2xl">
            <Sparkles size={20} />
          </div>
          <div>
            <p className="font-black text-sm">VEX AI 🧠</p>
            <p className="text-[10px] text-white/70">مساعد ذكي فوري</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-colors">
          <X size={20} />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-start' : 'items-end'}`}>
            <div className={`max-w-[85%] p-4 rounded-[1.5rem] text-sm leading-relaxed shadow-sm relative group ${
              m.role === 'user' 
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-br-none border border-gray-100 dark:border-gray-700' 
                : 'bg-dz-green text-white rounded-bl-none'
            }`}>
              {m.image && (
                <img src={m.image} className="w-full rounded-xl mb-2 border border-dz-border shadow-sm" alt="Shared" />
              )}
              {m.text}
              
              {m.role === 'ai' && (
                <button 
                  onClick={() => playResponse(m.text, idx)}
                  disabled={m.isSpeaking}
                  className={`mt-2 flex items-center gap-2 text-[11px] font-black p-2 px-3 rounded-xl transition-all shadow-inner ${
                    m.isSpeaking 
                      ? 'bg-white/30 text-white animate-pulse' 
                      : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  {m.isSpeaking ? <Loader2 size={14} className="animate-spin" /> : <Megaphone size={14} />}
                  <span>{m.isSpeaking ? 'جاري التحدث...' : 'استماع'}</span>
                </button>
              )}

              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-2 border-t border-white/20">
                  <div className="flex flex-wrap gap-1">
                    {m.sources.map((chunk, i) => chunk.web && (
                      <a key={i} href={chunk.web.uri} target="_blank" rel="noopener noreferrer" className="text-[9px] bg-white/10 px-2 py-0.5 rounded flex items-center gap-1">
                        المصدر <ExternalLink size={8} />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-end">
            <div className="bg-dz-green/10 text-dz-green p-3 rounded-2xl animate-pulse text-[10px] font-black">
              VEX يحلل طلبك...
            </div>
          </div>
        )}
      </div>

      {/* Image Preview */}
      {selectedImage && (
        <div className="p-2 px-4 bg-gray-100 dark:bg-gray-800 flex items-center gap-3 animate-in slide-in-from-bottom-2">
          <div className="relative w-12 h-12">
            <img src={selectedImage} className="w-full h-full object-cover rounded-lg border-2 border-dz-green" />
            <button onClick={() => setSelectedImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white p-0.5 rounded-full">
              <X size={10} />
            </button>
          </div>
          <span className="text-[10px] font-bold text-gray-500">صورة جاهزة للتحليل</span>
        </div>
      )}

      <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900 space-y-3">
        <div className="flex items-center gap-2">
           <button onClick={() => cameraInputRef.current?.click()} className="p-2 text-gray-400 hover:text-dz-green hover:bg-dz-green/5 rounded-xl transition-all">
             <Camera size={20} />
           </button>
           <button onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-400 hover:text-dz-green hover:bg-dz-green/5 rounded-xl transition-all">
             <ImageIcon size={20} />
           </button>
           <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-800 mx-1"></div>
           <button 
             onMouseDown={startRecording}
             onMouseUp={stopRecording}
             onTouchStart={startRecording}
             onTouchEnd={stopRecording}
             className={`p-3 rounded-2xl transition-all ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'text-gray-400 hover:text-dz-orange hover:bg-dz-orange/5'}`}
           >
             {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
           </button>
        </div>

        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-[1.5rem] px-4 py-1">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="اسأل، صور، أو سجل صوتك..."
            className="flex-1 bg-transparent border-none py-3 text-sm focus:outline-none text-gray-800 dark:text-white"
          />
          <button 
            onClick={() => handleSend()}
            disabled={!input.trim() && !selectedImage}
            className="text-dz-green disabled:text-gray-300 p-2"
          >
            <Send size={20} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;
