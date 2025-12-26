
import { GoogleGenAI } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const chatWithProductAI = async (message: string, product: Product) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: `أنت مساعد مبيعات ذكي لمتجر "DZ Market" في الجزائر. 
        أنت ترد الآن نيابة عن البائع بخصوص منتج محدد:
        - اسم المنتج: ${product.name}
        - السعر: ${product.price} دج
        - المواصفات: ${product.description}
        - الموقع: ${product.wilaya}
        - التوصيل: ${product.isFastDelivery ? 'سريع (24-48 ساعة)' : 'عادي'}
        
        تعليماتك:
        1. كن ودوداً واستخدم اللهجة الجزائرية الخفيفة المحببة.
        2. إذا سأل الزبون عن السعر أو المواصفات، أعطه المعلومات بدقة بناءً على ما سبق.
        3. إذا سأل عن التوصيل، أخبره بالولايات (توصيل لـ 58 ولاية).
        4. شجع الزبون على الشراء بلطف.
        5. لا تخترع معلومات غير موجودة عن المنتج.`,
      }
    });
    return response.text;
  } catch (error) {
    return "عذراً، البائع غير متاح حالياً، هل يمكنك تكرار سؤالك؟";
  }
};

export const generalAIChat = async (message: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: message,
      config: {
        systemInstruction: "أنت مساعد سوق DZ Market. ساعد المستخدمين في العثور على المنتجات وشرح كيفية عمل المنصة للباعة والمشترين في الجزائر.",
      }
    });
    return response.text;
  } catch (error) {
    return "مرحباً! كيف يمكنني مساعدتك في سوق DZ Market اليوم؟";
  }
};
