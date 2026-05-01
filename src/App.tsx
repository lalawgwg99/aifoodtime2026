import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  applianceOptions,
  brandPositioning,
  defaultProfile,
  experiments,
  goalOptions,
  menuItems,
  pantryOptions,
  quickPresets,
  reports,
  shortSlogans,
  skillOptions,
  weekOnePlan,
} from "./data/cooklab";
import { HeroSection } from "./components/sections/HeroSection";
import { FridgeSection } from "./components/sections/FridgeSection";
import { PlannerSection } from "./components/sections/PlannerSection";
import { MenuWorkbenchSection } from "./components/sections/MenuWorkbenchSection";
import { ExperimentSection } from "./components/sections/ExperimentSection";
import { SupportSection } from "./components/sections/SupportSection";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import {
  buildBudgetSummary,
  buildFridgeInsights,
  buildNutritionSummary,
  buildRescueFeed,
  buildShoppingList,
  formatLocalCurrency,
  getExperimentAdvice,
  normalizeIngredientToken,
  scoreMenus,
} from "./lib/planner";
import { Appliance, QuickPreset, UserProfile } from "./types/cooklab";

const defaultSelectedMenuIds = scoreMenus(menuItems, defaultProfile)
  .filter((menu) => menu.eligible)
  .slice(0, defaultProfile.cookingDays)
  .map((menu) => menu.id);

const defaultVariantMap = Object.fromEntries(
  experiments.map((experiment) => [experiment.id, experiment.variants[0].id])
);

const obsoleteFoodSignals = new Set([
  "chicken breast",
  "broccoli",
  "bell pepper",
  "mushrooms",
  "greek yogurt",
  "tofu",
  "oats",
]);

function shouldResetObsoleteProfile(profile: UserProfile): boolean {
  return (profile.fridgeItems ?? []).some((item) =>
    obsoleteFoodSignals.has(normalizeIngredientToken(item))
  );
}

