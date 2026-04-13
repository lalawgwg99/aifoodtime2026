import React, { FormEvent, useMemo, useState } from "react";

type Trend = "上升" | "下降" | "持平";

interface ExperimentVariant {
  id: string;
  label: string;
  cookMinutes: number;
  successRate: number;
  textureScore: number;
  stabilityScore: number;
  estimatedCost: number;
  note: string;
}

interface Experiment {
  id: string;
  title: string;
  question: string;
  variants: ExperimentVariant[];
}

interface MenuItem {
  id: string;
  title: string;
  prepTime: string;
  cooklabCost: number;
  marketCost: number;
  highlight: string;
  recommended: boolean;
}

interface SeasonalSignal {
  ingredient: string;
  trend: Trend;
  range: string;
  action: string;
}

interface Report {
  title: string;
  summary: string;
  confidence: number;
  keyFinding: string;
}

interface ContentPlan {
  title: string;
  outline: string[];
}

const brandPositioning =
  "CookLab AI：用實驗驗證料理，用在地食材省錢吃好，每週只做最值得做的菜。";

const shortSlogans = [
  "料理也能被驗證，省錢也能吃得好",
  "做菜像做實驗，菜單跟著台灣季節走",
  "失敗也有價值，省錢也有方法",
];

const experiments: Experiment[] = [
  {
    id: "wings-temp",
    title: "氣炸雞翅 170 vs 190",
    question: "在相同時間下，溫度會如何影響脆度與失敗率？",
    variants: [
      {
        id: "wings-170",
        label: "170°C × 18 分鐘",
        cookMinutes: 18,
        successRate: 88,
        textureScore: 76,
        stabilityScore: 90,
        estimatedCost: 112,
        note: "表皮較薄脆、內部水分穩定，適合新手。",
      },
      {
        id: "wings-190",
        label: "190°C × 18 分鐘",
        cookMinutes: 18,
        successRate: 69,
        textureScore: 92,
        stabilityScore: 63,
        estimatedCost: 116,
        note: "脆度高但容易過乾，翻面時機非常敏感。",
      },
    ],
  },
  {
    id: "mackerel-skin",
    title: "乾煎鯖魚不破皮",
    question: "鍋溫與水分控制，哪個更影響完整度？",
    variants: [
      {
        id: "mackerel-dry",
        label: "擦乾＋中高溫起鍋",
        cookMinutes: 9,
        successRate: 91,
        textureScore: 84,
        stabilityScore: 93,
        estimatedCost: 98,
        note: "破皮率最低，香氣釋放更完整。",
      },
      {
        id: "mackerel-wet",
        label: "未擦乾＋中溫",
        cookMinutes: 11,
        successRate: 54,
        textureScore: 61,
        stabilityScore: 49,
        estimatedCost: 102,
        note: "皮面易黏鍋，翻面時破裂風險高。",
      },
    ],
  },
  {
    id: "squid-defrost",
    title: "冷凍花枝快炒不出水",
    question: "不同解凍方式，口感與出水量差異多大？",
    variants: [
      {
        id: "squid-fridge",
        label: "冷藏解凍 8 小時",
        cookMinutes: 6,
        successRate: 86,
        textureScore: 82,
        stabilityScore: 87,
        estimatedCost: 124,
        note: "口感最穩、出水量最低，適合大量備餐。",
      },
      {
        id: "squid-room",
        label: "常溫解凍 40 分鐘",
        cookMinutes: 6,
        successRate: 62,
        textureScore: 67,
        stabilityScore: 58,
        estimatedCost: 124,
        note: "解凍速度快，但纖維流失與出水風險偏高。",
      },
    ],
  },
];

const weeklyMenu: MenuItem[] = [
  {
    id: "cabbage",
    title: "當季高麗菜三吃",
    prepTime: "30 分鐘內完成 3 份基底",
    cooklabCost: 136,
    marketCost: 188,
    highlight: "同一顆菜延伸 3 天，減少浪費",
    recommended: true,
  },
  {
    id: "wings",
    title: "氣炸雞翅 170 vs 190 實驗版",
    prepTime: "實作 25 分鐘",
    cooklabCost: 180,
    marketCost: 238,
    highlight: "同批對照，直接選穩定口感",
    recommended: true,
  },
  {
    id: "squid",
    title: "冷凍花枝快炒零失敗",
    prepTime: "10 分鐘快炒",
    cooklabCost: 172,
    marketCost: 226,
    highlight: "解凍路徑固定，降低出水率",
    recommended: true,
  },
  {
    id: "pork-sauce",
    title: "豬絞肉 3 種萬用醬",
    prepTime: "1 鍋 3 變、可冷凍分裝",
    cooklabCost: 149,
    marketCost: 214,
    highlight: "拌飯拌麵炒菜共用同一基底",
    recommended: true,
  },
  {
    id: "bento",
    title: "便當級三菜一湯",
    prepTime: "45 分鐘批次完成",
    cooklabCost: 208,
    marketCost: 286,
    highlight: "一次備好平日便當配菜",
    recommended: false,
  },
];

