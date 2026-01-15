
import React, { useState, useRef } from 'react';
import { Clock, Flame, ChefHat, Heart, Utensils, Camera, X, BarChart2, Loader2, Award, Globe, ShieldCheck, Activity, Leaf, Share2, Check, AlertCircle, User, Send, MessageCircle } from 'lucide-react';
import { Recipe, ChatMessage, ChefVerdict } from '../types';
import { askSousChef, generateChefVerdict } from '../services/geminiService';

interface RecipeCardProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, isFavorite = false, onToggleFavorite }) => {
  const [expanded, setExpanded] = useState(false);
  const [showSousChef, setShowSousChef] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isChefThinking, setIsChefThinking] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = { role: 'user', text: inputMessage, timestamp: Date.now() };
    setChatMessages(prev => [...prev, newMsg]);
    const currentInput = inputMessage; // Store for API call
    setInputMessage("");
    setIsChefThinking(true);

    // Scroll
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 100);

    try {
      const response = await askSousChef(recipe, currentInput);
      setChatMessages(prev => [...prev, { role: 'assistant', text: response, timestamp: Date.now() }]);
    } catch (error) {
      const errorMsg = "抱歉，二廚暫時無法回應，請稍後再試。";
      setChatMessages(prev => [...prev, { role: 'assistant', text: errorMsg, timestamp: Date.now() }]);
    } finally {
      setIsChefThinking(false);
      setTimeout(() => {
        if (chatContainerRef.current) {
          chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
      }, 100);
    }
  };
  const [showVerdictModal, setShowVerdictModal] = useState(false);
  const [verdictImage, setVerdictImage] = useState<string | null>(null);
  const [isAnalyzingVerdict, setIsAnalyzingVerdict] = useState(false);
  const [verdict, setVerdict] = useState<ChefVerdict | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [verdictError, setVerdictError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);



  const handleVerdictUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result as string;
        setVerdictImage(base64);
        setShowVerdictModal(true);
        setIsAnalyzingVerdict(true);
        setVerdictError(null);
        setVerdict(null);
        try {
          const result = await generateChefVerdict(base64, recipe.name);
          if (result.badge === "NOT_FOOD") {
            setVerdictError("這張照片似乎不是食物，請拍攝您的料理成品。");
          } else {
            setVerdict(result);
          }
        } catch (e) {
          setVerdictError("分析失敗，請稍後再試。");
        } finally { setIsAnalyzingVerdict(false); }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Construct a rich text summary
    const shareText = `【饗味食光 SavorChef】\n主廚推薦：${recipe.name}\n\n"${recipe.description}"\n\n🔥 熱量：${recipe.calories} Kcal\n⏱️ 時間：${recipe.timeMinutes} Min\n\n快來試試這道 AI 私廚料理！`;
    const shareUrl = window.location.href; // In a real app, this would be a deep link to the specific recipe ID

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SavorChef: ${recipe.name}`,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled or error, ignore
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className={`group relative bg-white rounded-[2rem] transition-all duration-500 flex flex-col ${expanded ? 'shadow-floating z-20 md:scale-[1.02] ring-1 ring-chef-gold/10' : 'shadow-card hover:shadow-premium hover:-translate-y-2'}`}>
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-[2rem] cursor-pointer bg-chef-cream" onClick={() => setExpanded(!expanded)}>
        {recipe.imageUrl ? <img src={recipe.imageUrl} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={recipe.name} /> : <div className="absolute inset-0 flex items-center justify-center text-stone-200"><ChefHat size={48} className="animate-pulse" /></div>}
        <div className="absolute inset-0 bg-gradient-to-t from-chef-black/95 via-chef-black/20 to-transparent" />

        {recipe.isUserCreated && (
          <div className="absolute top-4 left-4 z-20">
            <div className="px-2 py-1 rounded-lg backdrop-blur-md bg-white/10 border border-white/20 text-white/80 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              {recipe.isPublic ? <Globe size={11} /> : <ShieldCheck size={11} />}
              {recipe.isPublic ? '公開' : '私人'}
            </div>
          </div>
        )}

        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`p-2.5 rounded-full transition-all backdrop-blur-sm border border-white/10 ${isCopied ? 'bg-green-500 text-white' : 'bg-white/10 text-white hover:bg-white hover:text-chef-black'}`}
            title="分享食譜"
          >
            {isCopied ? <Check size={16} /> : <Share2 size={16} />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
            className={`p-2.5 rounded-full transition-all backdrop-blur-sm border border-white/10 ${isFavorite ? 'bg-chef-terracotta text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white hover:text-chef-terracotta'}`}
            title="收藏食譜"
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="absolute bottom-5 left-6 right-6 text-white z-10">
          <h3 className="text-xl md:text-2xl font-serif font-bold tracking-tight leading-none drop-shadow-lg">{recipe.name}</h3>
        </div>
      </div>

      <div className="p-6 md:p-8 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-1.5 flex-wrap">
            {recipe.tags.slice(0, 2).map(tag => <span key={tag} className="text-[10px] font-black bg-stone-50 text-stone-500 border border-stone-100 px-2 py-1 rounded-md uppercase tracking-widest">{tag}</span>)}
          </div>
          <div className="text-right shrink-0">
            <span className="text-sm font-black text-chef-gold italic">{recipe.matchScore}%</span>
            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Accuracy</p>
          </div>
        </div>

        <div className={`space-y-8 transition-all duration-700 overflow-hidden ${expanded ? 'max-h-[3000px] opacity-100 mt-2' : 'max-h-0 opacity-0'}`}>

          {/* Quick Stats Badges */}
          <div className="flex items-center gap-2 flex-wrap animate-fadeInUp">
            <span className="bg-chef-gold px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-chef-black shadow-sm">{recipe.calories} KCAL</span>
            <span className="bg-stone-100 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-stone-600 flex items-center gap-1.5"><Clock size={12} /> {recipe.timeMinutes} MIN</span>
            <span className="bg-green-50 px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest text-green-600 border border-green-200">≈ NT$ {Math.round(recipe.ingredients.length * 22)}</span>
          </div>

          {/* Nutrition Analysis Section (Simplified & Breathable) */}
          {recipe.macros && (
            <div className="animate-fadeInUp pt-2 pb-6">
              <h4 className="font-serif font-bold text-md mb-6 flex items-center gap-2 text-chef-black">
                <Activity size={16} className="text-chef-gold" /> 深度營養分析
              </h4>

              {/* Macros Grid - Minimalist */}
              <div className="flex justify-between items-center mb-6 px-2">
                <div className="text-center flex-1 border-r border-stone-100 last:border-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">蛋白質</div>
                  <div className="text-xl font-serif font-bold text-chef-black">{recipe.macros.protein}</div>
                </div>
                <div className="text-center flex-1 border-r border-stone-100 last:border-0">
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">碳水</div>
                  <div className="text-xl font-serif font-bold text-chef-black">{recipe.macros.carbs}</div>
                </div>
                <div className="text-center flex-1">
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-1.5">脂肪</div>
                  <div className="text-xl font-serif font-bold text-chef-black">{recipe.macros.fat}</div>
                </div>
              </div>

              {/* Health Tip - Clean */}
              {recipe.healthTip && (
                <div className="flex gap-3 items-start pl-2 border-l-2 border-chef-gold/30">
                  <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
                    {recipe.healthTip}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Ingredients Section - Clean Magazine Style */}
          <div className="animate-fadeInUp pt-4 pb-6 border-t border-stone-50">
            <h4 className="font-serif font-bold text-md mb-6 flex items-center gap-2 text-chef-black">
              <Utensils size={16} className="text-chef-gold" /> 嚴選食材
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="text-sm text-stone-700 flex items-center gap-3 font-serif border-b border-stone-50 pb-2 last:border-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-chef-gold shrink-0" />
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions Section - Elegant Flow */}
          <div className="animate-fadeInUp pt-4 pb-8 border-t border-stone-50">
            <h4 className="font-serif font-bold text-md mb-8 flex items-center gap-2 text-chef-black">
              <Flame size={16} className="text-chef-gold" /> 烹飪工法
            </h4>
            <div className="space-y-8 pl-2 border-l border-stone-100 ml-2">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="relative pl-6 group">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-chef-gold transition-colors group-hover:bg-chef-gold" />
                  <span className="absolute -left-8 top-0 text-[10px] font-black text-stone-300 w-6 text-right pt-1">0{i + 1}</span>
                  <p className="text-sm text-stone-600 leading-relaxed font-serif tracking-wide">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-50">
            <button onClick={() => setShowSousChef(!showSousChef)} className={`py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-sm ${showSousChef ? 'bg-chef-gold text-white' : 'bg-chef-cream text-chef-black hover:bg-chef-gold hover:text-white'}`}><MessageCircle size={14} /> 問問二廚</button>
            <button onClick={() => fileInputRef.current?.click()} className="py-3.5 rounded-xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 border-2 border-dashed border-stone-100 text-stone-400 hover:border-chef-gold hover:text-chef-gold transition-all"><Camera size={14} /> 成品評鑑<input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleVerdictUpload} /></button>
          </div>

          {showSousChef && (
            <div className="mt-6 animate-fadeInUp">
              {/* Text Chat Container */}
              <div className="bg-chef-black rounded-[2.5rem] p-6 md:p-8 relative overflow-hidden shadow-2xl border border-chef-gold/20 min-h-[400px] flex flex-col">

                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-chef-gold/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-chef-gold/20 flex items-center justify-center text-chef-gold">
                      <ChefHat size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-serif font-bold text-lg tracking-wide">問問二廚</h3>
                      <p className="text-stone-400 text-xs">有任何料理問題，儘管問我！</p>
                    </div>
                  </div>
                  <button onClick={() => setShowSousChef(false)} className="p-3 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>

                {/* Chat Area */}
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2 mb-20 no-scrollbar relative z-10">
                  {chatMessages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-8">
                      <MessageCircle size={48} className="text-chef-gold mb-4" />
                      <p className="text-white text-lg font-medium mb-2">"這道菜要煮多久？"</p>
                      <p className="text-stone-400 text-sm">輸入您的問題，二廚馬上回覆</p>
                    </div>
                  )}

                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''} animate-fadeIn`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-lg ${msg.role === 'user' ? 'bg-stone-700 text-stone-300' : 'bg-chef-gold text-chef-black'}`}>
                        {msg.role === 'user' ? <User size={16} /> : <ChefHat size={16} />}
                      </div>
                      <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-md max-w-[80%] ${msg.role === 'user'
                        ? 'bg-stone-800 text-stone-100 rounded-tr-none'
                        : 'bg-white text-chef-black rounded-tl-none'
                        }`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}

                  {isChefThinking && (
                    <div className="flex items-start gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-chef-gold/50 flex items-center justify-center">
                        <ChefHat size={16} />
                      </div>
                      <div className="px-5 py-3 rounded-2xl rounded-tl-none bg-white/10 text-stone-300 text-sm">
                        思考中...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input Bar - Fixed Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-chef-black via-chef-black to-transparent z-20">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full h-12 px-3 border border-white/10 focus-within:border-chef-gold/50 transition-colors">
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="輸入您的問題..."
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-stone-500 px-3 h-full text-sm"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isChefThinking}
                      className="w-9 h-9 rounded-full bg-chef-gold text-chef-black flex items-center justify-center hover:bg-white transition-all disabled:opacity-30"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-6 pt-5 border-t border-stone-50 text-center cursor-pointer -mx-6 -mb-6 pb-6 rounded-b-[2rem] transition-colors hover:bg-chef-cream/50" onClick={() => setExpanded(!expanded)}>
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500 group-hover:text-chef-black transition-colors">{expanded ? '收合詳情' : '查看完整工法'}</span>
        </div>
      </div>

      {showVerdictModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-chef-black/98 backdrop-blur-xl p-0 md:p-6 animate-fadeIn">
          <div className="bg-white rounded-t-[2.5rem] md:rounded-[3rem] max-w-2xl w-full max-h-[92vh] overflow-y-auto no-scrollbar shadow-floating relative animate-fadeInUp">
            <button onClick={() => setShowVerdictModal(false)} className="absolute top-5 right-5 z-20 p-2.5 bg-chef-black/20 backdrop-blur-md rounded-full text-white"><X size={20} /></button>
            <div className="relative aspect-square md:aspect-video">
              <img src={verdictImage || ''} className="w-full h-full object-cover" alt="User Dish" />
              {isAnalyzingVerdict && <div className="absolute inset-0 bg-chef-black/70 backdrop-blur-md flex flex-col items-center justify-center text-white"><Loader2 size={32} className="animate-spin mb-4 text-chef-gold" /><p className="font-serif text-lg animate-pulse">大師對比分析中...</p></div>}
            </div>

            {/* Error State */}
            {verdictError && !isAnalyzingVerdict && (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-chef-black mb-2">無法評分</h3>
                <p className="text-stone-500 mb-8 max-w-xs mx-auto">{verdictError}</p>
                <button onClick={() => setShowVerdictModal(false)} className="px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold transition-colors">關閉</button>
              </div>
            )}

            {verdict && !isAnalyzingVerdict && (
              <div className="p-8 md:p-12 text-center">
                <div className="flex justify-center items-center gap-6 mb-8">
                  <div className="text-6xl md:text-8xl font-serif font-bold text-chef-black">{verdict.score}</div>
                  <div className="text-left border-l border-stone-100 pl-6">
                    <div className="text-[9px] font-black uppercase tracking-widest text-chef-gold">Soul Score</div>
                    <div className="text-xl md:text-2xl font-serif font-bold">{verdict.badge}</div>
                  </div>
                </div>
                <div className="bg-stone-50 p-7 md:p-10 rounded-[2.5rem] mb-8 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-2"><BarChart2 size={18} className="text-chef-gold" /><h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-chef-black">評鑑維度分析</h4></div>
                  {[
                    { label: '視覺呈現', user: verdict.comparisonData.visual, pro: verdict.comparisonData.proVisual },
                    { label: '創意發想', user: verdict.comparisonData.creativity, pro: verdict.comparisonData.proCreativity },
                    { label: '技術精準', user: verdict.comparisonData.technique, pro: verdict.comparisonData.proTechnique }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest"><span className="text-stone-400">{item.label}</span><span className="text-chef-black">{item.user}%</span></div>
                      <div className="h-1.5 bg-white rounded-full overflow-hidden flex shadow-inner border border-stone-100">
                        <div style={{ width: `${item.user}%` }} className="h-full bg-chef-gold" />
                      </div>
                    </div>
                  ))}
                  <p className="pt-6 border-t border-stone-200 text-xs text-stone-500 leading-relaxed italic font-serif">"{verdict.critique}"</p>
                </div>
                <button onClick={() => setShowVerdictModal(false)} className="w-full py-5 bg-chef-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all">關閉評鑑</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
