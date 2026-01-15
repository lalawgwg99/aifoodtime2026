import React, { useState } from 'react';
import { Newspaper, Globe, ArrowLeft, Heart, Share2, BookOpen, X, Clock, User as UserIcon, ChevronRight } from 'lucide-react';
import { User } from '../types';

interface ChroniclesProps {
    onBack: () => void;
    currentUser: User | null;
}

interface Article {
    id: number;
    title: string;
    subtitle: string;
    category: string;
    image: string;
    author: string;
    authorAvatar: string;
    readTime: string;
    publishDate: string;
    content: string[];
    tags: string[];
}

const ARTICLES: Article[] = [
    {
        id: 1,
        title: "台南牛肉湯的清晨儀式感",
        subtitle: "凌晨四點的府城，一碗湯喚醒一座城市的靈魂",
        category: "在地文化",
        image: "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=2671&auto=format&fit=crop",
        author: "林主廚",
        authorAvatar: "https://i.pravatar.cc/150?img=12",
        readTime: "5 分鐘",
        publishDate: "2026-01-10",
        content: [
            "凌晨四點半，台南安平區的街道還沉浸在夜色中，但「阿村第二代牛肉湯」的鐵門早已拉起。這不是普通的早餐店開業——這是一場延續半世紀的味覺儀式。",
            "「我們家的牛肉，從來不過夜。」第二代老闆阿村嫂一邊將溫體牛肉切成薄片，一邊解釋。這是台南牛肉湯的核心哲學：新鮮，是唯一的調味料。",
            "當地人稱這種飲食習慣為「清晨儀式感」。在天亮之前，排隊的人潮已經繞過街角。有西裝筆挺準備上班的業務、有剛下夜班的護理師、也有帶著孫子來「傳承味覺記憶」的阿公阿嬤。",
            "一碗標準的台南牛肉湯，講究三個層次：首先是高湯——用牛大骨熬煮8小時，加入白蘿蔔去腥增甜；其次是牛肉——溫體黃牛的後腿肉，切成0.3公分的薄片；最後是「沖」——用95度的高湯直接沖燙生牛肉，讓肉片在碗中綻放粉嫩色澤。",
            "「很多外地人問我，為什麼牛肉湯要這麼早吃？」阿村嫂笑著說，「因為我們追求的不是方便，是『當下』。這碗湯，就是台南人對新鮮的執著。」",
            "當第一線陽光灑進老店班駁的磁磚牆面，這一天的第一百碗湯已經送出。在台南，美食不只是味蕾的滿足——它是一種生活態度，一種對時間的敬畏，一種代代相傳的城市靈魂。"
        ],
        tags: ["台南", "牛肉湯", "早餐", "溫體牛", "在地文化"]
    },
    {
        id: 2,
        title: "東京深夜食堂：居酒屋的療癒哲學",
        subtitle: "霓虹燈下的一杯清酒，撫慰了多少疲憊的心",
        category: "國際視野",
        image: "https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2574&auto=format&fit=crop",
        author: "渡邊美食記",
        authorAvatar: "https://i.pravatar.cc/150?img=33",
        readTime: "7 分鐘",
        publishDate: "2026-01-08",
        content: [
            "東京新宿的黃金街，只有2.5公尺寬，卻擠進了超過200間酒吧。這裡沒有招牌、沒有菜單、甚至沒有價目表——門一推開，你只需要說一句「おまかせ（交給你了）」。",
            "這就是日本居酒屋文化的精髓：信任。",
            "「在這裡，料理是次要的。」在黃金街經營居酒屋35年的老闆田中先生說，「客人來這裡，是為了被理解。」每晚十點過後，田中的小店會擠入形形色色的客人：剛談完失敗合約的業務、被公司裁員的中年男子、甚至是準備離婚的太太。",
            "一盤毛豆、一碟煎餃、一杯冰鎮清酒——這是最標準的「療癒三件套」。但真正治癒人心的，是田中那句「辛苦了（お疲れ様）」。",
            "日本居酒屋的設計處處藏著心思：吧台刻意窄小，讓陌生人肩並肩；燈光昏黃，模糊了白天的階級差異；料理份量小巧，鼓勵人們多點幾輪、多待一會。這是一種「被設計的偶然」——在這裡，孤獨的人不再孤獨。",
            "凌晨兩點，最後一位客人離開時，田中習慣性地鞠躬道別：「下次見。」沒有人問「下次」是什麼時候，因為所有人都心知肚明——當你需要的時候，這扇門永遠會為你打開。",
            "「居酒屋不是餐廳，是城市的樹洞。」田中在打烊前說，「我們賣的不是酒，是一個可以卸下盔甲的地方。」"
        ],
        tags: ["東京", "居酒屋", "深夜食堂", "日本文化", "清酒"]
    }
];

