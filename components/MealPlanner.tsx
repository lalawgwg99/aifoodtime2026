import React, { useState } from 'react';
import { X, Calendar, ShoppingCart, Plus, Trash2, Check, ChevronLeft, ChevronRight, Download, DollarSign } from 'lucide-react';
import { Recipe } from '../types';

interface MealPlannerProps {
    isOpen: boolean;
    onClose: () => void;
    savedRecipes: Recipe[];
}

interface PlannedMeal {
    day: number;
    mealType: 'breakfast' | 'lunch' | 'dinner';
    recipe: Recipe;
}

const DAYS = ['週一', '週二', '週三', '週四', '週五', '週六', '週日'];
const MEAL_TYPES = [
    { key: 'breakfast' as const, label: '早餐', emoji: '🌅' },
    { key: 'lunch' as const, label: '午餐', emoji: '☀️' },
    { key: 'dinner' as const, label: '晚餐', emoji: '🌙' }
];

// Estimated ingredient prices (NT$)
const INGREDIENT_PRICES: Record<string, number> = {
    '雞胸肉': 45, '牛肉': 85, '豬肉': 55, '魚': 70, '蝦': 90,
    '蛋': 8, '米': 15, '麵': 12, '洋蔥': 10, '蒜頭': 5,
    '番茄': 15, '紅蘿蔔': 10, '馬鈴薯': 12, '高麗菜': 20,
    '青椒': 12, '花椰菜': 25, '菠菜': 20, '豆腐': 18,
    '醬油': 5, '鹽': 2, '糖': 3, '油': 8, '醋': 4,
    '薑': 8, '蔥': 6, '辣椒': 5, '香菜': 10, '九層塔': 12,
    '牛奶': 35, '起司': 45, '奶油': 30, '培根': 55,
    'default': 20 // 預設價格
};

const estimateIngredientCost = (ingredient: string): number => {
    const lowerIng = ingredient.toLowerCase();
    for (const [key, price] of Object.entries(INGREDIENT_PRICES)) {
        if (lowerIng.includes(key)) return price;
    }
    return INGREDIENT_PRICES.default;
};

