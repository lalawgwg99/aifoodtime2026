
import { GoogleGenAI, Type } from "@google/genai";
import { SearchState, Recipe, VisionMode, ChefVerdict, TrendReport, User } from "../types";

// Helper to clean JSON strings from the model response
const cleanJsonString = (str: string): string => {
  return str.replace(/^```json\s*/, "").replace(/^```\s*/, "").replace(/\s*```$/, "");
};

// BUG-004 修復：使用 Vite 環境變數
// Initialize the Google GenAI client
const getAIClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' && process.env?.API_KEY);
  if (!apiKey) {
    console.error("Missing GEMINI API Key. Set VITE_GEMINI_API_KEY in .env.local");
    throw new Error("API 密鑰未設定，請檢查環境變數設定。");
  }
  return new GoogleGenAI({ apiKey });
};

// Shared schema for a list of recipes
const RECIPE_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING, description: "A unique identifier for the recipe." },
      name: { type: Type.STRING, description: "The name of the recipe." },
      description: { type: Type.STRING, description: "A short description of the dish." },
      matchScore: { type: Type.NUMBER, description: "The match score from 0-100." },
      matchReason: { type: Type.STRING, description: "Reason why this recipe matches the criteria." },
      calories: { type: Type.NUMBER, description: "Estimated calories." },
      timeMinutes: { type: Type.NUMBER, description: "Preparation time in minutes." },
      tags: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of relevant tags." },
      ingredients: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of ingredients." },
      instructions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Step-by-step instructions." },
      macros: {
        type: Type.OBJECT,
        properties: {
          protein: { type: Type.STRING, description: "e.g., '25g'" },
          carbs: { type: Type.STRING, description: "e.g., '40g'" },
          fat: { type: Type.STRING, description: "e.g., '10g'" }
        },
        required: ["protein", "carbs", "fat"]
      },
      healthTip: { type: Type.STRING, description: "A brief nutritional analysis highlighting specific micronutrients (e.g., Vitamin C, Iron) or health benefits." }
    },
    required: ["id", "name", "description", "matchScore", "matchReason", "calories", "timeMinutes", "tags", "ingredients", "instructions", "macros", "healthTip"],
    propertyOrdering: ["id", "name", "description", "matchScore", "matchReason", "calories", "timeMinutes", "tags", "ingredients", "instructions", "macros", "healthTip"]
  }
};

// Shared schema for a single recipe
const SINGLE_RECIPE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    matchScore: { type: Type.NUMBER },
    matchReason: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    timeMinutes: { type: Type.NUMBER },
    tags: { type: Type.ARRAY, items: { type: Type.STRING } },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING }
      },
      required: ["protein", "carbs", "fat"]
    },
    healthTip: { type: Type.STRING }
  },
  required: ["id", "name", "description", "matchScore", "matchReason", "calories", "timeMinutes", "tags", "ingredients", "instructions", "macros", "healthTip"]
};

// Schema for Chef Verdict
const VERDICT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    score: { type: Type.NUMBER },
    critique: { type: Type.STRING },
    platingTip: { type: Type.STRING },
    badge: { type: Type.STRING },
    shareText: { type: Type.STRING },
    comparisonData: {
      type: Type.OBJECT,
      properties: {
        visual: { type: Type.NUMBER },
        creativity: { type: Type.NUMBER },
        technique: { type: Type.NUMBER },
        proVisual: { type: Type.NUMBER },
        proCreativity: { type: Type.NUMBER },
        proTechnique: { type: Type.NUMBER }
      },
      required: ["visual", "creativity", "technique", "proVisual", "proCreativity", "proTechnique"]
    }
  },
  required: ["score", "critique", "platingTip", "badge", "shareText", "comparisonData"]
};

// Schema for Trend Report
const TREND_REPORT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    seasonTitle: { type: Type.STRING },
    topIngredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    platingTrend: { type: Type.STRING },
    globalInsight: { type: Type.STRING },
    marketTrends: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          popularity: { type: Type.NUMBER },
          description: { type: Type.STRING },
          tag: { type: Type.STRING }
        },
        required: ["title", "popularity", "description", "tag"]
      }
    }
  },
  required: ["seasonTitle", "topIngredients", "platingTrend", "globalInsight", "marketTrends"]
};

// Analyze image and return recipes
export const analyzeImage = async (base64Image: string, mode: VisionMode): Promise<Recipe[]> => {
  const ai = getAIClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  let prompt = "";
  if (mode === VisionMode.FRIDGE_XRAY) {
    prompt = "任務：辨識這張照片中的食材。重要規則：如果照片中沒有任何可辨識的食物、食材或料理，請直接回傳空陣列 `[]`，不要嘗試生成。如果有食材，請根據這些食材生成 3 道美味且具備創意的食譜 JSON。請特別注意營養均衡，並在 healthTip 中提供微量元素分析。";
  } else if (mode === VisionMode.TASTE_THIEF) {
    prompt = "任務：辨識這張照片中的料理。重要規則：如果照片中沒有食物，請直接回傳空陣列 `[]`。如果有，請嘗試分析其配方，生成 3 道類似或改良版的食譜 JSON。";
  } else if (mode === VisionMode.NUTRI_SCANNER) {
    prompt = "任務：分析營養價值。重要規則：如果照片中沒有食物，請直接回傳空陣列 `[]`。如果有，提供營養價值評估，並推薦 3 道更健康的替代食譜 JSON。";
  } else {
    prompt = "辨識照片內容。如果不是食物，回傳空陣列。";
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
      ]
    },
    config: {
      systemInstruction: "你是一位具備頂尖視覺辨識能力的米其林主廚與專業營養師。首先必須驗證圖片是否為食物或食材，如果不是，為了節省資源，請務必回傳空陣列。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA,
    },
  });

  return JSON.parse(response.text || "[]");
};

// Generate recipes based on search state and optional user profile
export const generateRecipes = async (state: SearchState, user?: User | null): Promise<Recipe[]> => {
  const ai = getAIClient();

  let userProfileContext = "";
  if (user && user.stats.tasteDNA) {
    const dnaStr = user.stats.tasteDNA.map(dna => `${dna.label}: ${dna.value}%`).join(", ");
    userProfileContext = `使用者的味覺 DNA 設定檔如下：${dnaStr}。請在設計食譜時，微調風味與擺盤以符合這些偏好（例如：視覺美學高則強調擺盤細節，技術精準高則可以增加工序複雜度）。`;
  }

  const prompt = `請根據以下條件生成 3 道精緻食譜：
    食材：${state.ingredients.length > 0 ? state.ingredients.join(", ") : "由主廚發揮"}
    目標：${state.goal || "均衡"}
    菜系：${state.cuisine}
    場合：${state.occasion || "一般"}
    ${userProfileContext}
    請務必計算詳細的 macros (蛋白質、碳水、脂肪) 並在 healthTip 中提供專業的營養/微量元素分析。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "你是一位具備 30 年經驗的米其林三星主廚，同時也是擁有執照的運動營養師。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA,
    }
  });

  return JSON.parse(response.text || "[]");
};

