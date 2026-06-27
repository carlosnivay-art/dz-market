import express from "express";
import path from "path";
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
    const model = "gemini-2.5-flash";
    
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
    console.error("Backend Chat Error Details:", error);
    
    const errString = String(error?.message || error || "").toLowerCase();
    const isQuotaExceeded = 
      errString.includes("429") || 
      errString.includes("quota") || 
      errString.includes("limit") || 
      errString.includes("resource_exhausted") || 
      error?.status === 429 ||
      error?.statusCode === 429;

    if (error?.message === "MISSING_API_KEY") {
      res.status(400).json({ 
        error: "MISSING_API_KEY",
        text: "⚠️ لم يتم العثور على مفتاح Gemini API. يرجى تهيئة المتغير API_KEY في إعدادات البيئة على Vercel لتفعيل المساعد الذكي VEX." 
      });
    } else if (isQuotaExceeded) {
      res.status(429).json({
        error: "QUOTA_EXCEEDED",
        text: "تم تجاوز الحصة المجانية لـ Gemini، يرجى المحاولة لاحقاً."
      });
    } else {
      res.status(500).json({ 
        error: error?.message || "SERVER_ERROR",
        text: error?.message || "عذراً، حدث خطأ في الخادم أثناء معالجة الطلب."
      });
    }
  }
});

app.get("/api/gemini/test", async (req, res) => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "hi",
    });
    res.json({
      status: "success",
      message: "API Connection successful!",
      responseRaw: response,
      text: response.text
    });
  } catch (error: any) {
    console.error("Backend Test Connection Error:", error);
    res.status(500).json({
      status: "error",
      message: error?.message || "Unknown error",
      errorDetails: error,
      stack: error?.stack,
      envKeysPresent: {
        API_KEY: !!process.env.API_KEY,
        GEMINI_API_KEY: !!process.env.GEMINI_API_KEY,
        VITE_API_KEY: !!process.env.VITE_API_KEY,
        VITE_GEMINI_API_KEY: !!process.env.VITE_GEMINI_API_KEY,
      }
    });
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
      model: "gemini-2.5-flash",
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
    console.warn("Backend Logo Generation using image model failed or quota exceeded, using SVG fallback:", error.message || error);
    
    try {
      const ai = getAI();
      // Use gemini-2.5-flash to dynamically generate high-quality SVG code (free tier, no image generation quota limit)
      const svgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Create high-quality, modern, valid, self-contained SVG code for an e-commerce platform called "DZ MARKET".
Guidelines:
- Design: A beautiful shopping basket/bag containing a subtle stylized Algerian flag motif (crescent and star, with green and red).
- Modern minimalist aesthetic, beautiful gradients, soft shadows.
- Colors: Green (#10B981), Orange/Red (#EF4444), and White.
- Use viewBox="0 0 100 100" and specify xmlns="http://www.w3.org/2000/svg".
- Return ONLY the raw SVG code. No explanations, no markdown code blocks, no HTML wrapper. Just the valid SVG text starting with "<svg" and ending with "</svg>".`,
      });

      let svgText = svgResponse.text || '';
      svgText = svgText.trim();
      
      // Strip markdown code blocks if present
      if (svgText.includes('```')) {
        svgText = svgText.replace(/^```[a-zA-Z]*\n/, '').replace(/\n```$/, '').trim();
      }

      if (svgText.startsWith('<svg') || svgText.includes('<svg')) {
        const startIdx = svgText.indexOf('<svg');
        const endIdx = svgText.lastIndexOf('</svg>') + 6;
        if (startIdx !== -1 && endIdx > startIdx) {
          svgText = svgText.substring(startIdx, endIdx);
        }
        
        const base64Svg = Buffer.from(svgText).toString('base64');
        res.json({ imageUrl: `data:image/svg+xml;base64,${base64Svg}` });
      } else {
        throw new Error("Invalid SVG content generated by Gemini");
      }
    } catch (fallbackError: any) {
      console.error("SVG Fallback Logo Generation also failed:", fallbackError);
      
      // Ultimate hardcoded beautiful fallback SVG matching the theme precisely
      const defaultSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100%" height="100%">
  <defs>
    <linearGradient id="dzGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="4" stdDeviation="4" flood-opacity="0.15"/>
    </filter>
  </defs>
  <rect width="100" height="100" rx="24" fill="url(#dzGrad)" />
  <g filter="url(#shadow)" transform="translate(15, 12)">
    <path d="M20,25 C20,15 25,10 35,10 C45,10 50,15 50,25" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round"/>
    <rect x="12" y="24" width="46" height="42" rx="12" fill="#FFFFFF" />
    <path d="M12,24 L35,24 L35,66 L12,66 Z" fill="#10B981" />
    <path d="M35,45 C31.5,45 28.5,42 28.5,38 C28.5,34 31.5,31 35,31 C33.5,32.5 32.5,35 32.5,38 C32.5,41 33.5,43.5 35,45 Z" fill="#EF4444" />
    <polygon points="37,36 38,38 40,38 38.5,39 39,41 37.5,40 36,41 36.5,39 35,38 37,38" fill="#EF4444" />
    <path d="M22,38 L48,38 M22,46 L48,46" stroke="#E5E7EB" stroke-width="3" stroke-linecap="round" />
  </g>
</svg>`;
      const base64Svg = Buffer.from(defaultSvg).toString('base64');
      res.json({ imageUrl: `data:image/svg+xml;base64,${base64Svg}` });
    }
  }
});

app.post("/api/gemini/generate-speech", async (req, res) => {
  try {
    const { text } = req.body;
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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

    let audioBase64 = null;
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts && Array.isArray(parts)) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType && part.inlineData.mimeType.startsWith("audio/")) {
          audioBase64 = part.inlineData.data;
          break;
        }
      }
    }

    if (!audioBase64 && parts && parts[0]?.inlineData?.data) {
      audioBase64 = parts[0].inlineData.data;
    }

    res.json({ audioBase64 });
  } catch (error: any) {
    console.error("Backend TTS Error:", error);
    res.status(500).json({ audioBase64: null });
  }
});

// Serve frontend assets
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
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

if (!process.env.VERCEL) {
  setupVite();
}

export default app;
