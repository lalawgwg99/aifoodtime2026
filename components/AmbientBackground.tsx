import React from 'react';

export const AmbientBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {/* 1. Paper Texture (Noise) - Using Data URI to ensure loading */}
            <div
                className="absolute inset-0 opacity-[0.9] mix-blend-multiply pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.08'/%3E%3C/svg%3E")`,
                }}
            ></div>

            {/* 2. Ambient Orbs (Light) - Enhanced Visibility */}
            {/* Top Left - Warm Gold - More opaque and larger */}
            <div className="absolute top-[-20%] left-[-20%] w-[80vw] h-[80vw] bg-[#E8DCC4] rounded-full blur-[100px] opacity-40 animate-pulse-slow mix-blend-multiply" />

            {/* Bottom Right - Stone/Cool - More opaque */}
            <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#D6D3D1] rounded-full blur-[100px] opacity-30 mix-blend-multiply" />

            {/* Center Top - Golden Highlight - Adds shimmer */}
            <div className="absolute top-[10%] left-[50%] -translate-x-1/2 w-[40vw] h-[40vw] bg-[#FFF8E7] rounded-full blur-[80px] opacity-60 mix-blend-soft-light" />
        </div>
    );
};
