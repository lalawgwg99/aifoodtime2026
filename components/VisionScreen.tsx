import React, { useRef, useState } from 'react';
import { Camera, X, Image as ImageIcon, RotateCcw, Refrigerator, ChefHat, Activity } from 'lucide-react';
import { VisionMode } from '../types';

interface VisionScreenProps {
    onClose: () => void;
    onSelectMode: (mode: VisionMode) => void;
    onCapture: (file: File) => void;
}

export const VisionScreen: React.FC<VisionScreenProps> = ({ onClose, onSelectMode, onCapture }) => {
    const [selectedMode, setSelectedMode] = useState<VisionMode | null>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const modes = [
        { id: VisionMode.FRIDGE_XRAY, label: '廚神模式', icon: Refrigerator },
        { id: VisionMode.TASTE_THIEF, label: '食客模式', icon: ChefHat },
        { id: VisionMode.NUTRI_SCANNER, label: '營養師模式', icon: Activity },
    ];

    const handleModeSelect = async (mode: VisionMode) => {
        setSelectedMode(mode);

        // 啟動相機
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' },
                audio: false
            });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (error) {
            console.error('Camera access denied:', error);
            alert('無法訪問相機，請檢查權限設定');
        }
    };

    const handleCapture = () => {
        if (!videoRef.current || !selectedMode) return;

        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0);
            canvas.toBlob((blob) => {
                if (blob) {
                    const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });
                    stopCamera();
                    onCapture(file);
                    onSelectMode(selectedMode);
                }
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && selectedMode) {
            stopCamera();
            onCapture(file);
            onSelectMode(selectedMode);
        }
    };

    const handleBack = () => {
        stopCamera();
        if (selectedMode) {
            setSelectedMode(null);
        } else {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-chef-paper">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-20 bg-chef-paper/95 backdrop-blur-sm border-b border-stone-200">
                <div className="flex items-center justify-between px-4 h-16">
                    <button
                        onClick={handleBack}
                        className="p-2 -ml-2 text-stone-600 hover:text-stone-900 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <h1 className="text-lg font-serif font-bold text-chef-gold">AI 視覺辨識</h1>
                    <div className="w-10"></div> {/* Spacer for centering */}
                </div>
            </div>

            {/* Content */}
            <div className="h-full pt-16 pb-20 flex flex-col">
                {!selectedMode ? (
                    /* Mode Selection */
                    <div className="flex-1 flex flex-col items-center justify-start pt-8 px-6">
                        {/* Mode Buttons */}
                        <div className="flex items-center justify-center gap-6 mb-12">
                            {modes.map((mode) => {
                                const Icon = mode.icon;
                                return (
                                    <button
                                        key={mode.id}
                                        onClick={() => handleModeSelect(mode.id)}
                                        className="flex flex-col items-center gap-2 group"
                                    >
                                        <div className="w-20 h-20 rounded-full bg-stone-900 flex items-center justify-center text-white transition-transform group-hover:scale-110 group-active:scale-95">
                                            <Icon size={32} strokeWidth={1.5} />
                                        </div>
                                        <span className="text-xs font-medium text-stone-600">{mode.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Camera Preview Placeholder */}
                        <div className="w-full max-w-md aspect-[4/3] rounded-3xl bg-stone-200 border-4 border-stone-900 flex items-center justify-center overflow-hidden shadow-xl">
                            <div className="text-center px-8">
                                <Camera size={64} className="text-stone-400 mx-auto mb-4" />
                                <p className="text-stone-500 text-sm font-medium">
                                    選擇上方模式以開啟相機
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* Camera View */
                    <div className="flex-1 flex flex-col items-center justify-start pt-4 px-4">
                        {/* Camera Frame */}
                        <div className="w-full max-w-md aspect-[4/3] rounded-3xl bg-black border-4 border-stone-900 overflow-hidden shadow-2xl relative">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />

                            {/* Scan Grid Overlay */}
                            <div className="absolute inset-0 pointer-events-none">
                                <div className="absolute inset-8 border-2 border-chef-gold/50 rounded-xl">
                                    {/* Corner Brackets */}
                                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-chef-gold"></div>
                                    <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-chef-gold"></div>
                                    <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-chef-gold"></div>
                                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-chef-gold"></div>
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            {/* Gallery Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-14 h-14 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                            >
                                <ImageIcon size={24} className="text-stone-700" />
                            </button>

                            {/* Capture Button */}
                            <button
                                onClick={handleCapture}
                                className="w-20 h-20 rounded-full bg-white border-[6px] border-chef-gold flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg"
                            >
                                <div className="w-16 h-16 rounded-full bg-chef-gold"></div>
                            </button>

                            {/* Flip Camera Button */}
                            <button
                                className="w-14 h-14 rounded-full bg-white border-2 border-stone-300 flex items-center justify-center hover:bg-stone-50 transition-colors"
                            >
                                <RotateCcw size={24} className="text-stone-700" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Navigation */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-chef-paper border-t border-stone-200 flex items-center justify-around px-8">
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center">
                        <span className="text-lg">🏠</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center">
                        <span className="text-lg">🍴</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-chef-gold">
                    <div className="w-10 h-10 rounded-xl bg-chef-gold/20 flex items-center justify-center">
                        <Camera size={20} />
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center">
                        <span className="text-lg">🏆</span>
                    </div>
                </button>
                <button className="flex flex-col items-center gap-1 text-stone-400">
                    <div className="w-10 h-10 rounded-xl bg-stone-200 flex items-center justify-center">
                        <span className="text-lg">👤</span>
                    </div>
                </button>
            </div>

            {/* Hidden File Input */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
            />
        </div>
    );
};
