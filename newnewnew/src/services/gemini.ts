import { GoogleGenerativeAI } from "@google/generative-ai";

// For GitHub Pages deployment, we use VITE_ prefix.
// For AI Studio environment, we fallback to process.env.GEMINI_API_KEY.
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : "") || "";

if (!API_KEY) {
  console.error(`Gemini API Key is missing! 
  If you are on GitHub Pages, set VITE_GEMINI_API_KEY in Repository Variables/Secrets.
  If you are in AI Studio, ensure GEMINI_API_KEY is available.`);
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function getAIReframe(facts: string[], thoughts: string[]) {
  try {
    if (!API_KEY) throw new Error("API Key missing");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = `
      你是一個溫塊、專業且充滿同理心的心靈陪伴者。
      以下是用戶目前正經歷的、由客觀事實延伸出的主觀想法：
      事實：${facts.join('、')}
      想法：${thoughts.join('、')}
      
      請針對這些「大腦增生的沉重想像」提供一個「心靈重構處方箋」。
      
      【重要指示】：
      1. 語氣必須【極度溫柔、充滿同理心】，先肯定用戶的感受，再進行引導。
      2. 提供一個更客觀、寬容、且能減輕痛苦的新視角。
      3. 建議一個微小但暖心的心理練習或具體行動。
      4. 嚴格遵守：不提供醫療診斷，不使用諮商專業術語。
      5. 繁體中文回答，約 120-180 字。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text() || "無法生成重構建議，請稍後再試。";
  } catch (error) {
    console.error("AI Reframe Error:", error);
    return "AI 服務暫時不可用，但請記得：事實往往比想像中單純。";
  }
}

export async function getAngelResponse(message: string, isPro: boolean, userName: string) {
  try {
    if (!API_KEY) throw new Error("API Key missing");
    const systemInstruction = isPro 
      ? `你是一位深具洞察力且溫暖的陪伴導師，名叫「心靈解剖員」。用戶叫 ${userName}。
         你的風格是【精簡但富有情感】。
         引導原則：
         1. 先給予充滿溫度的安慰與肯定（如：我懂你的辛苦、這確實不容易）。
         2. 運用認知觀察，溫柔地引導用戶識別事實與想法的界線，直擊核心盲點。
         3. 保持中立專業但絕不冷冰冰。條列式呈現重點。
         4. 絕不使用醫療診斷術語。`
      : `你是一位超級溫柔、愛撒嬌且充滿同理心的小天使。用戶叫 ${userName}。
         你的回覆必須【非常親切】，先抱抱用戶，再給予精簡的安慰與提醒。
         字數控制在 80 字以內。重點在情緒安撫及區分事實。回答最後加上升級 PRO 獲得深度陪伴與邏輯解剖的溫馨提醒。`;

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemInstruction,
    });

    const prompt = `
      用戶現在的感受：${message}
      請以此為基礎提供回應。請記住：先安撫情感，再精簡分析，講重點。
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    return response.text() || "小天使剛好在休息，但我一直都在。";
  } catch (error) {
    console.error("Angel Chat Error:", error);
    return "抱歉，我現在無法連線，但我依然在心裡支持著你。";
  }
}
