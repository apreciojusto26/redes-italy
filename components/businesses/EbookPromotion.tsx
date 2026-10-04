"use client";

import { useEffect, useRef, useState, useId } from "react";
import { Check, Copy, MessageCircle, Bell } from "lucide-react";
import { ebookMessage, instagramEbookCallToAction, profileEbookCallToAction, youtubeEbookReply } from "@/config/ebook-promotion";

function CopyableText({ title, text }: { title: string; text: string }) {
  const id = useId();
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (resetTimer.current) clearTimeout(resetTimer.current);
  }, []);

  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const field = document.createElement("textarea");
        field.value = text;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const success = document.execCommand("copy");
        field.remove();
        if (!success) throw new Error("Copy failed");
      }
      setCopied(true);
      setFeedback("Texto copiado. Ya puedes pegarlo.");
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
      setFeedback("No se pudo copiar automáticamente. Selecciona el texto y cópialo.");
    }
  };

  return (
    <div className="mt-4 rounded-2xl border border-[#d8e3dc] bg-white p-4 sm:p-5">
      <h4 id={id} className="text-sm font-extrabold text-[#365e55]">{title}</h4>
      <p aria-labelledby={id} className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#3c4754] [overflow-wrap:anywhere]">{text}</p>
      <button type="button" onClick={copy} aria-label={`Copiar: ${title}`} className="mt-4 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#365e55] px-4 py-3 text-sm text-white transition hover:bg-[#24483f]">
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        {copied ? "Copiado" : "Copiar texto"}
      </button>
      <p role="status" aria-live="polite" className="mt-2 text-xs leading-5 text-[#56665e]">{feedback}</p>
    </div>
  );
}

export function EbookPromotion() {
  return (
    <section aria-labelledby="ebook-promotion-title" className="rounded-[24px] border border-[#e2e5e9] bg-white p-5 sm:p-7">
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-[#5b7477]">Para ponerlo en práctica · Redes sociales</p>
      <h2 id="ebook-promotion-title" className="text-xl font-extrabold">Del vídeo al ebook: qué decir y qué enviar</h2>
      <p className="mt-3 text-base leading-7 text-[#3c4754]">Al final de cada vídeo, explica a la persona qué debe hacer para conseguir el ebook. Esa invitación se llama «llamada a la acción».</p>

      <div className="mt-5 rounded-2xl bg-[#f0f6f3] p-4 sm:p-5">
        <h3 className="flex items-center gap-2 text-lg font-extrabold text-[#365e55]"><MessageCircle className="size-5 shrink-0" aria-hidden="true" /> Instagram: comenta «pizza»</h3>
        <p className="mt-3 text-sm leading-7 text-[#3c5750]">Lo ideal es automatizar la respuesta de los vídeos con ManyChat: cuando alguien comente la palabra «pizza», recibirá un mensaje privado con el enlace. Así no tendrás que enviar el mismo texto a cada persona.</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-[#3c5750]">
          <li>Prepara en ManyChat la respuesta de Instagram para la palabra «pizza» y el vídeo que quieras promocionar.</li>
          <li>Utiliza el mensaje de abajo como respuesta y comprueba que el enlace abre correctamente.</li>
          <li>Haz una prueba antes de anunciarlo. Mientras la automatización no esté activa, envía el mensaje tú mismo y revisa las conversaciones.</li>
        </ol>
        <CopyableText title="Frase para el vídeo de Instagram" text={instagramEbookCallToAction} />
        <CopyableText title="Mensaje para enviar por Instagram" text={ebookMessage} />
      </div>

      <div className="mt-5 rounded-2xl bg-[#f6f8fa] p-4 sm:p-5">
        <h3 className="text-lg font-extrabold">TikTok y YouTube: lleva al enlace del perfil</h3>
        <p className="mt-3 text-sm leading-7 text-[#55616d]">En estos vídeos, indica dónde está el enlace para descargar el ebook. Antes de publicar, comprueba que el perfil tenga el enlace correcto y que la descarga gratuita esté disponible.</p>
        <CopyableText title="Llamada a la acción para TikTok y YouTube" text={profileEbookCallToAction} />
      </div>

      <div className="mt-5 rounded-2xl border border-[#ead9bb] bg-[#fff8ed] p-4 sm:p-5">
        <h3 className="flex items-start gap-2 text-lg font-extrabold text-[#876132]"><Bell className="mt-1 size-5 shrink-0" aria-hidden="true" /> YouTube: hay un vídeo publicado, revisa las respuestas</h3>
        <p className="mt-3 text-sm leading-7 text-[#705b3f]">Ya se publicó un vídeo en YouTube con una llamada a la acción para pedir el ebook. Revisa sus comentarios y notificaciones, y responde a quienes lo soliciten o tengan dudas. Revisa también los mensajes que lleguen a Instagram.</p>
        <p className="mt-3 text-sm leading-7 text-[#705b3f]">La respuesta automática de Instagram no responde por ti los comentarios de YouTube. Para esos comentarios puedes copiar esta respuesta breve:</p>
        <CopyableText title="Respuesta para los comentarios de YouTube" text={youtubeEbookReply} />
      </div>
    </section>
  );
}
