import { dailyPublicationTotal, getPlatformItems, platforms } from "@/config/platforms";
import type { DailyChecks, DailySummary } from "@/types/publication";

export function countCompleted(checks: DailyChecks): number {
  return platforms.reduce(
    (total, platform) =>
      total +
      getPlatformItems(platform).filter((item) => checks[platform.id]?.[item.id]).length,
    0,
  );
}

export function createDailySummary(date: string, checks: DailyChecks): DailySummary {
  const completed = countCompleted(checks);
  return {
    date,
    completed,
    total: dailyPublicationTotal,
    percentage: dailyPublicationTotal === 0 ? 0 : Math.round((completed / dailyPublicationTotal) * 100),
  };
}
