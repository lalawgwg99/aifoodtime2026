import React, { useState, useRef } from 'react';
import { Clock, Flame, ChefHat, Heart, Utensils, Camera, X, BarChart2, Loader2, Award, Globe, ShieldCheck, Activity, Leaf, Share2, Check, AlertCircle, User, Send, MessageCircle, ChevronDown } from 'lucide-react';
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
    <div className={`group relative bg-white rounded-[2rem] transition-all duration-500 flex flex-col overflow-hidden w-full ${expanded ? 'shadow-[0_16px_48px_rgba(0,0,0,0.12)] z-20' : 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.1)]'}`}>

      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden cursor-pointer bg-stone-100" onClick={() => setExpanded(!expanded)}>
        {recipe.imageUrl ? (
          <img src={recipe.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt={recipe.name} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🍳</span>
          </div>
        )}

        {/* Floating Badges Group */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/20 flex items-center gap-1">
            <Flame size={12} className="text-orange-500" />
            <span className="text-xs font-bold text-stone-800">{recipe.calories}</span>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-white/20 flex items-center gap-1">
            <Clock size={12} className="text-stone-500" />
            <span className="text-xs font-bold text-stone-800">{recipe.timeMinutes}m</span>
          </div>
        </div>

      </div>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col">

        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-lg font-serif font-bold text-stone-800 leading-snug flex-1 line-clamp-2">{recipe.name}</h3>
            {recipe.matchScore && (
              <div className="shrink-0 flex flex-col items-center">
                <span className="text-sm font-bold text-orange-600">{recipe.matchScore}%</span>
              </div>
            )}
          </div>
          {/* Minimal Meta Line */}
          <div className="flex items-center gap-2 mt-1 text-xs text-stone-500">
            {recipe.tags?.slice(0, 3).join(' • ')}
          </div>
        </div>

        {/* AI Insight - Streamlined */}
        <div className="mb-4">
          <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
            {recipe.healthTip || recipe.matchReason || recipe.description}
          </p>
        </div>

        {/* Actions */}
        <div className="mt-auto grid grid-cols-[1fr_auto] gap-2">
          <button
            onClick={() => setExpanded(!expanded)}
            className="py-2.5 px-4 bg-stone-900 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
          >
            {expanded ? '收起食譜' : '查看作法'}
            <ChevronDown size={14} className={`transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite?.(); }}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFavorite ? 'bg-orange-50 text-orange-600' : 'bg-stone-50 text-stone-400 hover:text-stone-600'}`}
          >
            <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Expanded Content */}
        {expanded && (
          <div className="mt-6 pt-6 border-t border-stone-100 animate-fadeIn space-y-6">

            {/* Ingredients */}
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-stone-800">
                <Utensils size={14} className="text-orange-600" /> 食材
              </h4>
              <ul className="grid grid-cols-1 gap-1.5 pl-1">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="text-sm text-stone-700 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-300 mt-1.5 shrink-0" />
                    {ing}
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div>
              <h4 className="font-bold text-sm mb-3 flex items-center gap-2 text-stone-800">
                <Flame size={14} className="text-orange-600" /> 步驟
              </h4>
              <div className="space-y-4">
                {recipe.instructions.map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="font-serif font-bold text-stone-300 text-lg leading-none">{i + 1}</span>
                    <p className="text-sm text-stone-700 leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bot Action */}
            <button onClick={() => setShowSousChef(!showSousChef)} className="w-full py-3 bg-orange-50 text-orange-700 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors">
              <MessageCircle size={16} /> 有問題？問問二廚
            </button>

            {/* Chat Interface (Simplified for brevity in diff, keeping core logic) */}
            {showSousChef && (
              <div className="bg-stone-50 rounded-2xl p-4 min-h-[300px] flex flex-col">
                <div className="flex-1 overflow-y-auto mb-4 space-y-3 max-h-[300px]" ref={chatContainerRef}>
                  {chatMessages.length === 0 && <p className="text-center text-stone-400 text-sm py-8">二廚已就位，請發問！</p>}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === 'user' ? 'bg-stone-800 text-white self-end ml-8' : 'bg-white text-stone-800 self-start mr-8 shadow-sm'}`}>
                      {msg.text}
                    </div>
                  ))}
                  {isChefThinking && <div className="text-stone-400 text-xs animate-pulse">思考中...</div>}
                </div>
                <div className="flex gap-2">
                  <input
                    value={inputMessage}
                    onChange={e => setInputMessage(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1 bg-white border-none rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-orange-200"
                    placeholder="問問二廚..."
                  />
                  <button onClick={handleSendMessage} className="p-2 bg-orange-600 text-white rounded-xl">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
