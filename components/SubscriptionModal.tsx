import React, { useState } from 'react';
import { X, Check, Crown, Sparkles, Zap, Camera, Award, TrendingUp, Infinity, Shield, MessageCircle } from 'lucide-react';

interface SubscriptionModalProps {
   onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
   const [plan, setPlan] = useState<'monthly' | 'yearly'>('yearly');

   const proFeatures = [
      { icon: Infinity, title: '無限 AI 食譜', desc: '每日不限次數生成專屬食譜' },
      { icon: Camera, title: '進階視覺辨識', desc: '拍照清冰箱、味道偷師、營養掃描' },
      { icon: Award, title: '米其林評比', desc: '上傳成品照，AI 對標三星水準' },
      { icon: TrendingUp, title: '趨勢分析', desc: '掌握全球當季流行食材與擺盤' },
      { icon: Shield, title: '無廣告體驗', desc: '純淨閱讀，專注料理' },
      { icon: MessageCircle, title: '優先客服', desc: '24 小時內回覆您的問題' },
   ];

   return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 backdrop-blur-sm p-3 md:p-4 animate-fadeIn">
         <div className="bg-white rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl relative animate-[fadeInUp_0.3s_ease-out] max-h-[95vh] overflow-y-auto">

            {/* Close Button */}
            <button
               onClick={onClose}
               className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-stone-500 transition-colors z-20"
            >
               <X size={18} />
            </button>

            {/* Header - Luxury Black Gold */}
            <div className="bg-gradient-to-br from-chef-black via-stone-900 to-chef-black text-white p-6 md:p-8 text-center relative overflow-hidden">
               <div className="absolute inset-0 bg-silk opacity-20 pointer-events-none"></div>
               <div className="absolute top-0 right-0 w-40 h-40 bg-chef-gold rounded-full blur-[60px] opacity-30 -translate-y-1/2 translate-x-1/3 animate-pulse"></div>

               <div className="relative z-10">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-chef-gold to-chef-gold-dark px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-chef-black mb-4 shadow-lg shadow-chef-gold/20">
                     <Crown size={14} />
                     Chef Pro
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif font-bold mb-2">
                     解鎖<span className="text-transparent bg-clip-text bg-gradient-to-r from-chef-gold to-white">米其林級</span>體驗
                  </h2>
                  <p className="text-stone-400 text-sm">讓 AI 成為您的私人主廚顧問</p>
               </div>
            </div>

            {/* Plan Toggle */}
            <div className="p-4 md:p-6 bg-paper">
               <div className="flex bg-stone-100/50 rounded-2xl p-1.5 mb-6 border border-stone-200">
                  <button
                     onClick={() => setPlan('monthly')}
                     className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${plan === 'monthly' ? 'bg-white shadow-card text-chef-black border border-stone-100' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                     月費方案
                  </button>
                  <button
                     onClick={() => setPlan('yearly')}
                     className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all relative ${plan === 'yearly' ? 'bg-gradient-to-br from-chef-black to-stone-800 shadow-lg text-chef-gold border border-chef-black' : 'text-stone-500 hover:text-stone-700'}`}
                  >
                     年費方案
                     <span className="absolute -top-2 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">省17%</span>
                  </button>
               </div>

               {/* Price Display */}
               <div className="text-center mb-6">
                  <div className="flex items-baseline justify-center gap-1">
                     <span className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-chef-black to-stone-600">
                        ${plan === 'monthly' ? '120' : '99'}
                     </span>
                     <span className="text-stone-400 text-sm">/ 月</span>
                  </div>
                  {plan === 'yearly' && (
                     <p className="text-green-600 text-xs font-medium mt-1">
                        年繳 $1,188，每年省下 $252
                     </p>
                  )}
               </div>

               {/* Features Grid */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                  {proFeatures.map((feature, idx) => (
                     <div key={idx} className="flex items-start gap-2 p-3 bg-white border border-stone-100 rounded-xl hover:border-chef-gold/30 hover:shadow-gold-glow transition-all group">
                        <feature.icon size={16} className="text-chef-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                        <div>
                           <p className="text-xs font-bold text-chef-black">{feature.title}</p>
                           <p className="text-[10px] text-stone-500 leading-snug">{feature.desc}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* CTA */}
               <button className="w-full py-4 bg-gradient-to-r from-chef-gold to-chef-gold-dark text-white rounded-2xl font-bold text-sm uppercase tracking-wider hover:shadow-gold-glow hover:scale-[1.02] active:scale-[0.98] transition-all relative overflow-hidden group">
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                     {plan === 'yearly' ? '開始 7 天免費試用' : '立即訂閱'} <Sparkles size={16} />
                  </span>
               </button>

               <p className="text-center text-[10px] text-stone-400 mt-4 leading-relaxed">
                  點擊即同意 <a href="#" className="underline text-stone-500 hover:text-chef-gold">服務條款</a> 與 <a href="#" className="underline text-stone-500 hover:text-chef-gold">隱私政策</a>
                  <br />支援信用卡 / Apple Pay / Google Pay
               </p>
            </div>
         </div>
      </div>
   );
};