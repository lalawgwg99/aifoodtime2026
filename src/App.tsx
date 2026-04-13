import React from "react";

const shortSlogans = [
  "料理也能被驗證，省錢也能吃得好",
  "做菜像做實驗，菜單跟著台灣季節走",
  "失敗也有價值，省錢也有方法",
];

const painPoints = [
  "這個做法到底穩不穩",
  "失敗是因為哪個變因",
  "本週買什麼最划算",
];

const coreSolutions = [
  {
    title: "核心一：可驗證料理實驗室",
    description: "每道菜都有成功版本＋失敗版本＋原因對照。",
  },
  {
    title: "核心二：台灣食材週期菜單",
    description: "把季節、價格、促銷放進菜單決策，少花錢還吃更好。",
  },
];

const features = [
  {
    title: "實驗式食譜",
    description: "變因、步驟、結果清楚可複製。",
  },
  {
    title: "省錢菜單",
    description: "依台灣季節與市場價更新。",
  },
  {
    title: "失敗也記錄",
    description: "你不會再踩一樣的雷。",
  },
  {
    title: "每週 5 道菜",
    description: "少腦耗、直接照做。",
  },
];

const weeklyMenu = [
  "當季高麗菜三吃",
  "氣炸雞翅 170 vs 190 實驗",
  "冷凍花枝快炒零失敗",
  "豬絞肉 3 種萬用醬",
  "便當級三菜一湯",
];

const latestReports = [
  {
    title: "氣炸雞翅 170 vs 190：脆度差異與失敗原因",
    description: "比較不同溫度下的脆度、出油與失敗點，找出穩定解法。",
  },
  {
    title: "乾煎鯖魚不破皮：關鍵是水分與鍋溫",
    description: "拆解破皮率高的主因，建立可複製的前處理與下鍋流程。",
  },
  {
    title: "麻油雞不苦：薑先炸還是先煎？",
    description: "驗證薑處理順序對苦味與香氣的影響，提供穩定作法。",
  },
];

const weekOnePlan = [
  {
    title: "氣炸雞翅 170 vs 190 度：脆度、油耗、失敗率比較",
    outline: [
      "問題：溫度影響口感？",
      "實驗設計：同批雞翅、同時間、不同溫度",
      "結果：外皮脆度、出油量、內部熟度",
      "結論：最佳溫度與注意事項",
      "下一步：加醃料後是否改變結果",
    ],
  },
  {
    title: "高麗菜三吃：同一顆菜，省錢吃滿 3 天",
    outline: [
      "台灣當季高麗菜價格與保存",
      "第一天：清炒快熟版",
      "第二天：味噌湯／蛋花湯版",
      "第三天：煎餅或炒飯版",
      "成本拆解與每餐預估成本",
    ],
  },
  {
    title: "乾煎鯖魚不破皮：鍋溫與擦乾水分的臨界點",
    outline: [
      "失敗原因統整",
      "實驗：鍋溫三段＋是否擦乾",
      "結果：破皮率、香氣、熟度",
      "結論：可複製的流程",
    ],
  },
  {
    title: "冷凍花枝快炒不出水：解凍方式對口感影響",
    outline: [
      "常見失敗：出水、變老",
      "實驗：冷藏解凍 vs 常溫解凍 vs 直接下鍋",
      "結果：口感、出水量",
      "結論：最穩的做法與時間",
    ],
  },
  {
    title: "豬絞肉萬用醬：一鍋三變、成本最低",
    outline: [
      "萬用醬基底配方",
      "變化 1：拌飯",
      "變化 2：拌麵",
      "變化 3：蔬菜炒",
      "一鍋成本拆解",
    ],
  },
];