// Generate image for a recipe
export const generateRecipeImage = async (name: string, description: string): Promise<string | null> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: `A professional food photography of ${name}: ${description}. Michelin star presentation, hyper-realistic, 8k quality, elegant lighting.` }
      ]
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};

// Ask the Sous Chef about a recipe
export const askSousChef = async (recipe: Recipe, question: string): Promise<string> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `食譜內容：${JSON.stringify(recipe)}\n使用者問題：${question}`,
    config: {
      systemInstruction: "你是一位溫暖且專業的二廚助手。請根據提供的食譜內容，親切地回答使用者的問題，如果問題無關料理，請委婉告知。語言：必須使用台灣繁體中文。"
    }
  });
  return response.text || "主廚現在有點忙，請稍後再試。";
};

// Generate Chef Verdict from image
export const generateChefVerdict = async (base64Image: string, recipeName: string): Promise<ChefVerdict> => {
  const ai = getAIClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: `這是使用者製作的「${recipeName}」。重要規則：請先判斷這張照片是否為食物或料理成品。如果不是（例如是風景、人物、動物），請在 JSON 中將 badge 設為 "NOT_FOOD"，score 設為 0，並簡短說明這不是食物。如果是食物，請從視覺呈現、創意發想、技術熟練度三個維度進行深度評析，並給予評分（0-100）。` },
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
      ]
    },
    config: {
      systemInstruction: "你是一位嚴厲但客觀的米其林三星評審。如果圖片不是食物，請立即停止評分並標記為非食物。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: VERDICT_SCHEMA
    }
  });
  return JSON.parse(response.text || "{}");
};

// Create a professional recipe from user draft
export const createRecipeFromDraft = async (base64Image: string, draftText: string, author: string): Promise<Recipe> => {
  const ai = getAIClient();
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: `根據這張照片和使用者的敘述：「${draftText}」，整理成一份專業的食譜 JSON。重要規則：如果照片內容明顯不是食物或料理，請將 id 設為 "NOT_FOOD"，其餘欄位留空或填入提示文字。如果是食物，請務必估算營養成分。` },
        { inlineData: { mimeType: 'image/jpeg', data: cleanBase64 } }
      ]
    },
    config: {
      systemInstruction: "你是一位專業的食譜編輯。請務必先驗證圖片是否為食物。如果不是，請回傳 id 為 'NOT_FOOD' 的錯誤標記。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: SINGLE_RECIPE_SCHEMA
    }
  });
  const recipe = JSON.parse(response.text || "{}");
  if (recipe.id !== "NOT_FOOD") {
    recipe.id = `user-${Date.now()}`;
    recipe.author = author;
    recipe.isUserCreated = true;
    recipe.imageUrl = base64Image;
  }
  return recipe;
};

// Fetch random recipes for the discovery feed
export const fetchDiscoveryFeed = async (): Promise<Recipe[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "隨機生成 6 道目前全球最受歡迎、具備社群討論度且視覺效果強大的創意食譜 JSON。請包含詳細的營養數據。",
    config: {
      systemInstruction: "你是一位追蹤全球美食趨勢的社群主編。請生成具備創意且能吸引大眾眼球的食譜。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA
    }
  });
  return JSON.parse(response.text || "[]");
};

// Fetch market trends report
export const fetchMarketTrends = async (): Promise<TrendReport> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "分析目前的餐飲市場大數據，產出一份關於本季流行食材、擺盤趨勢與市場動向的報告 JSON。",
    config: {
      systemInstruction: "你是一位頂尖的資深餐飲市場分析師。請提供精確且具前瞻性的市場見解。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: TREND_REPORT_SCHEMA
    }
  });
  return JSON.parse(response.text || "{}");
};
