import React from 'react';
import { X, Database, Calculator, Info, ExternalLink, ChefHat, Beaker, DollarSign } from 'lucide-react';

interface MethodologyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const MethodologyModal: React.FC<MethodologyModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-stone-100 flex items-center justify-between bg-gradient-to-r from-chef-gold/10 to-transparent">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-chef-gold rounded-xl flex items-center justify-center">
                            <Beaker size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-serif font-bold text-chef-black">數據與計算說明</h2>
                            <p className="text-xs text-stone-500">透明公開的運算原理</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="w-10 h-10 rounded-full hover:bg-stone-100 flex items-center justify-center transition-all">
                        <X size={20} className="text-stone-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(85vh-100px)] space-y-8">

                    {/* Nutrition Data */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <Database size={18} className="text-chef-gold" />
                            <h3 className="font-bold text-lg text-chef-black">營養數據</h3>
                        </div>
                        <div className="bg-stone-50 rounded-2xl p-5 space-y-3">
                            <div className="flex items-start gap-3">
                                <Info size={16} className="text-blue-500 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-stone-700 leading-relaxed">
                                        <strong>熱量（Calories）、蛋白質、碳水化合物、脂肪</strong> 等營養數據，目前由
                                        <strong> Google Gemini AI 模型</strong> 基於食材組成進行估算。
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Calculator size={16} className="text-chef-gold mt-1 shrink-0" />
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    AI 會參考標準食品營養資料庫（如 USDA FoodData Central）的模式進行推估，
                                    但實際數值可能因食材品牌、產地、烹調方式有所差異。
                                </p>
                            </div>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mt-3">
                                <p className="text-xs text-amber-700">
                                    ⚠️ <strong>注意事項：</strong>本站營養數據僅供參考，不應作為醫療或專業營養建議依據。
                                    如有特殊飲食需求，請諮詢專業營養師。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Cost Estimation */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <DollarSign size={18} className="text-green-600" />
                            <h3 className="font-bold text-lg text-chef-black">食材成本預估</h3>
                        </div>
                        <div className="bg-stone-50 rounded-2xl p-5 space-y-3">
                            <div className="flex items-start gap-3">
                                <Calculator size={16} className="text-green-600 mt-1 shrink-0" />
                                <div>
                                    <p className="text-sm text-stone-700 leading-relaxed">
                                        <strong>計算公式：</strong>食材種類數量 × NT$ 22（平均單項成本）
                                    </p>
                                    <p className="text-xs text-stone-500 mt-1">
                                        例如：6 種食材 × NT$22 = NT$132
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Info size={16} className="text-blue-500 mt-1 shrink-0" />
                                <p className="text-sm text-stone-600 leading-relaxed">
                                    此估算基於台灣傳統市場 2024 年平均食材價格，實際費用因購買地點（超市、量販店、市場）
                                    及食材品質（有機、進口）而異。
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Recipe Generation */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <ChefHat size={18} className="text-chef-terracotta" />
                            <h3 className="font-bold text-lg text-chef-black">食譜生成</h3>
                        </div>
                        <div className="bg-stone-50 rounded-2xl p-5 space-y-3">
                            <p className="text-sm text-stone-700 leading-relaxed">
                                所有食譜由 <strong>Google Gemini 2.0</strong> 大型語言模型生成，模型已訓練於大量專業食譜資料。
                                生成過程考量以下因素：
                            </p>
                            <ul className="text-sm text-stone-600 space-y-2 pl-5">
                                <li className="list-disc">使用者輸入的食材偏好</li>
                                <li className="list-disc">選擇的飲食目標（減脂、增肌、快速等）</li>
                                <li className="list-disc">料理風格（日式、台式、義式等）</li>
                                <li className="list-disc">用餐場合（約會、健身後、深夜等）</li>
                            </ul>
                        </div>
                    </section>

                    {/* Data Sources */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <ExternalLink size={18} className="text-stone-500" />
                            <h3 className="font-bold text-lg text-chef-black">參考資料來源</h3>
                        </div>
                        <div className="space-y-2">
                            <a href="https://fdc.nal.usda.gov/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-all group">
                                <div>
                                    <p className="font-medium text-sm text-chef-black">USDA FoodData Central</p>
                                    <p className="text-xs text-stone-500">美國農業部食品營養資料庫</p>
                                </div>
                                <ExternalLink size={16} className="text-stone-400 group-hover:text-chef-gold transition-colors" />
                            </a>
                            <a href="https://consumer.fda.gov.tw/" target="_blank" rel="noopener noreferrer"
                                className="flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-all group">
                                <div>
                                    <p className="font-medium text-sm text-chef-black">衛生福利部食品藥物管理署</p>
                                    <p className="text-xs text-stone-500">台灣食品營養成分資料庫</p>
                                </div>
                                <ExternalLink size={16} className="text-stone-400 group-hover:text-chef-gold transition-colors" />
                            </a>
                        </div>
                    </section>

                    {/* Version & Contact */}
                    <div className="text-center pt-4 border-t border-stone-100">
                        <p className="text-xs text-stone-400">
                            計算模型版本：v1.0.0 | 最後更新：2026-01-15
                        </p>
                        <p className="text-xs text-stone-400 mt-1">
                            如有任何疑問，請透過網站底部「聯絡我們」反映
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
