
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
    className={`flex-shrink-0 transition-all duration-300 border flex items-center justify-center snap-center flex-row gap-2 px-5 py-3 rounded-full ${active
      ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105 z-10'
      : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
      }`}
  >
    {icon && <span className={`${active ? 'text-white' : 'text-orange-400'}`}>{icon}</span>}
    <span className="text-sm font-bold uppercase tracking-wider whitespace-nowrap">{label}</span>
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

      {/* Hero Title Section - REMOVED (Handled in App.tsx) */}

      <div className="relative mb-6">
        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">

          {/* Main Input Container - 100% Width on Mobile */}
          <div className="flex-1 relative group bg-white rounded-[2rem] p-4 md:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-stone-100 focus-within:shadow-[0_8px_40px_rgba(249,115,22,0.12)] transition-all duration-300">
            {searchState.ingredients.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {searchState.ingredients.map((ing, idx) => (
                  <IngredientTag key={idx} label={ing} onRemove={() => removeIngredient(idx)} />
                ))}
              </div>
            )}

            <div className="flex items-center h-full">
              <Search className="h-6 w-6 text-stone-400 shrink-0 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent text-lg md:text-xl text-stone-800 placeholder-stone-400 focus:outline-none font-serif min-w-0 w-full py-1"
                placeholder={searchState.ingredients.length === 0 ? PLACEHOLDER_EXAMPLES[placeholderIndex] : "還有其他食材？"}
              />
            </div>
          </div>

          {/* External Action Buttons - Stacked 50/50 on Mobile */}
          <div className="flex items-center gap-3 shrink-0 h-14 md:h-auto">
            {/* Camera Button */}
            <button
              onClick={() => onOpenSmartVision?.()}
              className="flex-1 md:flex-none md:w-16 md:h-16 h-full px-6 md:px-0 bg-white rounded-[2rem] md:rounded-full flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.06)] border border-stone-100 text-stone-500 hover:text-orange-600 hover:shadow-md active:scale-95 transition-all text-sm font-bold"
              title="AI 視覺辨識"
            >
              <Camera className="h-6 w-6" />
              <span className="md:hidden">拍食材</span>
            </button>

            {/* Search Button */}
            <button
              onClick={() => {
                onSearch(inputValue);
                setInputValue('');
              }}
              className="flex-1 md:flex-none md:w-16 md:h-16 h-full px-6 md:px-0 bg-stone-900 rounded-[2rem] md:rounded-full flex items-center justify-center gap-2 shadow-[0_4px_12px_rgba(0,0,0,0.2)] text-white hover:bg-chef-gold hover:text-black active:scale-95 transition-all text-sm font-bold"
            >
              <Search className="h-6 w-6" />
              <span className="md:hidden">搜食譜</span>
            </button>
          </div>
        </div>

        {/* Helper Text - Cleaner */}
        <div className="flex items-center justify-center gap-2 mt-3 text-sm text-stone-400 opacity-80">
          <Info size={14} />
          <span>支援多種食材：「雞蛋 豆腐 蔥」</span>
        </div>
      </div>

      {/* Search Filters / Inspiration - Simplified "Chips" */}
      <div className="mb-8">
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
              {/* Show All Toggle - Spans 2 rows */}
              <button
                onClick={() => setShowFilterMenu(true)}
                className="row-span-2 w-14 h-full rounded-2xl bg-white border border-stone-200 text-stone-500 hover:border-orange-500 hover:text-orange-500 transition-all flex items-center justify-center shadow-sm"
              >
                <SlidersHorizontal size={20} />
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

      {/* Taiwan Snacks - Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="md:bg-white md:rounded-[2rem] md:p-8 md:shadow-[0_8px_30px_rgba(0,0,0,0.04)] md:border md:border-stone-100">
        <div className="flex items-center justify-between mb-4 md:mb-6 px-1 md:px-0">
          <div>
            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 mb-1">本週熱門食譜</h3>
            <p className="text-sm text-stone-500">精選台灣經典美食靈感</p>
          </div>
          <button
            onClick={() => setShowAllSnacks(!showAllSnacks)}
            className="text-orange-600 text-sm font-bold hover:underline hidden md:block"
          >
            {showAllSnacks ? '收起' : '查看全部'}
          </button>
        </div>

        {/* Mobile: Horizontal Scroll (Snap) - Edge to Edge feel */}
        <div className="md:hidden flex overflow-x-auto gap-3 pb-4 -mx-4 px-4 snap-x no-scrollbar">
          {TAIWAN_SNACKS_DATA.slice(0, 8).map((snack, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchState(prev => ({ ...prev, ingredients: [snack.keyword] }));
                onSearch(snack.keyword);
              }}
              className="snap-center shrink-0 w-[42%] bg-white rounded-2xl p-4 shadow-sm border border-stone-100 flex flex-col items-center justify-center gap-2 text-center active:scale-95 transition-transform"
            >
              <div className="text-3xl mb-1">{snack.icon}</div>
              <div>
                <h4 className="font-bold text-stone-800 text-sm">{snack.label}</h4>
              </div>
            </button>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-4 lg:grid-cols-5 gap-4">
          {(showAllSnacks ? TAIWAN_SNACKS_DATA : TAIWAN_SNACKS_DATA.slice(0, 10)).map((snack, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchState(prev => ({ ...prev, ingredients: [snack.keyword] }));
                onSearch(snack.keyword);
              }}
              className="group p-4 bg-gradient-to-br from-stone-50 to-white rounded-2xl border border-stone-100 hover:border-orange-300 hover:shadow-md transition-all text-left"
            >
              <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">{snack.icon}</div>
              <h4 className="font-bold text-stone-800 text-sm mb-0.5">{snack.label}</h4>
              <p className="text-xs text-stone-500">{snack.sub}</p>
            </button>
          ))}
        </div>

        <div className="mt-2 text-center md:hidden">
          <p className="text-xs text-stone-400 opacity-60">← 左右滑動 →</p>
        </div>

      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} />
    </div >
  );
};
