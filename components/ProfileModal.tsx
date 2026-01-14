
import React from 'react';
import { X, Award, Activity, Heart, Star, LayoutGrid, Settings, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { User } from '../types';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
  onLogout: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose, onLogout }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-2xl p-0 md:p-6 animate-fadeIn">
      <div className="bg-white rounded-t-[2rem] md:rounded-[3.5rem] w-full max-w-5xl h-[90vh] md:h-auto md:max-h-[90vh] overflow-hidden shadow-floating relative flex flex-col md:flex-row animate-fadeInUp">
        
        <button onClick={onClose} className="absolute top-4 right-4 md:top-8 md:right-8 z-30 p-2 md:p-3 bg-stone-100 hover:bg-chef-gold hover:text-white rounded-full transition-all">
          <X size={20} className="md:w-[24px] md:h-[24px]" />
        </button>

        {/* Left: Sidebar */}
        <div className="bg-chef-black text-white p-6 md:p-12 md:w-1/3 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-between shrink-0">
           <div className="flex items-center md:block gap-4">
             <div className="relative inline-block mb-0 md:mb-8">
                <img src={user.avatar} className="w-16 h-16 md:w-32 md:h-32 rounded-2xl md:rounded-[2.5rem] border-2 md:border-4 border-chef-gold/30 shadow-2xl" alt={user.name} />
                <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-chef-gold text-chef-black p-1 md:p-2 rounded-lg md:rounded-xl shadow-lg">
                  <Award size={12} className="md:w-[20px] md:h-[20px]" />
                </div>
             </div>
             <div>
               <p className="text-chef-gold text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-1 md:mb-2">{user.level}</p>
               <h2 className="text-xl md:text-4xl font-serif font-bold mb-1 md:mb-4">{user.name}</h2>
               <p className="text-stone-500 text-xs md:text-sm font-medium hidden md:block">{user.email}</p>
             </div>
           </div>

           <div className="md:space-y-4 md:pt-12 md:border-t border-white/10">
              <button onClick={onLogout} className="flex items-center gap-2 md:gap-3 text-stone-500 hover:text-white transition-colors group px-3 py-2 md:px-0 md:py-0 border border-white/10 md:border-none rounded-lg md:rounded-none">
                <LogOut size={16} className="md:w-[18px] group-hover:-translate-x-1 transition-transform" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">登出</span>
              </button>
           </div>
        </div>

        {/* Right: Dashboard */}
        <div className="flex-1 p-6 md:p-12 overflow-y-auto no-scrollbar bg-stone-50">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 mb-8 md:mb-16">
              <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-sm border border-stone-100">
                 <div className="flex items-center gap-3 mb-4 md:mb-6">
                    <Activity className="text-chef-gold" size={18} />
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-stone-400">味覺 DNA 分析</h3>
                 </div>
                 <div className="space-y-4 md:space-y-6">
                    {user.stats.tasteDNA.map((dna, idx) => (
                      <div key={idx}>
                        <div className="flex justify-between text-[9px] md:text-[10px] font-bold uppercase mb-1 md:mb-2">
                           <span className="text-chef-black">{dna.label}</span>
                           <span className="text-stone-400">{dna.value}%</span>
                        </div>
                        <div className="h-1 bg-stone-100 rounded-full overflow-hidden">
                           <div style={{width: `${dna.value}%`}} className="h-full bg-chef-black" />
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                 <div className="bg-chef-gold text-chef-black p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col justify-between">
                    <LayoutGrid size={20} className="md:w-[24px]" />
                    <div>
                      <div className="text-2xl md:text-4xl font-bold font-serif">{user.stats.totalRecipes}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-60">累積食譜</div>
                    </div>
                 </div>
                 <div className="bg-chef-black text-white p-5 md:p-8 rounded-2xl md:rounded-[2.5rem] flex flex-col justify-between">
                    <Star size={20} className="md:w-[24px] text-chef-gold" />
                    <div>
                      <div className="text-2xl md:text-4xl font-bold font-serif">{user.stats.averageSoulScore}</div>
                      <div className="text-[9px] font-black uppercase tracking-widest opacity-60">平均靈魂評分</div>
                    </div>
                 </div>
              </div>
           </div>

           <div className="space-y-4 md:space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-300">主廚榮譽勳章</h4>
              <div className="grid grid-cols-3 gap-3 md:gap-6">
                 {[
                   { icon: <Sparkles />, title: '創意先驅', date: '2024.11' },
                   { icon: <Heart />, title: '口味大師', date: '2024.12' },
                   { icon: <Award />, title: '首選私廚', date: '2025.01' }
                 ].map((badge, i) => (
                   <div key={i} className="bg-white border border-stone-100 p-4 md:p-6 rounded-2xl md:rounded-[2rem] text-center flex flex-col items-center">
                      <div className="w-8 h-8 md:w-12 md:h-12 bg-chef-gold/10 text-chef-gold rounded-full flex items-center justify-center mb-2 md:mb-4 scale-75 md:scale-100">{badge.icon}</div>
                      <div className="text-[10px] md:text-xs font-bold text-chef-black mb-1">{badge.title}</div>
                      <div className="text-[8px] text-stone-300 uppercase tracking-widest font-black">{badge.date}</div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="mt-8 md:mt-12 p-5 md:p-8 bg-chef-gold/5 rounded-2xl md:rounded-[2.5rem] border border-chef-gold/10 flex items-center justify-between">
              <div className="flex items-center gap-3 md:gap-4">
                 <div className="p-2 md:p-3 bg-chef-gold/20 text-chef-gold rounded-xl"><Settings size={18} className="md:w-[20px]" /></div>
                 <div>
                    <h4 className="text-xs md:text-sm font-bold text-chef-black">工作室設定</h4>
                    <p className="text-[10px] md:text-xs text-stone-400">管理隱私、通知與資料匯出</p>
                 </div>
              </div>
              <ChevronRight className="text-stone-300" size={16} />
           </div>
        </div>
      </div>
    </div>
  );
};
