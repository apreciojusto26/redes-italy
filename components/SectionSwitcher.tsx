import { KeyRound, Leaf, Share2 } from "lucide-react";

export type AppSection = "social" | "vividia" | "passwords";

interface SectionSwitcherProps {
  activeSection: AppSection;
  onChange: (section: AppSection) => void;
}

const options = [
  { id: "social" as const, label: "Redes Italy", icon: Share2 },
  { id: "vividia" as const, label: "Redes Vividia", icon: Leaf },
  { id: "passwords" as const, label: "Contraseñas", icon: KeyRound },
];

export function SectionSwitcher({ activeSection, onChange }: SectionSwitcherProps) {
  return (
    <nav
      aria-label="Secciones de la aplicación"
      className="relative mx-auto grid min-h-[58px] w-full max-w-[640px] grid-cols-3 rounded-full border border-[#d1d5db] bg-[#f3f4f6]/85 p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_10px_28px_rgba(17,24,39,0.08)] backdrop-blur-xl"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1.5 left-1.5 w-[calc(33.333%-4px)] rounded-full bg-[#20231f] shadow-[0_7px_18px_rgba(31,41,32,0.18)] transition-transform duration-300 ease-out ${
          activeSection === "passwords" ? "translate-x-[200%]" : activeSection === "vividia" ? "translate-x-full" : "translate-x-0"
        }`}
      />

      {options.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            className={`relative z-10 flex min-h-11 items-center justify-center gap-1.5 rounded-full px-1 text-[11px] font-extrabold transition-colors duration-300 active:scale-[0.98] min-[390px]:text-xs sm:gap-2 sm:px-3 sm:text-[15px] ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            <Icon aria-hidden="true" className="size-4" strokeWidth={2.2} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
