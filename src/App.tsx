import React, { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  applianceOptions,
  brandPositioning,
  defaultProfile,
  experiments,
  goalOptions,
  menuItems,
  pantryOptions,
  pricingPlans,
  quickPresets,
  reports,
  shortSlogans,
  skillOptions,
  weekOnePlan,
} from "./data/cooklab";
import { HeroSection } from "./components/sections/HeroSection";
import { PlannerSection } from "./components/sections/PlannerSection";
import { MenuWorkbenchSection } from "./components/sections/MenuWorkbenchSection";
import { ExperimentSection } from "./components/sections/ExperimentSection";
import { SupportSection } from "./components/sections/SupportSection";
import { PricingSection } from "./components/sections/PricingSection";
import { AuthSection } from "./components/sections/AuthSection";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import { useAuth } from "./hooks/useAuth";
import {
  buildBudgetSummary,
  buildRescueFeed,
  buildShoppingList,
  formatLocalCurrency,
  getExperimentAdvice,
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

export default function App() {
  const { t, i18n } = useTranslation();
  const { user, loading: authLoading, signIn, signUp, signOut, hasConfig } = useAuth();
  const [profile, setProfile] = useLocalStorageState<UserProfile>(
    "cooklab.global-profile",
    defaultProfile
  );
  const [selectedMenuIds, setSelectedMenuIds] = useLocalStorageState<string[]>(
    "cooklab.selected-menu-ids",
    defaultSelectedMenuIds
  );
  const [variantMap, setVariantMap] = useState<Record<string, string>>(defaultVariantMap);
  const [activeExperimentId, setActiveExperimentId] = useState(experiments[0].id);
  const [email, setEmail] = useState("");
  const [waitlistStatus, setWaitlistStatus] = useState<"idle" | "error" | "success">("idle");
  const [checkoutStatus, setCheckoutStatus] = useState<"idle" | "error">("idle");

  const scoredMenus = useMemo(() => scoreMenus(menuItems, profile), [profile]);
  const recommendedMenus = useMemo(
    () => scoredMenus.filter((menu) => menu.eligible).slice(0, Math.max(profile.cookingDays, 3)),
    [profile.cookingDays, scoredMenus]
  );
  const selectedMenus = useMemo(
    () => scoredMenus.filter((menu) => selectedMenuIds.includes(menu.id)),
    [scoredMenus, selectedMenuIds]
  );
  const budgetSummary = useMemo(
    () => buildBudgetSummary(selectedMenus, profile),
    [profile, selectedMenus]
  );
  const shoppingGroups = useMemo(
    () => buildShoppingList(selectedMenus, profile),
    [profile, selectedMenus]
  );
  const rescueFeed = useMemo(() => buildRescueFeed(selectedMenus).slice(0, 6), [selectedMenus]);
  const activeExperiment =
    experiments.find((experiment) => experiment.id === activeExperimentId) ?? experiments[0];
  const advice = useMemo(
    () => getExperimentAdvice(activeExperiment, profile),
    [activeExperiment, profile]
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
      pantry: current.pantry.includes(ingredientKey)
        ? current.pantry.filter((key) => key !== ingredientKey)
        : [...current.pantry, ingredientKey],
    }));
  };

  const toggleAppliance = (appliance: Appliance): void => {
    setProfile((current) => ({
      ...current,
      appliances: current.appliances.includes(appliance)
        ? current.appliances.filter((item) => item !== appliance)
        : [...current.appliances, appliance],
    }));
  };

  const applyPreset = (preset: QuickPreset): void => {
    const nextProfile = {
      ...profile,
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
    setSelectedMenuIds(recommendedMenus.slice(0, profile.cookingDays).map((menu) => menu.id));
  };

  const handleVariantSelect = (experimentId: string, variantId: string): void => {
    setVariantMap((current) => ({
      ...current,
      [experimentId]: variantId,
    }));
  };

  const handleWaitlistSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);

    if (!isValidEmail) {
      setWaitlistStatus("error");
      return;
    }

    void (async () => {
      try {
        const response = await fetch("/api/waitlist", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: trimmedEmail,
            locale: i18n.language,
            source: "landing",
            userId: user?.id ?? null,
            planId: "pro",
          }),
        });

        if (!response.ok) {
          throw new Error("waitlist_failed");
        }

        setWaitlistStatus("success");
        setEmail("");
      } catch {
        setWaitlistStatus("error");
      }
    })();
  };

  const handleCheckout = (checkoutKey?: string): void => {
    if (!checkoutKey) {
      return;
    }

    setCheckoutStatus("idle");
    void (async () => {
      try {
        const normalizedEmail =
          user?.email ?? (email.trim().toLowerCase() || undefined);

        const response = await fetch("/api/stripe/checkout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checkoutKey,
            email: normalizedEmail,
            userId: user?.id ?? null,
            locale: i18n.language,
          }),
        });

        if (!response.ok) {
          throw new Error("checkout_failed");
        }

        const data = (await response.json()) as { url?: string };
        if (!data.url) {
          throw new Error("missing_checkout_url");
        }

        window.location.href = data.url;
      } catch {
        setCheckoutStatus("error");
      }
    })();
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
            <a href="#planner">{t("nav.planner")}</a>
            <a href="#menus">{t("nav.workbench")}</a>
            <a href="#lab">{t("nav.experiment")}</a>
            <a href="#support">{t("nav.support")}</a>
            <a href="#pricing">{t("nav.pricing")}</a>
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
          plannedSavingsLabel={formatLocalCurrency(budgetSummary.savings)}
          selectedCount={budgetSummary.selectedCount}
        />

        <PlannerSection
          profile={profile}
          presets={quickPresets}
          skillOptions={skillOptions}
          goalOptions={goalOptions}
          applianceOptions={applianceOptions}
          pantryOptions={pantryOptions}
          recommendedMenus={recommendedMenus}
          onApplyPreset={applyPreset}
          onPatchProfile={patchProfile}
          onToggleAppliance={toggleAppliance}
          onTogglePantry={togglePantry}
          onApplyRecommendations={applyRecommendations}
        />

        <MenuWorkbenchSection
          menus={scoredMenus}
          selectedMenuIds={selectedMenuIds}
          shoppingGroups={shoppingGroups}
          budgetSummary={budgetSummary}
          onToggleMenu={toggleMenu}
        />

        <ExperimentSection
          experiments={experiments}
          activeExperimentId={activeExperimentId}
          activeVariantId={activeVariantId}
          advice={advice}
          onSelectExperiment={setActiveExperimentId}
          onSelectVariant={handleVariantSelect}
        />

        <AuthSection
          user={user}
          loading={authLoading}
          hasConfig={hasConfig}
          onSignIn={signIn}
          onSignUp={signUp}
          onSignOut={signOut}
        />

        <SupportSection rescueFeed={rescueFeed} reports={reports} contentPlans={weekOnePlan} />

        <PricingSection
          pricingPlans={pricingPlans}
          email={email}
          status={waitlistStatus}
          checkoutStatus={checkoutStatus}
          onEmailChange={(value) => {
            setEmail(value);
            if (waitlistStatus !== "idle") {
              setWaitlistStatus("idle");
            }
            if (checkoutStatus !== "idle") {
              setCheckoutStatus("idle");
            }
          }}
          onSubmit={handleWaitlistSubmit}
          onCheckout={handleCheckout}
        />
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
