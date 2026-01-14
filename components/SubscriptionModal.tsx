import React from 'react';
import { X, Check, Crown, Sparkles, Zap } from 'lucide-react';

interface SubscriptionModalProps {
  onClose: () => void;
}

export const SubscriptionModal: React.FC<SubscriptionModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-[2rem] max-w-4xl w-full overflow-hidden shadow-2xl relative animate-[fadeInUp_0.3s_ease-out] flex flex-col md:flex-row">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-stone-500 transition-colors z-20"
        >
          <X size={20} />
        </button>

        {/* Left Side: Value Prop */}
        <div className="bg-chef-black text-white p-8 md:p-12 md:w-2/5 flex flex-col justify-between relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-chef-gold rounded-full blur-[80px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
           
           <div>
             <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-chef-gold mb-6">
                <Crown size={12} />
                Chef Pro
             </div>
             <h2 className="text-3xl font-serif font-bold mb-4 leading-tight">
               釋放您的<br/>烹飪潛能
             </h2>
             <p className="text-stone-400 text-sm leading-relaxed">
               加入 Chef Pro，獲得米其林等級的 AI 輔助，精準控制營養攝取，讓每一餐都成為藝術。
             </p>
           </div>

           <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-chef-gold">
                    <Sparkles size={16} />
                 </div>
                 <span className="text-sm font-medium">無限次 AI 食譜生成</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-chef-gold">
                    <Zap size={16} />
                 </div>
                 <span className="text-sm font-medium">深度營養微量元素分析</span>
              </div>
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-chef-gold">
                    <Crown size={16} />
                 </div>
                 <span className="text-sm font-medium">優先使用 GPT-4 / Gemini Ultra 模型</span>
              </div>
           </div>
        </div>

        {/* Right Side: Pricing */}
        <div className="p-8 md:p-12 md:w-3/5 bg-stone-50">
           <div className="text-center mb-8">
              <h3 className="text-xl font-bold text-chef-black mb-2">選擇您的方案</h3>
              <p className="text-xs text-stone-500">隨時取消，無隱藏費用</p>
           </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Monthly */}
              <div className="border-2 border-stone-200 rounded-2xl p-6 hover:border-chef-black cursor-pointer transition-all bg-white group relative">
                 <h4 className="font-serif font-bold text-lg text-stone-800">Monthly</h4>
                 <div className="my-4">
                    <span className="text-3xl font-bold text-chef-black">$120</span>
                    <span className="text-stone-400 text-xs"> / 月</span>
                 </div>
                 <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs text-stone-600">
                       <Check size={12} className="text-green-500" /> 完整 Pro 功能
                    </li>
                    <li className="flex items-center gap-2 text-xs text-stone-600">
                       <Check size={12} className="text-green-500" /> 支持多裝置
                    </li>
                 </ul>
                 <button className="w-full py-2 rounded-lg border border-stone-200 text-sm font-bold text-stone-600 group-hover:bg-chef-black group-hover:text-white group-hover:border-chef-black transition-colors">
                    選擇月費
                 </button>
              </div>

              {/* Yearly */}
              <div className="border-2 border-chef-gold rounded-2xl p-6 bg-white cursor-pointer relative shadow-lg transform scale-105 z-10">
                 <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-chef-gold text-chef-black text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                 </div>
                 <h4 className="font-serif font-bold text-lg text-stone-800">Yearly</h4>
                 <div className="my-4">
                    <span className="text-3xl font-bold text-chef-black">$99</span>
                    <span className="text-stone-400 text-xs"> / 月</span>
                 </div>
                 <p className="text-[10px] text-green-600 font-bold mb-4 bg-green-50 inline-block px-2 py-1 rounded">
                    每年省下 $252
                 </p>
                 <ul className="space-y-2 mb-6">
                    <li className="flex items-center gap-2 text-xs text-stone-600">
                       <Check size={12} className="text-green-500" /> 包含所有月費功能
                    </li>
                    <li className="flex items-center gap-2 text-xs text-stone-600">
                       <Check size={12} className="text-green-500" /> 獨家主廚大師課
                    </li>
                    <li className="flex items-center gap-2 text-xs text-stone-600">
                       <Check size={12} className="text-green-500" /> 優先客服支援
                    </li>
                 </ul>
                 <button className="w-full py-2 rounded-lg bg-chef-black text-white text-sm font-bold hover:bg-stone-800 transition-colors shadow-lg">
                    開始 7 天免費試用
                 </button>
              </div>
           </div>

           <div className="mt-8 text-center">
              <p className="text-[10px] text-stone-400">
                 點擊試用即代表您同意 <a href="#" className="underline">服務條款</a> 與 <a href="#" className="underline">隱私權政策</a>。
                 <br/>我們目前僅提供信用卡支付 (Stripe)。
              </p>
           </div>
        </div>

      </div>
    </div>
  );
};