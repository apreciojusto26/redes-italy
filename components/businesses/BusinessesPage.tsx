"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, CircleHelp, ExternalLink, FileText, KeyRound, LoaderCircle, Play, Plus, Search, X } from "lucide-react";
import { businessGuides, supportingTools, type BusinessResource, type BusinessTutorial } from "@/config/businesses";
import { normalizeCredentialGroup } from "@/config/credential-groups";

interface Props { active: boolean; onOpenPasswords: (group: string) => void; onOpenPublications: (section: "bamzuk" | "social") => void }
const panel = "rounded-[24px] border border-[#e2e5e9] bg-white p-5 sm:p-7";
const action = "inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition";
const helpSteps = [
  { title: "Empieza por un negocio", text: "Pulsa una tarjeta para ver qué es ese negocio, cómo funciona y qué páginas utiliza. Puedes volver a esta lista cuando quieras." },
  { title: "Sigue los pasos con las flechas", text: "Dentro de cada negocio, pulsa Siguiente para leer una acción cada vez. También puedes elegir un paso directamente. Esto es una guía, no una lista de tareas completadas." },
  { title: "Tus accesos siguen en Contraseñas", text: "El botón Ver accesos te lleva a las cuentas del negocio. Si la bóveda está bloqueada, primero te pedirá la contraseña maestra." },
  { title: "Aprende con los vídeos", text: "Cada negocio tiene su propia zona de tutoriales. Cuando Gabriel o Kevin compartan un vídeo, se puede añadir su título y enlace. Los vídeos se abren en otra pestaña." },
];