export const Chronicles: React.FC<ChroniclesProps> = ({ onBack }) => {
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [showWriteModal, setShowWriteModal] = useState(false);

    return (
        <div className="min-h-screen bg-[#121212] text-white selection:bg-chef-gold/30 font-sans pb-20 animate-fadeIn">
            {/* Navbar Overlay */}
            <nav className="fixed top-0 w-full z-50 p-6 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                <button onClick={onBack} className="flex items-center gap-2 text-white/80 hover:text-chef-gold transition-colors">
                    <ArrowLeft size={20} />
                    <span className="text-sm font-bold tracking-widest uppercase">返回首頁</span>
                </button>
                <div className="flex items-center gap-2 text-chef-gold">
                    <BookOpen size={20} />
                    <span className="text-sm font-bold tracking-wider">美食誌 Chronicles</span>
                </div>
            </nav>

            {/* Hero Cover Story */}
            <header
                className="relative w-full h-[75vh] overflow-hidden group cursor-pointer"
                onClick={() => setSelectedArticle(ARTICLES[0])}
            >
                <div className="absolute inset-0">
                    <img
                        src={ARTICLES[0].image}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                        alt="Cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 max-w-4xl">
                    <div className="flex items-center gap-3 mb-4 animate-fadeIn">
                        <span className="px-3 py-1 bg-chef-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm">{ARTICLES[0].category}</span>
                        <span className="text-stone-300 text-xs font-serif italic tracking-wider">封面故事 Cover Story</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-4 leading-tight group-hover:text-chef-gold transition-colors">
                        {ARTICLES[0].title}
                    </h1>
                    <p className="text-lg md:text-xl text-stone-300 mb-6 font-light">{ARTICLES[0].subtitle}</p>
                    <div className="flex items-center gap-6 text-stone-400 text-sm">
                        <div className="flex items-center gap-2">
                            <img src={ARTICLES[0].authorAvatar} className="w-8 h-8 rounded-full" alt={ARTICLES[0].author} />
                            <span>{ARTICLES[0].author}</span>
                        </div>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={14} /> {ARTICLES[0].readTime}</span>
                        <span className="hidden md:inline">•</span>
                        <span className="hidden md:inline">{ARTICLES[0].publishDate}</span>
                    </div>
                    <button className="mt-6 px-6 py-3 bg-chef-gold text-black font-bold rounded-full flex items-center gap-2 hover:bg-white transition-colors">
                        閱讀全文 <ChevronRight size={18} />
                    </button>
                </div>
            </header>

            {/* Latest Stories Grid */}
            <section className="px-6 md:px-12 mt-12">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-serif font-bold text-white flex items-center gap-3">
                        <Newspaper className="text-chef-gold" size={24} />
                        最新文章 Latest Stories
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ARTICLES.slice(1).map((article) => (
                        <article
                            key={article.id}
                            className="group cursor-pointer bg-white/5 rounded-3xl overflow-hidden hover:bg-white/10 transition-all"
                            onClick={() => setSelectedArticle(article)}
                        >
                            <div className="aspect-video overflow-hidden relative">
                                <img src={article.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={article.title} />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase text-white border border-white/10">
                                    {article.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-chef-gold transition-colors leading-snug">{article.title}</h3>
                                <p className="text-stone-400 text-sm mb-4 line-clamp-2">{article.subtitle}</p>
                                <div className="flex items-center justify-between text-stone-500 text-xs">
                                    <div className="flex items-center gap-2">
                                        <img src={article.authorAvatar} className="w-6 h-6 rounded-full" alt={article.author} />
                                        <span>{article.author}</span>
                                    </div>
                                    <span>{article.readTime}</span>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            {/* Article Detail Modal */}
            {selectedArticle && (
                <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto animate-fadeIn">
                    {/* Fixed Top Bar */}
                    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-md border-b border-white/10">
                        <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-white hover:bg-chef-gold hover:text-black transition-all">
                            <ArrowLeft size={20} />
                            <span className="font-bold">返回文章列表</span>
                        </button>
                        <button onClick={() => setSelectedArticle(null)} className="w-12 h-12 bg-red-500/20 hover:bg-red-500 rounded-full flex items-center justify-center transition-all">
                            <X size={24} className="text-red-400 hover:text-white" />
                        </button>
                    </div>

                    <div className="max-w-3xl mx-auto px-6 pt-24 pb-32">

                        {/* Article Header */}
                        <img src={selectedArticle.image} className="w-full aspect-video object-cover rounded-2xl mb-8" alt={selectedArticle.title} />

                        <span className="px-3 py-1 bg-chef-gold text-black text-[10px] font-black uppercase tracking-widest rounded-sm">{selectedArticle.category}</span>

                        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white mt-4 mb-3 leading-tight">
                            {selectedArticle.title}
                        </h1>
                        <p className="text-xl text-stone-400 mb-6">{selectedArticle.subtitle}</p>

                        <div className="flex items-center gap-4 text-stone-400 text-sm mb-8 pb-8 border-b border-white/10">
                            <img src={selectedArticle.authorAvatar} className="w-10 h-10 rounded-full" alt={selectedArticle.author} />
                            <div>
                                <p className="text-white font-bold">{selectedArticle.author}</p>
                                <p>{selectedArticle.publishDate} · {selectedArticle.readTime}</p>
                            </div>
                        </div>

                        {/* Article Body */}
                        <div className="prose prose-lg prose-invert max-w-none">
                            {selectedArticle.content.map((paragraph, index) => (
                                <p key={index} className="text-stone-300 leading-relaxed mb-6 text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mt-12 pt-8 border-t border-white/10">
                            {selectedArticle.tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-white/10 text-stone-300 text-xs rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        {/* Social Actions */}
                        <div className="flex items-center gap-4 mt-8">
                            <button className="flex items-center gap-2 px-6 py-3 bg-chef-gold text-black font-bold rounded-full hover:bg-white transition-colors">
                                <Heart size={18} /> 收藏文章
                            </button>
                            <button className="flex items-center gap-2 px-6 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors">
                                <Share2 size={18} /> 分享
                            </button>
                        </div>
                    </div>

                    {/* Fixed Bottom Nav */}
                    <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/90 backdrop-blur-md border-t border-white/10">
                        {(() => {
                            const idx = ARTICLES.findIndex(a => a.id === selectedArticle.id);
                            const prev = idx > 0 ? ARTICLES[idx - 1] : null;
                            const next = idx < ARTICLES.length - 1 ? ARTICLES[idx + 1] : null;
                            return (
                                <>
                                    <button onClick={() => prev && setSelectedArticle(prev)} disabled={!prev} className={`flex items-center gap-2 px-4 py-3 rounded-xl ${prev ? 'bg-white/10 hover:bg-white/20' : 'opacity-30'}`}>
                                        <ArrowLeft size={18} /> <span className="hidden md:inline">{prev?.title?.slice(0, 12) || ''}...</span>
                                    </button>
                                    <button onClick={() => setSelectedArticle(null)} className="px-6 py-3 bg-chef-gold text-black font-bold rounded-full">關閉</button>
                                    <button onClick={() => next && setSelectedArticle(next)} disabled={!next} className={`flex items-center gap-2 px-4 py-3 rounded-xl ${next ? 'bg-white/10 hover:bg-white/20' : 'opacity-30'}`}>
                                        <span className="hidden md:inline">{next?.title?.slice(0, 12) || ''}...</span> <ChevronRight size={18} />
                                    </button>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            {/* FAB - Write Article */}
            <button
                onClick={() => setShowWriteModal(true)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-chef-gold text-black rounded-full shadow-gold-glow flex items-center justify-center hover:scale-110 transition-transform z-50 group"
            >
                <span className="absolute -top-10 bg-white text-black text-xs font-bold px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">投稿文章</span>
                <Newspaper size={28} />
            </button>

            {/* Write Article Modal */}
            {showWriteModal && (
                <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-6 animate-fadeIn">
                    <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-lg w-full border border-white/10">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-serif font-bold text-white">投稿美食故事</h2>
                            <button onClick={() => setShowWriteModal(false)} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all">
                                <X size={20} />
                            </button>
                        </div>
                        <p className="text-stone-400 mb-6">分享您的美食體驗、旅途中的味覺記憶，或是私房食譜背後的故事。我們期待您的投稿！</p>
                        <input type="text" placeholder="文章標題" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:border-chef-gold outline-none" />
                        <textarea placeholder="寫下您的故事..." rows={5} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white mb-4 focus:border-chef-gold outline-none resize-none" />
                        <div className="flex gap-4">
                            <button onClick={() => setShowWriteModal(false)} className="flex-1 py-3 bg-white/10 text-white font-bold rounded-full hover:bg-white/20 transition-colors">取消</button>
                            <button onClick={() => { alert('感謝您的投稿！我們會盡快審核。'); setShowWriteModal(false); }} className="flex-1 py-3 bg-chef-gold text-black font-bold rounded-full hover:bg-white transition-colors">送出投稿</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
