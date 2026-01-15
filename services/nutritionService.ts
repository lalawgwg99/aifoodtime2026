/**
 * USDA FoodData Central API Service
 * 
 * 使用美國農業部官方食品營養資料庫
 * API 文檔：https://fdc.nal.usda.gov/api-guide.html
 */

const USDA_API_KEY = import.meta.env.VITE_USDA_API_KEY || '';
const USDA_BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

// 營養素 ID 對照表 (USDA nutrientNumber)
const NUTRIENT_IDS = {
    calories: 1008,        // Energy (kcal)
    protein: 1003,         // Protein (g)
    carbohydrates: 1005,   // Carbohydrate, by difference (g)
    fat: 1004,             // Total lipid (fat) (g)
    fiber: 1079,           // Fiber, total dietary (g)
    sugar: 2000,           // Sugars, total (g)
    sodium: 1093,          // Sodium, Na (mg)
};

export interface NutritionData {
    calories: number;
    protein: number;
    carbohydrates: number;
    fat: number;
    source: 'USDA' | 'Estimated';
    confidence: number; // 0-100
}

interface USDAFoodItem {
    fdcId: number;
    description: string;
    foodNutrients: {
        nutrientNumber: number;
        nutrientName: string;
        value: number;
        unitName: string;
    }[];
}

interface USDASearchResponse {
    foods: USDAFoodItem[];
    totalHits: number;
}

/**
 * 搜尋單一食材的營養資料
 */
export async function searchIngredientNutrition(ingredient: string): Promise<NutritionData | null> {
    if (!USDA_API_KEY) {
        console.warn('USDA API key not configured, using fallback estimation');
        return null;
    }

    try {
        // 清理食材名稱（移除份量描述）
        const cleanedIngredient = cleanIngredientName(ingredient);

        const response = await fetch(`${USDA_BASE_URL}/foods/search?api_key=${USDA_API_KEY}&query=${encodeURIComponent(cleanedIngredient)}&pageSize=1&dataType=Foundation,SR Legacy`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            console.error('USDA API error:', response.status);
            return null;
        }

        const data: USDASearchResponse = await response.json();

        if (!data.foods || data.foods.length === 0) {
            console.log(`No USDA data found for: ${ingredient}`);
            return null;
        }

        const food = data.foods[0];
        const nutrients = extractNutrients(food.foodNutrients);

        return {
            calories: nutrients.calories,
            protein: nutrients.protein,
            carbohydrates: nutrients.carbohydrates,
            fat: nutrients.fat,
            source: 'USDA',
            confidence: 85, // USDA data is highly reliable
        };
    } catch (error) {
        console.error('Failed to fetch USDA nutrition data:', error);
        return null;
    }
}

/**
 * 計算多個食材的總營養
 */
export async function calculateTotalNutrition(ingredients: string[]): Promise<NutritionData> {
    const nutritionPromises = ingredients.map(ing => searchIngredientNutrition(ing));
    const results = await Promise.all(nutritionPromises);

    const validResults = results.filter((r): r is NutritionData => r !== null);

    if (validResults.length === 0) {
        // Fallback to estimation if no USDA data available
        return estimateNutrition(ingredients);
    }

    // 計算平均營養（假設每種食材約 100g）
    const total = validResults.reduce((acc, curr) => ({
        calories: acc.calories + curr.calories,
        protein: acc.protein + curr.protein,
        carbohydrates: acc.carbohydrates + curr.carbohydrates,
        fat: acc.fat + curr.fat,
        source: 'USDA' as const,
        confidence: acc.confidence,
    }), { calories: 0, protein: 0, carbohydrates: 0, fat: 0, source: 'USDA' as const, confidence: 0 });

    // 信心度基於成功查詢的比例
    const confidenceScore = Math.round((validResults.length / ingredients.length) * 100);

    return {
        ...total,
        calories: Math.round(total.calories),
        protein: Math.round(total.protein),
        carbohydrates: Math.round(total.carbohydrates),
        fat: Math.round(total.fat),
        confidence: confidenceScore,
    };
}

/**
 * 從 USDA 回應中提取營養素
 */
function extractNutrients(foodNutrients: USDAFoodItem['foodNutrients']): { calories: number; protein: number; carbohydrates: number; fat: number } {
    const nutrients = { calories: 0, protein: 0, carbohydrates: 0, fat: 0 };

    for (const nutrient of foodNutrients) {
        switch (nutrient.nutrientNumber) {
            case NUTRIENT_IDS.calories:
                nutrients.calories = nutrient.value || 0;
                break;
            case NUTRIENT_IDS.protein:
                nutrients.protein = nutrient.value || 0;
                break;
            case NUTRIENT_IDS.carbohydrates:
                nutrients.carbohydrates = nutrient.value || 0;
                break;
            case NUTRIENT_IDS.fat:
                nutrients.fat = nutrient.value || 0;
                break;
        }
    }

    return nutrients;
}

/**
 * 清理食材名稱（移除份量、單位等）
 */
function cleanIngredientName(ingredient: string): string {
    // 移除中文數字和單位
    let cleaned = ingredient
        .replace(/\d+[gG克公克毫升ml杯匙大小茶湯碗片顆個根條株束包盒]/g, '')
        .replace(/約|適量|少許|一些/g, '')
        .trim();

    // 如果清理後為空，返回原始文字
    return cleaned || ingredient;
}

/**
 * 後備估算（當 USDA 無資料時使用）
 */
function estimateNutrition(ingredients: string[]): NutritionData {
    // 基於食材數量的粗略估算
    const baseCaloriesPerIngredient = 50;
    const baseProteinPerIngredient = 3;
    const baseCarbsPerIngredient = 8;
    const baseFatPerIngredient = 2;

    return {
        calories: Math.round(ingredients.length * baseCaloriesPerIngredient),
        protein: Math.round(ingredients.length * baseProteinPerIngredient),
        carbohydrates: Math.round(ingredients.length * baseCarbsPerIngredient),
        fat: Math.round(ingredients.length * baseFatPerIngredient),
        source: 'Estimated',
        confidence: 30, // Low confidence for estimates
    };
}

/**
 * 格式化營養顯示
 */
export function formatNutrition(data: NutritionData): {
    calories: string;
    protein: string;
    carbs: string;
    fat: string;
    sourceLabel: string;
} {
    return {
        calories: `${data.calories}`,
        protein: `${data.protein}g`,
        carbs: `${data.carbohydrates}g`,
        fat: `${data.fat}g`,
        sourceLabel: data.source === 'USDA'
            ? `來源：USDA FoodData Central (${data.confidence}% 匹配)`
            : '※ AI 預估值，僅供參考',
    };
}
