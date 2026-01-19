
import React from 'react';
import { Utensils, Sparkles } from 'lucide-react';

export const PremiumLoading = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-chef-paper flex flex-col items-center justify-center animate-fadeIn relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-1/4 right-1/4 opacity-5">
                <Sparkles size={120} className="text-chef-gold" />
            </div>
            <div className="absolute bottom-1/4 left-1/4 opacity-5">
                <Sparkles size={80} className="text-chef-gold" />
            </div>

            {/* Logo Ring Animation */}
            <div className="relative w-40 h-40 mb-10">
                {/* Outer Ring - Slower Rotation */}
                <div className="absolute inset-0 border-[3px] border-chef-gold/30 rounded-full"></div>

                {/* Spinning Ring */}
                <div
                    className="absolute inset-0 border-[3px] border-transparent border-t-chef-gold border-r-chef-gold rounded-full"
                    style={{
                        animation: 'spin 2s linear infinite'
                    }}
                ></div>

                {/* Inner Ring - Reverse Rotation */}
                <div
                    className="absolute inset-6 border-[2px] border-transparent border-b-chef-gold/60 border-l-chef-gold/60 rounded-full"
                    style={{
                        animation: 'spin 1.5s linear infinite reverse'
                    }}
                ></div>

                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                        <Utensils size={48} className="text-chef-gold-dark" strokeWidth={1.5} />
                        {/* Pulse Dot */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-chef-gold rounded-full animate-ping"></div>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <h3 className="text-2xl md:text-3xl font-serif font-bold text-stone-900 mb-2 tracking-tight text-center px-8">
                編排私人米其林食譜...
            </h3>

            {/* Divider */}
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent via-chef-gold to-transparent mb-4 opacity-60"></div>

            {/* Subtitle */}
            <p className="text-stone-500 text-sm font-medium tracking-[0.2em] uppercase animate-pulse">
                正在尋找最適合的烹飪工法
            </p>

            {/* Decorative Sparkle - Bottom Right */}
            <div className="absolute bottom-24 right-16 animate-float">
                <Sparkles size={32} className="text-chef-gold opacity-30" />
            </div>

            {/* Decorative Sparkle - Top Left */}
            <div className="absolute top-32 left-20 animate-float" style={{ animationDelay: '1s' }}>
                <Sparkles size={24} className="text-chef-gold opacity-20" />
            </div>
        </div>
    );
};
