
import React from 'react';
import { TrendingUp, Zap } from 'lucide-react';

const TRENDS = [
  { label: '和牛熟成技術', value: '+12%', type: 'up' },
  { label: '植物基肉類 2.0', value: '+45%', type: 'up' },
  { label: '極簡主義擺盤', value: 'HOT', type: 'hot' },
  { label: '台式傳統發酵', value: '+8%', type: 'up' },
  { label: '北歐森林採集風味', value: '+22%', type: 'up' },
  { label: '地中海減碳料理', value: 'TRENDING', type: 'hot' }
];

export const MarketTicker: React.FC = () => {
  return (
    <div className="bg-chef-black text-white py-2.5 overflow-hidden border-b border-white/5 relative z-[60]">
      <div className="flex animate-ticker whitespace-nowrap gap-12 items-center w-max">
        {/* 複製兩份以實現無縫循環 */}
        {[...TRENDS, ...TRENDS].map((trend, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
               {trend.type === 'up' ? <TrendingUp size={10} className="text-green-400" /> : <Zap size={10} className="text-chef-gold" />}
               {trend.label}
            </span>
            <span className={`text-[10px] font-bold ${trend.type === 'up' ? 'text-green-400' : 'text-chef-gold'}`}>{trend.value}</span>
            <div className="w-1 h-1 bg-white/10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
};
