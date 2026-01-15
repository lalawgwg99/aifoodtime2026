
import React, { useState } from 'react';
import { X, AlertCircle, LogIn } from 'lucide-react';

interface UsageLimitModalProps {
    onClose: () => void;
    onLogin: () => void;
    remainingUses: number;
}

export const UsageLimitModal: React.FC<UsageLimitModalProps> = ({ onClose, onLogin, remainingUses }) => {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl relative animate-[fadeInUp_0.3s_ease-out]">

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="text-amber-600" size={32} />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-serif font-bold text-center mb-3 text-chef-black">
                    {remainingUses === 0 ? '今日免費額度已用完' : `剩餘 ${remainingUses} 次免費使用`}
                </h2>

                {/* Description */}
                <p className="text-center text-stone-600 text-sm mb-8 leading-relaxed">
                    {remainingUses === 0
                        ? '未登入用戶每日限用 3 次。登入後即可無限使用所有功能，並解鎖專屬特色！'
                        : '未登入用戶每日可使用 3 次 AI 食譜生成。登入後無限制！'
                    }
                </p>

                {/* CTA */}
                <div className="space-y-3">
                    <button
                        onClick={onLogin}
                        className="w-full py-4 bg-chef-black text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-chef-gold hover:text-chef-black transition-all"
                    >
                        <LogIn size={18} />
                        立即登入解鎖
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-3 text-stone-500 text-sm font-medium hover:text-stone-700 transition-colors"
                    >
                        稍後再說
                    </button>
                </div>

                {/* Benefits */}
                <div className="mt-6 pt-6 border-t border-stone-100">
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">登入後解鎖</p>
                    <ul className="space-y-2 text-xs text-stone-600">
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-chef-gold rounded-full"></span>
                            無限 AI 食譜生成
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-chef-gold rounded-full"></span>
                            語音二廚助手
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-chef-gold rounded-full"></span>
                            米其林大師評比
                        </li>
                        <li className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-chef-gold rounded-full"></span>
                            跨裝置收藏同步
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};
