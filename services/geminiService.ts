
import { GoogleGenAI, Modality, Type } from "@google/genai";
import { Product } from "../types";

// وظيفة الحصول على نسخة من AI (تستخدم داخل الدوال لضمان تحديث المفتاح)
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * محادثة متعددة الوسائط (نص، صورة، بحث)
 */
export const multimodalAIChat = async (message: string, imageBase64?: string, product?: Product) => {
  try {
    const ai = getAI();
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
      ? `أنت مساعد مبيعات ذكي يدعى "VEX" لمنصة DZ MARKET. ساعد المستخدم بخصوص منتج ${product.name}. السعر: ${product.price} دج. وصف: ${product.description}. المطور: ضياف أيمن. أجب بلهجة جزائرية خفيفة.`
      : `أنت "VEX"، مساعد منصة DZ MARKET الذكي. صممك المهندس ضياف أيمن. مهمتك مساعدة المستخدمين في التسوق، البحث عن المنتجات، وفهم الصور. أجب دائماً بلهجة جزائرية محببة واحترافية. استخدم البحث في جوجل إذا سئلت عن أسعار حالية أو أخبار في الجزائر.`;

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
    return { text: "عذراً، واجه VEX مشكلة في الاتصال بالذكاء الاصطناعي. يرجى المحاولة لاحقاً." };
  }
};

/**
 * اقتراح نصوص تسويقية للمنشورات
 */
export const suggestPostCaption = async (userText: string, imageBase64?: string) => {
  try {
    const ai = getAI();
    const parts: any[] = [
      { text: `أنت خبير تسويق في DZ MARKET. حول النص التالي أو محتوى الصورة إلى منشور تسويقي "هبال" بلهجة جزائرية جذابة مع إيموجي. النص الأصلي: "${userText}"` }
    ];

    if (imageBase64) {
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: imageBase64.split(',')[1] || imageBase64 }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        systemInstruction: "أنت كاتب محتوى جزائري مبدع لمنصة DZ MARKET. اجعل منشوراتك قصيرة، قوية، وتستخدم لغة الشباب الجزائري.",
      }
    });

    return response.text;
  } catch (error) {
    console.error("Post Suggestion Error:", error);
    return userText;
  }
};

/**
 * توليد الشعار بالذكاء الاصطناعي
 */
export const generateLogo = async (prompt: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            text: `Modern professional e-commerce logo for "DZ MARKET". Design: A sleek modern shopping basket with a stylized Algerian flag flowing inside. Colors: Emerald Green, White, and Deep Red. Typography: "DZ MARKET" in bold, rounded, modern font. Clean background, premium vector style app icon. ${prompt}`,
          },
        ],
      },
      config: {
        imageConfig: { aspectRatio: "1:1" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Logo Generation Error:", error);
    return null;
  }
};

/**
 * تحويل النص إلى صوت (VEX Voice)
 */
export const generateSpeech = async (text: string) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `تحدث بلهجة جزائرية ودودة: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' },
          },
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (error) {
    console.error("TTS Error:", error);
    return null;
  }
};

// وظائف معالجة الصوت المساعدة
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
