---
description: [全端網站上線標準流程 SOP - Domain / SEO / Analytics / Security]
---

# 🚀 全端網站上線標準流程 (Website Launch SOP)

此流程適用於所有新上線的 Web 專案 (Cloudflare Pages / Vercel)，確保網站具備專業級的安全性與流量體質。

---

## 1. 網域與 DNS (Domain & DNS)

- [ ] **Cloudflare Custom Domain**:
  - 進入 Pages -> Custom Domains -> Set up custom domain.
  - 綁定主網域 (如 `example.com`) 與 `www` 子網域。
- [ ] **Google OAuth 白名單 (若有)**:
  - 更新 Google Cloud Console -> Credentials -> Authorized Origins & Redirect URIs.

## 2. 網站設定與安全性 (Config & Security)

- [ ] **Cloudflare WAF / Security**:
  - 開啟 **Bot Fight Mode** (防止惡意爬蟲)。
  - 開啟 **Block AI Scrapers** (保護內容不被 AI 免費抓取)。
  - 開啟 **Always Use HTTPS** 與 **HSTS** (6個月)。
  - 開啟 **Brotli** 與 **Early Hints** (效能優化)。

## 3. SEO 基礎建設 (SEO Essentials)

- [ ] **Meta Tags (index.html)**:
  - `title`: 包含品牌名 + 核心價值 + 關鍵字。
  - `description`: 吸引人的簡短介紹 (150字內)。
  - `og:image`: 必備！製作 1200x630 品牌圖卡 (放 `public/og-image.png`)。
- [ ] **Robots.txt (`public/robots.txt`)**:
  - 允許所有爬蟲，並指向 Sitemap。
- [ ] **Sitemap (`public/sitemap.xml`)**:
  - 列出首頁與重要頁面連結，方便 Google 索引。

## 4. 流量分析 (Analytics)

- [ ] **Cloudflare Web Analytics (優先)**:
  - 1-Click 開啟，免費、隱私、不拖速。
  - Dashboard -> Web Analytics -> Enable.
- [ ] **Google Analytics 4 (GA4)**:
  - 取得 Measurement ID (`G-XXXXXXXX`).
  - 將 `gtag.js` 貼入 `index.html` 的 `<head>` 最上方。
- [ ] **Google Search Console (GSC)**:
  - 使用 DNS 驗證網域所有權。
  - 提交 `sitemap.xml`。

## 5. 最終檢查 (Final Check)

- [ ] 使用無痕視窗測試登入/註冊流程。
- [ ] 檢查手機版 Open Graph 預覽 (貼到 Line/FB 測試)。
- [ ] 用 `nslookup` 確認 DNS 生效。
