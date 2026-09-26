"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CloudCheck, LoaderCircle, WifiOff } from "lucide-react";
import { DailyProgress } from "@/components/DailyProgress";
import { Header } from "@/components/Header";
import { History } from "@/components/History";
import { PlatformCard } from "@/components/PlatformCard";
import { PasswordsPlaceholder } from "@/components/PasswordsPlaceholder";
import { ResetDayDialog } from "@/components/ResetDayDialog";
import { SectionSwitcher, type AppSection } from "@/components/SectionSwitcher";
import { dailyPublicationTotal, platforms } from "@/config/platforms";
import { useDailyPublications } from "@/hooks/useDailyPublications";
import { getRecentDateKeys, getTodayKey } from "@/lib/dates";
import { createDailySummary } from "@/lib/progress";

const syncMessages = {
  loading: "Conectando con Turso…",
  saving: "Guardando cambios…",
  synced: "Cambios compartidos y guardados.",
  offline: "Sin conexión con Turso. Copia guardada en este dispositivo.",
} as const;

export function Dashboard() {
  const [activeSection, setActiveSection] = useState<AppSection>("social");
  const [selectedDate, setSelectedDate] = useState(getTodayKey);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const { checks, days, syncStatus, isReady, toggle, reset } = useDailyPublications(selectedDate);
  const summary = useMemo(() => createDailySummary(selectedDate, checks), [selectedDate, checks]);

  const history = useMemo(() => {
    const dateKeys = getRecentDateKeys(7);
    const storedDays = { ...days };
    if (dateKeys.includes(selectedDate)) storedDays[selectedDate] = checks;
    return dateKeys.map((dateKey) => createDailySummary(dateKey, storedDays[dateKey] ?? {}));
  }, [checks, days, selectedDate]);

  const closeResetDialog = useCallback(() => setResetDialogOpen(false), []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setSelectedDate(getTodayKey()), 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  const confirmReset = () => {
    reset();
    setResetDialogOpen(false);
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-[1180px] px-4 py-4 sm:px-6 sm:py-7 lg:px-8 lg:py-10">
      <div className="space-y-4 sm:space-y-5">
        <SectionSwitcher activeSection={activeSection} onChange={setActiveSection} />

        {activeSection === "social" ? (
          <>
            <Header selectedDate={selectedDate} onReset={() => setResetDialogOpen(true)} />
            <DailyProgress completed={summary.completed} total={dailyPublicationTotal} percentage={summary.percentage} />

            <section aria-label="Publicaciones por plataforma" className={`grid grid-cols-1 gap-4 transition-opacity duration-200 sm:gap-5 lg:grid-cols-2 ${isReady ? "opacity-100" : "pointer-events-none opacity-55"}`}>
              {platforms.map((platform) => (
                <PlatformCard
                  key={platform.id}
                  platform={platform}
                  checks={checks[platform.id]}
                  disabled={!isReady}
                  onToggle={(publicationId) => toggle(platform.id, publicationId)}
                />
              ))}
            </section>

            <History days={history} />

            <footer className="flex items-center justify-center gap-2 pb-4 pt-2 text-center text-xs font-semibold text-[#927e72] sm:text-sm" aria-live="polite">
              {syncStatus === "offline" ? (
                <WifiOff aria-hidden="true" className="size-4 text-[#b06e4f]" />
              ) : syncStatus === "loading" || syncStatus === "saving" ? (
                <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-[#d46530]" />
              ) : (
                <CloudCheck aria-hidden="true" className="size-4 text-[#4c9560]" />
              )}
              {syncMessages[syncStatus]}
            </footer>
          </>
        ) : (
          <PasswordsPlaceholder />
        )}
      </div>

      <ResetDayDialog open={resetDialogOpen} dateKey={selectedDate} onCancel={closeResetDialog} onConfirm={confirmReset} />
    </main>
  );
}
