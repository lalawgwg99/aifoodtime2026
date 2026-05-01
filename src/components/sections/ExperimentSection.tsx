import React from "react";
import { useTranslation } from "react-i18next";
import { Experiment, ExperimentAdvice } from "../../types/cooklab";
import { formatLocalCurrency } from "../../lib/planner";

const travelStyleLabels = {
  Beginner: "第一次來",
  Intermediate: "熟門熟路",
  Advanced: "專程吃",
} as const;

interface ExperimentSectionProps {
  experiments: Experiment[];
  activeExperimentId: string;
  activeVariantId: string;
  advice: ExperimentAdvice;
  currencyLocale: string;
  onSelectExperiment: (experimentId: string) => void;
  onSelectVariant: (experimentId: string, variantId: string) => void;
}

export function ExperimentSection({
  experiments,
  activeExperimentId,
  activeVariantId,
  advice,
  currencyLocale,
  onSelectExperiment,
  onSelectVariant,
}: ExperimentSectionProps) {
  const activeExperiment =
    experiments.find((experiment) => experiment.id === activeExperimentId) ?? experiments[0];
  const { t } = useTranslation();

  return (
    <section className="section section-surface" id="lab">
      <div className="container">
        <div className="section-heading">
          <p className="section-kicker">{t("experiment.kicker")}</p>
          <h2>{t("experiment.title")}</h2>
          <p>{t("experiment.desc")}</p>
        </div>

        <div className="experiment-tabs">
          {experiments.map((experiment) => (
            <button
              key={experiment.id}
              type="button"
              className={experiment.id === activeExperiment.id ? "chip chip-active" : "chip"}
              onClick={() => onSelectExperiment(experiment.id)}
            >
              {experiment.title}
            </button>
          ))}
        </div>

        <div className="experiment-banner">
          <strong>{t("experiment.reco")}</strong>
          <p>{advice.reason}</p>
        </div>

        <div className="experiment-grid">
          {activeExperiment.variants.map((variant) => {
            const selected = variant.id === activeVariantId;
            const recommended = variant.id === advice.variant.id;

            return (
              <article
                key={variant.id}
                className={
                  selected
                    ? "experiment-card experiment-card-selected"
                    : recommended
                      ? "experiment-card experiment-card-recommended"
                      : "experiment-card"
                }
              >
                <div className="experiment-card-top">
                  <div>
                    <h3>{variant.label}</h3>
                    <p>{variant.note}</p>
                  </div>
                  <div className="badge-stack">
                    {recommended && <span className="status-pill">{t("experiment.recommended")}</span>}
                    {selected && <span className="status-pill status-pill-dark">{t("experiment.inspecting")}</span>}
                  </div>
                </div>

                <div className="metric-list">
                  <div className="metric-line">
                    <span>{t("experiment.success")}</span>
                    <strong>{variant.successRate}%</strong>
                  </div>
                  <div className="meter">
                    <span style={{ width: `${variant.successRate}%` }} />
                  </div>
                  <div className="metric-line">
                    <span>{t("experiment.stability")}</span>
                    <strong>{variant.stabilityScore}/100</strong>
                  </div>
                  <div className="meter meter-alt">
                    <span style={{ width: `${variant.stabilityScore}%` }} />
                  </div>
                  <div className="metric-line">
                    <span>{t("experiment.texture")}</span>
                    <strong>{variant.textureScore}/100</strong>
                  </div>
                  <div className="meter meter-alt-2">
                    <span style={{ width: `${variant.textureScore}%` }} />
                  </div>
                </div>

                <div className="experiment-meta">
                  <span>{variant.cookMinutes} min</span>
                  <span>{formatLocalCurrency(variant.estimatedCost, currencyLocale)}</span>
                  <span>{travelStyleLabels[variant.requiredSkill]}</span>
                </div>

                <p className="experiment-callout">
                  <strong>{t("experiment.bestFor")} </strong> {variant.bestFor}
                </p>
                <p className="experiment-callout">
                  <strong>{t("experiment.quickFix")} </strong> {variant.quickFix}
                </p>

                <button
                  type="button"
                  className={selected ? "button button-secondary full-width" : "button button-ghost full-width"}
                  onClick={() => onSelectVariant(activeExperiment.id, variant.id)}
                >
                  {selected ? t("experiment.selected") : t("experiment.inspect")}
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
