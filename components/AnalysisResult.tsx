
import React from 'react';
import { DishAnalysis, HealthInsight, VisionMode, VisionResult } from '../types';
import { Check, AlertTriangle, Droplet, Flame, Wheat, Activity, ChefHat } from 'lucide-react';

interface AnalysisResultProps {
    result: VisionResult;
    onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
    if (result.mode === VisionMode.FRIDGE_XRAY) return null; // Should be handled by RecipeCard

    const isDish = result.mode === VisionMode.TASTE_THIEF;
    const data = result.data as DishAnalysis | HealthInsight;

    return (
        <div className="max-w-4xl mx-auto p-6 animate-fadeIn">

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${isDish ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'
                            }`}>
                            {isDish ? '食客模式 • 料理拆解' : '營養師模式 • 健康評估'}
                        </span>
                    </div>
                    <h2 className="text-4xl font-serif font-bold text-stone-800">{data.name}</h2>
                    {isDish && <p className="text-stone-500 mt-2">{(data as DishAnalysis).description}</p>}
                </div>
                <button onClick={onReset} className="px-4 py-2 rounded-full border border-stone-200 text-xs font-bold hover:bg-stone-50 transition-all">
                    重新掃描
                </button>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Main Stats Block */}
                <div className="md:col-span-2 p-8 rounded-[2rem] bg-stone-900 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-chef-gold/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-1">Total Energy</div>
                                <div className="text-5xl font-black font-sans">{data.calories} <span className="text-lg font-normal text-stone-400">kcal</span></div>
                            </div>
                            {!isDish && (
                                <div className={`px-4 py-2 rounded-xl text-xl font-bold ${(data as HealthInsight).trafficLight === 'Green' ? 'bg-green-500/20 text-green-400' :
                                        (data as HealthInsight).trafficLight === 'Red' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                                    }`}>
                                    {(data as HealthInsight).healthScore} 分
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8">
                            <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
                                <div className="text-stone-400 text-xs font-bold uppercase mb-1">Protein</div>
                                <div className="text-xl font-bold">{data.macros.protein}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
                                <div className="text-stone-400 text-xs font-bold uppercase mb-1">Carbs</div>
                                <div className="text-xl font-bold">{data.macros.carbs}</div>
                            </div>
                            <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm">
                                <div className="text-stone-400 text-xs font-bold uppercase mb-1">Fat</div>
                                <div className="text-xl font-bold">{data.macros.fat}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                    {/* Chef/Dietitian Comment */}
                    <div className={`h-full p-6 rounded-[2rem] border ${isDish ? 'bg-orange-50 border-orange-100' : 'bg-green-50 border-green-100'}`}>
                        <div className="flex items-center gap-2 mb-3">
                            {isDish ? <ChefHat size={18} className="text-orange-600" /> : <Activity size={18} className="text-green-600" />}
                            <span className={`text-xs font-bold uppercase tracking-wider ${isDish ? 'text-orange-600' : 'text-green-600'}`}>
                                {isDish ? '主廚點評' : '營養師建議'}
                            </span>
                        </div>
                        <p className="text-stone-700 text-sm leading-relaxed font-medium">
                            {isDish ? (data as DishAnalysis).chefComment : (data as HealthInsight).dietitianAdvice}
                        </p>
                    </div>
                </div>

                {/* Bottom Row */}
                {isDish ? (
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
                            <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Ingredients</div>
                            <div className="flex flex-wrap gap-2">
                                {(data as DishAnalysis).ingredients.map(ing => (
                                    <span key={ing} className="px-3 py-1.5 bg-stone-100 text-stone-600 rounded-lg text-sm font-bold">
                                        {ing}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
                            <div className="text-stone-400 text-xs font-bold uppercase tracking-widest mb-4">Flavor & Allergens</div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-stone-700">
                                    <Flame size={16} className="text-orange-500" />
                                    <span className="font-bold">風味：</span>
                                    <span>{(data as DishAnalysis).flavorProfile}</span>
                                </div>
                                {(data as DishAnalysis).allergens.length > 0 && (
                                    <div className="flex items-center gap-2 text-stone-700">
                                        <AlertTriangle size={16} className="text-red-500" />
                                        <span className="font-bold">過敏原：</span>
                                        <span className="text-red-600">{(data as DishAnalysis).allergens.join(', ')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-6 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
                            <div className="text-green-600 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Check size={14} /> Positives
                            </div>
                            <ul className="space-y-2">
                                {(data as HealthInsight).positiveNutrients.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-stone-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-white border border-stone-100 shadow-sm">
                            <div className="text-red-500 text-xs font-bold uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangle size={14} /> Watch Out
                            </div>
                            <ul className="space-y-2">
                                {(data as HealthInsight).negativeNutrients.map((item, idx) => (
                                    <li key={idx} className="flex items-center gap-2 text-stone-600 text-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};
