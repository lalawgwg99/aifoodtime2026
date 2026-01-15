
import React, { useState, useEffect, useRef } from 'react';
import { X, ChefHat, Sparkles, Globe } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const buttonContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 等待 Google SDK 載入
    const checkGoogleLoaded = setInterval(() => {
      if (window.google?.accounts?.id && buttonContainerRef.current) {
        clearInterval(checkGoogleLoaded);

        try {
          // 初始化 Google Sign-In
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
          });

          // 渲染按鈕
          window.google.accounts.id.renderButton(
            buttonContainerRef.current,
            {
              theme: 'outline',
              size: 'large',
              text: 'signin_with',
              shape: 'rectangular',
              width: 280,
              locale: 'zh_TW'
            }
          );

          setIsLoading(false);
        } catch (err) {
          console.error('Google Sign-In init error:', err);
          setError('初始化失敗');
          setIsLoading(false);
        }
      }
    }, 100);

    // 5 秒後超時
    const timeout = setTimeout(() => {
      clearInterval(checkGoogleLoaded);
      if (isLoading) {
        setError('Google 服務載入超時，請檢查網路連線');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearInterval(checkGoogleLoaded);
      clearTimeout(timeout);
    };
  }, []);

  const handleCredentialResponse = (response: any) => {
    try {
      // 解碼 JWT
      const payload = JSON.parse(atob(response.credential.split('.')[1]));

      const user: User = {
        id: payload.sub,
        name: payload.name,
        email: payload.email,
        avatar: payload.picture,
        level: '新進主廚',
        stats: {
          totalRecipes: 0,
          averageSoulScore: 0,
          tasteDNA: [
            { label: '視覺美學 Visual', value: 50 },
            { label: '創意發想 Creativity', value: 50 },
            { label: '技術精準 Precision', value: 50 },
            { label: '地緣風味 Local Taste', value: 50 }
          ]
        }
      };

      onLogin(user);
      onClose();
    } catch (err) {
      setError('登入處理失敗');
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="bg-white rounded-[3.5rem] max-w-md w-full overflow-hidden shadow-floating relative animate-fadeInUp">

        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors z-10">
          <X size={24} />
        </button>

        <div className="bg-chef-black p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-chef-gold/20 to-transparent" />
          <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 relative z-10 border border-white/10 shadow-2xl">
            <ChefHat size={32} className="text-chef-gold" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-white mb-2 relative z-10">主廚認證登入</h2>
          <p className="text-stone-500 text-[10px] font-black uppercase tracking-[0.4em] relative z-10">SavorChef Identity</p>
        </div>

        <div className="p-12 space-y-8 bg-stone-50">
          <div className="flex flex-col items-center justify-center min-h-[60px]">
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-chef-gold border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-stone-400">載入 Google 登入...</span>
              </div>
            ) : error ? (
              <p className="text-red-500 text-sm text-center">{error}</p>
            ) : null}
            <div ref={buttonContainerRef} className={isLoading || error ? 'hidden' : ''} />
          </div>

          <div className="pt-8 border-t border-stone-200 grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Globe size={18} className="text-chef-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-chef-black">雲端同步</h4>
              <p className="text-[9px] text-stone-400 leading-relaxed">隨時存取您的私人食譜庫</p>
            </div>
            <div className="space-y-2">
              <Sparkles size={18} className="text-chef-gold" />
              <h4 className="text-[10px] font-black uppercase tracking-widest text-chef-black">身份聲望</h4>
              <p className="text-[9px] text-stone-400 leading-relaxed">累積點讚，晉升星級主廚</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// TypeScript 全域型別宣告
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}
