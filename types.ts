import { Recipe as RecipeType } from './schemas/recipe';

export enum DietaryGoal {
  BALANCED = 'Balanced',
  WEIGHT_LOSS = 'Weight Loss',
  MUSCLE_GAIN = 'Muscle Gain',
  QUICK = 'Quick & Easy',
  BUDGET = 'Budget Friendly',
  COMFORT = 'Comfort Food',
  KETO = 'Keto Friendly',
  VEGAN = 'Plant Based',
  HIGH_FIBER = 'High Fiber',
  LOW_SODIUM = 'Low Sodium'
}

export enum Cuisine {
  ANY = 'Any',
  JAPANESE = 'Japanese',
  TAIWANESE = 'Taiwanese',
  ITALIAN = 'Italian',
  WESTERN = 'Western',
  CHINESE = 'Chinese',
  THAI = 'Thai',
  FRENCH = 'French',
  KOREAN = 'Korean',
  VIETNAMESE = 'Vietnamese',
  INDIAN = 'Indian',
  MEXICAN = 'Mexican',
  AMERICAN = 'American'
}

export enum MealOccasion {
  DATE = 'Date Night',
  SOLO = 'Solo Dining',
  FAMILY = 'Family Party',
  WORK = 'Work Lunch',
  LATE_NIGHT = 'Late Night',
  FITNESS = 'After Workout',
  PARTY = 'Party Vibes',
  PICNIC = 'Picnic Day',
  CAMPING = 'Outdoor Camping',
  FESTIVAL = 'Festival Feast'
}

export interface UserStats {
  totalRecipes: number;
  averageSoulScore: number;
  tasteDNA: { label: string; value: number }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  level: string;
  stats: UserStats;
  isAdmin?: boolean; // Super Admin Flag
}

export interface MarketTrend {
  title: string;
  popularity: number;
  description: string;
  tag: string;
}

export interface TrendReport {
  seasonTitle: string;
  topIngredients: string[];
  platingTrend: string;
  globalInsight: string;
  marketTrends: MarketTrend[];
}

// Re-export Recipe from Single Source of Truth
export type Recipe = RecipeType;

export interface SearchState {
  ingredients: string[];
  goal: DietaryGoal | null;
  cuisine: Cuisine;
  occasion: MealOccasion | null;
  mealTime: any;
}

export enum VisionMode {
  TASTE_THIEF = 'Taste Thief', // Dining Mode (Dish Analysis)
  FRIDGE_XRAY = 'Fridge X-Ray', // Cooking Mode (Recipe Gen)
  NUTRI_SCANNER = 'Nutri-Scanner' // Health Mode (Health Score)
}

export interface DishAnalysis {
  name: string;
  description: string;
  ingredients: string[];
  calories: number;
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  allergens: string[];
  flavorProfile: string; // e.g. "Umami-rich, Savory, Spicy"
  chefComment: string; // "This looks like a sous-vide prepared steak..."
}

export interface HealthInsight {
  name: string;
  calories: number;
  healthScore: number; // 0-100
  trafficLight: 'Green' | 'Yellow' | 'Red';
  macros: {
    protein: string;
    carbs: string;
    fat: string;
  };
  positiveNutrients: string[];
  negativeNutrients: string[];
  dietitianAdvice: string; // "High in sodium, suggest pairing with wate..."
}

export type VisionResult =
  | { mode: VisionMode.FRIDGE_XRAY; data: Recipe[] }
  | { mode: VisionMode.TASTE_THIEF; data: DishAnalysis }
  | { mode: VisionMode.NUTRI_SCANNER; data: HealthInsight };

export interface NutritionAnalysis {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  healthScore: number;
  summary: string;
}

export interface ChefVerdict {
  score: number;
  critique: string;
  platingTip: string;
  badge: string;
  shareText: string;
  comparisonData: {
    visual: number;
    creativity: number;
    technique: number;
    proVisual: number;
    proCreativity: number;
    proTechnique: number;
  };
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  timestamp: number;
}
