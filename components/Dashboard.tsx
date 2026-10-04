"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CloudCheck, LoaderCircle, WifiOff } from "lucide-react";
import { DailyProgress } from "@/components/DailyProgress";
import { Header } from "@/components/Header";
import { PlatformCard } from "@/components/PlatformCard";
import { PasswordsPage } from "@/components/passwords/PasswordsPage";
import { BusinessesPage } from "@/components/businesses/BusinessesPage";
import { ResetDayDialog } from "@/components/ResetDayDialog";
import { SectionSwitcher, type AppSection } from "@/components/SectionSwitcher";
import { bamzukPlatforms, platforms } from "@/config/platforms";
import { useDailyPublications } from "@/hooks/useDailyPublications";
import type { BusinessResource } from "@/config/businesses";
import { getTodayKey } from "@/lib/dates";
import { createDailySummary } from "@/lib/progress";
import type { PlatformConfig, PlatformIcon, PublicationTheme } from "@/types/publication";

const syncMessages = {
  loading: "Conectando con Turso…",
  saving: "Guardando cambios…",
  synced: "Cambios compartidos y guardados.",
  offline: "Sin conexión con Turso. Copia guardada en este dispositivo.",
} as const;

const socialPlatformTerms: Record<PlatformIcon, string[]> = {
  tiktok: ["tiktok"],
  youtube: ["youtube", "youtu.be"],
  instagram: ["instagram", "insta"],
  facebook: ["facebook", "fb.com"],
};

