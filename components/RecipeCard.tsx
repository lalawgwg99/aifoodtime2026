
import React, { useState, useRef } from 'react';
import { Clock, Flame, ChefHat, Heart, Utensils, Camera, X, BarChart2, Loader2, Award, Globe, ShieldCheck, Activity, Leaf, Share2, Check, AlertCircle, User, Send, MessageCircle, Sparkles, ChevronDown } from 'lucide-react';
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
    const currentInput = inputMessage;
    setInputMessage("");
    setIsChefThinking(true);

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

    const shareText = `【饗味食光 SavorChef】\n主廚推薦：${recipe.name}\n\n"${recipe.description}"\n\n🔥 熱量：${recipe.calories} Kcal\n⏱️ 時間：${recipe.timeMinutes} Min\n\n快來試試這道 AI 私廚料理！`;
    const shareUrl = window.location.href;

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
    <div className={`group relative bg-white rounded-3xl transition-all duration-500 flex flex-col overflow-hidden ${expanded ? 'shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-20' : 'shadow-[0_8px_24px_rgba(0,0,0,0.08)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.12)] hover:-translate-y-1'}`}>

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-gradient-to-br from-stone-50 to-orange-50" onClick={() => setExpanded(!expanded)}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={recipe.name} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-32 h-32">
              <div className="absolute inset-0 animate-spin" style={{ animationDuration: '12s' }}>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 text-2xl">🥬</span>
                <span className="absolute top-1/4 right-0 text-2xl">🍅</span>
                <span className="absolute bottom-1/4 right-0 text-2xl">🥕</span>
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 text-2xl">🐟</span>
                <span className="absolute bottom-1/4 left-0 text-2xl">🥩</span>
                <span className="absolute top-1/4 left-0 text-2xl">🍳</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                  <ChefHat size={32} className="text-orange-600" />
                </div>
              </div>
            </div>
            <p className="absolute bottom-6 text-stone-400 text-sm font-medium">AI 生成料理圖片中...</p>
          </div>
        )}

        {/* Calorie Badge - Floating */}
        <div className="absolute top-4 right-4 z-20">
          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm shadow-lg border border-orange-100 flex items-center gap-1.5">
            <Flame size={14} className="text-orange-600" />
            <span className="text-sm font-bold text-stone-800">{recipe.calories} Kcal</span>
          </div>
        </div>

        {/* Public/Private Badge */}
        {recipe.isUserCreated && (
          <div className="absolute top-4 left-4 z-20">
            <div className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm border border-stone-200 text-stone-700 text-xs font-bold flex items-center gap-1.5">
              {recipe.isPublic ? <Globe size={12} /> : <ShieldCheck size={12} />}
              {recipe.isPublic ? '公開' : '私人'}
            </div>
          </div>
        )}

        {/* Favorite & Share Buttons */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`p-2.5 rounded-full transition-all backdrop-blur-sm ${isCopied ? 'bg-green-500 text-white' : 'bg-white/90 text-stone-600 hover:bg-white hover:text-orange-600'} shadow-lg`}
            title="分享食譜"
          >
            {isCopied ? <Check size={16} /> : <Share2 size={16} />}
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
            className={`p-2.5 rounded-full transition-all backdrop-blur-sm ${isFavorite ? 'bg-orange-600 text-white' : 'bg-white/90 text-stone-600 hover:bg-white hover:text-orange-600'} shadow-lg`}
            title="收藏食譜"
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">

        {/* Title & Tags */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-xl md:text-2xl font-serif font-bold text-stone-800 leading-tight flex-1">{recipe.name}</h3>
            <div className="shrink-0 text-right">
              <span className="text-sm font-bold text-orange-600">{recipe.matchScore}%</span>
              <p className="text-[9px] text-stone-400 uppercase tracking-wider">匹配</p>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-stone-600">
            <span className="flex items-center gap-1.5">
              <Clock size={14} className="text-orange-500" />
              {recipe.timeMinutes} 分鐘
            </span>
            <span className="flex items-center gap-1.5">
              <Activity size={14} className="text-orange-500" />
              中等難度
            </span>
          </div>
        </div>

        {/* AI Recommendation Reason (參考設計的藍色區塊，我改為橘色) */}
        <div className="mb-4 p-4 bg-gradient-to-r from-orange-50 to-orange-100/50 rounded-2xl border border-orange-200/50">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={16} className="text-orange-600" />
            <h4 className="text-xs font-bold text-orange-900 uppercase tracking-wider">AI 推薦理由</h4>
          </div>
          <p className="text-sm text-stone-700 leading-relaxed">
            {recipe.healthTip || "根據您的飲食習慣，AI 建議今日嘗試此料理。營養均衡且風味獨特，建議搭配全穀雜糧主食一起享用。"}
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setExpanded(!expanded)}
            className="py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            開始烹飪
            <ChevronDown size={16} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
            className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${isFavorite ? 'border-orange-600 bg-orange-50 text-orange-700' : 'border-stone-200 bg-white text-stone-600 hover:border-orange-300 hover:bg-orange-50'}`}
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            收藏食譜
          </button>
        </div>

        {/* Expanded Content */}
        <div className={`transition-all duration-700 overflow-hidden ${expanded ? 'max-h-[3000px] opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>

          {/* Nutrition */}
          {recipe.macros && (
            <div className="mb-6 pb-6 border-b border-stone-100">
              <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-stone-800 uppercase tracking-wider">
                <Activity size={16} className="text-orange-600" /> 營養成分
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-stone-50 rounded-xl">
                  <div className="text-2xl font-bold text-stone-800">{recipe.macros.protein}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider">蛋白質</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-xl">
                  <div className="text-2xl font-bold text-stone-800">{recipe.macros.carbs}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider">碳水</div>
                </div>
                <div className="text-center p-3 bg-stone-50 rounded-xl">
                  <div className="text-2xl font-bold text-stone-800">{recipe.macros.fat}</div>
                  <div className="text-xs text-stone-500 uppercase tracking-wider">脂肪</div>
                </div>
              </div>
            </div>
          )}

          {/* Ingredients */}
          <div className="mb-6 pb-6 border-b border-stone-100">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-stone-800 uppercase tracking-wider">
              <Utensils size={16} className="text-orange-600" /> 食材清單
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="text-sm text-stone-700 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-600 shrink-0" />
                  {ing}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mb-6">
            <h4 className="font-bold text-sm mb-4 flex items-center gap-2 text-stone-800 uppercase tracking-wider">
              <Flame size={16} className="text-orange-600" /> 烹飪步驟
            </h4>
            <div className="space-y-4">
              {recipe.instructions.map((step, i) => (
                <div key={i} className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-sm text-stone-700 leading-relaxed flex-1 pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Advanced Actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setShowSousChef(!showSousChef)} className={`py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${showSousChef ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-700 hover:bg-orange-50'}`}>
              <MessageCircle size={14} /> 問問二廚
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 border-2 border-dashed border-stone-200 text-stone-600 hover:border-orange-300 hover:text-orange-600 transition-all">
              <Camera size={14} /> 成品評鑑
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleVerdictUpload} />
            </button>
          </div>

          {/* Sous Chef Chat */}
          {showSousChef && (
            <div className="mt-6 bg-stone-900 rounded-3xl p-6 relative overflow-hidden min-h-[400px] flex flex-col">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/5 rounded-full blur-3xl" />

              {/* Header */}
              <div className="flex items-center justify-between mb-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-600/20 flex items-center justify-center text-orange-500">
                    <ChefHat size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">問問二廚</h3>
                    <p className="text-stone-400 text-xs">有任何料理問題，儘管問我！</p>
                  </div>
                </div>
                <button onClick={() => setShowSousChef(false)} className="p-2 rounded-full bg-white/10 text-stone-300 hover:bg-white/20 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Chat Area */}
              <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-20 relative z-10">
                {chatMessages.length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-60 mt-8">
                    <MessageCircle size={48} className="text-orange-500 mb-4" />
                    <p className="text-white text-lg font-medium mb-2">"這道菜要煮多久？"</p>
                    <p className="text-stone-400 text-sm">輸入您的問題，二廚馬上回覆</p>
                  </div>
                )}

                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-stone-700 text-stone-300' : 'bg-orange-600 text-white'}`}>
                      {msg.role === 'user' ? <User size={16} /> : <ChefHat size={16} />}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm max-w-[80%] ${msg.role === 'user' ? 'bg-stone-800 text-stone-100 rounded-tr-none' : 'bg-white text-stone-800 rounded-tl-none'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}

                {isChefThinking && (
                  <div className="flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-orange-600/50 flex items-center justify-center">
                      <ChefHat size={16} />
                    </div>
                    <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/10 text-stone-300 text-sm">思考中...</div>
                  </div>
                )}
              </div>

              {/* Input Bar */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-stone-900 z-20">
                <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-full px-3 border border-white/10 focus-within:border-orange-500/50">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="輸入您的問題..."
                    className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-stone-500 px-3 py-3 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isChefThinking}
                    className="w-9 h-9 rounded-full bg-orange-600 text-white flex items-center justify-center hover:bg-orange-700 transition-all disabled:opacity-30"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Verdict Modal */}
      {showVerdictModal && (
        <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-xl p-0 md:p-6">
          <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative">
            <button onClick={() => setShowVerdictModal(false)} className="absolute top-5 right-5 z-20 p-2.5 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40">
              <X size={20} />
            </button>
            <div className="relative aspect-square md:aspect-video">
              <img src={verdictImage || ''} className="w-full h-full object-cover" alt="User Dish" />
              {isAnalyzingVerdict && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex flex-col items-center justify-center text-white">
                  <Loader2 size={32} className="animate-spin mb-4 text-orange-500" />
                  <p className="font-bold text-lg">大師對比分析中...</p>
                </div>
              )}
            </div>

            {verdictError && !isAnalyzingVerdict && (
              <div className="p-12 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={40} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">無法評分</h3>
                <p className="text-stone-500 mb-8 max-w-xs mx-auto">{verdictError}</p>
                <button onClick={() => setShowVerdictModal(false)} className="px-8 py-3 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-xl font-bold transition-colors">關閉</button>
              </div>
            )}

            {verdict && !isAnalyzingVerdict && (
              <div className="p-8 md:p-12 text-center">
                <div className="flex justify-center items-center gap-6 mb-8">
                  <div className="text-6xl md:text-8xl font-bold text-stone-800">{verdict.score}</div>
                  <div className="text-left border-l border-stone-200 pl-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-orange-600">Soul Score</div>
                    <div className="text-xl md:text-2xl font-bold">{verdict.badge}</div>
                  </div>
                </div>
                <div className="bg-stone-50 p-8 rounded-3xl mb-8 space-y-6 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <BarChart2 size={18} className="text-orange-600" />
                    <h4 className="text-xs font-bold uppercase tracking-wider text-stone-800">評鑑維度分析</h4>
                  </div>
                  {[
                    { label: '視覺呈現', user: verdict.comparisonData.visual },
                    { label: '創意發想', user: verdict.comparisonData.creativity },
                    { label: '技術精準', user: verdict.comparisonData.technique }
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-3">
                      <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                        <span className="text-stone-500">{item.label}</span>
                        <span className="text-stone-800">{item.user}%</span>
                      </div>
                      <div className="h-2 bg-white rounded-full overflow-hidden shadow-inner border border-stone-100">
                        <div style={{ width: `${item.user}%` }} className="h-full bg-orange-600" />
                      </div>
                    </div>
                  ))}
                  <p className="pt-6 border-t border-stone-200 text-xs text-stone-600 leading-relaxed italic">"{verdict.critique}"</p>
                </div>
                <button onClick={() => setShowVerdictModal(false)} className="w-full py-4 bg-orange-600 text-white rounded-2xl font-bold text-sm uppercase tracking-wider shadow-xl hover:bg-orange-700 transition-all">關閉評鑑</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
