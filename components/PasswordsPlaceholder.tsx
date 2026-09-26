import { KeyRound, ShieldCheck } from "lucide-react";

export function PasswordsPlaceholder() {
  return (
    <section className="overflow-hidden rounded-[26px] border border-[#eadfd4] bg-[#fffdfa] shadow-[0_14px_42px_rgba(75,51,38,0.06)]">
      <div className="bg-[linear-gradient(135deg,#f18527_0%,#ed6824_52%,#df4d1e_100%)] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div className="mb-5 grid size-12 place-items-center rounded-2xl border border-white/20 bg-white/15 backdrop-blur-sm">
          <KeyRound aria-hidden="true" className="size-6" />
        </div>
        <p className="mb-1 text-sm font-semibold text-orange-50/85">Italy Pizza</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Contraseñas</h1>
      </div>

      <div className="px-5 py-10 text-center sm:px-8 sm:py-14">
        <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#f8eee7] text-[#d85a20]">
          <ShieldCheck aria-hidden="true" className="size-7" />
        </span>
        <h2 className="mt-5 text-xl font-extrabold tracking-[-0.03em] text-[#2b201a]">Sección preparada</h2>
        <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[#7c6a60]">
          Aquí podremos añadir los accesos de Italy Pizza con el nivel de seguridad adecuado.
        </p>
      </div>
    </section>
  );
}