export default function App() {
  return (
    <div className="page">
      <header className="nav">
        <div className="container nav-inner">
          <div className="logo">CookLab AI</div>
          <nav className="nav-links">
            <a href="#positioning">品牌定位</a>
            <a href="#solution">雙核心</a>
            <a href="#menu">本週菜單</a>
            <a href="#week-plan">內容企劃</a>
            <a href="#subscribe" className="btn btn-ghost">
              加入更新
            </a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container hero-inner">
            <div>
              <div className="badge">料理實驗室 × 台灣食材週期</div>
              <h1>做菜，不再靠運氣</h1>
              <p className="lead">
                CookLab AI 用實驗驗證料理成功率，結合台灣當季食材與價格，給你真正省錢又穩定的每週菜單。
              </p>
              <div className="actions">
                <a href="#menu" className="btn btn-primary">
                  免費看本週菜單
                </a>
                <a href="#reports" className="btn btn-secondary">
                  看最新實驗報告
                </a>
              </div>
            </div>
            <div className="hero-card">
              <div className="card-title">CookLab AI 定位</div>
              <div className="card-highlight">可驗證的料理實驗室＋台灣食材週期省錢菜單</div>
              <p>每週只做最值得做的菜，降低失敗與食材浪費，讓家常菜穩定好吃。</p>
              <div className="card-footer">本週重點：5 道可複製菜單</div>
            </div>
          </div>
        </section>

        <section className="section" id="positioning">
          <div className="container">
            <h2>品牌定位一句話</h2>
            <p className="positioning-line">
              CookLab AI：用實驗驗證料理，用在地食材省錢吃好，每週只做最值得做的菜。
            </p>
            <h3>備選短標語</h3>
            <ol className="slogan-list">
              {shortSlogans.map((slogan) => (
                <li key={slogan}>{slogan}</li>
              ))}
            </ol>
          </div>
        </section>

        <section className="section" id="pain">
          <div className="container">
            <h2>你不缺食譜，你缺的是：</h2>
            <div className="pain-grid">
              {painPoints.map((painPoint) => (
                <div className="pain" key={painPoint}>
                  {painPoint}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section split" id="solution">
          <div className="container">
            <h2>解法：雙核心</h2>
            <div className="split-grid">
              {coreSolutions.map((core) => (
                <article className="feature-card" key={core.title}>
                  <h3>{core.title}</h3>
                  <p>{core.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="container">
            <h2>產品特色</h2>
            <div className="features-grid">
              {features.map((feature) => (
                <article className="feature" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="menu">
          <div className="container">
            <h2>本週範例</h2>
            <p className="section-lead">本週省錢菜單：</p>
            <div className="menu-list">
              {weeklyMenu.map((item, index) => (
                <div className="menu-item" key={item}>
                  {index + 1}) {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="reports">
          <div className="container">
            <h2>最新實驗報告</h2>
            <div className="reports-grid">
              {latestReports.map((report) => (
                <article className="report-card" key={report.title}>
                  <h3>{report.title}</h3>
                  <p>{report.description}</p>
                  <span>看完整報告</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="week-plan">
          <div className="container">
            <h2>第一週內容企劃（5 篇）</h2>
            <div className="plan-grid">
              {weekOnePlan.map((post) => (
                <article className="plan-card" key={post.title}>
                  <h3>{post.title}</h3>
                  <ul>
                    {post.outline.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section subscribe" id="subscribe">
          <div className="container subscribe-inner">
            <div>
              <h2>加入每週菜單與實驗報告</h2>
              <p>Email 訂閱／Telegram 即時更新</p>
            </div>
            <div className="subscribe-form">
              <input type="email" placeholder="輸入 Email" aria-label="Email" />
              <button className="btn btn-primary">Email 訂閱</button>
              <a href="https://t.me" target="_blank" rel="noreferrer" className="btn btn-secondary">
                Telegram 更新
              </a>
            </div>
          </div>
        </section>

        <section className="section about">
          <div className="container">
            <h2>About</h2>
            <p>
              CookLab AI 是把料理當實驗做的人，目標只有一個：讓你少失敗、少花錢、吃更好。
            </p>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div>© 2026 CookLab AI</div>
          <div className="muted">用實驗驗證料理，用在地食材省錢吃好</div>
        </div>
      </footer>
    </div>
  );
}
