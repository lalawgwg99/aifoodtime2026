
import React, { useRef, useState, useEffect } from 'react';
import {
  Search, Camera, X, Info, ChefHat,
  Leaf, Zap, Activity, Heart, Coins, Coffee, Utensils,
  Compass, Flame, Wine, Moon, Users, Briefcase, Dumbbell, Star,
  Carrot, Waves, Tent, PartyPopper, Trees, Apple,
  ArrowRight, ChevronDown, ChevronUp, TrendingUp, Globe, Clock, SlidersHorizontal, Lightbulb
} from 'lucide-react';
import { DietaryGoal, Cuisine, SearchState, MealOccasion } from '../types';

interface HeroProps {
  searchState: SearchState;
  setSearchState: React.Dispatch<React.SetStateAction<SearchState>>;
  onSearch: (pendingIngredient?: string) => void;
  isLoading: boolean;
  onImageUpload: (file: File) => void;
  onOpenSmartVision?: () => void;
}


const FilterPill: React.FC<{
  label: string;
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 transition-all duration-200 flex items-center justify-center snap-center flex-row gap-2 px-0 pb-1 text-xs font-medium uppercase tracking-[0.2em] whitespace-nowrap border-b-2 ${active
      ? 'border-stone-900 text-stone-900'
      : 'border-transparent text-stone-400 hover:text-stone-700 hover:border-stone-300'
      }`}
  >
    {icon && <span className="opacity-50">{icon}</span>}
    <span>{label}</span>
  </button>
);

const IngredientTag: React.FC<{ label: string; onRemove: () => void }> = ({ label, onRemove }) => (
  <div className="flex items-center gap-1.5 bg-orange-50 text-orange-700 border border-orange-200 px-4 py-2 rounded-xl text-base font-bold animate-fadeInUp shadow-sm whitespace-nowrap">
    <span>{label}</span>
    <button onClick={onRemove} className="hover:text-red-500 transition-colors p-0.5">
      <X size={14} />
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

const TAIWAN_SNACKS_DATA = [
  { icon: '🍚', label: '滷肉飯', sub: '南部 vs 北部', keyword: '滷肉飯' },
  { icon: '🦪', label: '蚵仔煎', sub: '夜市經典', keyword: '蚵仔煎' },
  { icon: '🍜', label: '大腸麵線', sub: '台北招牌', keyword: '大腸麵線' },
  { icon: '🥟', label: '肉圓', sub: '彰化名產', keyword: '肉圓' },
  { icon: '🧋', label: '珍珠奶茶', sub: '全球風靡', keyword: '珍珠奶茶' },
  { icon: '🍗', label: '大雞排', sub: '罪惡宵夜', keyword: '雞排' },
  { icon: '🧀', label: '臭豆腐', sub: '獨特風味', keyword: '臭豆腐' },
  { icon: '🥩', label: '牛肉麵', sub: '台灣之光', keyword: '牛肉麵' },
  { icon: '🥢', label: '小籠包', sub: '皮薄多汁', keyword: '小籠包' },
  { icon: '🍔', label: '刈包', sub: '台式漢堡', keyword: '刈包' },
  { icon: '🥞', label: '蔥油餅', sub: '酥脆口感', keyword: '蔥油餅' },
  { icon: '🍍', label: '鳳梨酥', sub: '必買伴手', keyword: '鳳梨酥' },
  { icon: '🍧', label: '芒果冰', sub: '夏日限定', keyword: '芒果冰' },
  { icon: '🥚', label: '滷味', sub: '下酒良伴', keyword: '滷味' },
  { icon: '🍗', label: '鹽酥雞', sub: '追劇必備', keyword: '鹽酥雞' },
  { icon: '🍞', label: '棺材板', sub: '台南特色', keyword: '棺材板' },
  { icon: '🌯', label: '潤餅', sub: '清爽首選', keyword: '潤餅' },
  { icon: '🍜', label: '擔仔麵', sub: '度小月', keyword: '擔仔麵' },
  { icon: '🍚', label: '碗粿', sub: '滑嫩口感', keyword: '碗粿' },
  { icon: '🥚', label: '鐵蛋', sub: '淡水名產', keyword: '鐵蛋' },
];

// Configuration for filters
const GoalConfig: Record<DietaryGoal, { label: string; icon: React.ReactNode }> = {
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

const OccasionConfig: Record<MealOccasion, { label: string; icon: React.ReactNode }> = {
  [MealOccasion.DATE]: { label: '浪漫約會', icon: <Heart size={14} /> },
  [MealOccasion.SOLO]: { label: '一人獨享', icon: <Coffee size={14} /> },
  [MealOccasion.FAMILY]: { label: '家庭聚餐', icon: <Users size={14} /> },
  [MealOccasion.WORK]: { label: '效率午餐', icon: <Briefcase size={14} /> },
  [MealOccasion.LATE_NIGHT]: { label: '深夜食堂', icon: <Flame size={14} /> },
  [MealOccasion.FITNESS]: { label: '運動補給', icon: <Dumbbell size={14} /> },
  [MealOccasion.PARTY]: { label: '派對狂歡', icon: <PartyPopper size={14} /> },
  [MealOccasion.PICNIC]: { label: '戶外野餐', icon: <Trees size={14} /> },
  [MealOccasion.CAMPING]: { label: '露營野炊', icon: <Tent size={14} /> },
  [MealOccasion.FESTIVAL]: { label: '節慶盛宴', icon: <Star size={14} /> }
};

const CuisineConfig: Record<Exclude<Cuisine, Cuisine.ANY>, { label: string; icon: React.ReactNode }> = {
  [Cuisine.TAIWANESE]: { label: '台式經典', icon: <Utensils size={14} /> },
  [Cuisine.JAPANESE]: { label: '精緻日式', icon: <Star size={14} /> },
  [Cuisine.ITALIAN]: { label: '道地義式', icon: <ChefHat size={14} /> },
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

export const Hero: React.FC<HeroProps> = ({ searchState, setSearchState, onSearch, isLoading, onImageUpload, onOpenSmartVision }) => {
  const [inputValue, setInputValue] = useState('');
  const [showAllSnacks, setShowAllSnacks] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
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
      onSearch(inputValue);
      setInputValue('');
    } else if (e.key === 'Backspace' && !inputValue && searchState.ingredients.length > 0) {
      removeIngredient(searchState.ingredients.length - 1);
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4">

      {/* Search Section - Editorial Minimal Style */}
      <div className="relative mb-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 pb-4">

          {/* Main Input Container - With Bottom Border */}
          <div className="flex-1 relative group border-b border-stone-300 pb-3">
            {searchState.ingredients.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {searchState.ingredients.map((ing, idx) => (
                  <IngredientTag key={idx} label={ing} onRemove={() => removeIngredient(idx)} />
                ))}
              </div>
            )}

            <div className="flex items-start gap-3 py-2">
              <div className="flex flex-col items-center pt-0.5">
                <Search className="h-5 w-5 text-stone-400 shrink-0" />
                <span className="text-[10px] text-stone-400 mt-1 whitespace-nowrap">多種食材</span>
              </div>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-base md:text-lg text-stone-800 placeholder-stone-400 focus:outline-none font-serif min-w-0 w-full"
                placeholder={searchState.ingredients.length === 0 ? PLACEHOLDER_EXAMPLES[placeholderIndex] : "還有其他食材？"}
              />
            </div>
          </div>

          {/* Action Buttons - Square, Same Size, Right Aligned */}
          <div className="flex items-center gap-2 shrink-0 ml-auto">
            {/* Camera Button */}
            <button
              onClick={() => onOpenSmartVision?.()}
              className="w-16 h-12 bg-white border border-stone-200 flex items-center justify-center text-stone-600 hover:text-stone-900 hover:border-stone-300 transition-all"
              title="AI 視覺辨識"
            >
              <Camera className="h-5 w-5" />
            </button>

            {/* Search Button */}
            <button
              onClick={() => {
                onSearch(inputValue);
                setInputValue('');
              }}
              className="w-16 h-12 bg-stone-900 text-white flex items-center justify-center hover:bg-stone-800 transition-all"
              title="搜尋食譜"
            >
              <Search className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Filters / Inspiration - Simplified "Chips" */}
      <div className="mb-8 -mt-4">
        {showFilterMenu ? (
          /* Expanded Filter Menu */
          <div className="relative p-6 bg-white rounded-[2rem] shadow-xl border border-stone-100 z-20 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-serif font-bold text-lg text-stone-800">搜尋篩選</h3>
              <button onClick={() => setShowFilterMenu(false)} className="p-2 hover:bg-stone-100 rounded-full text-stone-400">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6">
              {/* Goals */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">營養目標</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(DietaryGoal).map(goal => (
                    <FilterPill key={goal} label={GoalConfig[goal].label} active={searchState.goal === goal} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === goal ? null : goal }))} />
                  ))}
                </div>
              </div>
              {/* Occasions */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">用餐場合</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(MealOccasion).map(occ => (
                    <FilterPill key={occ} label={OccasionConfig[occ].label} active={searchState.occasion === occ} onClick={() => setSearchState(prev => ({ ...prev, occasion: prev.occasion === occ ? null : occ }))} />
                  ))}
                </div>
              </div>
              {/* Cuisines */}
              <div>
                <h4 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">偏好菜系</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(Cuisine).filter(c => c !== Cuisine.ANY).map(c => (
                    <FilterPill key={c} label={CuisineConfig[c].label} active={searchState.cuisine === c} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === c ? Cuisine.ANY : c }))} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Collapsed View: Expanded 2-Row Grid Horizontal Scroll */
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <Lightbulb className="text-chef-gold" size={16} />
              <span className="font-serif font-bold text-stone-700 text-sm">料理靈感</span>
            </div>
            <div className="grid grid-rows-2 grid-flow-col gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear-fade px-1 h-[116px]">
              {/* Show All Toggle - Minimal Square Design */}
              <button
                onClick={() => setShowFilterMenu(true)}
                className="row-span-2 w-14 h-full border border-stone-200 text-stone-500 hover:border-stone-400 hover:text-stone-900 transition-all flex items-center justify-center"
              >
                <SlidersHorizontal size={18} strokeWidth={1.5} />
              </button>

              {/* Quick Filters - Populated to fill grid */}
              <FilterPill label={GoalConfig[DietaryGoal.QUICK].label} active={searchState.goal === DietaryGoal.QUICK} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.QUICK ? null : DietaryGoal.QUICK }))} icon={<Zap size={14} />} />
              <FilterPill label={CuisineConfig[Cuisine.TAIWANESE].label} active={searchState.cuisine === Cuisine.TAIWANESE} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.TAIWANESE ? Cuisine.ANY : Cuisine.TAIWANESE }))} icon={<Utensils size={14} />} />

              <FilterPill label={GoalConfig[DietaryGoal.WEIGHT_LOSS].label} active={searchState.goal === DietaryGoal.WEIGHT_LOSS} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.WEIGHT_LOSS ? null : DietaryGoal.WEIGHT_LOSS }))} icon={<Leaf size={14} />} />
              <FilterPill label={GoalConfig[DietaryGoal.MUSCLE_GAIN].label} active={searchState.goal === DietaryGoal.MUSCLE_GAIN} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.MUSCLE_GAIN ? null : DietaryGoal.MUSCLE_GAIN }))} icon={<Dumbbell size={14} />} />

              <FilterPill label={GoalConfig[DietaryGoal.COMFORT].label} active={searchState.goal === DietaryGoal.COMFORT} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.COMFORT ? null : DietaryGoal.COMFORT }))} icon={<Heart size={14} />} />
              <FilterPill label={CuisineConfig[Cuisine.JAPANESE].label} active={searchState.cuisine === Cuisine.JAPANESE} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.JAPANESE ? Cuisine.ANY : Cuisine.JAPANESE }))} icon={<Star size={14} />} />

              <FilterPill label={CuisineConfig[Cuisine.ITALIAN].label} active={searchState.cuisine === Cuisine.ITALIAN} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.ITALIAN ? Cuisine.ANY : Cuisine.ITALIAN }))} icon={<ChefHat size={14} />} />
              <FilterPill label={OccasionConfig[MealOccasion.FAMILY].label} active={searchState.occasion === MealOccasion.FAMILY} onClick={() => setSearchState(prev => ({ ...prev, occasion: prev.occasion === MealOccasion.FAMILY ? null : MealOccasion.FAMILY }))} icon={<Users size={14} />} />

              <FilterPill label={OccasionConfig[MealOccasion.LATE_NIGHT].label} active={searchState.occasion === MealOccasion.LATE_NIGHT} onClick={() => setSearchState(prev => ({ ...prev, occasion: prev.occasion === MealOccasion.LATE_NIGHT ? null : MealOccasion.LATE_NIGHT }))} icon={<Flame size={14} />} />
              <FilterPill label={CuisineConfig[Cuisine.KOREAN].label} active={searchState.cuisine === Cuisine.KOREAN} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.KOREAN ? Cuisine.ANY : Cuisine.KOREAN }))} icon={<Utensils size={14} />} />
            </div>
          </div>
        )}
      </div>


      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} />
    </div >
  );
};