export default function App() {
  const { t, i18n } = useTranslation();
  const [profile, setProfile] = useLocalStorageState<UserProfile>(
    "cooklab.taiwan-food-profile",
    defaultProfile
  );
  const [selectedMenuIds, setSelectedMenuIds] = useLocalStorageState<string[]>(
    "cooklab.taiwan-food-selected-route-ids",
    defaultSelectedMenuIds
  );
  const [variantMap, setVariantMap] = useState<Record<string, string>>(defaultVariantMap);
  const [activeExperimentId, setActiveExperimentId] = useState(experiments[0].id);
  const currencyLocale = i18n.language === "zh-TW" ? "zh-TW" : "en";

  const normalizedProfile = useMemo<UserProfile>(
    () => {
      if (shouldResetObsoleteProfile(profile)) {
        return defaultProfile;
      }

      return {
        ...defaultProfile,
        ...profile,
        appliances: profile.appliances ?? defaultProfile.appliances,
        pantry: profile.pantry ?? defaultProfile.pantry,
        fridgeItems: profile.fridgeItems ?? defaultProfile.fridgeItems,
      };
    },
    [profile]
  );

  const scoredMenus = useMemo(() => scoreMenus(menuItems, normalizedProfile), [normalizedProfile]);
  const recommendedMenus = useMemo(
    () => scoredMenus.filter((menu) => menu.eligible).slice(0, Math.max(normalizedProfile.cookingDays, 3)),
    [normalizedProfile.cookingDays, scoredMenus]
  );
  const fridgeTopMatches = useMemo(
    () =>
      scoredMenus
        .filter((menu) => menu.eligible)
        .sort((left, right) => right.fridgeHits - left.fridgeHits || right.score - left.score)
        .slice(0, 3),
    [scoredMenus]
  );
  const effectiveSelectedMenuIds = useMemo(() => {
    const scoredIds = new Set(scoredMenus.map((menu) => menu.id));
    const validIds = selectedMenuIds.filter((id) => scoredIds.has(id));

    if (validIds.length > 0) {
      return validIds;
    }

    return scoredMenus
      .filter((menu) => menu.eligible)
      .slice(0, Math.max(normalizedProfile.cookingDays, 3))
      .map((menu) => menu.id);
  }, [normalizedProfile.cookingDays, scoredMenus, selectedMenuIds]);
  const selectedMenus = useMemo(
    () => scoredMenus.filter((menu) => effectiveSelectedMenuIds.includes(menu.id)),
    [effectiveSelectedMenuIds, scoredMenus]
  );
  const budgetSummary = useMemo(
    () => buildBudgetSummary(selectedMenus, normalizedProfile),
    [normalizedProfile, selectedMenus]
  );
  const shoppingGroups = useMemo(
    () => buildShoppingList(selectedMenus, normalizedProfile),
    [normalizedProfile, selectedMenus]
  );
  const nutritionSummary = useMemo(
    () => buildNutritionSummary(selectedMenus),
    [selectedMenus]
  );
  const fridgeInsights = useMemo(
    () => buildFridgeInsights(selectedMenus, scoredMenus, normalizedProfile),
    [normalizedProfile, scoredMenus, selectedMenus]
  );
  const rescueFeed = useMemo(() => buildRescueFeed(selectedMenus).slice(0, 6), [selectedMenus]);
  const activeExperiment =
    experiments.find((experiment) => experiment.id === activeExperimentId) ?? experiments[0];
  const advice = useMemo(
    () => getExperimentAdvice(activeExperiment, normalizedProfile),
    [activeExperiment, normalizedProfile]
  );
  const activeVariantId = variantMap[activeExperiment.id] ?? advice.variant.id;

  const patchProfile = (patch: Partial<UserProfile>): void => {
    setProfile((current) => ({
      ...current,
      ...patch,
    }));
  };

  const toggleMenu = (menuId: string): void => {
    setSelectedMenuIds((current) =>
      current.includes(menuId)
        ? current.filter((id) => id !== menuId)
        : [...current, menuId]
    );
  };

  const togglePantry = (ingredientKey: string): void => {
    setProfile((current) => ({
      ...current,
      pantry: (current.pantry ?? []).includes(ingredientKey)
        ? (current.pantry ?? []).filter((key) => key !== ingredientKey)
        : [...(current.pantry ?? []), ingredientKey],
    }));
  };

  const addFridgeItems = (items: string[]): void => {
    if (items.length === 0) {
      return;
    }

    setProfile((current) => {
      const currentFridge = current.fridgeItems ?? [];
      const seen = new Set(currentFridge.map((entry) => normalizeIngredientToken(entry)));
      const nextItems: string[] = [];

      items.forEach((item) => {
        const cleaned = item.trim();
        if (!cleaned) {
          return;
        }
        const token = normalizeIngredientToken(cleaned);
        if (!token || seen.has(token)) {
          return;
        }
        seen.add(token);
        nextItems.push(cleaned);
      });

      if (nextItems.length === 0) {
        return current;
      }

      return {
        ...current,
        fridgeItems: [...currentFridge, ...nextItems],
      };
    });
  };

  const removeFridgeItem = (item: string): void => {
    const normalized = normalizeIngredientToken(item);
    setProfile((current) => ({
      ...current,
      fridgeItems: (current.fridgeItems ?? []).filter(
        (entry) => normalizeIngredientToken(entry) !== normalized
      ),
    }));
  };

  const toggleAppliance = (appliance: Appliance): void => {
    setProfile((current) => ({
      ...current,
      appliances: (current.appliances ?? []).includes(appliance)
        ? (current.appliances ?? []).filter((item) => item !== appliance)
        : [...(current.appliances ?? []), appliance],
    }));
  };

  const applyPreset = (preset: QuickPreset): void => {
    const nextProfile = {
      ...normalizedProfile,
      ...preset.profile,
    };
    setProfile(nextProfile);
    setSelectedMenuIds(
      scoreMenus(menuItems, nextProfile)
        .filter((menu) => menu.eligible)
        .slice(0, Math.max(nextProfile.cookingDays, 3))
        .map((menu) => menu.id)
    );
  };

  const applyRecommendations = (): void => {
    setSelectedMenuIds(recommendedMenus.slice(0, normalizedProfile.cookingDays).map((menu) => menu.id));
  };

  const handleVariantSelect = (experimentId: string, variantId: string): void => {
    setVariantMap((current) => ({
      ...current,
      [experimentId]: variantId,
    }));
  };

  return (
    <div className="site-shell">
      <header className="top-nav">
        <div className="container nav-row">
          <a className="brand-lockup" href="#top">
            <span className="brand-orb" />
            <span>CookLab AI</span>
          </a>
          <nav className="nav-links">
            <a href="#fridge">{t("nav.fridge")}</a>
            <a href="#planner">{t("nav.planner")}</a>
            <a href="#menus">{t("nav.workbench")}</a>
            <a href="#lab">{t("nav.experiment")}</a>
            <a href="#support">{t("nav.support")}</a>
            <button
              type="button"
              className={i18n.language === "zh-TW" ? "chip chip-active nav-lang" : "chip nav-lang"}
              onClick={() => {
                void i18n.changeLanguage("zh-TW");
              }}
            >
              {t("common.chinese")}
            </button>
            <button
              type="button"
              className={i18n.language === "en" ? "chip chip-active nav-lang" : "chip nav-lang"}
              onClick={() => {
                void i18n.changeLanguage("en");
              }}
            >
              {t("common.english")}
            </button>
          </nav>
        </div>
      </header>

      <main>
        <HeroSection
          brandPositioning={brandPositioning}
          shortSlogans={shortSlogans}
          suggestedMenu={recommendedMenus[0]}
          plannedSavingsLabel={formatLocalCurrency(budgetSummary.savings, currencyLocale)}
          selectedCount={budgetSummary.selectedCount}
        />

        <FridgeSection
          fridgeItems={normalizedProfile.fridgeItems}
          suggestions={[
            "台北",
            "台南",
            "夜市",
            "牛肉麵",
            "甜點",
            "老店",
          ]}
          topMatches={fridgeTopMatches}
          insights={fridgeInsights}
          currencyLocale={currencyLocale}
          onAddItems={addFridgeItems}
          onRemoveItem={removeFridgeItem}
        />

        <PlannerSection
          profile={normalizedProfile}
          presets={quickPresets}
          skillOptions={skillOptions}
          goalOptions={goalOptions}
          applianceOptions={applianceOptions}
          pantryOptions={pantryOptions}
          recommendedMenus={recommendedMenus}
          currencyLocale={currencyLocale}
          onApplyPreset={applyPreset}
          onPatchProfile={patchProfile}
          onToggleAppliance={toggleAppliance}
          onTogglePantry={togglePantry}
          onApplyRecommendations={applyRecommendations}
        />

        <MenuWorkbenchSection
          menus={scoredMenus}
          selectedMenuIds={effectiveSelectedMenuIds}
          shoppingGroups={shoppingGroups}
          budgetSummary={budgetSummary}
          nutritionSummary={nutritionSummary}
          currencyLocale={currencyLocale}
          onToggleMenu={toggleMenu}
        />

        <ExperimentSection
          experiments={experiments}
          activeExperimentId={activeExperimentId}
          activeVariantId={activeVariantId}
          advice={advice}
          currencyLocale={currencyLocale}
          onSelectExperiment={setActiveExperimentId}
          onSelectVariant={handleVariantSelect}
        />

        <SupportSection rescueFeed={rescueFeed} reports={reports} contentPlans={weekOnePlan} />
      </main>

      <footer className="footer">
        <div className="container footer-row">
          <strong>CookLab AI</strong>
          <span>{brandPositioning}</span>
        </div>
      </footer>
    </div>
  );
}
