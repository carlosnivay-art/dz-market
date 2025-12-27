
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

// Always use const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const chatWithProductAI = async (message: string, product: Product) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `أنت مساعد مبيعات ذكي يدعى "VEX" لتطبيق "Dz Market" (ديزاد ماركت) في الجزائر، التطبيق من تطوير المهندس "ضياف أيمن" (Diaf Aymen).
        أنت ترد الآن نيابة عن البائع بخصوص منتج محدد متوفر على منصة ديزاد ماركت:
        - اسم المنتج: ${product.name}
        - السعر: ${product.price} دج
        - المواصفات: ${product.description}
        - الموقع: ${product.wilaya}
        
        معلومات هامة:
        - اسمك هو "VEX".
        - منصة ديزاد ماركت هي سوق جزائري آمن يضمن حقوق الجميع.
        - المطور هو "ضياف أيمن"، مهندس جزائري يسعى لتطوير التكنولوجيا المحلية.
        - يمكنك البحث في الويب إذا سألك المستخدم عن مقارنات أسعار أو تفاصيل تقنية حديثة.
        
        تعليماتك:
        1. كن ودوداً واستخدم اللهجة الجزائرية الخفيفة المفهومة.
        2. أكد على موثوقية التعامل عبر ديزاد ماركت (Dz Market).
        3. إذا سأل عن المطور، أخبره بفخر أنه المهندس "ضياف أيمن".
        4. دائماً عرف نفسك بـ "VEX" مساعد ديزاد ماركت الذكي.`,
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    return { text: "عذراً، VEX غير متاح حالياً في ديزاد ماركت، هل يمكنك تكرار سؤالك؟" };
  }
};

export const generalAIChat = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        tools: [{ googleSearch: {} }],
        systemInstruction: `أنت "VEX"، الخبير التجاري والمساعد الذكي لتطبيق ديزاد ماركت (Dz Market)، الذي صممه وطوره المهندس الجزائري "ضياف أيمن" (Diaf Aymen).
        
        مهامك:
        1. اسمك هو "VEX".
        2. الإجابة على استفسارات التجارة في الجزائر والعالم باستخدام البحث المباشر.
        3. شرح مدى موثوقية Dz Market (دفع آمن، توصيل سريع، حماية المشتري).
        4. التعريف بالمطور "ضياف أيمن" عند السؤال عنه كمبتكر جزائري طموح.
        5. مساعدة المستخدمين في العثور على أفضل الصفقات على منصة ديزاد ماركت.
        
        كن احترافياً، مطلعاً، وداعماً للابتكار الجزائري. اسمك VEX ومنصتك هي Dz Market.`,
      }
    });
    return {
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    };
  } catch (error) {
    return { text: "مرحباً! أنا VEX، مساعد ديزاد ماركت الذكي. كيف يمكنني مساعدتك في تجربة التسوق اليوم؟" };
  }
};
