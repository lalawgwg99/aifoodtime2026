import React from "react";
import { useTranslation } from "react-i18next";
import { NutritionSummary, ScoredMenu, ShoppingListGroup } from "../../types/cooklab";
import { formatLocalCurrency } from "../../lib/planner";

const routeSectionLabels: Record<string, string> = {
  Produce: "地區",
  Protein: "主食",
  Carbs: "配餐",
  Pantry: "甜點 / 備註",
  Frozen: "口味",
};

interface MenuWorkbenchSectionProps {
  menus: ScoredMenu[];
  selectedMenuIds: string[];
  shoppingGroups: ShoppingListGroup[];
  budgetSummary: {
    plannedCost: number;
    marketCost: number;
    savings: number;
    remainingBudget: number;
    selectedCount: number;
  };
  nutritionSummary: NutritionSummary;
  currencyLocale: string;
  onToggleMenu: (menuId: string) => void;
}

export function MenuWorkbenchSection({
  menus,
  selectedMenuIds,
  shoppingGroups,
  budgetSummary,
  nutritionSummary,
  currencyLocale,
  onToggleMenu,
}: MenuWorkbenchSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="section" id="menus">
      <div className="container workbench-grid">
        <div className="panel">
          <div className="section-heading">
            <p className="section-kicker">{t("workbench.kicker")}</p>
            <h2>{t("workbench.title")}</h2>
          </div>

          <div className="commercial-strip">
            <strong>{t("workbench.hookTitle")}</strong>
          </div>

          <div className="menu-grid">
            {menus.map((menu) => {
              const selected = selectedMenuIds.includes(menu.id);

              return (
                <article
                  className={
                    selected
                      ? "menu-card menu-card-selected"
                      : menu.eligible
                        ? "menu-card"
                        : "menu-card menu-card-disabled"
                  }
                  key={menu.id}
                >
                  <div className="menu-card-top">
                    <div>
                      <h3>{menu.title}</h3>
                      <p>{menu.description}</p>
                    </div>
                    <span className={menu.eligible ? "status-pill" : "status-pill status-pill-warn"}>
                      {menu.eligible
                        ? t("workbench.ready")
                        : t("workbench.needs", { gear: menu.missingAppliances.join(" / ") })}
                    </span>
                  </div>

                  <div className="mini-stat-row">
                    <span>{formatLocalCurrency(menu.adjustedCost, currencyLocale)}</span>
                    <span>{menu.adjustedMinutes} min</span>
                    <span>{t("workbench.stability", { score: menu.stabilityScore })}</span>
                    <span>{t("workbench.protein", { grams: menu.adjustedProtein })}</span>
                  </div>

                  <p className="menu-note">{menu.heroNote}</p>
                  <p className="menu-leftover">{t("workbench.leftover", { plan: menu.leftoverPlan })}</p>

                  <div className="reason-list">
                    {menu.why.map((reason) => (
                      <span className="reason-pill" key={reason}>
                        {reason}
                      </span>
                    ))}
                  </div>

                  <button
                    type="button"
                    className={selected ? "button button-secondary full-width" : "button button-ghost full-width"}
                    onClick={() => onToggleMenu(menu.id)}
                  >
                    {selected ? t("workbench.remove") : t("workbench.add")}
                  </button>
                </article>
              );
            })}
          </div>
        </div>

        <aside className="panel aside-panel">
          <div className="summary-stack">
            <article className="summary-tile">
              <span>{t("workbench.planned")}</span>
              <strong>{formatLocalCurrency(budgetSummary.plannedCost, currencyLocale)}</strong>
            </article>
            <article className="summary-tile">
              <span>{t("workbench.market")}</span>
              <strong>{formatLocalCurrency(budgetSummary.marketCost, currencyLocale)}</strong>
            </article>
            <article className="summary-tile">
              <span>{t("workbench.savings")}</span>
              <strong>{formatLocalCurrency(budgetSummary.savings, currencyLocale)}</strong>
            </article>
            <article
              className={
                budgetSummary.remainingBudget >= 0
                  ? "summary-tile summary-tile-positive"
                  : "summary-tile summary-tile-negative"
              }
            >
              <span>{t("workbench.left")}</span>
              <strong>{formatLocalCurrency(budgetSummary.remainingBudget, currencyLocale)}</strong>
            </article>
            <article className="summary-tile">
              <span>{t("workbench.calories")}</span>
              <strong>{nutritionSummary.avgCaloriesPerMeal}</strong>
            </article>
            <article className="summary-tile">
              <span>{t("workbench.proteinAvg")}</span>
              <strong>{nutritionSummary.avgProteinPerMeal}</strong>
            </article>
          </div>

          <div className="shopping-panel">
            <div className="section-heading compact-heading">
              <p className="section-kicker">{t("workbench.shoppingKicker")}</p>
              <h2>{t("workbench.shoppingTitle")}</h2>
            </div>

            {shoppingGroups.map((group) => (
              <div className="shopping-group" key={group.section}>
                <h3>{routeSectionLabels[group.section] ?? group.section}</h3>
                <div className="shopping-items">
                  {group.items.map((item) => (
                    <article className="shopping-item" key={item.key}>
                      <div className="shopping-head">
                        <strong>{item.name}</strong>
                        <span>
                          {item.fromPantry
                            ? t("workbench.fromPantry")
                            : formatLocalCurrency(item.totalCost, currencyLocale)}
                        </span>
                      </div>
                      <p>{item.amounts.join(" / ")}</p>
                      <p className="shopping-meta">{t("workbench.usedIn", { menus: item.menus.join(", ") })}</p>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
