
import React, { useRef, useState, useEffect } from 'react';
import {
  Search, Camera, X, Info, ChefHat,
  Leaf, Zap, Activity, Heart, Coins, Coffee, Utensils,
  Compass, Flame, Wine, Moon, Users, Briefcase, Dumbbell, Star,
  Carrot, Waves, Tent, PartyPopper, Trees, Apple
} from 'lucide-react';
import { DietaryGoal, Cuisine, SearchState, MealOccasion } from '../types';

interface HeroProps {
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  onSearch: () => void;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
}

const FilterPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode
}> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-5 py-3 md:px-5 md:py-3 rounded-full text-sm md:text-sm font-bold uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 whitespace-nowrap snap-center ${active
      ? 'bg-chef-black text-white border-chef-black shadow-premium scale-105 z-10'
      : 'bg-white text-stone-500 border-stone-200 hover:border-chef-gold/30 hover:text-chef-black hover:bg-chef-cream/30'
      }`}
  >
    {icon && <span className={`${active ? 'text-chef-gold' : 'text-stone-300'}`}>{icon}</span>}
    {label}
  </button>
);

const IngredientTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="flex items-center gap-1.5 md:gap-2 bg-chef-gold/10 text-chef-accent border border-chef-gold/20 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-sm md:text-base font-bold animate-fadeInUp shadow-sm whitespace-nowrap">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:text-red-500 transition-colors p-0.5">
      <X size={12} />
    </button>
  </div>
);

const PLACEHOLDER_EXAMPLES = [
  "我冰箱有：雞蛋、豆腐、高麗菜",
  "15 分鐘完成的台式晚餐",
  "低脂、高蛋白、適合減脂期",
  "只有氣炸鍋能用",
  "想吃古早味、療癒系料理",
  "滷肉飯、蚵仔煎等台灣小吃",
];

export const Hero: React.FC<HeroProps> = ({ searchState, setSearchState, onSearch, isLoading, onImageUpload }) => {
  const [inputValue, setInputValue] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Placeholder rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDER_EXAMPLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const GoalConfig: Record<DietaryGoal, { label: string, icon: React.ReactNode }> = {
    [DietaryGoal.BALANCED]: { label: '均衡健康', icon: <Activity size={14} /> },
    [DietaryGoal.WEIGHT_LOSS]: { label: '減脂輕食', icon: <Leaf size={14} /> },
    [DietaryGoal.MUSCLE_GAIN]: { label: '增肌高蛋', icon: <Dumbbell size={14} /> },
    [DietaryGoal.QUICK]: { label: '15分鐘快手', icon: <Zap size={14} /> },
    [DietaryGoal.BUDGET]: { label: '省錢料理', icon: <Coins size={14} /> },
    [DietaryGoal.COMFORT]: { label: '療癒暖胃', icon: <Heart size={14} /> },
    [DietaryGoal.KETO]: { label: '低碳生酮', icon: <Flame size={14} /> },
    [DietaryGoal.VEGAN]: { label: '純植物性', icon: <Carrot size={14} /> },
    [DietaryGoal.HIGH_FIBER]: { label: '高纖排毒', icon: <Waves size={14} /> },
    [DietaryGoal.LOW_SODIUM]: { label: '低卡低鈉', icon: <Apple size={14} /> }
  };

  const OccasionConfig: Record<MealOccasion, { label: string, icon: React.ReactNode }> = {
    [MealOccasion.DATE]: { label: '浪漫約會', icon: <Wine size={14} /> },
    [MealOccasion.SOLO]: { label: '一人獨享', icon: <Coffee size={14} /> },
    [MealOccasion.FAMILY]: { label: '家庭聚餐', icon: <Users size={14} /> },
    [MealOccasion.WORK]: { label: '效率午餐', icon: <Briefcase size={14} /> },
    [MealOccasion.LATE_NIGHT]: { label: '深夜食堂', icon: <Moon size={14} /> },
    [MealOccasion.FITNESS]: { label: '運動補給', icon: <Dumbbell size={14} /> },
    [MealOccasion.PARTY]: { label: '派對狂歡', icon: <PartyPopper size={14} /> },
    [MealOccasion.PICNIC]: { label: '戶外野餐', icon: <Trees size={14} /> },
    [MealOccasion.CAMPING]: { label: '露營野炊', icon: <Tent size={14} /> },
    [MealOccasion.FESTIVAL]: { label: '節慶盛宴', icon: <Star size={14} /> }
  };

  const CuisineConfig: Record<Exclude<Cuisine, Cuisine.ANY>, { label: string, icon: React.ReactNode }> = {
    [Cuisine.TAIWANESE]: { label: '台式經典', icon: <Utensils size={14} /> },
    [Cuisine.JAPANESE]: { label: '精緻日式', icon: <Star size={14} /> },
    [Cuisine.ITALIAN]: { label: '道地義式', icon: <Flame size={14} /> },
    [Cuisine.CHINESE]: { label: '中式私廚', icon: <Compass size={14} /> },
    [Cuisine.WESTERN]: { label: '西式餐酒', icon: <Wine size={14} /> },
    [Cuisine.THAI]: { label: '泰式辛香', icon: <Zap size={14} /> },
    [Cuisine.FRENCH]: { label: '法式優雅', icon: <ChefHat size={14} /> },
    [Cuisine.KOREAN]: { label: '韓式風味', icon: <Utensils size={14} /> },
    [Cuisine.VIETNAMESE]: { label: '越式清爽', icon: <Waves size={14} /> },
    [Cuisine.INDIAN]: { label: '印度咖哩', icon: <Compass size={14} /> },
    [Cuisine.MEXICAN]: { label: '墨西哥風', icon: <Flame size={14} /> },
    [Cuisine.AMERICAN]: { label: '美式豪邁', icon: <Utensils size={14} /> }
  };

  const addIngredient = (val: string) => {
    const trimmed = val.trim();
    if (trimmed && !searchState.ingredients.includes(trimmed)) {
      setSearchState(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, trimmed]
      }));
    }
    setInputValue('');
  };

  const removeIngredient = (index: number) => {
    setSearchState(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (inputValue) {
        addIngredient(inputValue);
      } else if (searchState.ingredients.length > 0 || searchState.goal || searchState.occasion) {
        onSearch();
      }
    } else if (e.key === 'Backspace' && !inputValue && searchState.ingredients.length > 0) {
      removeIngredient(searchState.ingredients.length - 1);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-0">
      {/* No card wrapper - content directly on background */}
      <div className="relative overflow-hidden">

        {/* Search Bar / Tag Input */}
        <div className="relative group bg-white md:bg-chef-cream rounded-2xl md:rounded-[2.5rem] p-4 md:p-4 shadow-lg md:shadow-inner border border-stone-200 md:border-stone-200/50 focus-within:ring-2 md:focus-within:ring-4 focus-within:ring-chef-gold/20 transition-all">
          {searchState.ingredients.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-2 px-2 min-h-[30px] md:min-h-[40px] max-h-[100px] overflow-y-auto no-scrollbar">
              {searchState.ingredients.map((ing, idx) => (
                <IngredientTag key={idx} label={ing} onRemove={() => removeIngredient(idx)} />
              ))}
            </div>
          )}

          <div className="flex items-center">
            <div className="pl-3 md:pl-6 flex items-center shrink-0">
              <Search className="h-5 w-5 md:h-6 md:w-6 text-stone-500 group-focus-within:text-chef-gold transition-all" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 pl-3 pr-2 py-2 md:pl-5 md:pr-4 md:py-3 bg-transparent text-base md:text-2xl text-chef-black placeholder-stone-400 focus:outline-none font-serif tracking-tight min-w-0"
              placeholder={searchState.ingredients.length === 0 ? PLACEHOLDER_EXAMPLES[placeholderIndex] : "還有其他食材？"}
            />

            <div className="flex items-center gap-2 pr-2 md:pr-4 shrink-0 relative group/photo">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-3 md:p-4 rounded-xl md:rounded-full bg-chef-gold/10 hover:bg-chef-gold text-chef-gold hover:text-white shadow-sm border border-chef-gold/20 transition-all duration-300 active:scale-90 flex items-center justify-center"
                title="📸 拍照辨識食材"
              >
                <Camera size={20} className="md:w-[22px] md:h-[22px]" />
              </button>
              {/* Tooltip */}
              <div className="absolute right-0 top-full mt-2 bg-chef-black text-white text-xs p-3 rounded-xl shadow-lg opacity-0 invisible group-hover/photo:opacity-100 group-hover/photo:visible transition-all duration-200 w-48 z-50 hidden md:block">
                <p className="font-bold mb-1">📸 智慧拍照辨識</p>
                <p className="text-stone-400 text-[10px] leading-relaxed">拍下冰箱食材或餐廳料理，AI 自動辨識並生成專屬食譜</p>
              </div>
            </div>
          </div>
        </div>

        {/* Input Helper Text */}
        <div className="mt-4 flex items-center justify-center gap-2 text-stone-500 animate-fadeIn">
          <Info size={14} />
          <span className="text-sm font-medium tracking-wide">輸入食材自動辨識同義詞</span>
        </div>

        {/* Filters Grouped by Context - Mobile Optimized Horizontal Scroll */}
        <div className="mt-8 md:mt-12 space-y-8 md:space-y-12">

          {/* Section 1: Occasions (Emotional Context) */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 px-1">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-chef-gold">靈魂用餐情境</span>
              <div className="h-px bg-stone-100 flex-1"></div>
            </div>
            {/* Horizontal Scroll Container */}
            <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 md:mx-0 md:px-0 gap-3 md:flex-wrap snap-x">
              {Object.entries(OccasionConfig).map(([key, config]) => (
                <FilterPill
                  key={key}
                  label={config.label}
                  icon={config.icon}
                  active={searchState.occasion === key}
                  onClick={() => setSearchState(prev => ({ ...prev, occasion: prev.occasion === key ? null : (key as MealOccasion) }))}
                />
              ))}
            </div>
          </div>

          {/* Section 2: Goals (Health Context) */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 px-1">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-chef-gold">核心營養目標</span>
              <div className="h-px bg-stone-100 flex-1"></div>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 md:mx-0 md:px-0 gap-3 md:flex-wrap snap-x">
              {Object.entries(GoalConfig).map(([key, config]) => (
                <FilterPill
                  key={key}
                  label={config.label}
                  icon={config.icon}
                  active={searchState.goal === key}
                  onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === key ? null : (key as DietaryGoal) }))}
                />
              ))}
            </div>
          </div>

          {/* Section 3: Cuisines (Taste Context) */}
          <div className="space-y-4 md:space-y-6">
            <div className="flex items-center gap-4 px-1">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-chef-gold">偏好料理風味</span>
              <div className="h-px bg-stone-100 flex-1"></div>
            </div>
            <div className="flex overflow-x-auto no-scrollbar pb-2 -mx-5 px-5 md:mx-0 md:px-0 gap-3 md:flex-wrap snap-x">
              {Object.entries(CuisineConfig).map(([key, config]) => (
                <FilterPill
                  key={key}
                  label={config.label}
                  icon={config.icon}
                  active={searchState.cuisine === key}
                  onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === key ? Cuisine.ANY : (key as Cuisine) }))}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main CTA */}
        <div className="mt-10 md:mt-16">
          <button
            onClick={onSearch}
            disabled={isLoading || (searchState.ingredients.length === 0 && !searchState.goal && !searchState.occasion)}
            className={`w-full py-5 md:py-7 rounded-[1.5rem] md:rounded-[2rem] relative overflow-hidden group transition-all duration-700 ${isLoading || (searchState.ingredients.length === 0 && !searchState.goal && !searchState.occasion)
              ? 'bg-stone-100 text-stone-400 cursor-not-allowed border border-stone-200'
              : 'bg-chef-black text-white hover:shadow-floating hover:-translate-y-1 active:translate-y-0 shadow-premium'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-chef-gold/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative z-10 flex items-center justify-center gap-3 md:gap-4 text-lg md:text-xl font-black tracking-widest uppercase">
              {isLoading ? '主廚正在編排...' : '解鎖米其林食譜'}
              {!isLoading && <ChefHat size={20} className="md:w-[24px] md:h-[24px] text-chef-gold group-hover:rotate-12 transition-transform" />}
            </span>
          </button>
        </div>
      </div>

      {/* Social Verification */}
      <div className="mt-8 md:mt-12 flex flex-col items-center gap-4 md:gap-5 animate-fadeIn">
        <div className="flex -space-x-3 md:-space-x-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <img key={i} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-[3px] md:border-4 border-chef-paper shadow-premium hover:z-10 hover:scale-110 transition-transform cursor-pointer" src={`https://i.pravatar.cc/150?img=${i + 35}`} alt="User" />
          ))}
        </div>
        <p className="text-sm md:text-base text-stone-500 font-medium tracking-tight px-4 text-center">
          與 <span className="text-chef-black font-black underline decoration-chef-gold underline-offset-4">12,400+</span> 位生活家探索美味。
        </p>
      </div>
    </div>
  );
};
