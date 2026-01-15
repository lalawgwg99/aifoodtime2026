
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

export interface Recipe {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  matchReason: string;
  calories: number;
  timeMinutes: number;
  tags: string[];
  ingredients: string[];
  instructions: string[];
  imageUrl?: string;
  author?: string;
  authorAvatar?: string;
  likes?: number;
  isUserCreated?: boolean;
  isPublic?: boolean;
  // New Nutrition Data
  macros?: {
    protein: string;
    carbs: string;
    fat: string;
  };
  healthTip?: string;
}

export interface SearchState {
  ingredients: string[];
  goal: DietaryGoal | null;
  cuisine: Cuisine;
  occasion: MealOccasion | null;
  mealTime: any;
}

export enum VisionMode {
  TASTE_THIEF = 'Taste Thief',
  FRIDGE_XRAY = 'Fridge X-Ray',
  NUTRI_SCANNER = 'Nutri-Scanner'
}

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
