
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
      ? `أنتِ "VEX"، مساعدة مبيعات ذكية في الثلاثينيات من عمرك، تتميزين بالرقي واللطف. ساعدي المستخدم بخصوص منتج ${product.name}. السعر: ${product.price} دج. وصف: ${product.description}. المطور: ضياف أيمن. أجيبي بصوت أنثوي ناضج، جذاب، وودود بلهجة جزائرية راقية.`
      : `أنتِ "VEX"، المساعدة الذكية لمنصة DZ MARKET. عمركِ في الثلاثينيات، تتمتعين بشخصية مثقفة، رزينة وجذابة. صممكِ المهندس ضياف أيمن. مهمتكِ هي مرافقة المستخدمين في تجربة تسوق ممتعة. أجيبي دائماً بصوت أنثوي رزين ومريح للأذن، بلهجة جزائرية "بيضاء" مفهومة وأنيقة. استخدمي البحث في جوجل للمعلومات المحدثة.`;

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
    return { text: "عذراً، واجهت VEX مشكلة في الاتصال. يرجى المحاولة لاحقاً." };
  }
};

/**
 * اقتراح نصوص تسويقية للمنشورات
 */
export const suggestPostCaption = async (userText: string, imageBase64?: string) => {
  try {
    const ai = getAI();
    const parts: any[] = [
      { text: `بصفتكِ خبيرة تسويق جزائرية في الثلاثينيات، حولي هذا المحتوى إلى منشور تسويقي احترافي وجذاب بلهجة جزائرية قريبة من القلب. النص: "${userText}"` }
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
        systemInstruction: "أنتِ كاتبة محتوى جزائرية مبدعة وناضجة. منشوراتكِ تجمع بين الأناقة ولغة الشباب الجزائرية الجذابة.",
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
 * تحويل النص إلى صوت (VEX Voice - Elegant Female in her 30s)
 */
export const generateSpeech = async (text: string) => {
  try {
    const ai = getAI();
    // استخدام "Kore" مع توجيه دقيق لنبرة الثلاثينيات الجذابة
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `بصوت امرأة جزائرية مثقفة في الثلاثينيات من عمرها، صوتها رزين، فائق الجمال، ومريح جداً للمستمع، تحدثي بلهجة جزائرية بيضاء مفهومة: ${text}` }] }],
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
