/**
 * Google Authentication Service
 * 使用 Google Identity Services SDK 實作登入功能
 */

declare global {
    interface Window {
        google?: {
            accounts: {
                id: {
                    initialize: (config: GoogleIdConfiguration) => void;
                    renderButton: (element: HTMLElement, config: GoogleButtonConfiguration) => void;
                    prompt: () => void;
                };
            };
        };
    }
}

interface GoogleIdConfiguration {
    client_id: string;
    callback: (response: GoogleCredentialResponse) => void;
    auto_select?: boolean;
    cancel_on_tap_outside?: boolean;
}

interface GoogleButtonConfiguration {
    theme?: 'outline' | 'filled_blue' | 'filled_black';
    size?: 'large' | 'medium' | 'small';
    text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
    shape?: 'rectangular' | 'pill' | 'circle' | 'square';
    logo_alignment?: 'left' | 'center';
    width?: number;
    locale?: string;
}

export interface GoogleCredentialResponse {
    credential: string;
    select_by: string;
    clientId: string;
}

export interface GoogleUserPayload {
    sub: string;        // Google User ID
    name: string;
    given_name: string;
    family_name: string;
    picture: string;
    email: string;
    email_verified: boolean;
    locale: string;
}

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

/**
 * 解碼 JWT Token 取得 Payload
 */
export function decodeJwtPayload(token: string): GoogleUserPayload | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
    }
}

/**
 * 初始化 Google Sign-In
 */
export function initializeGoogleSignIn(
    callback: (response: GoogleCredentialResponse) => void
): boolean {
    if (!window.google) {
        console.warn('Google Identity Services SDK not loaded yet');
        return false;
    }

    if (!GOOGLE_CLIENT_ID) {
        console.error('VITE_GOOGLE_CLIENT_ID is not set');
        return false;
    }

    window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback,
        auto_select: false,
        cancel_on_tap_outside: true,
    });

    return true;
}

/**
 * 在指定元素渲染 Google 登入按鈕
 */
export function renderGoogleButton(elementId: string): boolean {
    const element = document.getElementById(elementId);
    if (!element || !window.google) {
        return false;
    }

    window.google.accounts.id.renderButton(element, {
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
        logo_alignment: 'left',
        width: 300,
        locale: 'zh_TW',
    });

    return true;
}
