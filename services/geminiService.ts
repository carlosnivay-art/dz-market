
import { GoogleGenAI, Modality } from "@google/genai";
import { Product } from "../types";

// وظيفة المحادثة العامة مع دعم الصور
export const multimodalAIChat = async (message: string, imageBase64?: string, product?: Product) => {
  try {
    // ALWAYS initialize a fresh instance of GoogleGenAI before generating content.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = "gemini-3-flash-preview";
    const parts: any[] = [{ text: message }];

    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: imageBase64,
        },
      });
    }

    const systemInstruction = product 
      ? `أنت مساعد مبيعات ذكي يدعى "VEX" لمنتج ${product.name}. السعر: ${product.price} دج. وصف: ${product.description}. المطور: ضياف أيمن.`
      : `أنت "VEX"، مساعد ديزاد ماركت الذكي. صممك المهندس ضياف أيمن. ساعد المستخدم في التسوق والبحث في الجزائر.`;

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: systemInstruction,
      }
    });

    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "عذراً، واجه VEX مشكلة في تحليل طلبك. حاول مجدداً!" };
  }
};

// وظيفة توليد الصوت من النص
export const generateSpeech = async (text: string) => {
  try {
    // ALWAYS initialize a fresh instance of GoogleGenAI before generating content.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `تحدث بلهجة جزائرية خفيفة وودودة: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // صوت مناسب وودود
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// الدوال المساعدة لفك تشفير الصوت
export const decodeAudio = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
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
