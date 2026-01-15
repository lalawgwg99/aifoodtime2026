import React from 'react';
import { X, Check, ChefHat } from 'lucide-react';

interface LoginBenefitsModalProps {
    onClose: () => void;
    onLogin: () => void;
}

export const LoginBenefitsModal: React.FC<LoginBenefitsModalProps> = ({ onClose, onLogin }) => {
    return (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-chef-paper rounded-[2rem] max-w-lg w-full overflow-hidden shadow-2xl relative animate-[fadeInUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">

                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-black/5 hover:bg-black/10 rounded-full text-stone-500 transition-colors z-20">
                    <X size={20} />
                </button>

                <div className="p-8 pb-4 text-center">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">為什麼要登入？</p>
                    <h3 className="text-2xl font-serif font-bold text-chef-black">解鎖完整 AI 私廚體驗</h3>
                </div>

                <div className="p-6 space-y-4">
                    {/* Member Column (Luxury Black Gold) - Highlighted */}
                    <div className="bg-gradient-to-br from-chef-black via-stone-900 to-chef-black rounded-2xl p-6 border border-chef-gold shadow-gold-glow relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-full bg-silk opacity-10 pointer-events-none"></div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-chef-gold/20 rounded-full blur-3xl group-hover:bg-chef-gold/30 transition-all duration-700"></div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-chef-gold rounded-full animate-pulse"></div>
                                <h4 className="font-bold text-white text-lg">會員專享</h4>
                            </div>
                            <ul className="space-y-4 text-sm text-white font-medium">
                                <li className="flex items-start gap-3">
                                    <Check className="text-chef-gold shrink-0 mt-0.5" size={16} />
                                    <span>無限個人化菜單</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="text-chef-gold shrink-0 mt-0.5" size={16} />
                                    <span>跨裝置雲端同步</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="text-chef-gold shrink-0 mt-0.5" size={16} />
                                    <span>專屬 AI 口味模型</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check className="text-chef-gold shrink-0 mt-0.5" size={16} />
                                    <span>建立您的味覺記憶庫</span>
                                </li>
                            </ul>
                            <button onClick={onLogin} className="w-full mt-8 py-3.5 bg-gradient-to-r from-chef-gold to-chef-gold-dark text-white rounded-xl font-bold text-sm hover:shadow-gold-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                立即免費註冊 / 登入 <ChefHat size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Free Column - Secondary */}
                    <div className="bg-white rounded-2xl p-6 border border-stone-200">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 bg-stone-300 rounded-full"></div>
                            <h4 className="font-bold text-stone-500">訪客體驗</h4>
                        </div>
                        <ul className="space-y-3 text-sm text-stone-400">
                            <li className="flex items-start gap-2">
                                <span>○ 每日僅限 3 次靈感</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>○ 無法收藏任何食譜</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>○ 僅提供通用建議</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span>○ 離開後無歷史記錄</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};
