import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      nav: {
        fridge: "Fridge",
        planner: "Planner",
        workbench: "Workbench",
        experiment: "Experiment",
        support: "Support",
        pricing: "Pricing",
      },
      auth: {
        kicker: "Authentication",
        title: "User accounts for paid product flows",
        description:
          "Sign in before checkout to attach subscriptions and waitlist intent to a real account.",
        signedIn: "Signed in as {{email}}",
        signOut: "Sign out",
        modeSignIn: "Sign in",
        modeSignUp: "Sign up",
        email: "Email",
        password: "Password",
        submitSignIn: "Continue with email",
        submitSignUp: "Create account",
        successSignIn: "Signed in successfully.",
        successSignUp: "Account created. Check your inbox if email confirmation is enabled.",
        errorMissing: "Missing Supabase credentials. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
      },
      pricing: {
        kicker: "Monetization architecture",
        title: "Design the product around repeat paid value.",
        desc:
          "Launch narrative: Taiwan market beta now, global household planning platform next. Pricing is framed in USD because this needs to work beyond one geography.",
        launchKicker: "Launch CTA",
        launchTitle: "Collect revenue intent before the global data layer is complete.",
        launchDesc:
          "This waitlist form writes into backend storage and can route users into Stripe checkout.",
        waitlistPlaceholder: "founder@creator.com",
        waitlistCta: "Join paid beta",
        waitlistSuccess: "Waitlist captured. Next step is checkout onboarding.",
        waitlistError: "Enter a valid email address.",
        checkoutError: "Could not start checkout. Verify Stripe backend configuration.",
      },
      common: {
        language: "Language",
        chinese: "繁中",
        english: "EN",
      },
    },
  },
  "zh-TW": {
    translation: {
      nav: {
        fridge: "冰箱",
        planner: "規劃器",
        workbench: "工作台",
        experiment: "實驗室",
        support: "支援",
        pricing: "定價",
      },
      auth: {
        kicker: "帳號系統",
        title: "可付費產品需要帳號層",
        description: "先登入，再把 waitlist 與 Stripe 訂閱綁到同一個使用者身份。",
        signedIn: "目前登入：{{email}}",
        signOut: "登出",
        modeSignIn: "登入",
        modeSignUp: "註冊",
        email: "Email",
        password: "密碼",
        submitSignIn: "使用 Email 登入",
        submitSignUp: "建立帳號",
        successSignIn: "登入成功。",
        successSignUp: "註冊成功。若啟用信箱驗證，請至信箱確認。",
        errorMissing: "缺少 Supabase 設定，請補上 VITE_SUPABASE_URL 與 VITE_SUPABASE_ANON_KEY。",
      },
      pricing: {
        kicker: "商業化架構",
        title: "產品要圍繞可重複付費價值設計",
        desc: "目前是台灣市場 beta，結構已預留全球化訂閱路徑。定價先以 USD 表示。",
        launchKicker: "上線轉換",
        launchTitle: "全球資料層還沒完工前，先收斂付費意圖",
        launchDesc: "這個表單會寫入後端 waitlist，並可直接串到 Stripe 結帳。",
        waitlistPlaceholder: "founder@creator.com",
        waitlistCta: "加入付費 beta",
        waitlistSuccess: "已加入 waitlist，下一步可進入付款流程。",
        waitlistError: "請輸入有效 Email。",
        checkoutError: "無法啟動付款流程，請檢查 Stripe 後端設定。",
      },
      common: {
        language: "語言",
        chinese: "繁中",
        english: "EN",
      },
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
