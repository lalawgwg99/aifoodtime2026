
import React, { useState } from 'react';
import { X, Camera, ChefHat, Mic, Award, Heart, TrendingUp, Globe, Sparkles, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'story'>('guide');

  const guideSteps = [
    { icon: Camera, title: '📸 AI 視覺廚房', desc: '不只是拍照！結合您的飲食目標（如增肌、減脂），AI 為您量身轉化冰箱食材。' },
    { icon: Mic, title: '💬 問問二廚', desc: '料理過程中有任何問題，隨時輸入詢問，即時獲得專業回覆。' },
    { icon: TrendingUp, title: '📈 趨勢研究', desc: '掌握當季流行食材與擺盤數據' },
    { icon: Award, title: '⭐ 大師評比', desc: '上傳作品，AI 評比你與米其林的差距' },
    { icon: Globe, title: '🌍 社群創作', desc: '分享或 Remix 其他創作者的靈感' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 md:p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] md:rounded-[3rem] w-full max-w-4xl overflow-hidden shadow-floating relative animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)] flex flex-col md:flex-row max-h-[95vh] md:max-h-[85vh]">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 md:top-6 md:right-6 p-2 bg-white/80 md:bg-transparent hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Left Side: Visual Identity - Hidden on Mobile, shows compact header instead */}
        <div className="bg-chef-black text-white p-6 md:p-10 md:w-[35%] flex flex-col justify-between relative overflow-hidden shrink-0">
          <div className="absolute top-0 right-0 w-40 h-40 bg-chef-gold/30 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative z-10">
            <ChefHat size={36} className="text-chef-gold mb-4 md:mb-6" />
            <h2 className="text-2xl md:text-3xl font-serif font-bold leading-tight mb-2 md:mb-3">
              {activeTab === 'guide' ? (
                <>主廚養成<span className="text-chef-gold">手冊</span></>
              ) : (
                <>靈魂創作<span className="text-chef-gold">故事</span></>
              )}
            </h2>
            <p className="text-stone-400 text-xs md:text-sm font-medium leading-relaxed hidden md:block">
              {activeTab === 'guide' ? '五步驟，從料理愛好者晉升為味覺藝術家。' : '這不僅是程式碼，更是對美食的一封情書。'}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 md:gap-3 mt-4 md:mt-8">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'guide' ? 'bg-chef-gold text-chef-black border-chef-gold' : 'border-white/20 text-stone-400 hover:text-white hover:border-white/40'}`}
            >
              快速指南
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'story' ? 'bg-white text-chef-black border-white' : 'border-white/20 text-stone-400 hover:text-white hover:border-white/40'}`}
            >
              開發故事
            </button>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-5 md:p-10 bg-stone-50 overflow-y-auto">

          {activeTab === 'guide' && (
            <div className="space-y-3 md:space-y-5 animate-fadeIn">
              {guideSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group bg-white p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-stone-100 rounded-xl flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                    <step.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base md:text-lg mb-0.5 text-chef-black">{step.title}</h3>
                    <p className="text-xs md:text-sm text-stone-500 leading-relaxed">{step.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-stone-300 shrink-0 mt-1 hidden md:block" />
                </div>
              ))}

              {/* Start Button for Mobile */}
              <button
                onClick={onClose}
                className="w-full py-4 bg-chef-black text-white rounded-2xl font-bold text-sm uppercase tracking-wider mt-4 hover:bg-chef-gold hover:text-chef-black transition-all md:hidden"
              >
                開始探索 →
              </button>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-5 animate-fadeIn">
              {/* Quote Card */}
              <div className="p-5 md:p-6 bg-chef-black text-white rounded-2xl relative overflow-hidden">
                <Sparkles className="absolute top-3 right-3 text-chef-gold/40" size={20} />
                <p className="font-serif italic text-base md:text-lg leading-relaxed">
                  「我們不只想解決『晚餐吃什麼』，我們想解決的是對生活的麻木。」
                </p>
              </div>

              {/* Story Content */}
              <div className="space-y-4 text-sm text-stone-600 leading-relaxed">
                <p>
                  <strong className="text-chef-black">饗味食光</strong>的開發初衷，是結合<span className="text-chef-gold font-bold">數據科學</span>與<span className="text-chef-gold font-bold">廚藝藝術</span>。
                </p>
                <p>
                  在現代忙碌的生活中，冰箱裡的食材往往被遺忘，而料理也逐漸變成一種例行公事。
                </p>
                <p>
                  我們利用 <strong>Gemini AI</strong> 的視覺與語言理解力，打破了食譜的僵化。App 能即時進行全球市場調查，讓你了解什麼食材正在流行；它甚至能充當嚴厲且專業的評論家，幫你對標米其林水準。
                </p>

                <div className="flex items-center gap-2 text-chef-terracotta font-bold text-xs pt-4 border-t border-stone-200">
                  <Heart size={14} fill="currentColor" /> 讓科技充滿溫度，讓味蕾重拾感動。
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
