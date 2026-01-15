
import React, { useState, useEffect } from 'react';
import { ChefHat, Sparkles, X, Users, Heart, Crown, HelpCircle, Menu } from 'lucide-react';
import { Hero } from './components/Hero';
import { RecipeCard } from './components/RecipeCard';
import { Community } from './components/Community';
import { MarketTicker } from './components/MarketTicker';
import { AuthModal } from './components/AuthModal';
import { ProfileModal } from './components/ProfileModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { Onboarding } from './components/Onboarding';
import { UsageLimitModal } from './components/UsageLimitModal';
import { LoginBenefitsModal } from './components/LoginBenefitsModal';
import { generateRecipes, generateRecipeImage, analyzeImage } from './services/geminiService';
import { usageService } from './services/usageService';
import { SearchState, Recipe, Cuisine, VisionMode, User } from './types';

const GENERIC_MESSAGES = [
  { text: "正在解構食材風味...", sub: "AI 主廚正在優化口感搭配" },
  { text: "正在喚醒食材靈魂...", sub: "尋找味覺的最佳平衡點" },
  { text: "同步全球私廚資料庫...", sub: "策劃專屬於您的味覺饗宴" },
  { text: "編排私人米其林食譜...", sub: "正在尋找最適合的烹飪工法" }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchState, setSearchState] = useState<SearchState>({
    ingredients: [], goal: null, cuisine: Cuisine.ANY, occasion: null, mealTime: null
  });
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showUsageLimitModal, setShowUsageLimitModal] = useState(false);
  const [showLoginBenefitsModal, setShowLoginBenefitsModal] = useState(false);
  const [currentView, setCurrentView] = useState<'home' | 'community'>('home');

  useEffect(() => {
    const savedUser = localStorage.getItem('smartchef_user');
    if (savedUser) try { setCurrentUser(JSON.parse(savedUser)); } catch (e) { }
    const savedFavorites = localStorage.getItem('smartchef_favorites');
    if (savedFavorites) try { setFavorites(JSON.parse(savedFavorites)); } catch (e) { }
    // BUG-005 修復：新用戶首次訪問自動顯示 Onboarding
    const hasSeenOnboarding = localStorage.getItem('smartchef_onboarding_seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('smartchef_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowProfileModal(false);
    localStorage.removeItem('smartchef_user');
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('smartchef_onboarding_seen', 'true');
  };

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => setLoadingIndex(prev => (prev + 1) % GENERIC_MESSAGES.length), 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleSearch = async () => {
    if (searchState.ingredients.length === 0 && !searchState.goal && !searchState.occasion) return;

    // Check usage limits for non-logged-in users
    if (!usageService.canUse(!!currentUser)) {
      setShowUsageLimitModal(true);
      return;
    }

    setLoading(true); setError(null); setShowFavoritesOnly(false);
    try {
      const results = await generateRecipes(searchState, currentUser);
      setRecipes(results); setHasSearched(true);

      // Increment usage count  for non-logged-in users
      if (!currentUser) {
        usageService.incrementUsage();
      }

      setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
      results.forEach(async (recipe) => {
        const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
        if (imageUrl) setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, imageUrl } : r));
      });
    } catch (err) { setError("連線忙碌中，請稍後再試。"); } finally { setLoading(false); }
  };

  // BUG-001 修復：將 finally 移至正確位置，處理非同步錯誤
  const handleImageUpload = async (file: File) => {
    setLoading(true); setError(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const results = await analyzeImage(base64, VisionMode.FRIDGE_XRAY);
        if (results.length === 0) {
          setError("這張照片似乎沒有包含可辨識的食材或料理，請換一張試試。");
          return;
        }
        setRecipes(results); setHasSearched(true);
        setTimeout(() => document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' }), 300);
        results.forEach(async (recipe) => {
          const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
          if (imageUrl) setRecipes(prev => prev.map(r => r.id === recipe.id ? { ...r, imageUrl } : r));
        });
      } catch (err) {
        setError("辨識失敗，請重試。");
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError("讀取檔案失敗，請重試。");
      setLoading(false);
    };
  };

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites(prev => {
      const isFav = prev.some(f => f.id === recipe.id);
      const next = isFav ? prev.filter(f => f.id !== recipe.id) : [...prev, recipe];
      localStorage.setItem('smartchef_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Soft reset function to avoid page reload crash
  const handleLogoClick = () => {
    setSearchState({ ingredients: [], goal: null, cuisine: Cuisine.ANY, occasion: null, mealTime: null });
    setRecipes([]);
    setHasSearched(false);
    setShowFavoritesOnly(false);
    setError(null);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentView === 'community') return <Community onBack={() => setCurrentView('home')} currentUser={currentUser} onShowLogin={() => setShowAuthModal(true)} />;

  const displayedRecipes = showFavoritesOnly ? favorites : recipes;

  return (
    <div className="min-h-screen bg-chef-paper selection:bg-chef-gold/30 pb-24 font-sans relative">

      {/* 1. Market Ticker - The "Market Research" Vibe */}
      <MarketTicker />

      {/* Global Error Toast */}
      {error && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[80] bg-red-50 text-red-600 px-6 py-4 rounded-xl shadow-floating border border-red-100 flex items-center gap-3 animate-[fadeInUp_0.3s_ease-out]">
          <X className="cursor-pointer hover:text-red-800" size={18} onClick={() => setError(null)} />
          <span className="text-sm font-bold">{error}</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="w-full bg-chef-paper/80 backdrop-blur-xl transition-all sticky top-0 z-40 border-b border-chef-gold/5">
        <div className="max-w-7xl mx-auto px-4 md:px-12 h-16 md:h-24 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 group cursor-pointer" onClick={handleLogoClick}>
            <div className="w-9 h-9 md:w-12 md:h-12 bg-[#1A1818] rounded-xl flex items-center justify-center text-white shadow-xl">
              <ChefHat size={18} className="md:w-[26px] md:h-[26px]" />
            </div>
            <div className="flex flex-col">
              <span className="text-base md:text-xl font-bold text-[#1A1818] leading-tight">饗味食光</span>
              <span className="hidden md:block text-sm tracking-[0.15em] text-chef-gold font-serif italic font-medium mt-0.5">您的專屬暖心私廚</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => setShowSubscriptionModal(true)} className="flex items-center gap-2 px-4 py-2 bg-chef-black text-chef-gold rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg border border-chef-gold/30">
              <Crown size={14} /> Pro
            </button>
            <button onClick={() => setShowOnboarding(true)} className="p-2 text-stone-500 hover:text-chef-black transition-all" title="新手指南">
              <HelpCircle size={22} />
            </button>
            <button onClick={() => setShowFavoritesOnly(!showFavoritesOnly)} className={`p-2 transition-all ${showFavoritesOnly ? 'text-chef-gold-dark' : 'text-stone-500 hover:text-chef-black'}`}>
              <Heart size={22} fill={showFavoritesOnly ? "currentColor" : "none"} />
            </button>
            <button onClick={() => setCurrentView('community')} className="p-2 text-stone-500 hover:text-chef-black transition-all">
              <Users size={22} />
            </button>
            {currentUser ? (
              <button onClick={() => setShowProfileModal(true)} className="outline-none">
                <img src={currentUser.avatar} className="w-12 h-12 rounded-full border-2 border-chef-gold/30" alt="User" />
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-8 py-3 rounded-xl bg-stone-100/50 text-[#1A1818] text-xs font-black uppercase tracking-widest hover:bg-[#1A1818] hover:text-white transition-all">登入</button>
            )}
          </div>

          {/* Mobile: Login + Hamburger */}
          <div className="flex md:hidden items-center gap-3">
            {currentUser ? (
              <button onClick={() => setShowProfileModal(true)} className="outline-none">
                <img src={currentUser.avatar} className="w-9 h-9 rounded-full border-2 border-chef-gold/30" alt="User" />
              </button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="px-4 py-2 rounded-lg bg-chef-black text-white text-xs font-bold">登入</button>
            )}
            <button onClick={() => setShowMobileMenu(true)} className="p-2 text-chef-black">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl animate-fadeInUp">
            <div className="p-6 border-b border-stone-100 flex items-center justify-between">
              <span className="font-bold text-lg">選單</span>
              <button onClick={() => setShowMobileMenu(false)} className="p-2 hover:bg-stone-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 space-y-2">
              <button onClick={() => { setShowSubscriptionModal(true); setShowMobileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-10 h-10 bg-chef-black rounded-xl flex items-center justify-center">
                  <Crown size={18} className="text-chef-gold" />
                </div>
                <div className="text-left">
                  <span className="font-bold text-sm">升級 Pro</span>
                  <p className="text-xs text-stone-400">解鎖進階功能</p>
                </div>
              </button>

              {!currentUser && (
                <button onClick={() => { setShowLoginBenefitsModal(true); setShowMobileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-stone-50 transition-all">
                  <div className="w-10 h-10 bg-chef-gold/10 rounded-xl flex items-center justify-center">
                    <Sparkles size={18} className="text-chef-gold-dark" />
                  </div>
                  <div className="text-left">
                    <span className="font-bold text-sm text-chef-black">為什麼要登入？</span>
                    <p className="text-xs text-stone-500">會員權益比較</p>
                  </div>
                </button>
              )}
              <button onClick={() => { setShowOnboarding(true); setShowMobileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
                  <HelpCircle size={18} className="text-stone-600" />
                </div>
                <span className="font-bold text-sm">新手指南</span>
              </button>
              <button onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setShowMobileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-stone-50 transition-all">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${showFavoritesOnly ? 'bg-chef-gold/20' : 'bg-stone-100'}`}>
                  <Heart size={18} className={showFavoritesOnly ? 'text-chef-gold' : 'text-stone-600'} fill={showFavoritesOnly ? "currentColor" : "none"} />
                </div>
                <span className="font-bold text-sm">我的收藏</span>
              </button>
              <button onClick={() => { setCurrentView('community'); setShowMobileMenu(false); }} className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl hover:bg-stone-50 transition-all">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center">
                  <Users size={18} className="text-stone-600" />
                </div>
                <span className="font-bold text-sm">社群分享</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-20">
        <div className="text-center mb-12 md:mb-24 animate-fadeIn">

          {/* Main Headline - Elegant Stacked Layout */}
          <div className="mb-8 md:mb-12">
            <p className="text-xs md:text-sm font-bold uppercase tracking-[0.4em] text-chef-gold mb-4 md:mb-6">AI 私廚顧問</p>
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-serif font-bold text-[#1A1818] leading-[1.15] tracking-tight">
              讓食材
              <span className="text-chef-gold block md:inline md:mx-4">綻放靈魂</span>
            </h1>
          </div>

          <p className="text-base md:text-xl text-stone-500 max-w-2xl mx-auto font-normal leading-relaxed">
            「饗味食光」不只是食譜，更是您廚房裡的藝術策展人。
            <span className="hidden md:inline">讓我們為您編織一場味覺的極致饗宴。</span>
          </p>
        </div>

        {/* Search Component */}
        <Hero searchState={searchState} setSearchState={setSearchState} onSearch={handleSearch} isLoading={loading} onImageUpload={handleImageUpload} />

        {/* Results */}
        {(hasSearched || showFavoritesOnly) && (
          <div id="results-section" className="mt-24 md:mt-40 animate-fadeIn">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
              <h2 className="text-3xl md:text-5xl font-serif font-bold italic">{showFavoritesOnly ? "收藏菜單" : "策劃菜單"}</h2>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-chef-gold-dark bg-chef-gold/5 px-5 py-2.5 rounded-full self-start md:self-auto">{displayedRecipes.length} 道精選佳餚</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-14">
              {displayedRecipes.map(recipe => (
                <RecipeCard key={recipe.id} recipe={recipe} isFavorite={favorites.some(f => f.id === recipe.id)} onToggleFavorite={() => toggleFavorite(recipe)} />
              ))}
            </div>
            {/* BUG-006 修復：Empty State 組件 */}
            {displayedRecipes.length === 0 && showFavoritesOnly && (
              <div className="text-center py-20 animate-fadeIn">
                <Heart className="mx-auto text-stone-300 mb-6" size={56} />
                <h3 className="text-2xl font-serif font-bold text-stone-500 mb-3">尚無收藏</h3>
                <p className="text-stone-500 text-sm max-w-xs mx-auto">點擊食譜卡片上的愛心圖示，即可開始收藏您喜愛的料理。</p>
              </div>
            )}
          </div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/98 backdrop-blur-md animate-fadeIn transition-all">
            <div className="w-20 h-20 mb-12 relative">
              <div className="absolute inset-0 border-4 border-stone-50 rounded-[2rem]"></div>
              <div className="absolute inset-0 border-4 border-[#1A1818] border-t-transparent rounded-[2rem] animate-spin"></div>
              <ChefHat className="absolute inset-0 m-auto text-[#1A1818] animate-pulse" size={28} />
            </div>
            <div className="text-center max-w-sm px-8">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-[#1A1818] mb-3 italic">{GENERIC_MESSAGES[loadingIndex].text}</h3>
              <p className="text-stone-400 text-[10px] font-bold tracking-[0.2em] uppercase">{GENERIC_MESSAGES[loadingIndex].sub}</p>
            </div>
          </div>
        )}
      </main>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onLogin={handleLogin} />}
      {showProfileModal && currentUser && <ProfileModal user={currentUser} onClose={() => setShowProfileModal(false)} onLogout={handleLogout} />}
      {showSubscriptionModal && <SubscriptionModal onClose={() => setShowSubscriptionModal(false)} />}
      {showOnboarding && <Onboarding onClose={handleCloseOnboarding} />}
      {showUsageLimitModal && (
        <UsageLimitModal
          onClose={() => setShowUsageLimitModal(false)}
          onLogin={() => { setShowUsageLimitModal(false); setShowAuthModal(true); }}
          remainingUses={usageService.getRemainingUses(!!currentUser)}
        />
      )}
      {showLoginBenefitsModal && (
        <LoginBenefitsModal
          onClose={() => setShowLoginBenefitsModal(false)}
          onLogin={() => { setShowLoginBenefitsModal(false); setShowAuthModal(true); }}
        />
      )}
    </div>
  );
}
