import React, { useState } from 'react';
import { Newspaper, ArrowLeft, BookOpen, X, Clock, ChevronRight } from 'lucide-react';
import { User } from '../types';
import { ArticleEditor } from './ArticleEditor';

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
    // 1. Taiwan Local (3篇)
    {
        id: 1,
        title: "基隆廟口夜市：雨都的深夜食堂",
        subtitle: "從鼎邊趖到泡泡冰，探索台灣最密集的味覺戰場",
        category: "在地文化",
        image: "https://images.unsplash.com/photo-1552526881-721ce85decc3?q=80&w=2574&auto=format&fit=crop",
        author: "美食探險家",
        authorAvatar: "https://i.pravatar.cc/150?img=12",
        readTime: "6 分鐘",
        publishDate: "2026-01-14",
        content: [
            "基隆，這座總是濕淋淋的城市，卻擁有全台灣最火熱的宵夜文化。廟口夜市不僅是觀光客的打卡點，更是在地人從小吃到大的記憶。",
            "一碗熱騰騰的鼎邊趖，湯頭鮮甜，米漿滑嫩，配上香菇、金針、蝦仁羹，這是基隆人對海味的極致詮釋。",
            "走到巷尾，一定要來一杯綿密的花生泡泡冰。堅持手打的口感，讓每一口都吃得到花生的濃郁香氣，甜而不膩。",
            "在這裡，不管是營養三明治的酥脆，還是天婦羅的Q彈，每一攤都有著幾十年不變的堅持。雨夜裡的黃燈籠下，這裡是台灣最溫暖的角落。"
        ],
        tags: ["基隆", "夜市", "小吃", "海鮮", "在地文化"]
    },
    {
        id: 2,
        title: "客家庄的米食記憶：從粄條到麻糬",
        subtitle: "樸實無華的米漿，在客家阿婆手中變幻出的千層滋味",
        category: "在地文化",
        image: "https://plus.unsplash.com/premium_photo-1664648119253-066b245a4988?q=80&w=2574&auto=format&fit=crop",
        author: "阿婆的灶腳",
        authorAvatar: "https://i.pravatar.cc/150?img=5",
        readTime: "5 分鐘",
        publishDate: "2026-01-12",
        content: [
            "走進苗栗三義的客家庄，空氣中飄散著淡淡的米香。這裡的人們對「米」有著特殊的情感，將其發揮到了淋漓盡致。",
            "清晨，一碗熱氣騰騰的客家粄條，淋上油蔥酥與瘦肉片，簡單卻雋永。那種Q彈的口感，是機器製作無法比擬的。",
            "午後，阿婆們聚在禾埕上搓揉著麻糬（粢粑）。沾上花生粉與糖粉，一口咬下，軟糯香甜，象徵著客家人的團結與黏結。",
            "這些米食不僅是果腹的食物，更是客家文化傳承的載體，每一口都是對土地的感謝。"
        ],
        tags: ["客家", "米食", "粄條", "麻糬", "傳統美食"]
    },
    {
        id: 3,
        title: "馬告與刺蔥：原民部落的香料魔法",
        subtitle: "走進深山，尋找台灣土地賜予的最原始風味",
        category: "在地文化",
        image: "https://images.unsplash.com/photo-1621852004158-b39178650ef0?q=80&w=2574&auto=format&fit=crop",
        author: "山林主廚",
        authorAvatar: "https://i.pravatar.cc/150?img=8",
        readTime: "7 分鐘",
        publishDate: "2026-01-10",
        content: [
            "在台灣的深山部落裡，藏著許多平地少見的「綠色寶石」。馬告（山胡椒），帶著檸檬與香茅的清香，是原住民料理中的靈魂。",
            "刺蔥，又名「鳥不踏」，雖然枝幹長滿刺，但其葉片卻有著強烈的辛香，拿來煎蛋或是煮湯，風味獨特。",
            "這些取之於自然的香料，不僅豐富了味蕾，更蘊含了原住民與山林共存的智慧。每一道料理，都是對大自然的致敬。"
        ],
        tags: ["原住民", "香料", "馬告", "刺蔥", "部落美食"]
    },

    // 2. Japan (JP/TW) (2篇)
    {
        id: 4,
        title: "京都の懐石料理：四季を味わう芸術 (京都懷石料理：品味四季的藝術)",
        subtitle: "一期一會的極致款待，將季節流轉凝縮於盤中",
        category: "日本精選",
        image: "https://images.unsplash.com/photo-1580822184713-fc54006efa4e?q=80&w=2574&auto=format&fit=crop",
        author: "Yiko Saito",
        authorAvatar: "https://i.pravatar.cc/150?img=9",
        readTime: "8 分鐘",
        publishDate: "2026-01-13",
        content: [
            "静寂に包まれた京都の古寺で、懐石料理をいただく。それは単なる食事ではなく、五感で感じる芸術体験だ。",
            "在寧靜的京都古寺中享用懷石料理，這不僅僅是一頓飯，而是一場五感的藝術體驗。",
            "旬の筍、初鰹、そして若鮎。料理長は、その時期に最も美味しい食材を厳選し、素材本来の味を引き出す。",
            "當季的竹筍、初鰹鱼、還有香魚。料理長嚴選當季最美味的食材，引出素材原本的滋味。",
            "器の選び方、盛り付けの美しさ、そして庭園の眺め。すべてが一体となり、「一期一会」の心を表している。",
            "器皿的選擇、擺盤的美感、以及庭園的景色。一切融為一體，展現了「一期一會」的心意。"
        ],
        tags: ["京都", "懐石料理", "日本文化", "Kyoto", "Kaiseki"]
    },
    {
        id: 5,
        title: "北海道の海鮮丼：北国の恵みを堪能 (北海道海鮮丼：盡享北國恩惠)",
        subtitle: "朝市で出会う、宝石箱のような輝き",
        category: "日本精選",
        image: "https://images.unsplash.com/photo-1560155016-bd4879ae8f21?q=80&w=2574&auto=format&fit=crop",
        author: "Hokkaido Eats",
        authorAvatar: "https://i.pravatar.cc/150?img=11",
        readTime: "5 分鐘",
        publishDate: "2026-01-09",
        content: [
            "冬の北海道、函館の朝市。寒さを忘れるほどの熱気がそこにはある。",
            "冬天的北海道，函館朝市。那裡的熱鬧氣氛讓人忘卻了寒冷。",
            "どんぶりから溢れんばかりのウニ、イクラ、カニ、ホタテ。それはまるで海の宝石箱だ。",
            "從碗裡滿溢出來的海膽、鮭魚卵、螃蟹、干貝。簡直就像是大海的珠寶盒。",
            "新鮮な魚介の甘みと旨みが、口の中で弾ける。これぞ、北国の贅沢。",
            "新鮮海鮮的甘甜與鮮美，在口中迸發。這就是北國的奢華享受。"
        ],
        tags: ["北海道", "海鮮丼", "壽司", "Hokkaido", "Seafood"]
    },

    // 3. Thai/Vietnam (Local/TW) (2篇)
    {
        id: 6,
        title: "Khao Soi: The Golden Curry Noodle of Chiang Mai (清邁金麵：泰北黃金咖哩)",
        subtitle: "濃郁椰奶與酥脆炸麵的完美交響曲",
        category: "東南亞風味",
        image: "https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=2574&auto=format&fit=crop",
        author: "Thanyarat Cook",
        authorAvatar: "https://i.pravatar.cc/150?img=20",
        readTime: "6 分鐘",
        publishDate: "2026-01-11",
        content: [
            "ข้าวซอย (Khao Soi) เป็นอาหารขึ้นชื่อของภาคเหนือไทย โดยเฉพาะจังหวัดเชียงใหม่",
            "Khao Soi (考摔) 是泰國北部的著名美食，特別是在清邁地區。",
            "น้ำแกงกะทิเข้มข้น หอมเครื่องเทศ เสิร์ฟพร้อมบะหมี่ไข่นุ่มและหมี่กรอบโรยหน้า",
            "濃郁的椰奶咖哩湯頭，香料味十足，搭配軟嫩的雞蛋麵與酥脆的炸麵條。",
            "บีบมะนาวเล็กน้อย เติมพริกผัดและหอมแดงซอย รสชาติจะกลมกล่อมยิ่งขึ้น",
            "擠一點檸檬汁，加入炒辣椒與紅蔥頭，味道層次更加豐富圓潤。"
        ],
        tags: ["泰國", "清邁", "咖哩", "Khao Soi", "Chiang Mai"]
    },
    {
        id: 7,
        title: "Phở: The Soul of Hanoi (河內河粉：越南的靈魂之湯)",
        subtitle: "清澈湯頭下的百年底蘊，街頭巷尾的國民早餐",
        category: "東南亞風味",
        image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=2574&auto=format&fit=crop",
        author: "Nguyen Kitchen",
        authorAvatar: "https://i.pravatar.cc/150?img=25",
        readTime: "6 分鐘",
        publishDate: "2026-01-07",
        content: [
            "Phở không chỉ là món ăn, mà là một phần văn hóa của người Hà Nội.",
            "Phở 不僅僅是一道菜，更是河內人文化的一部分。",
            "Nước dùng được ninh từ xương bò trong nhiều giờ, tạo nên vị ngọt thanh tự nhiên.",
            "湯頭是用牛骨熬煮數小時而成，創造出清甜自然的風味。",
            "Thêm chút hành tây, rau thơm và lát thịt bò tái, tạo nên bát phở hoàn hảo.",
            "加上一點洋蔥、香草和半熟牛肉片，成就了一碗完美的河粉。"
        ],
        tags: ["越南", "河粉", "河內", "Pho", "Vietnam"]
    },

    // 4. Global Michelin 3-Star (EN/TW) (3篇)
    {
        id: 8,
        title: "The French Laundry: Culinary Perfection in Napa (納帕谷的烹飪極致)",
        subtitle: "Thomas Keller's masterpiece where ingredients dictate the menu.",
        category: "米其林傳奇",
        image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2574&auto=format&fit=crop",
        author: "Global Epicure",
        authorAvatar: "https://i.pravatar.cc/150?img=3",
        readTime: "10 分鐘",
        publishDate: "2026-01-05",
        content: [
            "Nestled in the heart of Napa Valley, The French Laundry is more than a restaurant; it's a pilgrimage for gourmets.",
            "坐落於納帕谷中心，The French Laundry 不僅是一間餐廳，更是美食家的朝聖地。",
            "Chef Thomas Keller's philosophy of 'Oysters and Pearls' redefines luxury dining with humor and precision.",
            "主廚 Thomas Keller 的「牡蠣與珍珠」哲學，以幽默與精準重新定義了奢華餐飲。",
            "Every dish is a testament to the relationship between the farmer, the gardener, and the chef.",
            "每一道菜都是農夫、園丁與主廚之間緊密連結的見證。"
        ],
        tags: ["Michelin", "Napa", "Thomas Keller", "French Cuisine", "米其林"]
    },
    {
        id: 9,
        title: "Noma: Reinventing Nordic Cuisine (Noma：重塑北歐料理)",
        subtitle: "Foraging the wild, preserving the seasons.",
        category: "米其林傳奇",
        image: "https://images.unsplash.com/photo-1546272989-40c2696b6a3e?q=80&w=2664&auto=format&fit=crop",
        author: "Nordic Palate",
        authorAvatar: "https://i.pravatar.cc/150?img=33",
        readTime: "9 分鐘",
        publishDate: "2026-01-03",
        content: [
            "In Copenhagen, René Redzepi challenged the world to look at moss, ants, and fermented berries as delicacies.",
            "在哥本哈根，René Redzepi 挑戰世界，將苔蘚、螞蟻和發酵漿果視為珍饈。",
            "Noma is not just about eating; it's about connecting with time and place through fermentation.",
            "Noma 不僅是關於吃；它是關於透過發酵與時間和地點連結。",
            "The menu changes strictly with the seasons: Ocean, Vegetable, and Game & Forest.",
            "菜單嚴格隨著季節更迭：海洋、蔬菜、以及野味與森林。"
        ],
        tags: ["Noma", "Nordic", "Fermentation", "Copenhagen", "北歐料理"]
    },
    {
        id: 10,
        title: "Osteria Francescana: Tradition in Evolution (傳統的進化論)",
        subtitle: "Massimo Bottura's storytelling on a plate.",
        category: "米其林傳奇",
        image: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2574&auto=format&fit=crop",
        author: "Italiano Vero",
        authorAvatar: "https://i.pravatar.cc/150?img=50",
        readTime: "8 分鐘",
        publishDate: "2026-01-01",
        content: [
            "Massimo Bottura asks: 'Five Ages of Parmigiano Reggiano'. It is a study of texture and temperature.",
            "Massimo Bottura 探問：「帕馬森乾酪的五種熟成」。這是一場關於質地與溫度的研究。",
            "In 'Oops! I Dropped the Lemon Tart', he finds beauty in imperfection.",
            "在「哎呀！我打破了檸檬塔」中，他在不完美中發現了美。",
            "Here, Italian tradition is looked at from 10 kilometers away.",
            "在這裡，義大利傳統被拉遠到十公里外來重新審視。"
        ],
        tags: ["Italy", "Modena", "Massimo Bottura", "Art", "義大利料理"]
    },

    // 5. Healthy/Weight Loss (2篇)
    {
        id: 11,
        title: "生酮飲食便當：上班族的減脂救星",
        subtitle: "低碳高脂也能吃得豐盛？一週備餐攻略大公開",
        category: "健康生活",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2670&auto=format&fit=crop",
        author: "營養師 Sarah",
        authorAvatar: "https://i.pravatar.cc/150?img=43",
        readTime: "6 分鐘",
        publishDate: "2026-01-15",
        content: [
            "對於忙碌的上班族來說，外食往往是減重計畫的最大殺手。高油、高糖、澱粉爆量，讓體脂居高不下。",
            "其實，生酮飲食（Keto Diet）並不如想像中困難。核心原則是「好的油脂 + 適量蛋白質 + 大量蔬菜」。",
            "本週便當提案：煎鮭魚佐酪梨沙拉、迷迭香雞腿排配花椰菜米、奶油菠菜炒牛肉。",
            "只要善用週末進行備餐（Meal Prep），平日只需微波加熱，就能輕鬆堅持低碳飲食，讓身體重回燃脂模式。"
        ],
        tags: ["生酮", "減重", "便當", "低碳", "健康飲食"]
    },
    {
        id: 12,
        title: "抗發炎飲食：吃出免疫力與好氣色",
        subtitle: "遠離慢性發炎，從餐盤裡的顏色開始改變",
        category: "健康生活",
        image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=2670&auto=format&fit=crop",
        author: "自然醫學博士",
        authorAvatar: "https://i.pravatar.cc/150?img=60",
        readTime: "7 分鐘",
        publishDate: "2026-01-14",
        content: [
            "現代人常見的疲勞、過敏、甚至心血管疾病，很多時候都源自於體內的「慢性發炎」。",
            "抗發炎飲食強調攝取富含 Omega-3 的魚類、深色蔬菜、莓果類以及優質油脂（如橄欖油、堅果）。",
            "薑黃、大蒜、生薑等辛香料，更是廚房裡的天然抗發炎藥。",
            "拒絕加工食品與精緻糖，擁抱原型食物。這不僅是為了減肥，更是為了讓身體回到最純淨、充滿活力的狀態。"
        ],
        tags: ["抗發炎", "免疫力", "原型食物", "健康", "養生"]
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

            {/* Article Editor (Full-Featured) */}
            <ArticleEditor
                isOpen={showWriteModal}
                onClose={() => setShowWriteModal(false)}
                onSubmit={(article) => {
                    console.log('New article submitted:', article);
                    // TODO: Save to backend
                }}
            />
        </div>
    );
};