export function BusinessesPage({ active, onOpenPasswords, onOpenPublications }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [resources, setResources] = useState<BusinessResource[]>([]);
  const [tutorials, setTutorials] = useState<BusinessTutorial[]>([]);
  const [resourceError, setResourceError] = useState("");
  const [tutorialError, setTutorialError] = useState("");
  const [loading, setLoading] = useState(false);
  const [addingVideo, setAddingVideo] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [helpStep, setHelpStep] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const selected = businessGuides.find((guide) => guide.id === selectedId);

  useEffect(() => {
    if (!active) { dialog.current?.close(); return; }
    const controller = new AbortController();
    const timer = window.setTimeout(() => {
      setLoading(true);
      const read = async (endpoint: string) => {
        const response = await fetch(endpoint, { signal: controller.signal, cache: "no-store" });
        const body = await response.json();
        if (!response.ok) throw new Error(body.error);
        return body;
      };
      void Promise.allSettled([
        read("/api/business-resources").then((body) => { setResources(body.resources); setResourceError(""); }).catch((error) => { if (!controller.signal.aborted) setResourceError(error.message); }),
        read("/api/business-tutorials").then((body) => { setTutorials(body.tutorials); setTutorialError(""); }).catch((error) => { if (!controller.signal.aborted) setTutorialError(error.message); }),
      ]).finally(() => { if (!controller.signal.aborted) setLoading(false); });
    }, 0);
    return () => { controller.abort(); window.clearTimeout(timer); };
  }, [active]);

  const openGuide = (id: string | null) => {
    setSelectedId(id); setStep(0); setAddingVideo(false); setTitle(""); setUrl(""); setSaveError("");
    window.requestAnimationFrame(() => { heading.current?.focus(); heading.current?.scrollIntoView({ block: "start", behavior: "smooth" }); });
  };
  const showHelp = () => { setHelpStep(0); dialog.current?.showModal(); };
  const saveVideo = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected || saving) return;
    setSaving(true); setSaveError("");
    try {
      const response = await fetch("/api/business-tutorials", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ businessId: selected.id, title, url }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error);
      setTutorials((current) => [...current, body.tutorial]); setAddingVideo(false); setTitle(""); setUrl("");
    } catch (error) { setSaveError(error instanceof Error ? error.message : "No se pudo guardar el vídeo."); }
    finally { setSaving(false); }
  };
  const matchingResources = selected ? resources.filter((resource) => selected.aliases.some((alias) => normalizeCredentialGroup(resource.groupName) === normalizeCredentialGroup(alias))) : [];
  const safeResources = matchingResources.filter((resource) => /^https?:\/\//i.test(resource.url));
  const videos = tutorials.filter((video) => video.businessId === selectedId);
  const guides = businessGuides.filter((guide) => normalizeCredentialGroup(`${guide.name} ${guide.subtitle} ${guide.explanation}`).includes(normalizeCredentialGroup(search)));

  return (
    <div className="businesses-page space-y-5 pb-5">
      <header className="relative overflow-hidden rounded-[26px] bg-[#223e45] px-5 py-7 text-white sm:px-8 sm:py-9">
        <div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full border-[45px] border-white/5" />
        <div className="relative flex flex-wrap items-start justify-between gap-5">
          <div className="max-w-xl">
            <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[#b8d9d0]"><BookOpen className="size-4" aria-hidden="true" /> La guía de Daniel</p>
            <h1 ref={heading} tabIndex={-1} className="scroll-mt-6 text-3xl font-extrabold tracking-[-0.04em] outline-none sm:text-4xl">{selected ? selected.name : "Mis negocios"}</h1>
            <p className="mt-3 text-base leading-7 text-white/85">{selected ? selected.subtitle : "Entiende cada proyecto, sigue los pasos y encuentra todo lo que necesitas."}</p>
          </div>
          <button type="button" onClick={showHelp} className={`${action} border border-white/25 bg-white/10 hover:bg-white/20`}><CircleHelp className="size-5" aria-hidden="true" /> ¿Cómo uso esto?</button>
        </div>
      </header>

      {selected ? <>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <button type="button" onClick={() => openGuide(null)} className={`${action} px-1 text-[#365e64] hover:bg-[#eff6f3]`}><ArrowLeft className="size-5" aria-hidden="true" /> Todos mis negocios</button>
          <div className="flex flex-wrap gap-2"><a href="#business-videos" className={`${action} border border-[#d7dedb] text-[#365e55]`}><Play className="size-4" aria-hidden="true" /> Ir a los vídeos</a><button type="button" onClick={() => onOpenPasswords(selected.group)} className={`${action} bg-[#365e55] text-white`}><KeyRound className="size-4" aria-hidden="true" /> Ver accesos</button></div>
        </div>
        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 space-y-5">
            <section className={panel} aria-labelledby="business-about">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5b7477]">01 · Entender</p>
              <h2 id="business-about" className="text-xl font-extrabold">¿Qué es este negocio?</h2>
              <p className="mt-3 text-base leading-7 text-[#3c4754]">{selected.explanation}</p>
              <div className="mt-5 rounded-2xl bg-[#f0f6f3] p-4"><p className="font-extrabold text-[#365e55]">Un ejemplo sencillo</p><p className="mt-2 text-sm leading-6 text-[#3c5750]">{selected.example}</p></div>
              <div className="mt-5 grid gap-2 sm:grid-cols-[1fr_auto_1fr]"><div className="rounded-2xl border border-[#e2e5e9] p-4"><p className="text-xs font-bold text-[#64707c]">LA GENTE TE CONOCE EN</p><p className="mt-2 font-bold">{selected.promotion}</p></div><ArrowRight aria-hidden="true" className="hidden self-center text-[#537a70] sm:block" /><ArrowDown aria-hidden="true" className="mx-auto text-[#537a70] sm:hidden" /><div className="rounded-2xl border border-[#d4e5dc] bg-[#f7faf8] p-4"><p className="text-xs font-bold text-[#64707c]">LA COMPRA SE HACE EN</p><p className="mt-2 font-bold">{selected.sale}</p></div></div>
            </section>
            <section className={panel} aria-labelledby="business-steps">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5b7477]">02 · Aprender paso a paso</p>
              <h2 id="business-steps" className="text-xl font-extrabold">¿Cómo funciona?</h2>
              <p className="mt-2 text-sm leading-6 text-[#64707c]">Una cosa cada vez. Usa las flechas o elige un número.</p>
              <div className="mt-5 flex flex-wrap gap-2" aria-label="Elegir un paso">{selected.steps.map((item, index) => <button type="button" key={item.title} onClick={() => setStep(index)} aria-label={`Paso ${index + 1}: ${item.title}`} aria-current={step === index ? "step" : undefined} className={`grid size-11 place-items-center rounded-xl border font-extrabold ${step === index ? "border-[#365e55] bg-[#365e55] text-white" : "border-[#d7dedb] bg-white text-[#365e55] hover:bg-[#eff6f3]"}`}>{index + 1}</button>)}</div>
              <div className="mt-4 min-h-[180px] rounded-2xl bg-[#f6f8fa] p-5 sm:p-6" aria-live="polite" aria-atomic="true"><p className="text-xs font-bold uppercase tracking-wider text-[#63716b]">Paso {step + 1} de {selected.steps.length}</p><h3 className="mt-3 text-xl font-extrabold">{selected.steps[step].title}</h3><p className="mt-3 text-base leading-7 text-[#3c4754]">{selected.steps[step].description}</p></div>
              <div className="mt-4 flex flex-wrap justify-between gap-3"><button type="button" onClick={() => setStep((current) => current - 1)} disabled={step === 0} className={`${action} border border-[#d7dedb] text-[#365e55] disabled:opacity-35`}><ArrowLeft className="size-4" aria-hidden="true" /> Anterior</button><button type="button" onClick={() => setStep((current) => current === selected.steps.length - 1 ? 0 : current + 1)} className={`${action} bg-[#365e55] text-white hover:bg-[#24483f]`}>{step === selected.steps.length - 1 ? "Volver al primer paso" : "Siguiente"}<ArrowRight className="size-4" aria-hidden="true" /></button></div>
            </section>
            <section className={panel} aria-labelledby="business-videos">
              <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5b7477]">03 · Ver cómo se hace</p><h2 id="business-videos" className="text-xl font-extrabold">Vídeos tutoriales</h2></div><button type="button" onClick={() => { setAddingVideo((current) => !current); setSaveError(""); }} aria-expanded={addingVideo} className={`${action} border border-[#d7dedb] text-[#365e55]`}><Plus className="size-4" aria-hidden="true" /> Añadir vídeo</button></div>
              {loading && <p className="mt-4 text-sm text-[#64707c]">Buscando tutoriales…</p>}
              {tutorialError && <p role="status" className="mt-4 rounded-xl bg-[#fff4e6] p-3 text-sm text-[#835329]">{tutorialError}</p>}
              {videos.length > 0 ? <div className="mt-5 space-y-3">{videos.map((video) => <a key={video.id} href={video.url} target="_blank" rel="noopener noreferrer" className="flex min-h-16 items-center gap-3 rounded-2xl border border-[#dce5e0] p-4 hover:bg-[#f0f6f3]"><span className="grid size-11 shrink-0 place-items-center rounded-xl bg-[#e8f0eb] text-[#365e55]"><Play className="size-5" aria-hidden="true" /></span><span className="min-w-0 flex-1"><span className="block break-words font-bold">{video.title}</span><span className="mt-1 block text-xs text-[#64707c]">Ver vídeo · abre otra pestaña</span></span><ExternalLink className="size-4 shrink-0" aria-hidden="true" /></a>)}</div> : !loading && <div className="mt-5 rounded-2xl border border-dashed border-[#cfdcd5] bg-[#f7faf8] p-5"><p className="font-extrabold text-[#365e55]">Los primeros vídeos están por llegar</p><p className="mt-2 text-sm leading-6 text-[#56665e]">Los informes no incluyen enlaces de vídeos. Estos son los temas preparados para Gabriel y Kevin:</p><ul className="mt-3 space-y-2">{selected.tutorials.map((topic) => <li key={topic} className="flex gap-2 text-sm leading-6"><Play className="mt-1 size-4 shrink-0 text-[#6b8c7e]" aria-hidden="true" />{topic}</li>)}</ul></div>}
              {addingVideo && <form onSubmit={saveVideo} className="mt-5 space-y-4 rounded-2xl border border-[#d7dedb] p-4"><p className="text-sm leading-6 text-[#64707c]">Pega el enlace de un vídeo de YouTube, Drive u otra plataforma. Se guardará para todos los dispositivos. Si el vídeo es privado, comprueba sus permisos.</p><label className="block text-sm font-bold">¿Qué enseña el vídeo?<input required maxLength={160} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Ejemplo: Cómo revisar un pedido" className="mt-2 min-h-12 w-full rounded-xl border border-[#cdd6d1] px-3 font-medium" /></label><label className="block text-sm font-bold">Enlace del vídeo<input required type="url" maxLength={2048} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…" className="mt-2 min-h-12 w-full rounded-xl border border-[#cdd6d1] px-3 font-medium" /></label>{saveError && <p role="alert" className="text-sm text-[#a74729]">{saveError}</p>}<div className="flex flex-wrap gap-3"><button disabled={saving} className={`${action} bg-[#365e55] text-white disabled:opacity-60`}>{saving ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <Check className="size-4" aria-hidden="true" />}Guardar vídeo</button><button type="button" disabled={saving} onClick={() => setAddingVideo(false)} className={`${action} text-[#56665e]`}>Cancelar</button></div></form>}
            </section>
            <section className={panel}><h2 className="text-xl font-extrabold">Recuerda</h2><div className="mt-4 space-y-3">{selected.reminders.map((reminder) => <details key={reminder} className="rounded-2xl bg-[#fff8ed] p-4"><summary className="min-h-6 cursor-pointer text-sm font-bold text-[#876132]">Una aclaración útil</summary><p className="mt-3 text-sm leading-6 text-[#705b3f]">{reminder}</p></details>)}</div><p className="mt-5 text-xs leading-5 text-[#64707c]">Basado en {selected.source}. Informes del 4 de octubre de 2026.</p></section>
          </div>
          <aside className="space-y-5 lg:sticky lg:top-5">
            <section className={`${panel} bg-[#f0f6f3]`}><KeyRound className="size-6 text-[#365e55]" aria-hidden="true" /><h2 className="mt-3 text-lg font-extrabold">Tus accesos, a mano</h2><p className="mt-2 text-sm leading-6 text-[#56665e]">Las claves siguen en Contraseñas. Elige el negocio y desbloquea la bóveda si te lo pide.</p><div className="mt-4 space-y-2">{selected.aliases.map((group) => <button type="button" key={group} onClick={() => onOpenPasswords(group)} className={`${action} w-full justify-between bg-white text-[#365e55] shadow-sm`}>{selected.aliases.length > 1 ? group : "Ver accesos"}<ArrowRight className="size-4 shrink-0" aria-hidden="true" /></button>)}</div></section>
            <section className={panel}><h2 className="text-lg font-extrabold">Herramientas y páginas</h2><div className="mt-4 space-y-4">{selected.tools.map((tool) => <div key={tool.name}><h3 className="font-bold">{tool.name}</h3><p className="mt-1 text-sm leading-6 text-[#64707c]">{tool.description}</p></div>)}</div>{resourceError && <p role="status" className="mt-4 text-sm text-[#835329]">{resourceError}</p>}<div className="mt-5 space-y-2">{safeResources.map((resource, index) => <a key={`${resource.url}-${index}`} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center justify-between gap-2 rounded-xl border border-[#d7dedb] p-3 text-sm font-bold text-[#365e55] hover:bg-[#f0f6f3]"><span className="min-w-0 break-words">Abrir {resource.name}</span><ExternalLink className="size-4 shrink-0" aria-hidden="true" /></a>)}</div>{!loading && safeResources.length === 0 && <p className="mt-4 text-sm leading-6 text-[#64707c]">Los enlaces aparecerán aquí cuando estén guardados en las cuentas de este negocio.</p>}</section>
            {(selected.id === "bamzuk" || selected.id === "italy") && <button type="button" onClick={() => onOpenPublications(selected.id === "bamzuk" ? "bamzuk" : "social")} className={`${action} w-full border border-[#d7dedb] text-[#365e55]`}>Ir al panel de publicaciones<ArrowRight className="size-4" aria-hidden="true" /></button>}
            {selected.related.length > 0 && <section className={panel}><h2 className="text-lg font-extrabold">Conectado con…</h2>{selected.related.map((id) => { const related = businessGuides.find((guide) => guide.id === id)!; return <button key={id} type="button" onClick={() => openGuide(id)} className="mt-3 flex min-h-12 w-full items-center justify-between gap-3 text-left text-sm font-bold text-[#365e55]">{related.name}<ChevronRight className="size-4 shrink-0" aria-hidden="true" /></button>; })}</section>}
          </aside>
        </div>
      </> : <>
        <section className={`${panel} bg-[#f0f6f3]`}><div className="flex items-start gap-3"><span aria-hidden="true" className="text-2xl">💡</span><div><h2 className="font-extrabold text-[#365e55]">Todos tienen algo en común</h2><p className="mt-2 text-sm leading-6 text-[#56665e]">Las redes ayudan a que la gente conozca los productos. Después, cada negocio lleva a sus clientes a un lugar distinto para comprar. Publicar con regularidad ayuda a dar visibilidad y confianza.</p></div></div></section>
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="text-xl font-extrabold">Elige el negocio que quieres entender</h2><p className="mt-2 text-sm text-[#64707c]">Seis proyectos. Una explicación a tu ritmo.</p></div><label className="flex min-h-12 items-center gap-2 rounded-2xl border border-[#d7dedb] px-3 sm:max-w-64"><Search aria-hidden="true" className="size-5 shrink-0 text-[#64707c]" /><span className="sr-only">Buscar negocio</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar negocio…" className="min-w-0 w-full bg-transparent text-sm outline-none" /></label></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{guides.map((guide) => <button type="button" key={guide.id} onClick={() => openGuide(guide.id)} className="group flex flex-col rounded-[24px] border border-[#e2e5e9] bg-white p-5 text-left shadow-[0_4px_18px_rgba(25,55,45,0.03)] transition hover:-translate-y-1 hover:border-[#a6c3b6] hover:shadow-[0_10px_30px_rgba(25,55,45,0.08)] sm:p-6"><span aria-hidden="true" className="grid size-14 place-items-center rounded-2xl bg-[#f4f6f5] text-3xl">{guide.emoji}</span><h3 className="mt-5 text-lg font-extrabold" style={{ color: guide.color }}>{guide.name}</h3><p className="mt-2 text-sm leading-6 text-[#64707c]">{guide.subtitle}</p><span className="mt-5 flex w-full items-center justify-between border-t border-[#edf0ee] pt-4 text-sm font-extrabold text-[#365e55]">Ver la guía<ArrowRight className="size-5 transition group-hover:translate-x-1" aria-hidden="true" /></span></button>)}</div>
        {guides.length === 0 && <p role="status" className={`${panel} text-center text-[#64707c]`}>No encontramos ese negocio. Prueba con Italy, Bamzuk o dropshipping.</p>}
        <section className={panel}><h2 className="text-xl font-extrabold">Otras cuentas que ayudan a tus negocios</h2><p className="mt-2 text-sm leading-6 text-[#64707c]">No son proyectos separados. Son herramientas de apoyo recogidas en el primer informe.</p><div className="mt-5 grid gap-3 sm:grid-cols-2">{supportingTools.map((sector) => <details key={sector.name} className="rounded-2xl bg-[#f6f8fa] p-4"><summary className="min-h-7 cursor-pointer font-bold">{sector.name}</summary><p className="mt-3 text-sm leading-6 text-[#55616d]">{sector.description}</p><p className="mt-2 text-sm leading-6 text-[#55616d]">{sector.tools}</p></details>)}</div><button type="button" onClick={() => onOpenPasswords("")} className={`${action} mt-4 text-[#365e55]`}><KeyRound className="size-4" aria-hidden="true" /> Ver todas las cuentas<ArrowRight className="size-4" aria-hidden="true" /></button></section>
        <section className={panel}><h2 className="text-lg font-extrabold">Los informes originales</h2><p className="mt-2 text-sm leading-6 text-[#64707c]">Puedes consultar el detalle completo. Estas guías resumen los documentos del 4 de octubre de 2026.</p><div className="mt-4 flex flex-wrap gap-3">{[1, 2].map((number) => <a key={number} href={`/informes/informe-${number}.pdf`} target="_blank" rel="noopener noreferrer" className={`${action} border border-[#d7dedb] text-[#365e55]`}><FileText className="size-4" aria-hidden="true" />{number === 1 ? "Informe general" : "Guía de proyectos"}<ExternalLink className="size-4" aria-hidden="true" /></a>)}</div></section>
      </>}
      <dialog ref={dialog} aria-labelledby="business-help-title" className="m-auto w-[calc(100%-2rem)] max-w-lg rounded-[26px] border-0 bg-white p-0 text-black shadow-2xl backdrop:bg-[#142b2a]/55 backdrop:backdrop-blur-sm">
        <div className="p-6 sm:p-8"><div className="flex items-center justify-between gap-4"><p className="text-xs font-bold uppercase tracking-widest text-[#5b7477]">Una pequeña visita · {helpStep + 1} de {helpSteps.length}</p><button type="button" onClick={() => dialog.current?.close()} aria-label="Cerrar ayuda" className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f0f6f3]"><X className="size-5" aria-hidden="true" /></button></div><CircleHelp aria-hidden="true" className="mt-5 size-10 text-[#365e55]" /><h2 id="business-help-title" className="mt-5 text-2xl font-extrabold">{helpSteps[helpStep].title}</h2><p className="mt-4 text-base leading-7 text-[#55616d]" aria-live="polite">{helpSteps[helpStep].text}</p><div className="mt-7 flex flex-wrap justify-between gap-3"><button type="button" disabled={helpStep === 0} onClick={() => setHelpStep((current) => current - 1)} className={`${action} text-[#365e55] disabled:opacity-35`}>Anterior</button><button type="button" onClick={() => helpStep === helpSteps.length - 1 ? dialog.current?.close() : setHelpStep((current) => current + 1)} className={`${action} bg-[#365e55] text-white`}>{helpStep === helpSteps.length - 1 ? "Entendido" : "Siguiente"}<ArrowRight className="size-4" aria-hidden="true" /></button></div></div>
      </dialog>
    </div>
  );
}
