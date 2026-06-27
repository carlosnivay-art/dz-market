import { Product } from "../types";

// Helper to get headers with the custom API key if present
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const customKey = localStorage.getItem("custom_gemini_api_key");
  if (customKey) {
    headers["X-Custom-Api-Key"] = customKey.trim();
  }
  return headers;
};

// Local Offline Demo Responses when Gemini API quota is exceeded or rate-limited
const getOfflineDemoResponse = (message: string): string => {
  const msg = message.toLowerCase();
  
  if (msg.includes("سعر") || msg.includes("شحال") || msg.includes("سومة") || msg.includes("بكم") || msg.includes("السعر") || msg.includes("السومة")) {
    return "مرحباً بك! أسعارنا في DZ MARKET ممتازة وتنافسية جداً في السوق الجزائرية 🇩🇿. يمكنك العثور على الأسعار المحدثة والتخفيضات لكل منتج على صفحة العرض مباشرة. كما نوفر الدفع عند الاستلام بعد فحص السلعة!";
  }
  if (msg.includes("توصيل") || msg.includes("شحن") || msg.includes("الولايات") || msg.includes("ولاية") || msg.includes("livraison")) {
    return "نعم يا فندم! نحن نوفر خدمة التوصيل السريع لـ 58 ولاية جزائرية بالكامل 🚚. التوصيل إلى العاصمة والولايات الكبرى يستغرق من 24 إلى 48 ساعة فقط، وباقي الولايات من 3 إلى 5 أيام. الدفع يكون دائماً يداً بيد عند استلام طلبيتك!";
  }
  if (msg.includes("كيف") || msg.includes("طريقة") || msg.includes("شراء") || msg.includes("طلب") || msg.includes("نطلب") || msg.includes("نشري")) {
    return "طريقة الطلب سهلة جداً في سوقنا الذكي: \n1. اختر المنتج الذي نال إعجابك.\n2. اضغط على زر 'شراء الآن' أو 'طلب'.\n3. املأ الاسم الكامل ورقم الهاتف بدقة.\n4. سيتصل بك فريق الدعم الهاتفي لتأكيد الطلب والعنوان، ثم نقوم بشحنه مباشرة لباب منزلك!";
  }
  if (msg.includes("تواصل") || msg.includes("هاتف") || msg.includes("رقم") || msg.includes("دعم") || msg.includes("مساعدة") || msg.includes("اتصال")) {
    return "يمكنك التواصل مع خدمة زبائن DZ MARKET مباشرة عبر الهاتف: 0550112233 أو عبر البريد الإلكتروني support@dz-market.com. كما يمكنك فتح محادثة مباشرة مع البائعين في التطبيق!";
  }
  if (msg.includes("سلام") || msg.includes("مرحبا") || msg.includes("أهلي") || msg.includes("صباح الخير") || msg.includes("مساء الخير")) {
    return "أهلاً وسهلاً بك في ديزاد ماركت (DZ MARKET) - سوقك الذكي في الجزائر! 🇩🇿 أنا VEX، مساعدتك الذكية في وضع المحاكاة المحلّي (Offline Demo) بسبب استهلاك الحصة اليومية لـ Gemini. كيف يمكنني مساعدتك اليوم في تصفح المنتجات أو الشراء؟";
  }
  if (msg.includes("منتج") || msg.includes("ملابس") || msg.includes("هاتف") || msg.includes("الكترونيات") || msg.includes("سوق")) {
    return "نوفر في ديزاد ماركت تشكيلة واسعة من المنتجات بجودة عالية: أزياء رجالية ونسائية، إلكترونيات حديثة، مستلزمات المطبخ والمنزل، وغيرها من المنتجات المستوردة والمحلية بأفضل الأسعار. تصفح بواباتنا الآن واستمتع بالتسوق الجزائري المريح!";
  }
  
  return "أنا المساعدة الذكية VEX في وضع المحاكاة المحلّي (Offline Demo) نظراً لتجاوز حصة الاستخدام المجانية لـ Gemini مؤقتاً 💡. طلبك مفهوم، وتطبيق ديزاد ماركت جاهز بالكامل للتصفح وإضافة المنتجات، التوصيل متوفر لـ 58 ولاية والدفع عند الاستلام!";
};

/**
 * محادثة متعددة الوسائط (نص، صورة، بحث) عبر السيرفر
 */
export const multimodalAIChat = async (message: string, imageBase64?: string, product?: Product) => {
  try {
    // خطوة الطلب إلى السيرفر (السطر الذي قد يتسبب بحدوث الخطأ 429 في حال تجاوز الحصة)
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ message, imageBase64, product }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      if (errData.error === "MISSING_API_KEY") {
        return { 
          text: "⚠️ لم يتم العثور على مفتاح Gemini API. يرجى تهيئة المتغير API_KEY في إعدادات البيئة على Vercel لتفعيل المساعد الذكي VEX." 
        };
      }
      if (response.status === 429 || errData.error === "QUOTA_EXCEEDED" || String(errData.text || "").includes("تم تجاوز الحصة") || String(errData.text || "").includes("غير متاح مؤقتاً")) {
        return {
          text: "عذراً، الذكاء الاصطناعي غير متاح مؤقتاً. حاول مرة أخرى لاحقاً."
        };
      }
      throw new Error(errData.text || errData.error || "خطأ غير معروف في السيرفر");
    }

    return await response.json();
  } catch (error: any) {
    console.error("Gemini Error:", error);
    const errString = String(error?.message || error || "").toLowerCase();
    if (errString.includes("429") || errString.includes("quota") || errString.includes("limit") || errString.includes("exhausted") || errString.includes("تم تجاوز الحصة") || errString.includes("غير متاح مؤقتاً")) {
      return { 
        text: "عذراً، الذكاء الاصطناعي غير متاح مؤقتاً. حاول مرة أخرى لاحقاً." 
      };
    }
    return { text: error?.message || "خطأ غير معروف في السيرفر" };
  }
};

/**
 * اقتراح نصوص تسويقية للمنشورات عبر السيرفر
 */
export const suggestPostCaption = async (userText: string, imageBase64?: string) => {
  try {
    const response = await fetch("/api/gemini/suggest-caption", {
      method: "POST",
      headers: getHeaders(),
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
      headers: getHeaders(),
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
      headers: getHeaders(),
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
  try {
    // Attempt standard browser decoding first (covers container formats like AAC, MP3, WAV)
    const bufferCopy = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
    return await ctx.decodeAudioData(bufferCopy);
  } catch (err) {
    console.warn("Native browser decodeAudioData failed, falling back to manual PCM decoding:", err);
    
    // Fallback to manual 16-bit PCM decoding
    const dataInt16 = new Int16Array(data.buffer, data.byteOffset, data.byteLength / 2);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }
};
