import React from 'react';
import { Camera, X, Refrigerator, ChefHat, Activity } from 'lucide-react';
import { VisionMode } from '../types';

interface VisionModeModalProps {
    onClose: () => void;
    onSelectMode: (mode: VisionMode) => void;
}

export const VisionModeModal: React.FC<VisionModeModalProps> = ({ onClose, onSelectMode }) => {
    return (
        <div className="fixed inset-0 z-50 bg-chef-paper">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-chef-paper">
                <div className="flex items-center justify-between px-4 h-16">
                    <div className="w-10"></div>
                    <h1 className="text-base font-serif font-bold text-chef-gold tracking-wide">AI 視覺辨識</h1>
                    <button
                        onClick={onClose}
                        className="p-2 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="h-full pt-16 pb-20 flex flex-col items-center justify-start px-6">
                {/* Mode Selection - Horizontal Pills */}
                <div className="flex items-center justify-center gap-4 mb-8 mt-8">
                    {/* 廚神模式 */}
                    <button
                        onClick={() => onSelectMode(VisionMode.FRIDGE_XRAY)}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-stone-900 flex items-center justify-center text-white transition-transform group-hover:scale-110 group-active:scale-95">
                            <Refrigerator size={28} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-stone-600">廚神模式</span>
                    </button>

                    {/* 食客模式 */}
                    <button
                        onClick={() => onSelectMode(VisionMode.TASTE_THIEF)}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center text-stone-700 transition-transform group-hover:scale-110 group-active:scale-95">
                            <ChefHat size={28} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-stone-600">食客模式</span>
                    </button>

                    {/* 營養師模式 */}
                    <button
                        onClick={() => onSelectMode(VisionMode.NUTRI_SCANNER)}
                        className="flex flex-col items-center gap-2 group"
                    >
                        <div className="w-16 h-16 rounded-full bg-white border-2 border-stone-200 flex items-center justify-center text-stone-700 transition-transform group-hover:scale-110 group-active:scale-95">
                            <Activity size={28} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs font-medium text-stone-600">營養師模式</span>
                    </button>
                </div>

                {/* Camera Preview Placeholder */}
                <div className="w-full max-w-md aspect-[4/3] bg-stone-100 border-4 border-stone-900 flex items-center justify-center overflow-hidden relative">
                    {/* Camera Icon */}
                    <div className="text-center">
                        <Camera size={64} className="text-stone-300 mx-auto mb-4" />
                        <p className="text-stone-400 text-sm font-medium px-8">
                            選擇上方模式開始拍攝
                        </p>
                    </div>

                    {/* Corner Brackets */}
                    <div className="absolute inset-8 border-2 border-stone-300 pointer-events-none">
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-stone-400"></div>
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-stone-400"></div>
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-stone-400"></div>
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-stone-400"></div>
                    </div>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-stone-400 mt-6 text-center max-w-xs">
                    點選模式後，相機將自動啟動
                </p>
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-chef-paper border-t border-stone-200 flex items-center justify-around px-8">
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-lg">🏠</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-lg">🍴</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-chef-gold">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <Camera size={20} />
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-lg">🏆</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 flex items-center justify-center">
                        <span className="text-lg">👤</span>
                    </div>
                </button>
            </div>
        </div>
    );
};
