import React from 'react';
import { ChefHat, Globe, ShieldCheck, Mail, FileText, Lock, Beaker } from 'lucide-react';

interface FooterProps {
    onOpenContact?: () => void;
    onOpenMethodology?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact, onOpenMethodology }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1818] text-stone-400 py-4 md:py-6 mt-0 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-chef-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4 mb-4 border-b border-white/5 pb-4">
                    {/* Brand Identity - Compact */}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-chef-gold/10 rounded-lg flex items-center justify-center text-chef-gold">
                                <ChefHat size={16} />
                            </div>
                            <span className="text-lg font-bold text-white tracking-wide font-serif">饗味食光</span>
                        </div>
                        <p className="text-[10px] text-stone-500 max-w-md leading-relaxed hidden md:block">
                            結合全球美食趨勢數據與米其林極致私廚工法，為您獻上每一口都有靈魂的味覺體驗。
                        </p>
                    </div>

                    {/* Quick Links Group - Horizontal & Compact */}
                    <div className="flex flex-row flex-wrap gap-x-8 gap-y-2 text-[10px] font-bold tracking-wider uppercase items-center">
                        <div className="flex items-center gap-4">
                            <span className="text-white/30 text-[9px]">Support</span>
                            <button onClick={onOpenContact} className="hover:text-chef-gold transition-colors">聯絡客服</button>
                            <button onClick={onOpenMethodology} className="hover:text-chef-gold transition-colors">計算說明</button>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-white/30 text-[9px]">Legal</span>
                            <a href="#" className="hover:text-chef-gold transition-colors">使用條款</a>
                            <a href="#" className="hover:text-chef-gold transition-colors">隱私政策</a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] md:text-xs">
                    <div className="flex items-center gap-2 text-stone-600">
                        <span>&copy; {currentYear} SavorChef Inc.</span>
                        <span className="w-1 h-1 bg-stone-700 rounded-full" />
                        <span>All rights reserved.</span>
                    </div>

                    {/* Trust Badges / Social */}
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1.5 text-stone-500 hover:text-white transition-colors cursor-pointer">
                            <Globe size={14} />
                            <span>繁體中文 (台灣)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-stone-500 hover:text-white transition-colors cursor-pointer">
                            <ShieldCheck size={14} />
                            <span>Security Audited</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