export const MealPlanner: React.FC<MealPlannerProps> = ({ isOpen, onClose, savedRecipes }) => {
    const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<{ day: number; mealType: 'breakfast' | 'lunch' | 'dinner' } | null>(null);
    const [showRecipeSelector, setShowRecipeSelector] = useState(false);

    const addMeal = (recipe: Recipe) => {
        if (!selectedSlot) return;
        setPlannedMeals(prev => {
            const filtered = prev.filter(m => !(m.day === selectedSlot.day && m.mealType === selectedSlot.mealType));
            return [...filtered, { ...selectedSlot, recipe }];
        });
        setShowRecipeSelector(false);
        setSelectedSlot(null);
    };

    const removeMeal = (day: number, mealType: string) => {
        setPlannedMeals(prev => prev.filter(m => !(m.day === day && m.mealType === mealType)));
    };

    const getMeal = (day: number, mealType: string) => {
        return plannedMeals.find(m => m.day === day && m.mealType === mealType);
    };

    // Calculate shopping list
    const getShoppingList = () => {
        const ingredientMap: Record<string, { count: number; cost: number }> = {};
        plannedMeals.forEach(meal => {
            meal.recipe.ingredients.forEach(ing => {
                const baseName = ing.split(/\d/)[0].trim().replace(/[,，、]/g, '');
                if (!ingredientMap[baseName]) {
                    ingredientMap[baseName] = { count: 0, cost: estimateIngredientCost(baseName) };
                }
                ingredientMap[baseName].count += 1;
            });
        });
        return Object.entries(ingredientMap).map(([name, data]) => ({
            name,
            count: data.count,
            cost: data.cost * data.count
        }));
    };

    const shoppingList = getShoppingList();
    const totalCost = shoppingList.reduce((sum, item) => sum + item.cost, 0);
    const totalCalories = plannedMeals.reduce((sum, m) => sum + (m.recipe.calories || 0), 0);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Calendar className="text-chef-gold" size={24} />
                    <h1 className="text-xl font-serif font-bold text-white">週計劃 / 購物清單</h1>
                </div>
                <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all">
                    <X size={20} />
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-stone-400 text-xs mb-1">本週餐數</p>
                        <p className="text-2xl font-bold text-white">{plannedMeals.length}<span className="text-sm text-stone-400"> / 21</span></p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-stone-400 text-xs mb-1">預估總熱量</p>
                        <p className="text-2xl font-bold text-chef-gold">{totalCalories.toLocaleString()}<span className="text-sm text-stone-400"> kcal</span></p>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-stone-400 text-xs mb-1">預估食材費</p>
                        <p className="text-2xl font-bold text-green-400">NT$ {totalCost.toLocaleString()}</p>
                    </div>
                </div>

                {/* Week Grid */}
                <div className="bg-white/5 rounded-3xl p-4 border border-white/10 mb-6 overflow-x-auto">
                    <div className="grid grid-cols-8 gap-2 min-w-[700px]">
                        {/* Header Row */}
                        <div className="p-2"></div>
                        {DAYS.map((day, i) => (
                            <div key={day} className="p-2 text-center text-sm font-bold text-white bg-white/5 rounded-lg">{day}</div>
                        ))}

                        {/* Meal Rows */}
                        {MEAL_TYPES.map(({ key, label, emoji }) => (
                            <React.Fragment key={key}>
                                <div className="p-2 text-sm font-bold text-stone-400 flex items-center gap-1">
                                    <span>{emoji}</span> {label}
                                </div>
                                {DAYS.map((_, dayIndex) => {
                                    const meal = getMeal(dayIndex, key);
                                    return (
                                        <div
                                            key={`${dayIndex}-${key}`}
                                            onClick={() => { setSelectedSlot({ day: dayIndex, mealType: key }); setShowRecipeSelector(true); }}
                                            className={`p-2 rounded-xl min-h-[80px] cursor-pointer transition-all ${meal
                                                ? 'bg-chef-gold/20 border border-chef-gold/30 hover:bg-chef-gold/30'
                                                : 'bg-white/5 border border-dashed border-white/10 hover:border-chef-gold/50 hover:bg-white/10'
                                                }`}
                                        >
                                            {meal ? (
                                                <div className="relative group">
                                                    <p className="text-xs font-bold text-white truncate">{meal.recipe.name}</p>
                                                    <p className="text-[10px] text-stone-400">{meal.recipe.calories} kcal</p>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeMeal(dayIndex, key); }}
                                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="h-full flex items-center justify-center">
                                                    <Plus size={16} className="text-stone-500" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Shopping List */}
                <div className="bg-white/5 rounded-3xl p-6 border border-white/10">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-white flex items-center gap-2">
                            <ShoppingCart className="text-chef-gold" size={20} />
                            購物清單
                        </h2>
                        <button className="px-4 py-2 bg-chef-gold text-black font-bold rounded-full text-sm flex items-center gap-2 hover:bg-white transition-colors">
                            <Download size={16} /> 匯出清單
                        </button>
                    </div>

                    {shoppingList.length === 0 ? (
                        <p className="text-stone-400 text-center py-8">尚未規劃任何餐點，請先在上方日曆添加食譜</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {shoppingList.map((item, i) => (
                                <div key={i} className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Check size={14} className="text-green-400" />
                                        <span className="text-white text-sm">{item.name}</span>
                                        {item.count > 1 && <span className="text-xs text-stone-400">x{item.count}</span>}
                                    </div>
                                    <span className="text-chef-gold text-sm font-bold">${item.cost}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {shoppingList.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                            <span className="text-stone-400">總計</span>
                            <span className="text-2xl font-bold text-green-400">NT$ {totalCost.toLocaleString()}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Recipe Selector Modal */}
            {showRecipeSelector && (
                <div className="fixed inset-0 z-[110] bg-black/80 flex items-center justify-center p-4">
                    <div className="bg-[#1A1A1A] rounded-3xl max-w-md w-full max-h-[70vh] overflow-hidden border border-white/10">
                        <div className="p-4 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-white">選擇食譜</h3>
                            <button onClick={() => setShowRecipeSelector(false)} className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto max-h-[50vh]">
                            {savedRecipes.length === 0 ? (
                                <p className="text-stone-400 text-center py-8">尚無收藏的食譜。請先收藏一些食譜！</p>
                            ) : (
                                <div className="space-y-2">
                                    {savedRecipes.map((recipe, i) => (
                                        <button
                                            key={i}
                                            onClick={() => addMeal(recipe)}
                                            className="w-full p-4 bg-white/5 rounded-xl hover:bg-chef-gold/20 transition-all text-left flex justify-between items-center"
                                        >
                                            <div>
                                                <p className="font-bold text-white">{recipe.name}</p>
                                                <p className="text-xs text-stone-400">{recipe.calories} kcal · {recipe.timeMinutes} 分鐘</p>
                                            </div>
                                            <Plus size={20} className="text-chef-gold" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