const seasonalSignals: SeasonalSignal[] = [
  { ingredient: "高麗菜", trend: "下降", range: "NT$ 22-30 / 600g", action: "本週可加碼，適合做三吃。" },
  { ingredient: "雞翅", trend: "持平", range: "NT$ 105-120 / 600g", action: "可先醃再凍，分批氣炸更省時。" },
  { ingredient: "花枝", trend: "上升", range: "NT$ 150-180 / 500g", action: "優先買冷凍規格，控制成本波動。" },
];

const reports: Report[] = [
  {
    title: "氣炸雞翅 170 vs 190：脆度差異與失敗原因",
    summary: "170°C 在穩定度與多數人口感偏好中勝出，190°C 更適合追求極致脆感。",
    confidence: 88,
    keyFinding: "翻面提早 2 分鐘可讓過乾風險下降約 17%。",
  },
  {
    title: "乾煎鯖魚不破皮：關鍵是水分與鍋溫",
    summary: "先擦乾再下鍋，搭配中高溫定型，能大幅降低破皮率。",
    confidence: 91,
    keyFinding: "皮面接觸鍋面後 30 秒內不要移動，成功率最高。",
  },
  {
    title: "麻油雞不苦：薑先炸還是先煎？",
    summary: "薑片中火先煎再轉小火炸香，苦味最低，香氣保留更完整。",
    confidence: 84,
    keyFinding: "高溫直接炸會讓辛辣成分過度氧化，苦味上升。",
  },
];

