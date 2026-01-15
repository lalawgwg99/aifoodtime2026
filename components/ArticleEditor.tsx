import React, { useState, useRef } from 'react';
import { X, Image, Bold, Italic, AlignLeft, AlignCenter, List, Link, Type, Palette, Upload, Check, Trash2 } from 'lucide-react';

interface ArticleEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (article: { title: string; content: string; coverImage: string | null; category: string }) => void;
}

const CATEGORIES = ['在地文化', '國際視野', '街頭美食', '私房食譜', '旅途風味', '節慶飲食'];
const FONT_COLORS = ['#FFFFFF', '#C5A059', '#EF4444', '#22C55E', '#3B82F6', '#A855F7'];

export const ArticleEditor: React.FC<ArticleEditorProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [coverImage, setCoverImage] = useState<string | null>(null);
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [selectedColor, setSelectedColor] = useState('#FFFFFF');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setCoverImage(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const execCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        contentRef.current?.focus();
    };

    const handleSubmit = () => {
        if (!title.trim() || !contentRef.current?.innerHTML.trim()) {
            alert('請填寫標題和內容');
            return;
        }
        setIsSubmitting(true);
        setTimeout(() => {
            onSubmit({
                title,
                content: contentRef.current?.innerHTML || '',
                coverImage,
                category
            });
            setIsSubmitting(false);
            setTitle('');
            setCoverImage(null);
            if (contentRef.current) contentRef.current.innerHTML = '';
            onClose();
            alert('🎉 文章投稿成功！我們會盡快審核。');
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black/95 overflow-y-auto animate-fadeIn">
            {/* Header */}
            <div className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-[#1A1A1A]/95 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={onClose} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-red-500 transition-all">
                        <X size={20} />
                    </button>
                    <h1 className="text-xl font-serif font-bold text-white">撰寫新文章</h1>
                </div>
                <div className="flex items-center gap-3">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-chef-gold"
                    >
                        {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-black">{cat}</option>)}
                    </select>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-chef-gold text-black font-bold rounded-full hover:bg-white transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Check size={18} />}
                        {isSubmitting ? '發布中...' : '發布文章'}
                    </button>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Cover Image */}
                <div className="mb-8">
                    {coverImage ? (
                        <div className="relative group">
                            <img src={coverImage} className="w-full aspect-video object-cover rounded-2xl" alt="Cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-4">
                                <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-white text-black font-bold rounded-full flex items-center gap-2">
                                    <Upload size={16} /> 更換圖片
                                </button>
                                <button onClick={() => setCoverImage(null)} className="px-4 py-2 bg-red-500 text-white font-bold rounded-full flex items-center gap-2">
                                    <Trash2 size={16} /> 移除
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full aspect-video border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-chef-gold hover:bg-white/5 transition-all cursor-pointer"
                        >
                            <Image size={48} className="text-stone-400" />
                            <span className="text-stone-400 font-bold">點擊上傳封面圖片</span>
                            <span className="text-stone-500 text-sm">建議尺寸 1200 x 630 px</span>
                        </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>

                {/* Title */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="輸入文章標題..."
                    className="w-full text-4xl md:text-5xl font-serif font-bold text-white bg-transparent border-none outline-none placeholder:text-stone-600 mb-8"
                />

                {/* Rich Text Toolbar */}
                <div className="sticky top-20 z-40 flex flex-wrap items-center gap-1 p-2 bg-[#1A1A1A] rounded-xl border border-white/10 mb-4">
                    <button onClick={() => execCommand('bold')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="粗體">
                        <Bold size={18} />
                    </button>
                    <button onClick={() => execCommand('italic')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="斜體">
                        <Italic size={18} />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1" />
                    <button onClick={() => execCommand('formatBlock', 'H2')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="標題">
                        <Type size={18} />
                    </button>
                    <button onClick={() => execCommand('insertUnorderedList')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="項目符號">
                        <List size={18} />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1" />
                    <button onClick={() => execCommand('justifyLeft')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="靠左對齊">
                        <AlignLeft size={18} />
                    </button>
                    <button onClick={() => execCommand('justifyCenter')} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="置中對齊">
                        <AlignCenter size={18} />
                    </button>
                    <div className="w-px h-6 bg-white/20 mx-1" />
                    <div className="relative">
                        <button onClick={() => setShowColorPicker(!showColorPicker)} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="文字顏色">
                            <Palette size={18} />
                        </button>
                        {showColorPicker && (
                            <div className="absolute top-12 left-0 bg-[#1A1A1A] border border-white/20 rounded-xl p-2 flex gap-1 shadow-xl z-50">
                                {FONT_COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => { execCommand('foreColor', color); setSelectedColor(color); setShowColorPicker(false); }}
                                        className={`w-8 h-8 rounded-full border-2 ${selectedColor === color ? 'border-chef-gold' : 'border-transparent'} transition-all hover:scale-110`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <button onClick={() => { const url = prompt('輸入連結 URL:'); if (url) execCommand('createLink', url); }} className="w-10 h-10 rounded-lg hover:bg-white/10 flex items-center justify-center text-stone-300 hover:text-white transition-colors" title="插入連結">
                        <Link size={18} />
                    </button>
                </div>

                {/* Content Editor */}
                <div
                    ref={contentRef}
                    contentEditable
                    className="min-h-[400px] text-lg text-stone-300 leading-relaxed outline-none focus:ring-0 prose prose-invert prose-headings:text-chef-gold prose-a:text-chef-gold max-w-none"
                    style={{ caretColor: '#C5A059' }}
                    data-placeholder="開始撰寫您的美食故事..."
                    suppressContentEditableWarning
                />
            </div>
        </div>
    );
};
