import { useState, useEffect, useRef, useCallback } from 'react';

export const useCamera = () => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);

    const startCamera = useCallback(async () => {
        try {
            const constraints = {
                video: { facingMode: 'environment' } // Prefer back camera on mobile
            };
            const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setIsActive(true);
            setError(null);
        } catch (err) {
            console.error("Camera access denied:", err);
            setError("無法存取相機，請檢查權限設定。");
            setIsActive(false);
        }
    }, []);

    const stopCamera = useCallback(() => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
            setIsActive(false);
        }
    }, [stream]);

    const takePhoto = useCallback(() => {
        if (videoRef.current && isActive) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(videoRef.current, 0, 0);
                // Convert to File object
                return new Promise<File | null>((resolve) => {
                    canvas.toBlob((blob) => {
                        if (blob) {
                            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                            resolve(file);
                        } else {
                            resolve(null);
                        }
                    }, 'image/jpeg', 0.9);
                });
            }
        }
        return Promise.resolve(null);
    }, [isActive]);

    return { videoRef, startCamera, stopCamera, takePhoto, error, isActive };
};
