import React, { useState, useRef } from 'react';
import { X, Calendar, ShoppingCart, Plus, Check, Download, ChefHat, Flame, Clock, Printer, FileText } from 'lucide-react';
import { Recipe } from '../types';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
    'default': 20
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
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const printRef = useRef<HTMLDivElement>(null);

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
    const avgCaloriesPerDay = plannedMeals.length > 0 ? Math.round(totalCalories / 7) : 0;

    // Calculate macros breakdown
    const totalProtein = plannedMeals.reduce((sum, m) => sum + parseInt(m.recipe.macros?.protein || '0'), 0);
    const totalCarbs = plannedMeals.reduce((sum, m) => sum + parseInt(m.recipe.macros?.carbs || '0'), 0);
    const totalFat = plannedMeals.reduce((sum, m) => sum + parseInt(m.recipe.macros?.fat || '0'), 0);

    const generatePDF = async () => {
        if (!printRef.current || plannedMeals.length === 0) return;
        setIsGeneratingPDF(true);

        try {
            const canvas = await html2canvas(printRef.current, {
                scale: 2,
                backgroundColor: '#1A1A1A',
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

            const today = new Date().toISOString().split('T')[0];
            pdf.save(`饗味食光_一週菜單_${today}.pdf`);
        } catch (error) {
            console.error('PDF generation failed:', error);
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Calendar className="text-chef-gold" size={24} />
                    <h1 className="text-xl font-serif font-bold text-white">週計劃 / 購物清單</h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={generatePDF}
                        disabled={isGeneratingPDF || plannedMeals.length === 0}
                        className="px-4 py-2 bg-gradient-to-r from-chef-gold to-amber-500 text-black font-bold rounded-full text-sm flex items-center gap-2 hover:from-amber-400 hover:to-chef-gold transition-all disabled:opacity-30 shadow-lg"
                    >
                        {isGeneratingPDF ? (
                            <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        ) : (
                            <FileText size={16} />
                        )}
                        {isGeneratingPDF ? '生成中...' : '下載精美 PDF'}
                    </button>
                    <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-6">
                {/* Stats Bar */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gradient-to-br from-white/10 to-white/5 rounded-2xl p-4 border border-white/10">
                        <p className="text-stone-400 text-xs mb-1">本週餐數</p>
                        <p className="text-2xl font-bold text-white">{plannedMeals.length}<span className="text-sm text-stone-400"> / 21</span></p>
                    </div>
                    <div className="bg-gradient-to-br from-chef-gold/20 to-chef-gold/5 rounded-2xl p-4 border border-chef-gold/20">
                        <p className="text-stone-400 text-xs mb-1">預估總熱量</p>
                        <p className="text-2xl font-bold text-chef-gold">{totalCalories.toLocaleString()}<span className="text-sm text-stone-400"> kcal</span></p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 rounded-2xl p-4 border border-blue-500/20">
                        <p className="text-stone-400 text-xs mb-1">日均熱量</p>
                        <p className="text-2xl font-bold text-blue-400">{avgCaloriesPerDay}<span className="text-sm text-stone-400"> kcal/日</span></p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/20 to-green-500/5 rounded-2xl p-4 border border-green-500/20">
                        <p className="text-stone-400 text-xs mb-1">預估食材費</p>
                        <p className="text-2xl font-bold text-green-400">NT$ {totalCost.toLocaleString()}</p>
                    </div>
                </div>

                {/* Week Grid */}
                <div className="bg-white/5 rounded-3xl p-4 border border-white/10 mb-6 overflow-x-auto">
                    <div className="grid grid-cols-8 gap-2 min-w-[700px]">
                        <div className="p-2"></div>
                        {DAYS.map((day) => (
                            <div key={day} className="p-2 text-center text-sm font-bold text-white bg-white/5 rounded-lg">{day}</div>
                        ))}

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

            {/* ========== PRINTABLE PDF SECTION (Hidden but rendered for capture) ========== */}
            <div ref={printRef} className="absolute left-[-9999px] top-0 w-[800px] bg-[#1A1A1A] p-8">
                {/* Premium Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-chef-gold">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-chef-gold rounded-2xl flex items-center justify-center">
                            <ChefHat size={32} className="text-black" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-white">饗味食光</h1>
                            <p className="text-chef-gold font-serif italic">您的專屬一週菜單</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-stone-400 text-sm">Generated by CookLabAI</p>
                        <p className="text-white font-bold">{new Date().toLocaleDateString('zh-TW')}</p>
                    </div>
                </div>

                {/* Stats Cards Row */}
                <div className="grid grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-chef-gold/30 to-chef-gold/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-chef-gold">{plannedMeals.length}</p>
                        <p className="text-xs text-stone-300">規劃餐數</p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500/30 to-orange-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-orange-400">{totalCalories.toLocaleString()}</p>
                        <p className="text-xs text-stone-300">總熱量 kcal</p>
                    </div>
                    <div className="bg-gradient-to-br from-blue-500/30 to-blue-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-blue-400">{avgCaloriesPerDay}</p>
                        <p className="text-xs text-stone-300">日均 kcal</p>
                    </div>
                    <div className="bg-gradient-to-br from-green-500/30 to-green-500/10 rounded-xl p-4 text-center">
                        <p className="text-3xl font-bold text-green-400">NT${totalCost}</p>
                        <p className="text-xs text-stone-300">預估食材費</p>
                    </div>
                </div>

                {/* Nutrition Breakdown (Visual Bar Chart) */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Flame className="text-chef-gold" size={20} />
                        營養素分佈
                    </h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm text-stone-300">蛋白質</span>
                            <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-red-500 to-red-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.min(100, (totalProtein / (totalProtein + totalCarbs + totalFat)) * 100 || 33)}%` }}>
                                    <span className="text-xs font-bold text-white">{totalProtein}g</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm text-stone-300">碳水</span>
                            <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.min(100, (totalCarbs / (totalProtein + totalCarbs + totalFat)) * 100 || 33)}%` }}>
                                    <span className="text-xs font-bold text-white">{totalCarbs}g</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="w-16 text-sm text-stone-300">脂肪</span>
                            <div className="flex-1 bg-white/10 rounded-full h-6 overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-purple-500 to-purple-400 rounded-full flex items-center justify-end pr-2" style={{ width: `${Math.min(100, (totalFat / (totalProtein + totalCarbs + totalFat)) * 100 || 33)}%` }}>
                                    <span className="text-xs font-bold text-white">{totalFat}g</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Menu Table */}
                <div className="bg-white/5 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Calendar className="text-chef-gold" size={20} />
                        一週菜單總覽
                    </h3>
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/10">
                                <th className="p-2 text-left text-stone-400"></th>
                                {DAYS.map(d => <th key={d} className="p-2 text-center text-white font-bold">{d}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {MEAL_TYPES.map(({ key, label, emoji }) => (
                                <tr key={key} className="border-b border-white/5">
                                    <td className="p-2 text-stone-300">{emoji} {label}</td>
                                    {DAYS.map((_, i) => {
                                        const meal = getMeal(i, key);
                                        return (
                                            <td key={i} className="p-2 text-center">
                                                {meal ? (
                                                    <div className="bg-chef-gold/20 rounded-lg p-1">
                                                        <p className="text-xs font-bold text-white truncate">{meal.recipe.name}</p>
                                                        <p className="text-[10px] text-stone-400">{meal.recipe.calories} kcal</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-stone-600">-</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Shopping List */}
                <div className="bg-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ShoppingCart className="text-chef-gold" size={20} />
                        購物清單
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                        {shoppingList.map((item, i) => (
                            <div key={i} className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2">
                                <div className="flex items-center gap-2">
                                    <Check size={12} className="text-green-400" />
                                    <span className="text-white text-sm">{item.name}</span>
                                </div>
                                <span className="text-chef-gold text-sm font-bold">${item.cost}</span>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                        <span className="text-stone-400">購物預算總計</span>
                        <span className="text-xl font-bold text-green-400">NT$ {totalCost.toLocaleString()}</span>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-stone-500 text-xs">© 2026 饗味食光 CookLabAI — cooklabai.com</p>
                    <p className="text-stone-600 text-xs mt-1">此菜單由 AI 智慧生成，營養數據僅供參考</p>
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
