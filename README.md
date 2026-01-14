<div align="center">

<img width="120" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" alt="SavorChef Logo" />

# 饗味食光 (SavorChef)

### 🍳 讓食材綻放靈魂 — 全球趨勢與極致私廚系統

[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-Powered-8E75B2?style=flat-square&logo=google)](https://ai.google.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

</div>

---

## ✨ 專案簡介

**饗味食光** 是一款頂級 AI 私廚系統，結合 **全球美食趨勢研究**、**米其林大師量化評比**、**拍照食材辨識** 與 **語音導引**，讓每一口料理都具備靈魂。

透過 Google Gemini AI 的強大能力，為您打造專屬的味覺饗宴體驗。

---

## 🚀 核心功能

### 🔮 AI 智慧功能

| 功能 | 說明 |
|------|------|
| **🍽️ 智慧食譜推薦** | 根據食材、飲食目標、料理風格與用餐場合，AI 量身打造專屬食譜 |
| **📸 食材 X 光透視** | 拍照辨識冰箱食材，自動分析可用食材並推薦料理 |
| **🎯 味道竊取者** | 看到美食照片？AI 幫您逆向工程還原食譜！ |
| **📊 營養分析師** | 掃描任何餐點，即時獲得熱量與營養成分分析 |
| **👨‍🍳 主廚評鑑** | 上傳您的料理作品，獲得 AI 米其林級評語與擺盤建議 |
| **🌍 全球趨勢** | 追蹤最新美食趨勢、當季食材與擺盤風格 |

### 🎯 飲食目標支援

- 🥗 均衡飲食 (Balanced)
- 🏃 減重計畫 (Weight Loss)
- 💪 增肌飲食 (Muscle Gain)
- ⚡ 快速簡餐 (Quick & Easy)
- 💰 經濟實惠 (Budget Friendly)
- 🍜 療癒美食 (Comfort Food)
- 🥑 生酮飲食 (Keto Friendly)
- 🌱 植物性飲食 (Plant Based)
- 🌾 高纖飲食 (High Fiber)
- 🧂 低鈉飲食 (Low Sodium)

### 🌏 支援料理風格

日式 🇯🇵 | 台式 🇹🇼 | 義式 🇮🇹 | 西式 🍔 | 中式 🇨🇳 | 泰式 🇹🇭 | 法式 🇫🇷 | 韓式 🇰🇷 | 越式 🇻🇳 | 印度 🇮🇳 | 墨西哥 🇲🇽 | 美式 🇺🇸

---

## 🛠️ 技術架構

```
饗味食光/
├── 📁 components/          # React 元件
│   ├── AuthModal.tsx       # 登入/註冊彈窗
│   ├── Community.tsx       # 社群互動功能
│   ├── Hero.tsx            # 首頁主視覺與搜尋
│   ├── MarketTicker.tsx    # 市場趨勢跑馬燈
│   ├── Onboarding.tsx      # 新手引導流程
│   ├── ProfileModal.tsx    # 個人資料管理
│   ├── RecipeCard.tsx      # 食譜卡片組件
│   └── SubscriptionModal.tsx # 訂閱方案彈窗
├── 📁 services/
│   └── geminiService.ts    # Gemini AI 服務封裝
├── 📁 public/              # 靜態資源
├── App.tsx                 # 應用程式主體
├── types.ts                # TypeScript 型別定義
├── config.ts               # 應用程式設定
├── index.html              # HTML 入口
├── index.tsx               # React 入口
├── index.css               # 全域樣式
├── tailwind.config.js      # Tailwind 設定
├── vite.config.ts          # Vite 建置設定
└── package.json            # 專案依賴
```

### 技術棧

| 層級 | 技術 |
|------|------|
| **前端框架** | React 19 + TypeScript 5.7 |
| **建置工具** | Vite 6.0 |
| **樣式系統** | TailwindCSS 3.4 |
| **AI 引擎** | Google Gemini API (@google/genai) |
| **圖示庫** | Lucide React |

---

## 📦 快速開始

### 系統需求

- Node.js 18+
- npm 或 yarn
- Google Gemini API Key

### 安裝步驟

```bash
# 1. 複製專案
git clone https://github.com/lalawgwg99/aifoodtime2026.git
cd aifoodtime2026

# 2. 安裝依賴
npm install

# 3. 設定環境變數
# 編輯 .env.local 檔案，填入您的 Gemini API Key
GEMINI_API_KEY=your_api_key_here

# 4. 啟動開發伺服器
npm run dev
```

### 建置生產版本

```bash
# 建置
npm run build

# 預覽
npm run preview
```

---

## ⚙️ 設定說明

### 建置模式 (`config.ts`)

```typescript
// true  = App Store 上架模式 (解鎖所有 Pro 功能)
// false = Web SaaS 營利模式 (啟用付費牆)
export const IS_APP_STORE_BUILD = false;
```

### 權限需求 (`metadata.json`)

- 📷 **相機** — 食材拍照辨識
- 🎤 **麥克風** — 語音導引功能
- 📍 **定位** — 在地化食材推薦

---

## 🎨 使用者介面

### 核心體驗

1. **🏠 首頁** — 輸入食材、選擇偏好，一鍵獲得 AI 食譜
2. **📸 視覺探索** — 三種 AI 視覺模式：味道竊取、冰箱透視、營養掃描
3. **👨‍🍳 主廚評鑑** — 上傳作品獲得專業評語
4. **🌍 趨勢報告** — 掌握全球美食動態
5. **👥 社群** — 分享食譜、交流心得

---

## 📄 API 服務

### Gemini 服務功能 (`geminiService.ts`)

| 方法 | 功能 |
|------|------|
| `generateRecipes()` | 根據條件生成食譜 |
| `analyzeImage()` | 影像分析 (食材辨識/營養分析) |
| `generateChefVerdict()` | 料理作品評鑑 |
| `generateRecipeImage()` | 食譜配圖生成 |
| `askSousChef()` | 烹飪助手問答 |
| `createRecipeFromDraft()` | 草稿轉專業食譜 |
| `fetchDiscoveryFeed()` | 探索推薦 |
| `fetchMarketTrends()` | 市場趨勢報告 |

---

## 🗺️ 開發路線圖

- [x] ✅ 核心食譜推薦系統
- [x] ✅ AI 視覺辨識 (三種模式)
- [x] ✅ 主廚評鑑系統
- [x] ✅ 全球趨勢分析
- [x] ✅ 社群分享功能
- [ ] 🔜 語音導引烹飪
- [ ] 🔜 智慧購物清單
- [ ] 🔜 跨裝置同步
- [ ] 🔜 AR 擺盤指導

---

## 🤝 貢獻指南

歡迎貢獻！請遵循以下流程：

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

---

## 📜 授權條款

本專案採用 MIT 授權條款 — 詳見 [LICENSE](LICENSE) 檔案

---

## 📧 聯絡資訊

**專案連結：** [https://github.com/lalawgwg99/aifoodtime2026](https://github.com/lalawgwg99/aifoodtime2026)

**AI Studio 預覽：** [https://ai.studio/apps/drive/1C43Glk1UIKgOmpyzBsyNFu-U5YlKT1Ol](https://ai.studio/apps/drive/1C43Glk1UIKgOmpyzBsyNFu-U5YlKT1Ol)

---

<div align="center">

**用心料理，讓每一口都成為回憶 ❤️**

Made with 💝 by SavorChef Team

</div>
