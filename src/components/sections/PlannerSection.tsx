import React from "react";
import { useTranslation } from "react-i18next";
import {
  Appliance,
  GoalTag,
  OptionItem,
  QuickPreset,
  ScoredMenu,
  SkillLevel,
  UserProfile,
} from "../../types/cooklab";
import { formatLocalCurrency } from "../../lib/planner";

interface PlannerSectionProps {
  profile: UserProfile;
  presets: QuickPreset[];
  skillOptions: SkillLevel[];
  goalOptions: GoalTag[];
  applianceOptions: Appliance[];
  pantryOptions: OptionItem[];
  recommendedMenus: ScoredMenu[];
  currencyLocale: string;
  onApplyPreset: (preset: QuickPreset) => void;
  onPatchProfile: (patch: Partial<UserProfile>) => void;
  onToggleAppliance: (appliance: Appliance) => void;
  onTogglePantry: (ingredientKey: string) => void;
  onApplyRecommendations: () => void;
}

export function PlannerSection({
  profile,
  presets,
  skillOptions,
  goalOptions,
  applianceOptions,
  pantryOptions,
  recommendedMenus,
  currencyLocale,
  onApplyPreset,
  onPatchProfile,
  onToggleAppliance,
  onTogglePantry,
  onApplyRecommendations,
}: PlannerSectionProps) {
  const topMenus = recommendedMenus.slice(0, Math.max(3, profile.cookingDays));
  const { t } = useTranslation();

  return (
    <section className="section section-surface" id="planner">
      <div className="container grid-2">
        <div className="panel planner-panel">
          <div className="section-heading">
            <p className="section-kicker">{t("planner.kicker")}</p>
            <h2>{t("planner.title")}</h2>
            <p>{t("planner.desc")}</p>
          </div>

          <div className="preset-grid">
            {presets.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="preset-card"
                onClick={() => onApplyPreset(preset)}
              >
                <strong>{preset.label}</strong>
                <span>{preset.description}</span>
              </button>
            ))}
          </div>

          <div className="control-grid">
            <label className="control-card">
              <span className="control-top">
                <span>{t("planner.household")}</span>
                <strong>{t("planner.householdValue", { count: profile.householdSize })}</strong>
              </span>
              <input
                type="range"
                min="1"
                max="5"
                value={profile.householdSize}
                onChange={(event) =>
                  onPatchProfile({ householdSize: Number(event.target.value) })
                }
              />
            </label>

            <label className="control-card">
              <span className="control-top">
                <span>{t("planner.budget")}</span>
                <strong>{formatLocalCurrency(profile.weeklyBudget, currencyLocale)}</strong>
              </span>
              <input
                type="range"
                min="500"
                max="1800"
                step="50"
                value={profile.weeklyBudget}
                onChange={(event) =>
                  onPatchProfile({ weeklyBudget: Number(event.target.value) })
                }
              />
            </label>

            <label className="control-card">
              <span className="control-top">
                <span>{t("planner.time")}</span>
                <strong>{profile.maxCookMinutes} min</strong>
              </span>
              <input
                type="range"
                min="15"
                max="60"
                step="5"
                value={profile.maxCookMinutes}
                onChange={(event) =>
                  onPatchProfile({ maxCookMinutes: Number(event.target.value) })
                }
              />
            </label>

            <label className="control-card">
              <span className="control-top">
                <span>{t("planner.days")}</span>
                <strong>{profile.cookingDays} days</strong>
              </span>
              <input
                type="range"
                min="3"
                max="5"
                value={profile.cookingDays}
                onChange={(event) =>
                  onPatchProfile({ cookingDays: Number(event.target.value) })
                }
              />
            </label>
          </div>

          <div className="selector-group">
            <div>
              <p className="selector-title">{t("planner.goal")}</p>
              <div className="chip-row">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    className={profile.mainGoal === goal ? "chip chip-active" : "chip"}
                    onClick={() => onPatchProfile({ mainGoal: goal })}
                  >
                    {goal}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="selector-title">{t("planner.skill")}</p>
              <div className="chip-row">
                {skillOptions.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    className={profile.skillLevel === skill ? "chip chip-active" : "chip"}
                    onClick={() => onPatchProfile({ skillLevel: skill })}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="selector-title">{t("planner.tools")}</p>
              <div className="chip-row">
                {applianceOptions.map((appliance) => (
                  <button
                    key={appliance}
                    type="button"
                    className={
                      profile.appliances.includes(appliance) ? "chip chip-active" : "chip"
                    }
                    onClick={() => onToggleAppliance(appliance)}
                  >
                    {appliance}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="selector-title">{t("planner.pantry")}</p>
              <div className="chip-row">
                {pantryOptions.map((ingredient) => (
                  <button
                    key={ingredient.key}
                    type="button"
                    className={
                      profile.pantry.includes(ingredient.key) ? "chip chip-active" : "chip"
                    }
                    onClick={() => onTogglePantry(ingredient.key)}
                  >
                    {ingredient.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="panel recommendation-panel">
          <div className="section-heading">
            <p className="section-kicker">{t("planner.outputKicker")}</p>
            <h2>{t("planner.outputTitle")}</h2>
            <p>{t("planner.outputDesc")}</p>
          </div>

          <div className="recommendation-list">
            {topMenus.map((menu, index) => (
              <article className="recommendation-card" key={menu.id}>
                <div className="recommendation-head">
                  <span className="index-pill">{index + 1}</span>
                  <div>
                    <h3>{menu.title}</h3>
                    <p>{menu.description}</p>
                  </div>
                </div>

                <div className="mini-stat-row">
                  <span>{formatLocalCurrency(menu.adjustedCost, currencyLocale)}</span>
                  <span>{menu.adjustedMinutes} min</span>
                  <span>{t("planner.protein", { grams: menu.adjustedProtein })}</span>
                  <span>{t("planner.calories", { kcal: menu.adjustedCalories })}</span>
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

          <button type="button" className="button button-primary full-width" onClick={onApplyRecommendations}>
            {t("planner.apply")}
          </button>
        </aside>
      </div>
    </section>
  );
}
