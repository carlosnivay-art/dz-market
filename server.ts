import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Modality } from "@google/genai";

const app = express();
const PORT = 3000;

// Increase payload limit for base64 transfers
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// Helper to get GoogleGenAI client on the server
const getAI = () => {
  const keysToTry = [
    process.env.API_KEY,
    process.env.GEMINI_API_KEY,
    process.env.VITE_API_KEY,
    process.env.VITE_GEMINI_API_KEY
  ];
  
  let key = "";
  for (const k of keysToTry) {
    if (k) {
      const cleaned = k.trim().replace(/^["']|["']$/g, '');
      if (
        cleaned && 
        cleaned !== "PLACEHOLDER_API_KEY" && 
        cleaned !== "your_gemini_api_key_here" && 
        cleaned !== "your_api_key_here" &&
        !cleaned.toLowerCase().includes("placeholder")
      ) {
        key = cleaned;
        break;
      }
    }
  }

  if (!key || key === "") {
    throw new Error("MISSING_API_KEY");
  }
  return new GoogleGenAI({ 
    apiKey: key,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build-server',
      }
    }
  });
};

// API Routes
app.post("/api/gemini/chat", async (req, res) => {
  try {
    const { message, imageBase64, product } = req.body;
    const ai = getAI();
    const model = "gemini-3.5-flash";
    
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

    res.json({
      text: response.text,
      sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks
    });
  } catch (error: any) {
    console.error("Backend Chat Error:", error);
    if (error?.message === "MISSING_API_KEY") {
      res.status(400).json({ 
        error: "MISSING_API_KEY",
        text: "⚠️ لم يتم العثور على مفتاح Gemini API. يرجى تهيئة المتغير API_KEY في إعدادات البيئة على Vercel لتفعيل المساعد الذكي VEX." 
      });
    } else {
      res.status(500).json({ text: "عذراً، واجهت VEX مشكلة في الاتصال بالسيرفر. يرجى التأكد من تهيئة مفتاح API_KEY." });
    }
  }
});

app.post("/api/gemini/suggest-caption", async (req, res) => {
  try {
    const { userText, imageBase64 } = req.body;
    const ai = getAI();
    const parts: any[] = [
      { text: `بصفتكِ خبيرة تسويق جزائرية في الثلاثينيات، حولي هذا المحتوى إلى منشور تسويقي احترافي وجذاب بلهجة جزائرية قريبة من القلب. النص: "${userText}"` }
    ];

    if (imageBase64) {
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      parts.push({
        inlineData: { mimeType: "image/jpeg", data: cleanBase64 }
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: { parts },
      config: {
        systemInstruction: "أنتِ كاتبة محتوى جزائرية مبدعة وناضجة. منشوراتكِ تجمع بين الأناقة ولغة الشباب الجزائرية الجذابة.",
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Backend Post Suggestion Error:", error);
    res.status(500).json({ text: req.body.userText || "" });
  }
});

app.post("/api/gemini/generate-logo", async (req, res) => {
  try {
    const { prompt } = req.body;
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

    let imageUrl = null;
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        imageUrl = `data:image/png;base64,${part.inlineData.data}`;
        break;
      }
    }
    res.json({ imageUrl });
  } catch (error: any) {
    console.error("Backend Logo Generation Error:", error);
    res.status(500).json({ imageUrl: null });
  }
});

app.post("/api/gemini/generate-speech", async (req, res) => {
  try {
    const { text } = req.body;
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-tts-preview",
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

    const audioBase64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    res.json({ audioBase64 });
  } catch (error: any) {
    console.error("Backend TTS Error:", error);
    res.status(500).json({ audioBase64: null });
  }
});

// Serve frontend assets
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

setupVite();
