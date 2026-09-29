"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CloudCheck, LoaderCircle, WifiOff } from "lucide-react";
import { DailyProgress } from "@/components/DailyProgress";
import { Header } from "@/components/Header";
import { PlatformCard } from "@/components/PlatformCard";
import { PasswordsPage } from "@/components/passwords/PasswordsPage";
import { ResetDayDialog } from "@/components/ResetDayDialog";
import { SectionSwitcher, type AppSection } from "@/components/SectionSwitcher";
import { platforms, vividiaPlatforms } from "@/config/platforms";
import { useDailyPublications } from "@/hooks/useDailyPublications";
import { getCredentials } from "@/lib/credential-api";
import { getTodayKey } from "@/lib/dates";
import { createDailySummary } from "@/lib/progress";
import type { Credential } from "@/types/credential";
import type { PlatformIcon } from "@/types/publication";

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

const vividiaSocialLinks: Partial<Record<PlatformIcon, string>> = {
  instagram: "https://www.instagram.com/vividia_oficial/",
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("es");
}

function resolveSocialLinks(
  credentials: Credential[],
  preferredGroup: string,
): Partial<Record<PlatformIcon, string>> {
  return Object.fromEntries(platforms.flatMap((platform) => {
    const candidates = credentials
      .filter((credential) => {
        if (!credential.url) return false;
        const searchable = normalize(`${credential.name} ${credential.platform} ${credential.url}`);
        return socialPlatformTerms[platform.icon].some((term) => searchable.includes(term));
      })
      .sort((first, second) => {
        const score = (credential: Credential) =>
          (normalize(credential.groupName) === normalize(preferredGroup) ? 100 : 0) +
          (credential.favorite ? 10 : 0);
        return score(second) - score(first) || second.updatedAt.localeCompare(first.updatedAt);
      });

    return candidates[0] ? [[platform.icon, candidates[0].url]] : [];
  })) as Partial<Record<PlatformIcon, string>>;
}

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<AppSection>("social");
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [linkCredentials, setLinkCredentials] = useState<Credential[]>([]);
  const { checks, syncStatus, isReady, toggle, reset } = useDailyPublications(selectedDate);
  const isVividia = activeSection === "vividia";
  const isSocialSection = activeSection === "social" || isVividia;
  const activePlatforms = isVividia ? vividiaPlatforms : platforms;
  const summary = useMemo(
    () => createDailySummary(selectedDate, checks, isVividia ? vividiaPlatforms : platforms),
    [selectedDate, checks, isVividia],
  );
  const socialLinks = useMemo(
    () => isVividia ? vividiaSocialLinks : resolveSocialLinks(linkCredentials, "Italy Pizza"),
    [linkCredentials, isVividia],
  );

  const closeResetDialog = useCallback(() => setResetDialogOpen(false), []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setSelectedDate(getTodayKey()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    document.title = activeSection === "passwords"
      ? "Contraseñas · Italy Pizza"
      : isVividia
        ? "Redes Vividia · Vividia"
        : "Redes Italy · Italy Pizza";
  }, [activeSection, isVividia]);

  useEffect(() => {
    const controller = new AbortController();
    const refresh = async () => {
      try {
        setLinkCredentials(await getCredentials(controller.signal));
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
            <Header selectedDate={selectedDate} onReset={() => setResetDialogOpen(true)} brand={isVividia ? "vividia" : "italy"} />
            <DailyProgress completed={summary.completed} total={summary.total} percentage={summary.percentage} theme={isVividia ? "green" : "orange"} />

            <section aria-label="Publicaciones por plataforma" className={`grid grid-cols-1 gap-4 transition-opacity duration-200 sm:gap-5 lg:grid-cols-2 ${isReady ? "opacity-100" : "pointer-events-none opacity-55"}`}>
              {activePlatforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  checks={checks[platform.id]}
                  url={socialLinks[platform.icon]}
                  showOpenButton={isVividia}
                  theme={isVividia ? "green" : "orange"}
                  disabled={!isReady}
                  onToggle={(publicationId) => toggle(platform.id, publicationId)}
                />
              ))}
            </section>

            <footer className="flex items-center justify-center gap-2 pb-4 pt-2 text-center text-xs font-semibold text-black sm:text-sm" aria-live="polite">
              {syncStatus === "offline" ? (
                <WifiOff aria-hidden="true" className="size-4 text-[#b06e4f]" />
              ) : syncStatus === "loading" || syncStatus === "saving" ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-[#d46530]" />
              ) : (
                <CloudCheck aria-hidden="true" className="size-4 text-[#4c9560]" />
              )}
              {syncMessages[syncStatus]}
            </footer>
        </div>

        <div className={activeSection === "passwords" ? "block" : "hidden"}>
          <PasswordsPage />
        </div>
      </div>

      <ResetDayDialog open={resetDialogOpen} dateKey={selectedDate} onCancel={closeResetDialog} onConfirm={confirmReset} theme={isVividia ? "green" : "orange"} />
    </main>
  );
}
