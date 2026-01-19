import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, Server, CheckCircle2 } from 'lucide-react';

interface SecurityModalProps {
    onClose: () => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ onClose }) => {
    const securityFeatures = [
        {
            icon: Lock,
            title: 'TLS 1.3 銀行級傳輸加密',
            desc: '您的所有請求均透過最高標準的加密通道傳輸，確保資料在傳遞過程中不被攔截。'
        },
        {
            icon: EyeOff,
            title: 'Ephemeral Processing (影像即焚)',
            desc: 'AI 分析完成後，您的冰箱與食材照片將立即從運算節點中刪除，我們絕不留存私密影像。'
        },
        {
            icon: Server,
            title: 'Enterprise Grade Protection',
            desc: '採用 Google Cloud 企業級資安架構，防禦 DDoS 攻擊與未經授權的存取。'
        },
        {
            icon: ShieldCheck,
            title: '嚴格的隱私合規',
            desc: '我們僅存取必要的數據以提供服務，並嚴格遵守隱私政策與相關法規。'
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl relative flex flex-col overflow-hidden animate-scaleIn border border-stone-100">

                {/* Header with Visual */}
                <div className="bg-[#1A1818] text-white p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-4 text-green-400">
                            <ShieldCheck size={24} />
                        </div>
                        <h2 className="text-2xl font-serif font-bold mb-1">Security Audited</h2>
                        <p className="text-stone-400 text-sm">您的數據安全是我們的最高優先級。</p>
                    </div>

                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white/60 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 space-y-6">
                    {securityFeatures.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                            <div className="mt-1">
                                <CheckCircle2 size={20} className="text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-stone-800 text-base mb-1">{item.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Audit Footer */}
                <div className="p-4 bg-stone-50 text-center border-t border-stone-100">
                    <p className="text-xs text-stone-400 font-mono">AUDIT_ID: SC-{new Date().getFullYear()}-SEC-VERIFIED</p>
                </div>
            </div>
        </div>
    );
};
