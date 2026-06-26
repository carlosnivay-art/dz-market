import { Product } from "../types";

/**
 * محادثة متعددة الوسائط (نص، صورة، بحث) عبر السيرفر
 */
export const multimodalAIChat = async (message: string, imageBase64?: string, product?: Product) => {
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, imageBase64, product }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (errData.error === "MISSING_API_KEY") {
        return { 
          text: "⚠️ لم يتم العثور على مفتاح Gemini API. يرجى تهيئة المتغير API_KEY في إعدادات البيئة على Vercel لتفعيل المساعد الذكي VEX." 
        };
      }
      throw new Error(errData.text || "Network error");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    return { text: "عذراً، واجهت VEX مشكلة في الاتصال. يرجى المحاولة لاحقاً." };
  }
};

/**
 * اقتراح نصوص تسويقية للمنشورات عبر السيرفر
 */
export const suggestPostCaption = async (userText: string, imageBase64?: string) => {
  try {
    const response = await fetch("/api/gemini/suggest-caption", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userText, imageBase64 }),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.text;
  } catch (error: any) {
    console.error("Post Suggestion Error:", error);
    return userText;
  }
};

/**
 * توليد الشعار بالذكاء الاصطناعي عبر السيرفر
 */
export const generateLogo = async (prompt: string) => {
  try {
    const response = await fetch("/api/gemini/generate-logo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.imageUrl;
  } catch (error: any) {
    console.error("Logo Generation Error:", error);
    return null;
  }
};

/**
 * تحويل النص إلى صوت (VEX Voice) عبر السيرفر
 */
export const generateSpeech = async (text: string) => {
  try {
    const response = await fetch("/api/gemini/generate-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) throw new Error("Network response was not ok");
    const data = await response.json();
    return data.audioBase64;
  } catch (error: any) {
    console.error("TTS Error:", error);
    return null;
  }
};

// وظائف معالجة الصوت المساعدة (مطلوبة في الواجهة الأمامية)
export const decodeAudio = (base64: string) => {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
};

export const decodeAudioData = async (
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1,
): Promise<AudioBuffer> => {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
};
