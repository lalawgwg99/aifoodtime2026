
import React, { useState } from 'react';
import { X, Camera, ChefHat, Mic, Award, Heart, Leaf, Sparkles, TrendingUp, Globe } from 'lucide-react';

interface OnboardingProps {
  onClose: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'guide' | 'story'>('guide');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 animate-fadeIn">
      <div className="bg-white rounded-[3rem] max-w-4xl w-full overflow-hidden shadow-floating relative animate-[fadeInUp_0.4s_cubic-bezier(0.16,1,0.3,1)] flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 hover:bg-stone-100 rounded-full text-stone-400 hover:text-stone-600 transition-colors z-20"
        >
          <X size={24} />
        </button>

        {/* Left Side: Visual Identity */}
        <div className="bg-chef-black text-white p-12 md:w-1/3 flex flex-col justify-between relative overflow-hidden shrink-0">
           <div className="absolute top-0 right-0 w-64 h-64 bg-chef-gold/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
           <div>
             <ChefHat size={48} className="text-chef-gold mb-8" />
             <h2 className="text-4xl font-serif font-bold leading-tight mb-4">
               {activeTab === 'guide' ? '主廚<br/>養成手冊' : '靈魂<br/>創作故事'}
             </h2>
             <p className="text-stone-400 text-sm font-medium leading-relaxed">
               {activeTab === 'guide' ? '五個步驟，從料理愛好者晉升為味覺藝術家。' : '這不僅是程式碼，更是對美食的一封情書。'}
             </p>
           </div>
           
           <div className="flex gap-4 mt-12">
              <button 
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'guide' ? 'bg-chef-gold text-chef-black border-chef-gold' : 'border-white/10 text-stone-500 hover:text-white'}`}
              >
                快速指南
              </button>
              <button 
                onClick={() => setActiveTab('story')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${activeTab === 'story' ? 'bg-white text-chef-black border-white' : 'border-white/10 text-stone-500 hover:text-white'}`}
              >
                開發故事
              </button>
           </div>
        </div>

        {/* Right Side: Content */}
        <div className="p-12 md:w-2/3 bg-stone-50 overflow-y-auto no-scrollbar">
          
          {activeTab === 'guide' && (
            <div className="space-y-8 animate-fadeIn">
               <div className="grid grid-cols-1 gap-6">
                  {/* Step 1 */}
                  <div className="flex gap-6 group">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                       <Camera size={24} />
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-xl mb-1">視覺辨識與清冰箱</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">拍下冰箱食材或料理照片，AI 會自動辨識種類並提供「零浪費」食譜建議。</p>
                     </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-6 group">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                       <Mic size={24} />
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-xl mb-1">免手持語音二廚</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">手忙腳亂時，點擊麥克風與 AI 二廚即時對話。它能幫你調整份量或解說複雜工法。</p>
                     </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-6 group">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                       <TrendingUp size={24} />
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-xl mb-1">全球趨勢研究</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">進入社群分頁，調閱由 AI 整理的當季流行食材與擺盤數據，讓創作與世界同步。</p>
                     </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-6 group">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                       <Award size={24} />
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-xl mb-1">米其林大師評比</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">完成後拍照上傳，AI 會量化你與「3 星米其林」在視覺與技術上的差距，並提供優化建議。</p>
                     </div>
                  </div>

                  {/* Step 5 */}
                  <div className="flex gap-6 group">
                     <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-chef-black shrink-0 group-hover:bg-chef-gold group-hover:text-white transition-all">
                       <Globe size={24} />
                     </div>
                     <div>
                        <h3 className="font-serif font-bold text-xl mb-1">食譜社群與二次創作</h3>
                        <p className="text-sm text-stone-500 leading-relaxed">分享你的經典，或「Remix」其他創作者的靈感，將全球創意轉化為你的獨家私廚菜單。</p>
                     </div>
                  </div>
               </div>
            </div>
          )}

          {activeTab === 'story' && (
            <div className="prose prose-stone max-w-none animate-fadeIn space-y-6">
               <div className="p-8 bg-chef-black text-white rounded-[2rem] shadow-premium relative overflow-hidden">
                  <Sparkles className="absolute top-4 right-4 text-chef-gold/30" />
                  <p className="font-serif italic text-lg leading-relaxed mb-0">「我們不只想解決『晚餐吃什麼』，我們想解決的是對生活的麻木。」</p>
               </div>

               <div className="space-y-4 text-sm text-stone-600 leading-loose font-serif">
                 <p>
                   SmartChef 饗味食光的開發初衷，是結合 **數據科學** 與 **廚藝藝術**。在現代忙碌的生活中，冰箱裡的食材往往被遺忘，而料理也逐漸變成一種例行公事。
                 </p>
                 
                 <p>
                   我們利用 **Gemini AI** 的視覺與語言理解力，打破了食譜的僵化。現在，App 能即時進行全球市場調查，讓你了解什麼食材正在流行；它甚至能充當嚴厲且專業的評論家，幫你對標米其林水準。
                 </p>

                 <div className="flex items-center gap-2 text-chef-accent font-black uppercase tracking-widest text-[10px] pt-4 border-t border-stone-200">
                    <Heart size={14} className="text-chef-terracotta" /> 讓科技充滿溫度，讓味蕾重拾感動。
                 </div>
               </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
