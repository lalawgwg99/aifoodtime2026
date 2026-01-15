import React, { useState } from 'react';
import { Newspaper, Globe, ArrowLeft, Heart, Share2, BookOpen } from 'lucide-react';
import { User } from '../types';

interface ChroniclesProps {
    onBack: () => void;
    currentUser: User | null;
}

export const Chronicles: React.FC<ChroniclesProps> = ({ onBack, currentUser }) => {
    const [language, setLanguage] = useState<'TW' | 'EN'>('TW');

    const FEATURED_STORIES = [
        {
            id: 1,
            title: language === 'TW' ? "台南牛肉湯的清晨儀式感" : "The Morning Ritual of Tainan Beef Soup",
            category: language === 'TW' ? "在地文化" : "Local Culture",
            image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2671&auto=format&fit=crop",
            flavorProfile: { sour: 10, sweet: 60, bitter: 5, spicy: 10, salty: 40 },
            author: "Chef Lin",
            readTime: "5 min"
        },
        {
            id: 2,
            title: language === 'TW' ? "巴黎早午餐：不只是可頌" : "Parisian Brunch: Beyond Croissants",
            category: language === 'TW' ? "國際視野" : "Global View",
            image: "https://images.unsplash.com/photo-1548545815-59b4c09d58dc?q=80&w=2670&auto=format&fit=crop",
            flavorProfile: { sour: 20, sweet: 50, bitter: 10, spicy: 0, salty: 30 },
            author: "Emily in Paris",
            readTime: "8 min"
        },
        {
            id: 3,
            title: language === 'TW' ? "夜市牛排的鐵板哲學" : "The Philosophy of Night Market Sizzling Steak",
            category: language === 'TW' ? "街頭美食" : "Street Food",
            image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?q=80&w=2670&auto=format&fit=crop",
            flavorProfile: { sour: 15, sweet: 45, bitter: 5, spicy: 60, salty: 80 },
            author: "Foodie TW",
            readTime: "4 min"
        }
    ];

    return (
        <div className="min-h-screen bg-[#121212] text-white selection:bg-chef-gold/30 font-sans pb-20 animate-fadeIn">
            {/* Navbar Overlay */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-chef-gold transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold tracking-widest uppercase">Back to Kitchen</span>
                </button>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                    <span className={`text-xs font-bold cursor-pointer transition-colors ${language === 'TW' ? 'text-chef-gold' : 'text-stone-400'}`} onClick={() => setLanguage('TW')}>TW</span>
                    <div className="w-px h-3 bg-white/20"></div>
                    <span className={`text-xs font-bold cursor-pointer transition-colors ${language === 'EN' ? 'text-chef-gold' : 'text-stone-400'}`} onClick={() => setLanguage('EN')}>EN</span>
                    <Globe size={14} className="text-stone-400 ml-1" />
                </div>
            </nav>

            {/* Hero Cover Story */}
            <header className="relative w-full h-[75vh] overflow-hidden group cursor-pointer">
                <div className="absolute inset-0">
                    <img
                        src={FEATURED_STORIES[0].image}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        alt="Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4 animate-fadeInUp">
                        <span className="px-3 py-1 bg-chef-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm">{FEATURED_STORIES[0].category}</span>
                        <span className="text-stone-300 text-xs font-serif italic tracking-wider">Cover Story</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6 leading-tight animate-fadeInUp delay-100 group-hover:text-chef-gold transition-colors">
                        {FEATURED_STORIES[0].title}
                    </h1>
                    <div className="flex items-center gap-6 text-stone-400 text-sm animate-fadeInUp delay-200">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-stone-700" />
                            <span>{FEATURED_STORIES[0].author}</span>
                        </div>
                        <span>•</span>
                        <span>{FEATURED_STORIES[0].readTime} read</span>
                    </div>
                </div>
            </header>

            {/* Featured Grid */}
            <section className="px-6 md:px-12 -mt-20 relative z-10">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                        <BookOpen className="text-chef-gold" size={24} />
                        Latest Stories
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {FEATURED_STORIES.slice(1).map((story) => (
                        <article key={story.id} className="group cursor-pointer">
                            <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative">
                                <img src={story.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={story.title} />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white border border-white/10">
                                    {story.category}
                                </div>
                                {/* Flavor Radar Mini (Abstract) */}
                                <div className="absolute bottom-4 left-4 flex gap-1">
                                    {Object.entries(story.flavorProfile).filter(([k, v]) => v > 40).map(([k, v]) => (
                                        <div key={k} className="w-2 h-8 bg-white/20 rounded-full flex items-end overflow-hidden" title={k}>
                                            <div className="w-full bg-chef-gold" style={{ height: `${v}%` }} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-chef-gold transition-colors leading-snug">{story.title}</h3>
                            <div className="flex items-center justify-between text-stone-500 text-xs mt-3">
                                <span>{story.author}</span>
                                <div className="flex gap-3">
                                    <button className="hover:text-white transition-colors"><Heart size={14} /></button>
                                    <button className="hover:text-white transition-colors"><Share2 size={14} /></button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* FAB */}
            <button className="fixed bottom-8 right-8 w-16 h-16 bg-chef-gold text-black rounded-full shadow-gold-glow flex items-center justify-center hover:scale-110 transition-transform z-50 group">
                <span className="absolute -top-10 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Write Story</span>
                <Newspaper size={28} />
            </button>
        </div>
    );
};
