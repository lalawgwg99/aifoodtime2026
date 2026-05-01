import React from "react";
import { useTranslation } from "react-i18next";
import { ScoredMenu } from "../../types/cooklab";

interface HeroSectionProps {
  brandPositioning: string;
  shortSlogans: string[];
  suggestedMenu?: ScoredMenu;
  plannedSavingsLabel: string;
  selectedCount: number;
}

export function HeroSection({
  shortSlogans,
  suggestedMenu,
  plannedSavingsLabel,
  selectedCount,
}: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="hero-section" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <h1>{t("hero.title")}</h1>
          <p className="hero-lead">{t("hero.lead")}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="#fridge">
              {t("hero.ctaPrimary")}
            </a>
            <a className="button button-secondary" href="#pricing">
              {t("hero.ctaSecondary")}
            </a>
          </div>

          <div className="slogan-row">
            {shortSlogans.map((slogan) => (
              <span className="slogan-chip" key={slogan}>
                {slogan}
              </span>
            ))}
          </div>
        </div>

        <aside className="hero-card">
          <div className="macro-header">
            <p className="card-label">{t("hero.cardLabel")}</p>
            <h2>{suggestedMenu?.title ?? t("hero.bestNextFallbackTitle")}</h2>
          </div>
          <div className="hero-stats">
            <article>
              <strong>{selectedCount}</strong>
              <span>{t("hero.statMeals")}</span>
            </article>
            <article>
              <strong>{plannedSavingsLabel}</strong>
              <span>{t("hero.statSavings")}</span>
            </article>
            <article>
              <strong>{suggestedMenu?.adjustedMinutes ?? 0} min</strong>
              <span>{t("hero.statTime")}</span>
            </article>
          </div>

          <div className="hero-card-note">
            <strong>{t("hero.bestNext")}</strong>
            <p>{suggestedMenu?.heroNote ?? t("hero.bestNextFallbackDesc")}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
