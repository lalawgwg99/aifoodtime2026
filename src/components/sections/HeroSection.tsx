import React from "react";
import { ScoredMenu } from "../../types/cooklab";

interface HeroSectionProps {
  brandPositioning: string;
  shortSlogans: string[];
  suggestedMenu?: ScoredMenu;
  plannedSavingsLabel: string;
  selectedCount: number;
}

export function HeroSection({
  brandPositioning,
  shortSlogans,
  suggestedMenu,
  plannedSavingsLabel,
  selectedCount,
}: HeroSectionProps) {
  return (
    <section className="hero-section" id="top">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow-row">
            <span className="eyebrow">Global traffic theme</span>
            <span className="eyebrow eyebrow-muted">Fridge-to-Recipe + Goal Planner</span>
          </div>

          <h1>Turn what is in your fridge into goal-based weekly meals.</h1>
          <p className="hero-lead">
            This version is designed for traffic and conversion: high-frequency search intent
            ("what can I cook with..."), then an upgrade path into paid weekly planning and
            shopping automation. Core recommendations run on deterministic scoring so infra spend
            stays predictable.
          </p>
          <p className="hero-positioning">{brandPositioning}</p>

          <div className="hero-actions">
            <a className="button button-primary" href="#fridge">
              Add fridge ingredients
            </a>
            <a className="button button-secondary" href="#pricing">
              View pricing model
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
          <p className="card-label">Monetization thesis</p>
          <h2>Free fridge matching drives traffic. Goal planning and automation drive subscriptions.</h2>
          <div className="hero-stats">
            <article>
              <strong>{selectedCount}</strong>
              <span>meals in active plan</span>
            </article>
            <article>
              <strong>{plannedSavingsLabel}</strong>
              <span>estimated weekly savings</span>
            </article>
            <article>
              <strong>{suggestedMenu?.adjustedMinutes ?? 0} min</strong>
              <span>for top recommended dish</span>
            </article>
          </div>

          <div className="hero-card-note">
            <p className="card-label">Best next meal</p>
            <strong>{suggestedMenu?.title ?? "Add ingredients to start matching"}</strong>
            <p>{suggestedMenu?.heroNote ?? "CookLab will rank meals after your fridge inventory is set."}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