const weekOnePlan: ContentPlan[] = [
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

const recommendedMenuIds = weeklyMenu.filter((item) => item.recommended).map((item) => item.id);

function formatPrice(value: number): string {
  return `NT$ ${value.toLocaleString("zh-TW")}`;
}

function trendClassName(trend: Trend): string {
  if (trend === "下降") {
    return "trend trend-down";
  }
  if (trend === "上升") {
    return "trend trend-up";
  }
  return "trend trend-flat";
}

export default function App() {
  const [activeExperimentId, setActiveExperimentId] = useState(experiments[0].id);
  const [variantMap, setVariantMap] = useState<Record<string, string>>(() =>
    Object.fromEntries(experiments.map((experiment) => [experiment.id, experiment.variants[0].id]))
  );
  const [selectedMenuIds, setSelectedMenuIds] = useState<string[]>(recommendedMenuIds);
  const [email, setEmail] = useState("");
  const [subscribeState, setSubscribeState] = useState<"idle" | "error" | "success">("idle");

  const activeExperiment = useMemo(
    () => experiments.find((experiment) => experiment.id === activeExperimentId) ?? experiments[0],
    [activeExperimentId]
  );

  const activeVariant = useMemo(() => {
    const selectedId = variantMap[activeExperiment.id];
    return (
      activeExperiment.variants.find((variant) => variant.id === selectedId) ?? activeExperiment.variants[0]
    );
  }, [activeExperiment, variantMap]);

  const selectedMenus = useMemo(
    () => weeklyMenu.filter((menuItem) => selectedMenuIds.includes(menuItem.id)),
    [selectedMenuIds]
  );

  const totals = useMemo(() => {
    const cooklabCost = selectedMenus.reduce((sum, item) => sum + item.cooklabCost, 0);
    const marketCost = selectedMenus.reduce((sum, item) => sum + item.marketCost, 0);
    const saved = marketCost - cooklabCost;
    const savedRate = marketCost === 0 ? 0 : Math.round((saved / marketCost) * 100);

    return { cooklabCost, marketCost, saved, savedRate };
  }, [selectedMenus]);

  const toggleMenu = (id: string): void => {
    setSelectedMenuIds((prev) => (prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]));
  };

  const handleSubscribe = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

    if (!isValidEmail) {
      setSubscribeState("error");
      return;
    }

    setSubscribeState("success");
    setEmail("");
  };

  return (
    <div className="site-shell">
      <div className="ambient ambient-left" aria-hidden="true" />
      <div className="ambient ambient-right" aria-hidden="true" />

      <header className="top-nav">
        <div className="container nav-grid">
          <a className="brand-mark" href="#top">
            <span className="brand-dot" />
            <span>CookLab AI</span>
          </a>
          <nav className="nav-links">
            <a href="#positioning">定位</a>
            <a href="#lab">實驗台</a>
            <a href="#menu-lab">菜單控制台</a>
            <a href="#reports">報告</a>
            <a href="#subscribe" className="button button-sm button-ghost">
              立即訂閱
            </a>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="hero-section">
          <div className="container hero-layout">
            <div className="hero-copy">
              <p className="pill">可驗證的料理實驗室＋台灣食材週期省錢菜單</p>
              <h1>做菜像做實驗，結果可複製，預算看得見。</h1>
              <p className="hero-subtitle">
                CookLab AI 把成功版本、失敗版本與價格訊號放在同一個決策畫面，讓你每週只做最值得做的菜。
              </p>
              <div className="hero-actions">
                <a href="#menu-lab" className="button button-primary">
                  免費看本週菜單
                </a>
                <a href="#lab" className="button button-secondary">
                  進入實驗模擬器
                </a>
              </div>
              <div className="hero-metrics">
                <article>
                  <strong>5 道</strong>
                  <span>每週精選菜單</span>
                </article>
                <article>
                  <strong>3 種</strong>
                  <span>失敗路徑對照</span>
                </article>
                <article>
                  <strong>{formatPrice(totals.saved)}</strong>
                  <span>目前組合預估可省</span>
                </article>
              </div>
            </div>

            <aside className="hero-console">
              <div className="console-label">本週實驗焦點</div>
              <h2>{activeExperiment.title}</h2>
              <p>{activeExperiment.question}</p>
              <div className="console-highlight">
                <p>推薦流程</p>
                <strong>{activeVariant.label}</strong>
              </div>
              <div className="quick-stats">
                <div>
                  <span>成功率</span>
                  <strong>{activeVariant.successRate}%</strong>
                </div>
                <div>
                  <span>穩定度</span>
                  <strong>{activeVariant.stabilityScore}/100</strong>
                </div>
                <div>
                  <span>預估成本</span>
                  <strong>{formatPrice(activeVariant.estimatedCost)}</strong>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="section section-tight" id="positioning">
          <div className="container">
            <div className="section-heading">
              <h2>品牌定位</h2>
              <p>{brandPositioning}</p>
            </div>
            <div className="slogan-grid">
              {shortSlogans.map((slogan) => (
                <article key={slogan} className="slogan-card">
                  {slogan}
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-surface" id="lab">
          <div className="container grid-two">
            <div className="panel">
              <div className="panel-head">
                <h2>料理實驗模擬器</h2>
                <p>先看失敗率，再決定今天要做哪個版本。</p>
              </div>

              <div className="experiment-tabs">
                {experiments.map((experiment) => (
                  <button
                    key={experiment.id}
                    type="button"
                    className={experiment.id === activeExperiment.id ? "chip chip-active" : "chip"}
                    onClick={() => setActiveExperimentId(experiment.id)}
                  >
                    {experiment.title}
                  </button>
                ))}
              </div>

              <p className="panel-question">{activeExperiment.question}</p>

              <div className="variant-list">
                {activeExperiment.variants.map((variant) => (
                  <button
                    key={variant.id}
                    type="button"
                    className={variant.id === activeVariant.id ? "variant-card variant-active" : "variant-card"}
                    onClick={() =>
                      setVariantMap((prev) => ({
                        ...prev,
                        [activeExperiment.id]: variant.id,
                      }))
                    }
                  >
                    <strong>{variant.label}</strong>
                    <span>{variant.note}</span>
                  </button>
                ))}
              </div>
            </div>

            <aside className="panel metrics-panel">
              <h3>{activeVariant.label} 數據板</h3>
              <div className="metric-row">
                <span>成功率</span>
                <strong>{activeVariant.successRate}%</strong>
              </div>
              <div className="meter">
                <span style={{ width: `${activeVariant.successRate}%` }} />
              </div>

              <div className="metric-row">
                <span>口感分數</span>
                <strong>{activeVariant.textureScore}/100</strong>
              </div>
              <div className="meter meter-alt">
                <span style={{ width: `${activeVariant.textureScore}%` }} />
              </div>

              <div className="metric-row">
                <span>流程穩定度</span>
                <strong>{activeVariant.stabilityScore}/100</strong>
              </div>
              <div className="meter meter-alt-2">
                <span style={{ width: `${activeVariant.stabilityScore}%` }} />
              </div>

              <div className="detail-grid">
                <article>
                  <span>操作時間</span>
                  <strong>{activeVariant.cookMinutes} 分鐘</strong>
                </article>
                <article>
                  <span>單次成本</span>
                  <strong>{formatPrice(activeVariant.estimatedCost)}</strong>
                </article>
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="menu-lab">
          <div className="container grid-two">
            <div className="panel">
              <div className="panel-head">
                <h2>本週省錢菜單控制台</h2>
                <p>勾選你要做的菜，系統即時估算成本與省下金額。</p>
              </div>
              <div className="menu-actions">
                <button
                  className="button button-sm button-ghost"
                  type="button"
                  onClick={() => setSelectedMenuIds(recommendedMenuIds)}
                >
                  套用推薦組合
                </button>
                <button className="button button-sm button-ghost" type="button" onClick={() => setSelectedMenuIds([])}>
                  全部清空
                </button>
              </div>

              <div className="menu-cards">
                {weeklyMenu.map((item) => {
                  const checked = selectedMenuIds.includes(item.id);
                  const saved = item.marketCost - item.cooklabCost;

                  return (
                    <label key={item.id} className={checked ? "menu-card menu-card-active" : "menu-card"}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleMenu(item.id)}
                        aria-label={item.title}
                      />
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.prepTime}</p>
                        <p className="menu-highlight">{item.highlight}</p>
                      </div>
                      <div className="menu-prices">
                        <span>CookLab：{formatPrice(item.cooklabCost)}</span>
                        <span>市場均價：{formatPrice(item.marketCost)}</span>
                        <strong>可省 {formatPrice(saved)}</strong>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            <aside className="panel summary-panel">
              <h3>本週預算摘要</h3>
              <div className="summary-grid">
                <article>
                  <span>已選菜色</span>
                  <strong>{selectedMenuIds.length} 道</strong>
                </article>
                <article>
                  <span>CookLab 預估成本</span>
                  <strong>{formatPrice(totals.cooklabCost)}</strong>
                </article>
                <article>
                  <span>市場預估成本</span>
                  <strong>{formatPrice(totals.marketCost)}</strong>
                </article>
                <article>
                  <span>預估節省</span>
                  <strong className="summary-save">
                    {formatPrice(totals.saved)} ({totals.savedRate}%)
                  </strong>
                </article>
              </div>

              <h4>台灣食材價格訊號</h4>
              <div className="signal-list">
                {seasonalSignals.map((signal) => (
                  <article key={signal.ingredient} className="signal-item">
                    <div className="signal-title">
                      <strong>{signal.ingredient}</strong>
                      <span className={trendClassName(signal.trend)}>{signal.trend}</span>
                    </div>
                    <p>{signal.range}</p>
                    <p>{signal.action}</p>
                  </article>
                ))}
              </div>
            </aside>
          </div>
        </section>

        <section className="section section-surface" id="reports">
          <div className="container">
            <div className="section-heading">
              <h2>最新實驗報告</h2>
              <p>每張卡片都包含關鍵結論與可信度，先看結果再決定要不要做。</p>
            </div>
            <div className="report-grid">
              {reports.map((report) => (
                <article key={report.title} className="report-card">
                  <p className="report-confidence">可信度 {report.confidence}%</p>
                  <h3>{report.title}</h3>
                  <p>{report.summary}</p>
                  <div className="report-finding">{report.keyFinding}</div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="week-plan">
          <div className="container">
            <div className="section-heading">
              <h2>第一週內容企劃</h2>
              <p>5 篇內容直接對應可驗證料理與省錢菜單策略。</p>
            </div>
            <div className="plan-grid">
              {weekOnePlan.map((plan) => (
                <article key={plan.title} className="plan-card">
                  <h3>{plan.title}</h3>
                  <ul>
                    {plan.outline.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section section-cta" id="subscribe">
          <div className="container cta-grid">
            <div>
              <h2>加入每週菜單與實驗報告</h2>
              <p>Email 訂閱與 Telegram 即時更新，每週直接拿到可執行版本。</p>
            </div>

            <form className="subscribe-form" onSubmit={handleSubscribe}>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (subscribeState !== "idle") {
                    setSubscribeState("idle");
                  }
                }}
                placeholder="you@example.com"
              />
              <button className="button button-primary" type="submit">
                Email 訂閱
              </button>
              <a className="button button-secondary" href="https://t.me" target="_blank" rel="noreferrer">
                Telegram 更新
              </a>
              {subscribeState === "success" && (
                <p className="feedback feedback-success">已加入等待名單，下一期內容會寄到你的信箱。</p>
              )}
              {subscribeState === "error" && <p className="feedback feedback-error">請輸入有效 Email 格式。</p>}
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <strong>CookLab AI</strong>
          <span>{brandPositioning}</span>
        </div>
      </footer>
    </div>
  );
}
