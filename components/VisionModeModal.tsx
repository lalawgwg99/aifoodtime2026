
import React from 'react';
import { Camera, Utensils, Activity, X, ScanLine, ChefHat, Refrigerator } from 'lucide-react';
import { VisionMode } from '../types';

interface VisionModeModalProps {
    onClose: () => void;
    onSelectMode: (mode: VisionMode) => void;
}

export const VisionModeModal: React.FC<VisionModeModalProps> = ({ onClose, onSelectMode }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative bg-stone-900 border border-stone-800 w-full max-w-4xl rounded-3xl p-6 md:p-12 shadow-2xl animate-scaleIn overflow-hidden">

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-chef-gold/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-900/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 text-stone-500 hover:text-white transition-colors z-10"
                >
                    <X size={24} />
                </button>

                <div className="text-center mb-12 relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-chef-gold/10 border border-chef-gold/20 text-chef-gold text-xs font-bold uppercase tracking-widest mb-4">
                        <ScanLine size={14} />
                        AI Vision Engine
                    </div>
                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-white mb-4">
                        請選擇 <span className="text-chef-gold">視覺辨識</span> 模式
                    </h2>
                    <p className="text-stone-400 text-lg">
                        SavorChef 的 AI 之眼能看穿食材的靈魂。您現在想做什麼？
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

                    {/* Mode 1: Fridge X-Ray (Cooking) */}
                    <button
                        onClick={() => onSelectMode(VisionMode.FRIDGE_XRAY)}
                        className="group relative flex flex-col items-center p-8 rounded-2xl bg-stone-800/50 border border-stone-700 hover:border-chef-gold hover:bg-stone-800 transition-all duration-300 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-stone-700 group-hover:bg-chef-gold text-white group-hover:text-black flex items-center justify-center transition-all mb-6 shadow-lg">
                            <Refrigerator size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-chef-gold transition-colors">廚神模式</h3>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Fridge X-Ray</div>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            拍下冰箱或檯面食材，AI 立即為您生成三道米其林食譜。
                            <span className="block mt-2 text-xs text-stone-500">適合：清冰箱、尋找靈感</span>
                        </p>
                    </button>

                    {/* Mode 2: Taste Thief (Dining) */}
                    <button
                        onClick={() => onSelectMode(VisionMode.TASTE_THIEF)}
                        className="group relative flex flex-col items-center p-8 rounded-2xl bg-stone-800/50 border border-stone-700 hover:border-orange-500 hover:bg-stone-800 transition-all duration-300 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-stone-700 group-hover:bg-orange-500 text-white flex items-center justify-center transition-all mb-6 shadow-lg">
                            <ChefHat size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-orange-500 transition-colors">食客模式</h3>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Taste Thief</div>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            在餐廳拍下美食，AI 幫您拆解食材、風味與烹飪秘密。
                            <span className="block mt-2 text-xs text-stone-500">適合：外食紀錄、美食分析</span>
                        </p>
                    </button>

                    {/* Mode 3: Nutri Scanner (Health) */}
                    <button
                        onClick={() => onSelectMode(VisionMode.NUTRI_SCANNER)}
                        className="group relative flex flex-col items-center p-8 rounded-2xl bg-stone-800/50 border border-stone-700 hover:border-green-500 hover:bg-stone-800 transition-all duration-300 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-stone-700 group-hover:bg-green-500 text-white flex items-center justify-center transition-all mb-6 shadow-lg">
                            <Activity size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-500 transition-colors">營養師模式</h3>
                        <div className="text-xs font-bold text-stone-500 uppercase tracking-widest mb-4">Nutri Scanner</div>
                        <p className="text-stone-400 text-sm leading-relaxed">
                            掃描單一食物或標籤，獲得精確的熱量分析與健康紅綠燈。
                            <span className="block mt-2 text-xs text-stone-500">適合：健身、飲控、過敏檢查</span>
                        </p>
                    </button>

                </div>
            </div>
        </div>
    );
};
