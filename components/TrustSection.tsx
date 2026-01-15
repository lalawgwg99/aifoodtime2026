import React from 'react';
import { Users, ChefHat, Star } from 'lucide-react';

export const TrustSection = () => {
    return (
        <section className="py-20 md:py-32 bg-chef-paper relative overflow-hidden">

            {/* 1. Social Proof Avatars */}
            <div className="flex flex-col items-center mb-16 animate-fadeIn">
                <div className="flex items-center -space-x-4 mb-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-[3px] border-chef-paper overflow-hidden">
                            <img
                                src={`https://i.pravatar.cc/150?img=${i + 10}`}
                                alt="User"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                    <div className="w-12 h-12 rounded-full border-[3px] border-chef-paper bg-chef-black text-white flex items-center justify-center text-xs font-bold">
                        <ChefHat size={20} />
                    </div>
                </div>
                <p className="text-stone-600 font-medium text-lg">
                    與 <span className="font-bold text-[#1A1818] border-b-2 border-chef-gold/50">智能主廚</span> 一起探索美味無限可能。
                </p>
            </div>

            {/* 2. Stats Cards */}
            <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                {/* Card 1 */}
                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-floating transition-all group">
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1818] mb-2 group-hover:scale-110 transition-transform duration-500">
                        ∞<span className="text-chef-gold text-3xl"></span>
                    </h3>
                    <p className="text-xs font-black tracking-[0.2em] text-stone-500 uppercase">Unlimited Recipes</p>
                    <p className="text-sm text-stone-600 mt-1 font-bold">無限食譜生成</p>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-floating transition-all group">
                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-[#1A1818] mb-2 group-hover:scale-110 transition-transform duration-500">
                        24<span className="text-chef-gold text-3xl">/7</span>
                    </h3>
                    <p className="text-xs font-black tracking-[0.2em] text-stone-500 uppercase">Always Available</p>
                    <p className="text-sm text-stone-600 mt-1 font-bold">全天候專屬顧問</p>
                </div>

                {/* Card 3 - Highlight (Gold) */}
                <div className="bg-gradient-to-br from-[#D4AF37] to-[#C5A028] rounded-[2rem] p-8 flex flex-col items-center justify-center text-center shadow-gold-glow relative overflow-hidden group">
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute -right-10 -top-10 text-white/10">
                        <Star size={120} fill="currentColor" />
                    </div>

                    <h3 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-500 relative z-10">
                        92<span className="text-3xl">%</span>
                    </h3>
                    <p className="text-xs font-black tracking-[0.2em] text-white/90 uppercase relative z-10">Taiwanese Flavor</p>
                    <p className="text-sm text-white/90 mt-1 font-bold relative z-10">在地口味精準度</p>
                </div>

            </div>

        </section>
    );
};
