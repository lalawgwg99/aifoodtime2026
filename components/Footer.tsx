
import React from 'react';
import { ChefHat, Globe, ShieldCheck, Mail, FileText, Lock, Beaker } from 'lucide-react';

interface FooterProps {
    onOpenContact: () => void;
    onOpenMethodology: () => void;
    onOpenTerms?: () => void;
    onOpenPrivacy?: () => void;
    onOpenRegion?: () => void;
    onOpenSecurity?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
    onOpenContact,
    onOpenMethodology,
    onOpenTerms,
    onOpenPrivacy,
    onOpenRegion,
    onOpenSecurity
}) => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#1A1818] text-stone-400 py-6 md:py-8 mt-0 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-chef-gold/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6 border-b border-white/10 pb-6">
                    {/* Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-chef-gold/10 rounded-lg flex items-center justify-center border border-chef-gold/20">
                            <ChefHat size={16} className="text-chef-gold" />
                        </div>
                        <span className="text-lg font-serif font-bold text-white tracking-wide">饗味食光</span>
                    </div>

                    {/* Links - Horizontal & Compact */}
                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium tracking-wider uppercase">
                        <span className="text-white/20 hidden md:inline">Support</span>
                        <button onClick={onOpenContact} className="hover:text-chef-gold transition-colors">聯絡客服</button>
                        <button onClick={onOpenMethodology} className="hover:text-chef-gold transition-colors">計算說明</button>

                        <span className="text-white/20 hidden md:inline ml-2">Legal</span>
                        <button onClick={onOpenTerms} className="hover:text-chef-gold transition-colors">使用條款</button>
                        <button onClick={onOpenPrivacy} className="hover:text-chef-gold transition-colors">隱私政策</button>
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
                        <div onClick={onOpenRegion} className="flex items-center gap-1.5 text-stone-500 hover:text-white transition-colors cursor-pointer group">
                            <Globe size={14} className="group-hover:text-chef-gold transition-colors" />
                            <span>繁體中文 (台灣)</span>
                        </div>
                        <div onClick={onOpenSecurity} className="flex items-center gap-1.5 text-stone-500 hover:text-white transition-colors cursor-pointer group">
                            <ShieldCheck size={14} className="group-hover:text-green-500 transition-colors" />
                            <span>Security Audited</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};