const bamzukSocialLinks: Partial<Record<PlatformIcon, string>> = {
  tiktok: "https://www.tiktok.com/@bzuk_regalos?_r=1&_t=ZG-9A8Y4dUuZkm",
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function resolveSocialLinks(
  credentials: BusinessResource[],
  preferredGroup: string,
  strictGroup = false,
): Partial<Record<PlatformIcon, string>> {
  return Object.fromEntries(platforms.flatMap((platform) => {
    const matchingCredentials = credentials
      .filter((credential) => {
        if (!credential.url) return false;
        const searchable = normalize(`${credential.name} ${credential.platform} ${credential.url}`);
        return socialPlatformTerms[platform.icon].some((term) => searchable.includes(term));
      });
    const groupedCredentials = matchingCredentials.filter(
      (credential) => normalize(credential.groupName) === normalize(preferredGroup),
    );
    const candidates = (strictGroup ? groupedCredentials : matchingCredentials)
      .sort((first, second) => {
        const score = (credential: BusinessResource) =>
          (normalize(credential.groupName) === normalize(preferredGroup) ? 100 : 0) +
          (credential.favorite ? 10 : 0);
        return score(second) - score(first) || second.updatedAt.localeCompare(first.updatedAt);
      });

    return candidates[0] ? [[platform.icon, candidates[0].url]] : [];
  })) as Partial<Record<PlatformIcon, string>>;
}

interface SocialSectionConfig {
  brand: "bamzuk" | "italy";
  platforms: PlatformConfig[];
  theme: PublicationTheme;
}

const socialSections: Record<"bamzuk" | "social", SocialSectionConfig> = {
  bamzuk: { brand: "bamzuk", platforms: bamzukPlatforms, theme: "orange" },
  social: { brand: "italy", platforms, theme: "brown" },
};

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<AppSection>("bamzuk");
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [linkCredentials, setLinkCredentials] = useState<BusinessResource[]>([]);
  const [passwordRequest, setPasswordRequest] = useState<{ group: string; sequence: number } | null>(null);
  const { checks, syncStatus, isReady, toggle, reset } = useDailyPublications(selectedDate);
  const isSocialSection = activeSection === "bamzuk" || activeSection === "social";
  const socialSection = activeSection === "social" ? socialSections.social : socialSections.bamzuk;
  const activePlatforms = socialSection.platforms;
  const summary = useMemo(
    () => createDailySummary(selectedDate, checks, activePlatforms),
    [selectedDate, checks, activePlatforms],
  );
  const socialLinks = useMemo(
    () => activeSection === "bamzuk"
        ? bamzukSocialLinks
        : resolveSocialLinks(linkCredentials, "Italy Pizza"),
    [activeSection, linkCredentials],
  );

  const closeResetDialog = useCallback(() => setResetDialogOpen(false), []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setSelectedDate(getTodayKey()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.title = {
      bamzuk: "Bamzuk TikTok Shop",
      social: "Redes Italy · Italy Pizza",
      passwords: "Contraseñas",
      businesses: "Mis negocios · Daniel",
    }[activeSection];
  }, [activeSection]);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/business-resources", { signal: controller.signal, cache: "no-store" });
        if (response.ok) setLinkCredentials((await response.json()).resources);
      } catch {
        // Los enlaces son una ayuda opcional y no deben bloquear el panel diario.
      }
    };
    const initialRefreshId = window.setTimeout(() => void refresh(), 0);
    const intervalId = window.setInterval(() => void refresh(), 15_000);
    return () => {
      controller.abort();
      window.clearTimeout(initialRefreshId);
      window.clearInterval(intervalId);
    };
  }, [activeSection]);

  const confirmReset = () => {
    reset(activePlatforms.map((platform) => platform.id));
    setResetDialogOpen(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] px-4 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
      <div className="space-y-4 sm:space-y-5">
        <SectionSwitcher activeSection={activeSection} onChange={setActiveSection} />

        <div className={isSocialSection ? "space-y-4 sm:space-y-5" : "hidden"}>
            <Header selectedDate={selectedDate} onReset={() => setResetDialogOpen(true)} brand={socialSection.brand} />
            <DailyProgress completed={summary.completed} total={summary.total} percentage={summary.percentage} theme={socialSection.theme} />

            <section aria-label="Publicaciones por plataforma" className={`grid grid-cols-1 gap-4 transition-opacity duration-200 sm:gap-5 ${activeSection === "bamzuk" ? "lg:grid-cols-1" : "lg:grid-cols-2"} ${isReady ? "opacity-100" : "pointer-events-none opacity-55"}`}>
              {activePlatforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  checks={checks[platform.id]}
                  url={socialLinks[platform.icon]}
                  theme={socialSection.theme}
                  disabled={!isReady}
                  onToggle={(publicationId) => toggle(platform.id, publicationId)}
                />
              ))}
            </section>

            <footer className="flex items-center justify-center gap-2 pb-4 pt-2 text-center text-xs font-semibold text-black sm:text-sm" aria-live="polite">
              {syncStatus === "offline" ? (
                <WifiOff aria-hidden="true" className={`size-4 ${socialSection.theme === "brown" ? "text-[#68483d]" : "text-[#d65a21]"}`} />
              ) : syncStatus === "loading" || syncStatus === "saving" ? (
                <LoaderCircle aria-hidden="true" className={`size-4 animate-spin ${socialSection.theme === "brown" ? "text-[#68483d]" : "text-[#d65a21]"}`} />
              ) : (
                <CloudCheck aria-hidden="true" className="size-4 text-[#4c9560]" />
              )}
              {syncMessages[syncStatus]}
            </footer>
        </div>

        <div className={activeSection === "passwords" ? "block" : "hidden"}>
          <PasswordsPage groupRequest={passwordRequest} />
        </div>
        <div className={activeSection === "businesses" ? "block" : "hidden"}>
          <BusinessesPage active={activeSection === "businesses"} onOpenPasswords={(group) => {
            setPasswordRequest((current) => ({ group, sequence: (current?.sequence ?? 0) + 1 }));
            setActiveSection("passwords");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} onOpenPublications={(section) => {
            setActiveSection(section);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        </div>
      </div>

      <ResetDayDialog open={resetDialogOpen} dateKey={selectedDate} onCancel={closeResetDialog} onConfirm={confirmReset} theme={socialSection.theme} />
    </main>
  );
}
