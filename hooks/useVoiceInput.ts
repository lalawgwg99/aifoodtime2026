import { useState, useEffect, useCallback, useRef } from 'react';

interface UseVoiceInputReturn {
    isListening: boolean;
    transcript: string;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
    isSupported: boolean;
}

export const useVoiceInput = (lang: string = 'zh-TW'): UseVoiceInputReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isSupported, setIsSupported] = useState(true);

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setIsSupported(false);
            setError('您的瀏覽器不支援語音輸入功能');
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false; // Stop after one sentence for command-like inputs
        recognition.interimResults = true; // Show results in real-time
        recognition.lang = lang;

        recognition.onstart = () => {
            setIsListening(true);
            setError(null);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            let interimTranscript = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Update with mostly the interim, but settle on final
            // For simple inputs, we just want the latest guess
            setTranscript(finalTranscript || interimTranscript);
        };

        recognition.onerror = (event: any) => {
            console.error('Speech recognition error', event.error);
            if (event.error === 'not-allowed') {
                setError('請允許麥克風權限以使用語音功能');
            } else if (event.error === 'no-speech') {
                // Ignore no-speech errors usually, just stop listening
            } else {
                setError(event.error);
            }
            setIsListening(false);
        };

        recognitionRef.current = recognition;
    }, [lang]);

    const startListening = useCallback(() => {
        if (recognitionRef.current && !isListening) {
            try {
                setTranscript('');
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start failed", e);
            }
        }
    }, [isListening]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    }, [isListening]);

    const resetTranscript = useCallback(() => {
        setTranscript('');
    }, []);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript,
        isSupported
    };
};
