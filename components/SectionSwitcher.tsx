import { BookOpen, KeyRound, Pizza, ShoppingCart } from "lucide-react";

export type AppSection = "bamzuk" | "social" | "passwords" | "businesses";

interface SectionSwitcherProps {
  activeSection: AppSection;
  onChange: (section: AppSection) => void;
}

const options = [
  { id: "bamzuk" as const, label: "Bamzuk TikTok Shop", icon: ShoppingCart },
  { id: "social" as const, label: "Italy Pizza", icon: Pizza },
  { id: "passwords" as const, label: "Contraseñas", icon: KeyRound },
  { id: "businesses" as const, label: "Mis negocios", icon: BookOpen },
];

const activeColors: Record<AppSection, string> = {
  bamzuk: "bg-[#e96123] shadow-[0_7px_18px_rgba(204,77,25,0.22)]",
  social: "bg-[#5b4035] shadow-[0_7px_18px_rgba(62,42,34,0.22)]",
  passwords: "bg-[#3976c7] shadow-[0_7px_18px_rgba(38,89,166,0.22)]",
  businesses: "bg-[#365e55] shadow-[0_7px_18px_rgba(35,78,64,0.22)]",
};

const activePositions: Record<AppSection, string> = {
  bamzuk: "translate-x-0",
  social: "translate-x-full",
  passwords: "translate-x-[200%]",
  businesses: "translate-x-[300%]",
};

export function SectionSwitcher({ activeSection, onChange }: SectionSwitcherProps) {
  return (
    <nav
      aria-label="Secciones de la aplicación"
      className="relative mx-auto grid min-h-[58px] w-full max-w-[1000px] grid-cols-4 rounded-[24px] border border-[#d1d5db] bg-[#f3f4f6]/85 p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.85),0_10px_28px_rgba(17,24,39,0.08)] backdrop-blur-xl sm:rounded-full"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-1.5 left-1.5 w-[calc(25%-3px)] rounded-[18px] transition-[transform,background-color,box-shadow] duration-300 ease-out sm:rounded-full ${activeColors[activeSection]} ${activePositions[activeSection]}`}
      />

      {options.map(({ id, label, icon: Icon }) => {
        const isActive = activeSection === id;

        return (
          <button
            key={id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(id)}
            aria-label={label}
            title={label}
            className={`relative z-10 flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-[18px] px-1 text-[10px] font-extrabold transition-colors duration-300 active:scale-[0.98] sm:min-h-11 sm:flex-row sm:rounded-full lg:gap-2 lg:px-3 lg:text-[14px] ${
              isActive ? "text-white" : "text-black"
            }`}
          >
            <Icon aria-hidden="true" className="size-5 lg:size-4" strokeWidth={2.2} />
            <span className="text-center text-[10px] font-extrabold leading-tight sm:text-xs lg:text-[14px]">{id === "bamzuk" ? <><span className="lg:hidden">Bamzuk</span><span className="hidden lg:inline">{label}</span></> : label}</span>
          </button>
        );
      })}
    </nav>
  );
}
