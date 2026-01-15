import { useCallback } from 'react';

// Use a high-quality glass chime sound from a reliable hosted source
// This one is a crisp, ethereal "ding" suitable for UI success states
const SUCCESS_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview-primary.mp3";

export const useSound = () => {
    const playSuccess = useCallback(() => {
        try {
            const audio = new Audio(SUCCESS_SOUND_URL);
            audio.volume = 0.4; // Subtle volume, not startling
            audio.play().catch(e => {
                // Silent failure is acceptable for UI sounds if autoplay is blocked
                console.warn('Audio playback failed (likely browser policy):', e);
            });
        } catch (e) {
            console.error('Audio initialization failed', e);
        }
    }, []);

    return { playSuccess };
};
