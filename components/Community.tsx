
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Plus, Heart, Globe, Camera, PenTool, Loader2, ArrowRight, RefreshCcw, LayoutGrid, BarChart3, TrendingUp, PieChart, Info, Star, Share2, Shield, Eye, AlertCircle } from 'lucide-react';
import { Recipe, TrendReport, User } from '../types';
import { RecipeCard } from './RecipeCard';
import { createRecipeFromDraft, fetchDiscoveryFeed, generateRecipeImage, fetchMarketTrends } from '../services/geminiService';

interface CommunityProps {
  onBack: () => void;
  currentUser: User | null;
  onShowLogin: () => void;
}

export const Community: React.FC<CommunityProps> = ({ onBack, currentUser, onShowLogin }) => {
  const [activeTab, setActiveTab] = useState<'explore' | 'studio' | 'insights'>('explore');
  const [feed, setFeed] = useState<Recipe[]>([]);
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);
  const [report, setReport] = useState<TrendReport | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const [draftImage, setDraftImage] = useState<string | null>(null);
  const [draftText, setDraftText] = useState('');
  const [isPublic, setIsPublic] = useState(true); 
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadFeed();
    const saved = localStorage.getItem('smartchef_user_recipes');
    if (saved) {
      try { setUserRecipes(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      const results = await fetchDiscoveryFeed();
      setFeed(results);
      results.forEach(async (recipe) => {
        const imageUrl = await generateRecipeImage(recipe.name, recipe.description);
        if (imageUrl) {
          setFeed(prev => prev.map(r => r.id === recipe.id ? { ...r, imageUrl } : r));
        }
      });
    } finally { setIsLoading(false); }
  };

  const loadTrends = async () => {
    if (report) return;
    setIsLoading(true);
    try {
      const data = await fetchMarketTrends();
      setReport(data);
    } finally { setIsLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'insights') loadTrends();
  }, [activeTab]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onloadend = () => {
         setDraftImage(reader.result as string);
         setCreateError(null);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCreate = async () => {
      if (!draftImage || !draftText) return;
      if (!currentUser) {
        onShowLogin();
        return;
      }
      setIsCreating(true);
      setCreateError(null);
      try {
          const newRecipe = await createRecipeFromDraft(draftImage, draftText, currentUser.name);
          
          if (newRecipe.id === "NOT_FOOD") {
            setCreateError("照片無法辨識為食物，請重新上傳料理照片。");
            return;
          }

          newRecipe.authorAvatar = currentUser.avatar;
          newRecipe.isPublic = isPublic;
          const updated = [newRecipe, ...userRecipes];
          setUserRecipes(updated);
          localStorage.setItem('smartchef_user_recipes', JSON.stringify(updated));
          setDraftImage(null); setDraftText('');
          setActiveTab('studio');
      } catch(e) {
         setCreateError("創作失敗，請稍後再試。");
      } finally { setIsCreating(false); }
  };

  const deleteRecipe = (id: string) => {
    const updated = userRecipes.filter(r => r.id !== id);
    setUserRecipes(updated);
    localStorage.setItem('smartchef_user_recipes', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pb-32 animate-fadeIn selection:bg-chef-gold/30">
       <div className="bg-chef-black text-white pt-24 pb-20 px-6 sticky top-0 z-30 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-96 h-96 bg-chef-gold/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-10 relative z-10">
               <div>
                   <button onClick={onBack} className="text-stone-500 hover:text-chef-gold mb-6 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] transition-all">
                       <ArrowRight className="rotate-180" size={16} /> 返回探索主頁
                   </button>
                   <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 tracking-tighter">
                     社群 <span className="italic text-chef-gold">趨勢</span>
                   </h1>
                   <p className="text-stone-400 font-medium text-lg font-serif">遇見全球味覺趨勢，與大數據共同編織下一道經典。</p>
               </div>
               <div className="flex bg-white/5 p-1.5 rounded-2xl backdrop-blur-xl border border-white/10 shadow-inner overflow-x-auto no-scrollbar max-w-full">
                   <button onClick={() => setActiveTab('explore')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'explore' ? 'bg-chef-gold text-chef-black shadow-premium' : 'text-stone-400'}`}>全球探索</button>
                   <button onClick={() => setActiveTab('insights')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'insights' ? 'bg-chef-gold text-chef-black shadow-premium' : 'text-stone-400'}`}>趨勢研究</button>
                   <button onClick={() => setActiveTab('studio')} className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'studio' ? 'bg-white text-chef-black shadow-premium' : 'text-stone-400'}`}>個人工作室</button>
               </div>
           </div>
       </div>

       <main className="max-w-7xl mx-auto px-6 mt-16">
           {activeTab === 'explore' && (
               <div className="space-y-16">
                   {userRecipes.filter(r => r.isPublic).length > 0 && (
                     <div className="animate-fadeIn">
                       <div className="flex items-center gap-4 mb-8">
                         <div className="h-px bg-stone-200 flex-1"></div>
                         <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-chef-gold">您的公開發佈 Public Creations</h2>
                         <div className="h-px bg-stone-200 flex-1"></div>
                       </div>
                       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                          {userRecipes.filter(r => r.isPublic).map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                       </div>
                     </div>
                   )}

                   <div className="animate-fadeIn">
                      <div className="flex items-center gap-4 mb-8">
                         <div className="h-px bg-stone-200 flex-1"></div>
                         <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-stone-400">全球趨勢探索 Global Feed</h2>
                         <div className="h-px bg-stone-200 flex-1"></div>
                       </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                          {isLoading && feed.length === 0 ? [1,2,3,4,5,6].map(i => <div key={i} className="aspect-[4/5] bg-stone-100 rounded-[2.5rem] animate-pulse"></div>) : feed.map(recipe => <RecipeCard key={recipe.id} recipe={recipe} />)}
                      </div>
                   </div>
               </div>
           )}

           {activeTab === 'insights' && (
               <div className="animate-fadeIn max-w-4xl mx-auto">
                   {isLoading ? (
                       <div className="flex flex-col items-center justify-center py-40">
                           <Loader2 className="animate-spin text-chef-gold mb-4" size={48} />
                           <p className="font-serif italic text-stone-400">正在調閱全球美食大數據...</p>
                       </div>
                   ) : report && (
                       <div className="space-y-16">
                           <div className="text-center space-y-4">
                               <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-chef-gold/10 text-chef-gold rounded-full text-[10px] font-black uppercase tracking-widest border border-chef-gold/20">Market Insight Report</div>
                               <h2 className="text-4xl md:text-6xl font-serif font-bold text-chef-black">{report.seasonTitle}</h2>
                               <p className="text-stone-400 italic max-w-2xl mx-auto leading-relaxed">{report.globalInsight}</p>
                           </div>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div className="bg-white p-10 rounded-[3rem] shadow-premium border border-stone-100">
                                   <div className="flex items-center gap-3 mb-8">
                                       <BarChart3 className="text-chef-gold" size={24} />
                                       <h3 className="font-black text-xs uppercase tracking-widest text-chef-black">熱門趨勢分析 Popularity Index</h3>
                                   </div>
                                   <div className="space-y-8">
                                       {report.marketTrends.map((trend, i) => (
                                           <div key={i}>
                                               <div className="flex justify-between items-end mb-3">
                                                   <span className="font-serif font-bold text-lg text-chef-black">{trend.title}</span>
                                                   <span className="text-[10px] font-black text-chef-gold">{trend.popularity}%</span>
                                               </div>
                                               <div className="h-1.5 bg-stone-50 rounded-full overflow-hidden shadow-inner">
                                                   <div style={{width: `${trend.popularity}%`}} className="h-full bg-chef-black rounded-full" />
                                               </div>
                                               <p className="mt-3 text-[10px] text-stone-400 leading-relaxed font-medium">{trend.description}</p>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                               <div className="bg-chef-black text-white p-10 rounded-[3rem] shadow-premium relative overflow-hidden">
                                   <TrendingUp className="absolute top-10 right-10 text-chef-gold/20" size={120} />
                                   <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-chef-gold mb-6">當季靈魂食材 Top Selection</h3>
                                   <div className="flex flex-wrap gap-3 relative z-10">
                                       {report.topIngredients.map((ing, i) => (
                                           <span key={i} className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold border border-white/10">#{ing}</span>
                                       ))}
                                   </div>
                               </div>
                           </div>
                       </div>
                   )}
               </div>
           )}

           {activeTab === 'studio' && (
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                   <div className="lg:col-span-5">
                       <div className="bg-white rounded-[3rem] p-10 shadow-premium border border-stone-100 sticky top-40">
                           <h2 className="text-2xl font-serif font-bold text-chef-black mb-8 flex items-center gap-3"><PenTool className="text-chef-gold" /> AI 創作室</h2>
                           {!currentUser && (
                             <div className="mb-8 p-6 bg-chef-gold/5 rounded-2xl border border-chef-gold/20 flex flex-col items-center text-center">
                                <Sparkles className="text-chef-gold mb-3" size={32} />
                                <p className="text-sm font-serif font-bold text-chef-black mb-4">登入後解鎖跨裝置同步與全球發佈</p>
                                <button onClick={onShowLogin} className="w-full py-3 bg-chef-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest">立即登入</button>
                             </div>
                           )}
                           <div className="space-y-8">
                               <div onClick={() => fileInputRef.current?.click()} className={`aspect-video rounded-[2rem] border-2 border-dashed flex items-center justify-center cursor-pointer transition-all ${draftImage ? 'border-chef-gold' : 'border-stone-200 hover:bg-chef-cream/30'}`}>
                                   {draftImage ? <img src={draftImage} className="w-full h-full object-cover rounded-[2rem]" alt="Draft" /> : <div className="text-center"><Camera className="mx-auto text-stone-300 mb-2" size={32} /><p className="text-[10px] font-black text-stone-400 uppercase">上傳成品照</p></div>}
                                   <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                               </div>
                               
                               {createError && (
                                  <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2 text-xs font-bold">
                                     <AlertCircle size={16} /> {createError}
                                  </div>
                               )}

                               <textarea value={draftText} onChange={(e) => setDraftText(e.target.value)} className="w-full bg-stone-50 rounded-2xl p-6 text-sm min-h-[150px] border-none shadow-inner" placeholder="分享您的烹飪故事..." />
                               <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                                   <div className="flex items-center gap-3">
                                       <div className={`p-2 rounded-lg ${isPublic ? 'bg-chef-gold/10 text-chef-gold' : 'bg-stone-200 text-stone-400'}`}>
                                          {isPublic ? <Globe size={18} /> : <Shield size={18} />}
                                       </div>
                                       <div>
                                           <p className="text-xs font-bold text-chef-black">{isPublic ? '公開發佈' : '僅限私人'}</p>
                                           <p className="text-[9px] text-stone-400 uppercase tracking-widest">Global Visibility</p>
                                       </div>
                                   </div>
                                   <button onClick={() => setIsPublic(!isPublic)} className={`w-12 h-6 rounded-full relative transition-all duration-500 ${isPublic ? 'bg-chef-gold' : 'bg-stone-300'}`}>
                                       <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-500 ${isPublic ? 'right-1' : 'left-1'}`} />
                                   </button>
                               </div>
                               <button onClick={handleCreate} disabled={!draftImage || !draftText || isCreating} className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${!draftImage || !draftText || isCreating ? 'bg-stone-100 text-stone-300' : 'bg-chef-black text-white shadow-premium'}`}>{isCreating ? '處理中...' : '發布食譜'}</button>
                           </div>
                       </div>
                   </div>
                   <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-10">
                       {userRecipes.map(recipe => (
                         <div key={recipe.id} className="relative group">
                            <RecipeCard recipe={recipe} />
                            <button onClick={() => deleteRecipe(recipe.id)} className="absolute -top-3 -right-3 p-2 bg-red-500 text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all z-30"><Plus className="rotate-45" size={16} /></button>
                         </div>
                       ))}
                   </div>
               </div>
           )}
       </main>
    </div>
  );
};
