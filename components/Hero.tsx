
import React, { useRef, useState, useEffect } from 'react';
import {
  Search, Camera, X, Info, ChefHat,
  Leaf, Zap, Activity, Heart, Coins, Coffee, Utensils,
  Compass, Flame, Wine, Moon, Users, Briefcase, Dumbbell, Star,
  Carrot, Waves, Tent, PartyPopper, Trees, Apple,
  ArrowRight, ChevronDown, ChevronUp, TrendingUp, Sparkles, Globe, Clock
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
  icon?: React.ReactNode
}> = ({ label, active, onClick, icon }) => (
  <button
    onClick={onClick}
    className={`flex-shrink-0 px-5 py-3 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 border flex items-center gap-2 whitespace-nowrap snap-center ${active
      ? 'bg-orange-600 text-white border-orange-600 shadow-lg scale-105 z-10'
      : 'bg-white text-stone-600 border-stone-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50'
      }`}
  >
    {icon && <span className={`${active ? 'text-white' : 'text-orange-400'}`}>{icon}</span>}
    {label}
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
  [MealOccasion.DATE]: { label: '浪漫約會', icon: <Sparkles size={14} /> },
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

      {/* Hero Title Section */}
      <div className="text-center mb-12 animate-fadeIn">
        <div className="inline-block px-4 py-1.5 rounded-full bg-orange-50 border border-orange-200 mb-6">
          <span className="text-orange-600 text-xs font-bold tracking-wider uppercase">AI 智能菜單規劃師</span>
        </div>
        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-4 text-stone-800">
          讓食材
          <span className="font-black text-orange-600 ml-3">綻放靈魂</span>
        </h1>
        <p className="text-stone-600 text-lg md:text-xl max-w-2xl mx-auto">
          米其林私廚 × 全球趨勢 × AI 完美演繹
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <div className="relative group bg-white rounded-3xl p-4 md:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-stone-100 focus-within:shadow-[0_8px_40px_rgba(249,115,22,0.15)] transition-all duration-300">
          {searchState.ingredients.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-4 min-h-[40px]">
              {searchState.ingredients.map((ing, idx) => (
                <IngredientTag key={idx} label={ing} onRemove={() => removeIngredient(idx)} />
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <div className="flex items-center shrink-0 pl-2">
              <Search className="h-6 w-6 text-stone-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-2 bg-transparent text-xl text-stone-800 placeholder-stone-400 focus:outline-none font-serif min-w-0"
              placeholder={searchState.ingredients.length === 0 ? PLACEHOLDER_EXAMPLES[placeholderIndex] : "還有其他食材？"}
            />

            {/* Right Action Buttons */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Camera Button */}
              <button
                onClick={() => onOpenSmartVision?.()}
                className="p-3 rounded-full text-stone-500 hover:bg-orange-50 hover:text-orange-600 transition-colors group/camera"
                title="AI 視覺辨識"
              >
                <Camera className="h-6 w-6" />
              </button>

              <div className="w-px h-8 bg-stone-200 mx-1" />

              {/* Submit Button - Explicit User Request */}
              <button
                onClick={() => {
                  onSearch(inputValue);
                  setInputValue('');
                }}
                className="flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 text-white font-bold hover:bg-chef-gold hover:text-black transition-all shadow-lg active:scale-95"
              >
                <span>搜尋食譜</span>
              </button>
            </div>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-stone-500">
          <Info size={14} />
          <span>支援多種食材同時搜尋，例如：「雞蛋 豆腐 蔥」</span>
        </div>
      </div>

      {/* Smart Filter System */}
      <div className="mb-12">
        {/* Header with Expand Toggle */}
        <div className="flex items-center justify-between mb-4 px-2">
          <h3 className="font-bold text-stone-800 text-sm uppercase tracking-wider flex items-center gap-2">
            <Activity size={16} className="text-chef-gold" />
            料理靈感
          </h3>
          <button
            onClick={() => setShowFilterMenu(!showFilterMenu)}
            className="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-chef-gold transition-colors"
          >
            {showFilterMenu ? '收起更多' : '顯示全部篩選'}
          </button>
        </div>

        {/* Animated Expandable Area */}
        <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showFilterMenu ? 'max-h-[800px] opacity-100' : 'max-h-[60px] opacity-100'}`}>

          {showFilterMenu ? (
            /* Expanded View: Full Categories */
            <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 border border-stone-100 space-y-8 animate-fadeIn">

              {/* Goals */}
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">飲食目標</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(GoalConfig).map(([key, config]) => (
                    <FilterPill
                      key={key}
                      label={config.label}
                      active={searchState.goal === key}
                      onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === key ? null : key as DietaryGoal }))}
                      icon={config.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Occasions */}
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">用餐場合</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(OccasionConfig).map(([key, config]) => (
                    <FilterPill
                      key={key}
                      label={config.label}
                      active={searchState.occasion === key}
                      onClick={() => setSearchState(prev => ({ ...prev, occasion: prev.occasion === key ? null : key as MealOccasion }))}
                      icon={config.icon}
                    />
                  ))}
                </div>
              </div>

              {/* Cuisines */}
              <div>
                <div className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-3">菜系風格</div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CuisineConfig).map(([key, config]) => (
                    <FilterPill
                      key={key}
                      label={config.label}
                      active={searchState.cuisine === key}
                      onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === key ? Cuisine.ANY : key as Cuisine }))}
                      icon={config.icon}
                    />
                  ))}
                </div>
              </div>

            </div>
          ) : (
            /* Collapsed View: Horizontal Scroll Recommendations */
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-2 mask-linear-fade">
              <button
                onClick={() => setShowFilterMenu(true)}
                className="flex-shrink-0 px-4 py-3 rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors flex items-center gap-2 text-sm font-bold"
              >
                <span className="w-5 h-5 rounded-full bg-stone-300 text-white flex items-center justify-center text-xs">+</span>
                更多
              </button>
              {/* Mix of popular filters */}
              <FilterPill label="15分鐘快手" active={searchState.goal === DietaryGoal.QUICK} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.QUICK ? null : DietaryGoal.QUICK }))} icon={<Zap size={14} />} />
              <FilterPill label="台式經典" active={searchState.cuisine === Cuisine.TAIWANESE} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.TAIWANESE ? Cuisine.ANY : Cuisine.TAIWANESE }))} icon={<Utensils size={14} />} />
              <FilterPill label="減脂" active={searchState.goal === DietaryGoal.WEIGHT_LOSS} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.WEIGHT_LOSS ? null : DietaryGoal.WEIGHT_LOSS }))} icon={<Leaf size={14} />} />
              <FilterPill label="增肌" active={searchState.goal === DietaryGoal.MUSCLE_GAIN} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.MUSCLE_GAIN ? null : DietaryGoal.MUSCLE_GAIN }))} icon={<Dumbbell size={14} />} />
              <FilterPill label="療癒暖胃" active={searchState.goal === DietaryGoal.COMFORT} onClick={() => setSearchState(prev => ({ ...prev, goal: prev.goal === DietaryGoal.COMFORT ? null : DietaryGoal.COMFORT }))} icon={<Heart size={14} />} />
              <FilterPill label="日式" active={searchState.cuisine === Cuisine.JAPANESE} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.JAPANESE ? Cuisine.ANY : Cuisine.JAPANESE }))} icon={<Star size={14} />} />
              <FilterPill label="義式" active={searchState.cuisine === Cuisine.ITALIAN} onClick={() => setSearchState(prev => ({ ...prev, cuisine: prev.cuisine === Cuisine.ITALIAN ? Cuisine.ANY : Cuisine.ITALIAN }))} icon={<Flame size={14} />} />
            </div>
          )}
        </div>
      </div>

      {/* Taiwan Snacks */}
      <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-800 mb-1">本週熱門食譜</h3>
            <p className="text-sm text-stone-500">精選台灣經典美食靈感</p>
          </div>
          <button
            onClick={() => setShowAllSnacks(!showAllSnacks)}
            className="text-orange-600 text-sm font-bold hover:underline"
          >
            {showAllSnacks ? '收起' : '查看全部'}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
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
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onImageUpload(e.target.files[0])} />
    </div>
  );
};
