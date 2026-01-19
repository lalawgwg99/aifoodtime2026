# 饗味食光 SavorChef - AI 私廚顧問系統

![SavorChef Design](https://images.unsplash.com/photo-1547592180-85f173990554?q=80&w=2070&auto=format&fit=crop)

> **「這不僅是食譜，更是您廚房裡的藝術策展人。」**
>
> *An AI-powered culinary companion that transforms ingredients into soulful experiences.*

---

## 📖 專案簡介 (Introduction)

**饗味食光 (SavorChef)** 是一個結合 **Google Gemini AI** 多模態感知能力的現代化極致私廚系統。

不同於傳統食譜 App 僅列出步驟，SavorChef 致力於**「全流程陪伴」**。從打開冰箱的那一刻起，直到餐點上桌，AI 就像一位隨侍在側的米其林二廚，解決您「不知道煮什麼」、「不知道怎麼煮」以及「不知道怎麼擺盤」的困擾。

**🎉 完全免費 (Free to Use)**：我們相信好品味不應有門檻，目前所有進階 AI 功能均開放免費使用。

---

## ✨ 深度核心功能 (Core Features In-Depth)

我們將烹飪體驗拆解為三個關鍵階段：**靈感 (Inspiration)**、**生成 (Creation)** 與 **實作 (Execution)**。

### 1. �️ AI 視覺辨識：三大模式 (Vision Modes)

透過 **Gemini Vision Pro** 的強大算力，將您的手機鏡頭轉化為智能食材掃描器。

* **🥬 廚神模式 (Fridge X-Ray)**
  * **場景**：站在冰箱前發呆，充滿剩材卻不知道煮什麼。
  * **功能**：拍下冰箱內部或料理台上的食材，AI 自動盤點庫存，分析食材新鮮度與搭配性，立即生成「清冰箱米其林菜單」。
  * **魔法**：連角落的半顆洋蔥和過期前的牛奶都能被完美利用。

* **🕵️ 廚師帽模式 (Taste Thief / 食客模式)**
  * **場景**：在餐廳吃到一道驚為天人的料理，想在家復刻。
  * **功能**：拍下菜色，AI 逆向工程分析與解構，推導出可能的烹飪工法、調味比例與食材組合，還原大廚秘方。
  * **魔法**：把餐廳美味帶回家，只需一張照片。

* **📊 營養師模式 (Nutri Scanner)**
  * **場景**：健身、減脂或需要嚴格控制飲食。
  * **功能**：識別盤中食物，即時估算卡路里與三大營養素（蛋白質、碳水、脂肪），並提供更健康的烹調建議。
  * **魔法**：吃得健康不再需要查表計算，看一眼就知道。

### 2. 🍳 靈感食譜生成 (Generative Recipes)

AI 不產生罐頭文字，而是為您「創作」專屬食譜。

* **量身定制**：根據您現有的食材、人數、口味偏好（如：微辣、不吃香菜）生成。
* **完整套餐**：不僅是一道菜，更能規劃包含 **前菜 (Appetizer)**、**主餐 (Main Course)** 與 **湯品 (Soup)** 的完整餐桌提案。
* **風味描述**：每道菜都附帶如詩般的風味描述，讓您在烹飪前就能想像味道。
* **食譜圖片**：透過 AI 生成預覽圖，讓您知道完成品該長什麼樣。

### 3. 👨‍🍳 AI 二廚幫忙 (Sous-Chef Assistance)

進入烹飪模式後，SavorChef 轉變為您的廚房助手。

* **沉浸式導航**：專為沾滿油污的手設計的「大字體、高對比」介面，步驟清晰。
* **語音關鍵提醒**：針對關鍵步驟（如：「大火快炒30秒」、「轉小火燉煮」）提供提示，不再手忙腳亂。
* **SOS 救援**：如果不小心煮鹹了或燒焦了，AI 提供即時補救方案（如：「加入馬鈴薯吸走鹽分」）。

---

## 🛠 技術與美學 (Tech & Aesthetics)

* **Ambient Design (氛圍感)**：採用米色調 (Chef Paper) 與流動光影，減少數位冰冷感，營造溫暖、平靜的料理氛圍。
* **Security (資安承諾)**：雖免費使用，但資安不打折。所有上傳的個人影像經 AI 即時運算後即銷毀 (Ephemeral Processing)，絕不留存挪作他用。

---

## 🚀 快速開始 (Getting Started)

### 安裝步驟

1. **複製專案**

    ```bash
    git clone https://github.com/your-username/savor-chef-ai.git
    cd savor-chef-ai
    ```

2. **安裝依賴**

    ```bash
    npm install
    ```

3. **設定環境變數**
    複製 `.env.example` 為 `.env` 並填入您的 API Key：

    ```env
    VITE_GEMINI_API_KEY=your_api_key_here
    ```

4. **啟動開發伺服器**

    ```bash
    npm run dev
    ```

---

## 📝 版權與聲明 (Legal)

Copyright © 2026 **SavorChef Inc.** All rights reserved. Built with ❤️ in Taiwan.

* 使用本服務即代表您同意我們的 [使用條款] 與 [隱私政策]。
* AI 生成內容僅供參考，烹飪時請注意用火安全。
