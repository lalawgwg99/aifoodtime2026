import React from 'react';
import { ChefHat, Globe, ShieldCheck, Mail, FileText, Lock } from 'lucide-react';

interface FooterProps {
    onOpenContact?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenContact }) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1818] text-stone-400 py-12 md:py-16 mt-0 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-chef-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-12 border-b border-white/10 pb-12">

                    {/* Brand Identity */}
                    <div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-chef-gold/10 rounded-xl flex items-center justify-center text-chef-gold">
                                <ChefHat size={20} />
                            </div>
                            <span className="text-xl font-bold text-white tracking-wide font-serif">饗味食光</span>
                        </div>
                        <p className="text-xs text-stone-500 max-w-sm leading-relaxed">
                            結合全球美食趨勢數據與米其林極致私廚工法，
                            <br />為您獻上每一口都有靈魂的味覺體驗。
                        </p>
                    </div>

                    {/* Quick Links Group - Simplified */}
                    <div className="flex flex-wrap gap-8 md:gap-16 text-xs font-bold tracking-wider uppercase">
                        <div className="space-y-4">
                            <span className="text-white/40 block mb-4">Support</span>
                            <button className="block hover:text-chef-gold transition-colors text-left">系統狀態 <span className="text-stone-600 text-[10px] ml-1">Status</span></button>
                            <button onClick={onOpenContact} className="block hover:text-chef-gold transition-colors text-left">聯絡客服 <span className="text-stone-600 text-[10px] ml-1">Contact</span></button>
                            <button className="block hover:text-chef-gold transition-colors text-left">資安回報 <span className="text-stone-600 text-[10px] ml-1">Security</span></button>
                        </div>
                        <div className="space-y-4">
                            <span className="text-white/40 block mb-4">Legal</span>
                            <a href="#" className="block hover:text-chef-gold transition-colors">使用條款 <span className="text-stone-600 text-[10px] ml-1">Terms</span></a>
                            <a href="#" className="block hover:text-chef-gold transition-colors">隱私政策 <span className="text-stone-600 text-[10px] ml-1">Privacy</span></a>
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
