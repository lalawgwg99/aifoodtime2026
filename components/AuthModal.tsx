
import React, { useState } from 'react';
import { X, Mail, Github, LogIn, ChefHat, Sparkles, ShieldCheck, Globe } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleGoogleLogin = () => {
    setIsAnimating(true);
    // 模擬 Google OAuth 回傳與完整 User 物件
    setTimeout(() => {
      const mockUser: User = {
        id: 'u1',
        name: '星級評論員',
        email: 'star.chef@google.com',
        avatar: 'https://i.pravatar.cc/150?u=starchef',
        level: '三星主廚',
        stats: {
          totalRecipes: 12,
          averageSoulScore: 92,
          tasteDNA: [
            { label: '視覺美學 Visual', value: 95 },
            { label: '創意發想 Creativity', value: 88 },
            { label: '技術精準 Precision', value: 74 },
            { label: '地緣風味 Local Taste', value: 65 }
          ]
        }
      };
      onLogin(mockUser);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 animate-fadeIn">
      <div className="bg-white rounded-[3.5rem] max-w-md w-full overflow-hidden shadow-floating relative animate-fadeInUp">
        
        <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-stone-100 rounded-full text-stone-400 transition-colors">
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
          <div className="space-y-4">
            <button 
              onClick={handleGoogleLogin}
              disabled={isAnimating}
              className="w-full flex items-center justify-center gap-4 py-5 px-6 bg-white border border-stone-200 rounded-[1.5rem] hover:border-chef-gold hover:shadow-lg transition-all active:scale-95 disabled:opacity-50"
            >
               {isAnimating ? <div className="w-5 h-5 border-2 border-chef-gold border-t-transparent rounded-full animate-spin" /> : (
                 <svg className="w-5 h-5" viewBox="0 0 24 24">
                   <path fill="#EA4335" d="M12 5.04c1.94 0 3.51.68 4.75 1.81l3.51-3.51C17.91 1.24 15.21 0 12 0 7.31 0 3.25 2.67 1.21 6.56L5.3 9.72c.98-2.69 3.51-4.68 6.7-4.68z"/>
                   <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58l3.7 2.87c2.16-1.99 3.42-4.92 3.42-8.69z"/>
                   <path fill="#FBBC05" d="M5.3 14.28c-.26-.79-.41-1.64-.41-2.28 0-.64.15-1.48.41-2.28L1.21 6.56C.44 8.2 0 10.03 0 12s.44 3.8 1.21 5.44l4.09-3.16z"/>
                   <path fill="#34A853" d="M12 24c3.24 0 5.97-1.09 7.96-2.91l-3.7-2.87c-1.08.74-2.48 1.18-4.26 1.18-3.19 0-5.72-1.99-6.7-4.68l-4.09 3.16C3.25 21.33 7.31 24 12 24z"/>
                 </svg>
               )}
               <span className="text-sm font-bold text-chef-black">使用 Google 一鍵登入</span>
            </button>
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
