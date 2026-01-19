import React, { useState, useEffect } from 'react';
import { X, Shield, FileText } from 'lucide-react';

interface LegalModalProps {
    initialTab: 'terms' | 'privacy';
    onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ initialTab, onClose }) => {
    const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-chef-paper w-full max-w-3xl rounded-[2rem] shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-scaleIn border border-stone-200">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200 bg-white/50 backdrop-blur-sm shrink-0">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'terms' ? 'bg-chef-black text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                                }`}
                        >
                            <FileText size={16} /> 使用條款
                        </button>
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'privacy' ? 'bg-chef-black text-white' : 'text-stone-400 hover:bg-stone-100 hover:text-stone-600'
                                }`}
                        >
                            <Shield size={16} /> 隱私政策
                        </button>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-stone-100 text-stone-500 hover:bg-stone-200 transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-8 md:p-12 space-y-8 text-stone-800">
                    {activeTab === 'terms' ? (
                        <div className="prose prose-stone max-w-none">
                            <h2 className="font-serif text-3xl font-bold mb-6 text-chef-black">使用條款 (Terms of Service)</h2>
                            <p className="text-sm text-stone-500 mb-8">最後更新日期：2026年1月19日</p>

                            <h3 className="text-xl font-bold mb-3">1. 同意條款</h3>
                            <p className="mb-6">歡迎使用「饗味食光」(SavorChef)。當您存取或使用本服務時，即代表您同意受本協議之約束。若您不同意任何條款，請勿使用本服務。</p>

                            <h3 className="text-xl font-bold mb-3">2. 服務內容</h3>
                            <p className="mb-6">本服務運用人工智慧技術，提供食材分析、食譜生成及烹飪建議。AI 生成內容僅供參考，請使用者在實際烹飪時自行判斷食材安全性與烹飪環境安全。</p>

                            <h3 className="text-xl font-bold mb-3">3. 使用者責任</h3>
                            <p className="mb-6">您同意不將本服務用於任何非法用途，不干擾服務運行，且不嘗試破解或逆向工程本系統。對於您上傳的任何內容（如料理照片），您聲明並保證擁有相應的權利。</p>

                            <h3 className="text-xl font-bold mb-3">4. 智慧財產權</h3>
                            <p className="mb-6">本服務之介面設計、商標、代碼及 AI 模型權利均歸 SavorChef Inc. 所有。未經授權，不得轉載或用於商業用途。</p>

                            <h3 className="text-xl font-bold mb-3">5. 免責聲明</h3>
                            <p className="mb-6">本服務按「現狀」提供，不保證完全無誤或中斷。對於因使用本服務而產生的任何直接或間接損害，我們在法律允許範圍內不承擔責任。</p>
                        </div>
                    ) : (
                        <div className="prose prose-stone max-w-none">
                            <h2 className="font-serif text-3xl font-bold mb-6 text-chef-black">隱私政策 (Privacy Policy)</h2>
                            <p className="text-sm text-stone-500 mb-8">最後更新日期：2026年1月19日</p>

                            <h3 className="text-xl font-bold mb-3">1. 我們收集的資訊</h3>
                            <p className="mb-6">為了提供 AI 食材分析功能，我們會收集您上傳的冰箱或食材照片。此外，我們可能會收集您的操作偏好（如飲食習慣、過敏源設定）以優化推薦結果。</p>

                            <h3 className="text-xl font-bold mb-3">2. 資訊使用方式</h3>
                            <ul className="list-disc pl-5 mb-6 space-y-2">
                                <li>分析圖片內容以生成食譜。</li>
                                <li>改善 AI 模型的識別準確度。</li>
                                <li>提供個人化的烹飪建議。</li>
                            </ul>

                            <h3 className="text-xl font-bold mb-3">3. 資訊皆運用於本地端或加密傳輸</h3>
                            <p className="mb-6">我們重視您的隱私。您上傳的照片僅用於即時分析，除非您明確同意分享至社群，否則我們不會公開展示您的私人照片。</p>

                            <h3 className="text-xl font-bold mb-3">4. 第三方服務</h3>
                            <p className="mb-6">本服務使用 Google Gemini API 進行 AI 運算。相關數據處理將遵循 Google Cloud 的隱私保護標準。</p>

                            <h3 className="text-xl font-bold mb-3">5. 聯絡我們</h3>
                            <p className="mb-6">若您對隱私權有任何疑問，請透過「聯絡客服」功能與我們聯繫。</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};
