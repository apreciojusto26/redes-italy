import { CheckCircle2 } from "lucide-react";
import { BrandIcon } from "@/components/BrandIcon";
import { PublicationCheckbox } from "@/components/PublicationCheckbox";
import { getPlatformItems, getPlatformTotal } from "@/config/platforms";
import type { PlatformChecks, PlatformConfig, PublicationKind } from "@/types/publication";

interface PlatformCardProps {
  platform: PlatformConfig;
  checks: PlatformChecks;
  onToggle: (publicationId: string) => void;
  disabled?: boolean;
}

function PublicationGroup({
  label,
  kind,
  platform,
  checks,
  onToggle,
  disabled,
}: PlatformCardProps & { label: string; kind: PublicationKind }) {
  const items = getPlatformItems(platform).filter((item) => item.kind === kind);
  if (items.length === 0) return null;

  return (
    <div>
      <h3 className="mb-2.5 text-[10px] font-extrabold uppercase tracking-[0.16em] text-black">{label}</h3>
      <div className="grid grid-cols-2 gap-2.5 max-[370px]:grid-cols-1">
        {items.map((item) => (
          <PublicationCheckbox
            key={item.id}
            item={item}
            checked={Boolean(checks?.[item.id])}
            disabled={disabled}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

export function PlatformCard({ platform, checks, onToggle, disabled }: PlatformCardProps) {
  const total = getPlatformTotal(platform);
  const completed = getPlatformItems(platform).filter((item) => checks?.[item.id]).length;
  const isComplete = total > 0 && completed === total;
  const description = [
    platform.videos > 0 ? `${platform.videos} ${platform.videos === 1 ? "vídeo" : "vídeos"}` : null,
    platform.stories > 0 ? `${platform.stories} ${platform.stories === 1 ? "historia" : "historias"}` : null,
  ].filter(Boolean).join(" · ");

  return (
    <article className="rounded-[24px] border border-[#d1d5db] bg-white p-5 shadow-[0_12px_35px_rgba(17,24,39,0.045)] transition duration-300 hover:border-[#9ca3af] hover:shadow-[0_16px_42px_rgba(17,24,39,0.075)] sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3.5">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl" style={{ color: platform.accent, backgroundColor: platform.accentSoft }}>
            <BrandIcon icon={platform.icon} className="size-6" />
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-extrabold tracking-[-0.025em] text-black">{platform.name}</h2>
            <p className="mt-0.5 text-xs font-semibold text-black">{description}</p>
          </div>
        </div>

        <div className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-extrabold text-black transition-colors ${isComplete ? "bg-[#e7f4e9]" : "bg-[#f3f4f6]"}`}>
          {isComplete && <CheckCircle2 aria-hidden="true" className="size-4" />}
          {completed}/{total}
        </div>
      </div>

      <div className="space-y-5">
        <PublicationGroup label="Vídeos subidos" kind="video" platform={platform} checks={checks} onToggle={onToggle} disabled={disabled} />
        <PublicationGroup label="Historias subidas" kind="story" platform={platform} checks={checks} onToggle={onToggle} disabled={disabled} />
      </div>
    </article>
  );
}
