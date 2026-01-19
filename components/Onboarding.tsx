
import React, { useState } from 'react';
import { X, Camera, ChefHat, Mic, Award, Heart, TrendingUp, Globe, Star, ArrowRight } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'story'>('guide');

  const guideSteps = [
    { icon: Camera, title: '📸 一秒看透食材靈魂', desc: '冰箱剩材不再是煩惱，而是未被發掘的寶藏。拍張照，AI 瞬間為您解鎖食材潛力，變幻出令人驚豔的美味提案。' },
    { icon: ChefHat, title: '🍳 把日常餐桌變私廚', desc: '不知道煮什麼？交給 AI 靈感庫。從清冰箱料理到宴客大餐，量身打造專屬於您的味蕾地圖，讓每一餐都充滿期待。' },
    { icon: ArrowRight, title: '👨‍🍳 享受優雅的烹飪 Flow', desc: '告別手忙腳亂。如同主廚在旁輕聲指引，精準掌控每個步驟與火候。讓下廚不再是家務，而是一場療癒身心的儀式。' },
    { icon: Star, title: '✨ 獻給懂生活的探險家', desc: '純淨、無擾、高質感。我們剔除了一切雜訊，只為了讓您沉浸在最純粹的料理美學中，找回對生活的熱愛。' },
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
                <>解鎖您的<span className="text-chef-gold block mt-2">私廚潛能</span></>
              ) : (
                <>一封給美食的<span className="text-chef-gold block mt-2">科技情書</span></>
              )}
            </h2>
            <p className="text-stone-400 text-xs md:text-sm font-medium leading-relaxed hidden md:block mt-4">
              {activeTab === 'guide' ? '5 個步驟，讓 AI 成為您廚房裡最強大的創意夥伴。' : '探索饗味食光背後的初心－用數據找回對生活的熱情。'}
            </p>
          </div>

          {/* Tab Buttons */}
          <div className="flex gap-2 md:gap-3 mt-4 md:mt-8">
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'guide' ? 'bg-chef-gold text-chef-black border-chef-gold' : 'border-white/20 text-stone-400 hover:text-white hover:border-white/40'}`}
            >
              極致體驗
            </button>
            <button
              onClick={() => setActiveTab('story')}
              className={`flex-1 py-2.5 md:py-3 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === 'story' ? 'bg-white text-chef-black border-white' : 'border-white/20 text-stone-400 hover:text-white hover:border-white/40'}`}
            >
              靈魂故事
            </button>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 p-5 md:p-10 bg-stone-50 overflow-y-auto">

          {activeTab === 'guide' && (
            <div className="space-y-3 md:space-y-5 animate-fadeIn">
              {guideSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-4 group bg-white p-4 md:p-5 rounded-2xl shadow-sm hover:shadow-md transition-all border border-transparent hover:border-chef-gold/10">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-id-100 rounded-xl flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all duration-300 shadow-sm">
                    <step.icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-base md:text-lg mb-1 text-chef-black group-hover:text-chef-gold-dark transition-colors">{step.title}</h3>
                    <p className="text-xs md:text-sm text-stone-500 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                  <ArrowRight size={16} className="text-stone-300 shrink-0 mt-1 hidden md:block group-hover:translate-x-1 transition-transform text-chef-gold" />
                </div>
              ))}

              {/* Start Button for Mobile */}
              <button
                onClick={onClose}
                className="w-full py-4 bg-chef-black text-white rounded-2xl font-bold text-sm uppercase tracking-wider mt-4 hover:bg-chef-gold hover:text-chef-black transition-all md:hidden shadow-lg"
              >
                開始探索極致美味 →
              </button>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Quote Card */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-chef-black to-stone-900 text-white rounded-[2rem] relative overflow-hidden shadow-gold-glow">
                <Star className="absolute top-4 right-4 text-chef-gold animate-pulse" size={24} />
                <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-chef-gold/10 rounded-full blur-[40px]"></div>
                <p className="font-serif italic text-lg md:text-xl leading-relaxed text-center relative z-10">
                  「我們解決的不只是『<span className="text-chef-gold border-b border-chef-gold/30">晚餐吃什麼</span>』，<br />而是試圖喚醒那份對<span className="text-chef-gold border-b border-chef-gold/30">生活的熱愛</span>。」
                </p>
              </div>

              {/* Story Content */}
              <div className="space-y-5 text-sm md:text-base text-stone-600 leading-loose">
                <p>
                  <strong className="text-chef-black text-lg block mb-2">一切始於一個簡單的信念。</strong>
                  饗味食光 (SavorChef) 的誕生，源於我們對<span className="text-chef-gold font-bold">數據科學</span>與<span className="text-chef-gold font-bold">烹飪藝術</span>的極致追求。我們相信，科技不該是冰冷的，它應該有溫度、有味道。
                </p>
                <p>
                  在忙碌的現代生活中，冰箱深處的食材常被遺忘，做菜變成了一種機械式的家務。我們問自己：<span className="italic text-stone-800 font-medium">「如果 AI 能像一位米其林主廚朋友一樣，陪你一起料理呢？」</span>
                </p>
                <p>
                  於是，我們運用了 <strong>Gemini AI</strong> 原生多模態能力，賦予了 App <span className="underline decoration-chef-gold/30 decoration-2 underline-offset-2">看見食材</span> 與 <span className="underline decoration-chef-gold/30 decoration-2 underline-offset-2">理解風味</span> 的能力。它不再只是拋給你生硬的食譜，而是能讀懂你的營養需求、理解你的口味偏好，甚至能像一位嚴師般，評鑑你的擺盤美學。
                </p>

                <div className="flex items-center justify-center gap-3 text-chef-terracotta font-bold text-sm pt-6 border-t border-stone-200 mt-6">
                  <Heart size={16} fill="currentColor" className="animate-beat" />
                  <span>讓科技充滿溫度，讓味蕾重拾感動。</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
