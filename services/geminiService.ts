
import { GoogleGenAI, Type } from "@google/genai";
import { SearchState, Recipe, VisionMode, ChefVerdict, TrendReport, User } from "../types";
import { calculateTotalNutrition, formatNutrition } from "./nutritionService";

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

// Schema for Dish Analysis (Taste Thief)
const DISH_ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    description: { type: Type.STRING },
    ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
    calories: { type: Type.NUMBER },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING }
      },
      required: ["protein", "carbs", "fat"]
    },
    allergens: { type: Type.ARRAY, items: { type: Type.STRING } },
    flavorProfile: { type: Type.STRING },
    chefComment: { type: Type.STRING }
  },
  required: ["name", "description", "ingredients", "calories", "macros", "allergens", "flavorProfile", "chefComment"]
};

// Schema for Health Insight (Nutri Scanner)
const HEALTH_INSIGHT_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING },
    calories: { type: Type.NUMBER },
    healthScore: { type: Type.NUMBER },
    trafficLight: { type: Type.STRING, enum: ["Green", "Yellow", "Red"] },
    macros: {
      type: Type.OBJECT,
      properties: {
        protein: { type: Type.STRING },
        carbs: { type: Type.STRING },
        fat: { type: Type.STRING }
      },
      required: ["protein", "carbs", "fat"]
    },
    positiveNutrients: { type: Type.ARRAY, items: { type: Type.STRING } },
    negativeNutrients: { type: Type.ARRAY, items: { type: Type.STRING } },
    dietitianAdvice: { type: Type.STRING }
  },
  required: ["name", "calories", "healthScore", "trafficLight", "macros", "positiveNutrients", "negativeNutrients", "dietitianAdvice"]
};

