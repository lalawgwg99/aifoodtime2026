import React, { FormEvent, useState } from "react";
import { FridgeInsights, ScoredMenu } from "../../types/cooklab";
import { formatLocalCurrency } from "../../lib/planner";

interface FridgeSectionProps {
  fridgeItems: string[];
  suggestions: string[];
  topMatches: ScoredMenu[];
  insights: FridgeInsights;
  currencyLocale: string;
  onAddItems: (items: string[]) => void;
  onRemoveItem: (item: string) => void;
}

export function FridgeSection({
  fridgeItems,
  suggestions,
  topMatches,
  insights,
  currencyLocale,
  onAddItems,
  onRemoveItem,
}: FridgeSectionProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedItems = input
      .split(/[\n,，;/]+/g)
      .map((item) => item.trim())
      .filter(Boolean);

    if (parsedItems.length === 0) {
      return;
    }
    onAddItems(parsedItems);
    setInput("");
  };

  return (
    <section className="section" id="fridge">
      <div className="container grid-2">
        <div className="panel">
          <div className="section-heading">
            <p className="section-kicker">Fridge-first engine</p>
            <h2>Start from ingredients you already own.</h2>
            <p>
              This is the low-cost core: deterministic matching and scoring first, optional AI layer
              later. No expensive model call needed to generate value.
            </p>
          </div>

          <form className="waitlist-form" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Add one or many items: chicken breast, spinach, mushrooms"
              aria-label="Add fridge item"
            />
            <button type="submit" className="button button-primary">
              Add ingredient
            </button>
          </form>

          <div className="selector-group">
            <div>
              <p className="selector-title">Quick add</p>
              <div className="chip-row">
                {suggestions.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="chip"
                    onClick={() => onAddItems([item])}
                  >
                    + {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="selector-title">Current fridge inventory</p>
              <div className="chip-row">
                {fridgeItems.length === 0 && <span className="empty-note">No items yet.</span>}
                {fridgeItems.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="chip chip-active"
                    onClick={() => onRemoveItem(item)}
                    title="Remove"
                  >
                    {item} ×
                  </button>
                ))}
              </div>
            </div>

            <div className="fridge-insight-grid">
              <article className="fridge-insight-card">
                <span>Ingredient coverage</span>
                <strong>{Math.round(insights.coverageRate * 100)}%</strong>
                <p>
                  {insights.coveredIngredients}/{insights.totalIngredients} selected ingredients are
                  already in fridge or pantry.
                </p>
              </article>
              <article className="fridge-insight-card">
                <span>Waste risk</span>
                <strong>{insights.wasteRisk}</strong>
                <p>
                  {insights.unusedItems.length === 0
                    ? "No stranded ingredients right now."
                    : `${insights.unusedItems.length} fridge items are currently unused.`}
                </p>
              </article>
            </div>

            {insights.recoveryIdeas.length > 0 && (
              <div>
                <p className="selector-title">Recovery ideas for unused items</p>
                <div className="recovery-list">
                  {insights.recoveryIdeas.map((idea) => (
                    <article key={idea.item} className="recovery-item">
                      <strong>{idea.item}</strong>
                      <p>{idea.menuTitles.join(" / ")}</p>
                    </article>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="panel recommendation-panel">
          <div className="section-heading compact-heading">
            <p className="section-kicker">Fridge match results</p>
            <h2>Top meals based on current fridge state</h2>
          </div>

          <div className="recommendation-list">
            {topMatches.length === 0 && (
              <article className="recommendation-card">
                <h3>No matches yet</h3>
                <p>Add ingredients first and CookLab will rank meals automatically.</p>
              </article>
            )}
            {topMatches.map((menu) => (
              <article className="recommendation-card" key={menu.id}>
                <h3>{menu.title}</h3>
                <p>{menu.description}</p>
                <div className="mini-stat-row">
                  <span>fridge hits {menu.fridgeHits}</span>
                  <span>{menu.adjustedMinutes} min</span>
                  <span>{formatLocalCurrency(menu.adjustedCost, currencyLocale)}</span>
                  <span>{menu.adjustedProtein} g protein</span>
                </div>
                <div className="reason-list">
                  {menu.why.map((reason) => (
                    <span className="reason-pill" key={reason}>
                      {reason}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