// Analyze image with specific mode logic
export const analyzeImage = async (base64Image: string, mode: VisionMode, state?: SearchState): Promise<import("../types").VisionResult> => {
  const ai = getAIClient();
  const mimeTypeMatch = base64Image.match(/^data:(image\/[a-zA-Z+]+);base64,/);
  const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : 'image/jpeg';
  const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

  // Common constraints
  let constraints = "";
  if (state) {
    const parts = [];
    if (state.goal) parts.push(`營養目標：${state.goal}`);
    if (state.occasion) parts.push(`用餐場合：${state.occasion}`);
    if (state.cuisine && state.cuisine !== "Any") parts.push(`偏好菜系：${state.cuisine}`);
    if (state.ingredients.length > 0) parts.push(`額外指定食材：${state.ingredients.join(", ")}`);

    if (parts.length > 0) {
      constraints = `\n\n[使用者額外限制條件]：\n${parts.join("\n")}`;
    }
  }

  // Define prompt and schema based on mode
  let prompt = "";
  let schema = null;
  let systemInstruction = "";

  switch (mode) {
    case VisionMode.FRIDGE_XRAY:
      prompt = `任務：辨識冰箱或檯面上的原始食材。
      重要規則：如果照片沒有可辨識食材，回傳空陣列 []。
      目標：根據識別出的食材，推薦 3 道食譜。${constraints}`;
      schema = RECIPE_SCHEMA;
      systemInstruction = "你是一位擅長清冰箱料理的米其林主廚。請根據食材發想創意食譜。語言：台灣繁體中文。";
      break;

    case VisionMode.TASTE_THIEF:
      prompt = `任務：逆向工程這道餐廳料理。
      重要規則：分析這道菜的組成、烹飪手法與風味。
      目標：拆解出食材清單、初估熱量與營養、過敏原提示，並給予主廚級的風味點評。${constraints}`;
      schema = DISH_ANALYSIS_SCHEMA;
      systemInstruction = "你是一位擁有絕對味蕾的美食評論家。請精準拆解眼前的料理。語言：台灣繁體中文。";
      break;

    case VisionMode.NUTRI_SCANNER:
      prompt = `任務：掃描食物並進行嚴格的健康評估。
      重要規則：計算熱量、營養素，並給出健康紅綠燈 (Green/Yellow/Red)。
      目標：提供條列式的優缺點營養分析與營養師建議。${constraints}`;
      schema = HEALTH_INSIGHT_SCHEMA;
      systemInstruction = "你是一位嚴格的臨床營養師。請客觀分析食物的營養價值。語言：台灣繁體中文。";
      break;

    default:
      throw new Error("Unknown Vision Mode");
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        { text: prompt },
        { inlineData: { mimeType: mimeType, data: cleanBase64 } }
      ]
    },
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const rawResult = JSON.parse(response.text || "{}");

  // Type guard and return wrapped result
  if (mode === VisionMode.FRIDGE_XRAY) {
    return { mode: VisionMode.FRIDGE_XRAY, data: Array.isArray(rawResult) ? rawResult : [] };
  } else if (mode === VisionMode.TASTE_THIEF) {
    return { mode: VisionMode.TASTE_THIEF, data: rawResult };
  } else {
    return { mode: VisionMode.NUTRI_SCANNER, data: rawResult };
  }
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
    輸入條件/食材：${state.ingredients.length > 0 ? state.ingredients.join(", ") : "由主廚發揮"}
    目標：${state.goal || "均衡"}
    菜系：${state.cuisine}
    場合：${state.occasion || "一般"}
    ${userProfileContext}
    
    重要規則：
    1. 「輸入條件」可能包含具體的食材（如：雞蛋），也可能包含用戶的限制（如：我只有微波爐、不吃牛肉、要很辣）。
    2. 請務必優先遵守這些自然語言的限制條件。如果用戶說「只有微波爐」，生成的食譜必須完全能在微波爐完成。
    3. 請務必計算詳細的 macros (蛋白質、碳水、脂肪) 並在 healthTip 中提供專業的營養/微量元素分析。
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      systemInstruction: "你是一位具備 30 年經驗的米其林三星主廚，同時也是擁有執照的運動營養師。你特別擅長台灣在地料理，包括台灣小吃（如滷肉飯、蚵仔煎、大腸麵線、肉圓、割包）、古早味家常菜（如紅燒肉、菜脯蛋、瓜仔肉、竹筍湯）、夜市美食等。在生成食譜時，請優先考慮台灣味道與懷舊風味，同時也能融入創意元素。若遇到「只有微波爐/電鍋」等設備限制，請展現你的專業調整能力。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA,
    }
  });

  const recipes: Recipe[] = JSON.parse(response.text || "[]");

  // Post-process with real USDA nutrition data
  const recipesWithRealData = await Promise.all(recipes.map(async (recipe) => {
    try {
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const nutrition = await calculateTotalNutrition(recipe.ingredients);

        // Update recipe with real data
        recipe.calories = nutrition.calories;
        recipe.macros = {
          protein: `${nutrition.protein}g`,
          carbs: `${nutrition.carbohydrates}g`,
          fat: `${nutrition.fat}g`
        };

        // Add source metadata to healthTip (or could add a new field if schema allowed)
        if (nutrition.source === 'USDA') {
          recipe.matchReason += " (營養數據來源：USDA)";
        }
      }
    } catch (e) {
      console.error("Failed to fetch USDA data for recipe:", recipe.name, e);
    }
    return recipe;
  }));

  return recipesWithRealData;
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
  try {
    const ai = getAIClient();

    const recipeContext = `
食譜名稱：${recipe.name}
食材：${recipe.ingredients.join('、')}
步驟：${recipe.instructions.join(' → ')}
預估時間：${recipe.timeMinutes} 分鐘
熱量：${recipe.calories} kcal
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `${recipeContext}\n\n使用者問題：${question}`,
      config: {
        systemInstruction: "你是「饗味食光」的二廚助手，名叫小饗。請用溫暖親切的語氣回答使用者關於這道料理的問題。如果問題與料理無關，請委婉引導回料理話題。回答要簡潔實用，不超過 150 字。語言：必須使用台灣繁體中文。"
      }
    });

    const text = response.text?.trim();
    if (!text) {
      return "主廚現在有點忙，請稍後再試。";
    }
    return text;
  } catch (error) {
    console.error('askSousChef error:', error);
    return "抱歉，二廚暫時無法回應，請稍後再試。";
  }
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

    // Enhance with USDA data
    if (recipe.ingredients && recipe.ingredients.length > 0) {
      try {
        const nutrition = await calculateTotalNutrition(recipe.ingredients);
        recipe.calories = nutrition.calories;
        recipe.macros = {
          protein: `${nutrition.protein}g`,
          carbs: `${nutrition.carbohydrates}g`,
          fat: `${nutrition.fat}g`
        };
      } catch (e) {
        console.warn("USDA fetch failed for user recipe", e);
      }
    }
  }
  return recipe;
};

// Fetch random recipes for the discovery feed
export const fetchDiscoveryFeed = async (): Promise<Recipe[]> => {
  const ai = getAIClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "隨機生成 6 道食譜 JSON，其中至少 3 道必須是台灣道地美食（如滷肉飯、蚵仔煎、珍珠奶茶、鹹酥雞、牛肉麵、肉圓、割包、大腸麵線、古早味蛋糕、甜不辣等），其餘可為全球創意料理。請包含詳細的營養數據。",
    config: {
      systemInstruction: "你是一位追蹤全球美食趨勢的社群主編，同時也熱愛台灣在地美食文化。請生成具備創意且能吸引大眾眼球的食譜，特別強調台灣小吃與古早味料理。語言：必須使用台灣繁體中文。",
      responseMimeType: "application/json",
      responseSchema: RECIPE_SCHEMA
    }
  });
  const recipes: Recipe[] = JSON.parse(response.text || "[]");

  // Post-process discovery feed with USDA data
  const recipesWithRealData = await Promise.all(recipes.map(async (recipe) => {
    try {
      if (recipe.ingredients && recipe.ingredients.length > 0) {
        const nutrition = await calculateTotalNutrition(recipe.ingredients);
        recipe.calories = nutrition.calories;
        recipe.macros = {
          protein: `${nutrition.protein}g`,
          carbs: `${nutrition.carbohydrates}g`,
          fat: `${nutrition.fat}g`
        };
      }
    } catch (e) {
      // safe fail
    }
    return recipe;
  }));

  return recipesWithRealData;
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
