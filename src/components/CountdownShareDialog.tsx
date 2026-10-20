"use client";

import Image from "next/image";
import { Check, Copy, Download, ExternalLink, Facebook, Instagram, Link2, LoaderCircle, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  COUNTDOWN_SHARE_TITLE,
  buildCountdownCaption,
  buildCountdownCardUrl,
  buildCountdownShareUrl,
  type CardFormat,
  type CountdownSnapshot,
  type SharePlatform
} from "@/lib/countdown-share";

type PreparedCard = { file: File; url: string; format: CardFormat };
const focusStyle = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright";

export function CountdownShareDialog({ snapshot, onClose }: { snapshot: CountdownSnapshot; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const [platform, setPlatform] = useState<SharePlatform>("facebook");
  const [format, setFormat] = useState<"feed" | "story">("feed");
  const [captions, setCaptions] = useState(() => ({
    facebook: buildCountdownCaption(snapshot, "facebook"),
    instagram: buildCountdownCaption(snapshot, "instagram")
  }));
  const [preparedCard, setPreparedCard] = useState<PreparedCard | null>(null);
  const [cardError, setCardError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [canShareCard, setCanShareCard] = useState(false);
  const [sharingCard, setSharingCard] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState<"caption" | "link" | null>(null);
  const shareUrl = buildCountdownShareUrl(snapshot, platform);
  const card = preparedCard?.format === format ? preparedCard : null;
  const platformLabel = platform === "facebook" ? "Facebook" : "Instagram";
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: buildCountdownShareUrl(snapshot, "facebook") })}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("[data-dialog-initial-focus]")?.focus({ preventScroll: true });
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = originalOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    setPreparedCard(null);
    setCardError(false);
    setCanShareCard(false);

    async function prepareCard() {
      try {
        const response = await fetch(buildCountdownCardUrl(snapshot, format), { signal: controller.signal });
        if (!response.ok) throw new Error("Card unavailable");
        const blob = await response.blob();
        if (!blob.type.startsWith("image/png") || !blob.size) throw new Error("Invalid card");
        if (controller.signal.aborted) return;
        const file = new File([blob], `mg251-countdown-${snapshot.dateKey}-${format === "story" ? "story" : "post"}.png`, { type: "image/png" });
        objectUrl = URL.createObjectURL(blob);
        setPreparedCard({ file, url: objectUrl, format });
        try {
          setCanShareCard(typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
        } catch {
          setCanShareCard(false);
        }
      } catch {
        if (!controller.signal.aborted) setCardError(true);
      }
    }

    void prepareCard();
    return () => {
      controller.abort();
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [snapshot, format, retry]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 3000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  async function copyText(kind: "caption" | "link") {
    const text = kind === "caption" ? captions[platform] : shareUrl;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setStatus(kind === "caption" ? `${platformLabel} caption copied. Paste it into your post.` : "Website link copied. Add it to your post or Story link sticker.");
    } catch {
      const field = kind === "caption" ? captionRef.current : linkRef.current;
      field?.focus();
      field?.select();
      setCopied(null);
      setStatus(`Automatic copy is unavailable. The ${kind} is selected so you can copy it yourself.`);
    }
  }

  async function shareCard() {
    if (!card || typeof navigator.share !== "function" || sharingCard) return;
    setSharingCard(true);
    try {
      // The image is prepared before this click, preserving the user gesture
      // required by mobile browsers. Captions have a separate copy action
      // because receiving apps do not consistently accept text with a file.
      await navigator.share({ files: [card.file], title: COUNTDOWN_SHARE_TITLE });
      setStatus("Card handed to your device’s share menu. Paste the caption in your chosen app.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("Sharing canceled. Your card and caption are still ready.");
      } else {
        setStatus("Your device couldn’t share the card. Download it and upload it with your caption.");
      }
    } finally {
      setSharingCard(false);
    }
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="countdown-share-heading"
      aria-describedby="countdown-share-description"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none items-center justify-center overflow-hidden border-0 bg-black/75 p-2 text-white backdrop-blur-sm backdrop:bg-transparent open:flex sm:p-5"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-parade-gold/40 bg-parade-purpleDeep text-white shadow-card sm:max-h-[calc(100dvh-2.5rem)]">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/15 bg-gradient-to-r from-parade-purpleDeep to-parade-purple px-4 py-4 sm:px-6">
          <div>
            <p className="text-[0.65rem] font-black uppercase tracking-[0.18em] text-parade-goldBright">Bring your crew</p>
            <h2 id="countdown-share-heading" className="mt-1 text-xl font-black leading-tight sm:text-2xl">Share the Mardi Gras countdown</h2>
            <p id="countdown-share-description" className="mt-1.5 text-sm leading-5 text-purple-100">Your card, your caption, and a link to plan it all at MG251.</p>
          </div>
          <button type="button" onClick={onClose} data-dialog-initial-focus aria-label="Close countdown sharing" className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 hover:bg-white/20 ${focusStyle}`}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="overflow-y-auto overscroll-contain px-4 pb-5 pt-4 sm:p-6">
          <div className="grid gap-6 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)]">
            <section aria-labelledby="countdown-card-heading" className="min-w-0">
              <h3 id="countdown-card-heading" className="text-sm font-black text-parade-goldBright">1. Get your countdown card</h3>
              <div className="mt-3 flex min-h-56 items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-3 sm:min-h-72 md:min-h-[25rem]">
                {card ? (
                  <Image
                    src={card.url}
                    width={1080}
                    height={format === "story" ? 1920 : 1350}
                    unoptimized
                    alt={snapshot.expired ? "MG251 card: check the Mobile Mardi Gras parade schedule at MG251.xyz." : `MG251 countdown card: ${snapshot.days > 0 ? `${snapshot.days} ${snapshot.days === 1 ? "day" : "days"}` : "less than one day"} until the first downtown parade. Conde Cavaliers, January 22, 2027, 6:30 PM CT. Visit MG251.xyz.`}
                    className={`h-auto rounded-lg shadow-lg ${format === "story" ? "w-36 sm:w-44 md:w-52" : "w-44 sm:w-56 md:w-full md:max-w-72"}`}
                  />
                ) : cardError ? (
                  <div className="max-w-xs py-8 text-center">
                    <p className="text-sm leading-6 text-purple-100">The card couldn’t load. Your caption and website link are still ready.</p>
                    <button type="button" onClick={() => setRetry((value) => value + 1)} className={`mt-3 min-h-11 rounded-full border border-parade-gold/50 px-5 text-sm font-bold ${focusStyle}`}>Try card again</button>
                  </div>
                ) : (
                  <p className="flex items-center gap-2 py-12 text-sm text-purple-100" role="status"><LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Preparing your card…</p>
                )}
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Card size">
                {([{ value: "feed", label: "Post", dimensions: "1080 × 1350" }, { value: "story", label: "Story", dimensions: "1080 × 1920" }] as const).map((option) => (
                  <button key={option.value} type="button" aria-pressed={format === option.value} onClick={() => { setFormat(option.value); setStatus(""); }} className={`min-h-12 rounded-xl border px-3 py-2 text-sm transition ${focusStyle} ${format === option.value ? "border-parade-goldBright bg-parade-goldBright/15 text-parade-goldBright" : "border-white/20 text-purple-100 hover:bg-white/10"}`}>
                    <span className="block font-black">{option.label}</span><span className="block text-[0.65rem]">{option.dimensions}</span>
                  </button>
                ))}
              </div>
              <div className="mt-3 grid gap-2">
                {card ? <a href={card.url} download={card.file.name} onClick={() => setStatus("Save the card, then add it to your post with the caption.")} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-black text-parade-purpleDark hover:bg-purple-100 ${focusStyle}`}><Download className="h-4 w-4" aria-hidden="true" /> Download {format === "story" ? "Story" : "post"} card</a> : <button type="button" disabled className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white/15 px-4 py-2.5 text-sm font-bold text-white/55"><Download className="h-4 w-4" aria-hidden="true" /> {cardError ? "Card unavailable" : "Preparing card…"}</button>}
                {card && canShareCard ? <button type="button" onClick={() => void shareCard()} disabled={sharingCard} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2.5 text-sm font-black hover:bg-white/20 disabled:opacity-60 ${focusStyle}`}><Share2 className="h-4 w-4" aria-hidden="true" /> {sharingCard ? "Opening share menu…" : "Share card…"}</button> : null}
              </div>
              <p className="mt-2 text-center text-xs leading-5 text-purple-200">Card captured {snapshot.dateLabel}.</p>
            </section>

            <section aria-labelledby="countdown-caption-heading" className="min-w-0">
              <h3 id="countdown-caption-heading" className="text-sm font-black text-parade-goldBright">2. Add your caption</h3>
              <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Caption platform">
                {([{ value: "facebook", label: "Facebook", Icon: Facebook }, { value: "instagram", label: "Instagram", Icon: Instagram }] as const).map(({ value, label, Icon }) => (
                  <button key={value} type="button" aria-pressed={platform === value} onClick={() => { setPlatform(value); setCopied(null); setStatus(""); }} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-black ${focusStyle} ${platform === value ? "border-parade-goldBright bg-parade-goldBright text-parade-purpleDark" : "border-white/25 bg-white/5 text-white hover:bg-white/10"}`}><Icon className="h-4 w-4" aria-hidden="true" /> {label}</button>
                ))}
              </div>
              <label htmlFor="countdown-caption" className="mt-4 block text-xs font-semibold text-purple-100">Ready to post. Make it your own if you like.</label>
              <textarea ref={captionRef} id="countdown-caption" aria-label={`${platformLabel} caption`} value={captions[platform]} onChange={(event) => { setCaptions((values) => ({ ...values, [platform]: event.target.value })); setCopied(null); }} rows={8} className="mt-2 block w-full resize-y rounded-xl border border-white/25 bg-white p-3 text-base leading-6 text-parade-ink outline-none focus:border-parade-goldBright focus:ring-2 focus:ring-parade-goldBright sm:text-sm" />
              <button type="button" onClick={() => void copyText("caption")} className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-parade-goldBright px-4 py-2.5 text-sm font-black text-parade-purpleDark hover:bg-parade-goldSoft ${focusStyle}`}>
                {copied === "caption" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied === "caption" ? "Caption copied" : `Copy ${platformLabel} caption`}
              </button>

              {platform === "facebook" ? (
                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3">
                  <p className="text-sm leading-6 text-purple-100">Facebook opens with the countdown link. Paste your caption before posting, or upload the card in your own post.</p>
                  <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={`mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-black hover:bg-white/20 ${focusStyle}`}><Facebook className="h-4 w-4" aria-hidden="true" /> Share link on Facebook <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" /></a>
                </div>
              ) : (
                <div className="mt-4 rounded-xl border border-white/15 bg-white/5 p-3 text-sm leading-6 text-purple-100">
                  <p>Upload the card in Instagram and paste your caption. Choose the Story size for a full-screen Story.</p>
                  <p className="mt-2">To give people a clickable way back, add the website link below with a <span className="font-bold text-white">Link sticker</span> in your Story.</p>
                </div>
              )}
              <label htmlFor="countdown-share-link" className="mt-4 flex items-center gap-1.5 text-xs font-bold text-purple-100"><Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Website link</label>
              <div className="mt-2 flex gap-2">
                <input ref={linkRef} id="countdown-share-link" type="text" value={shareUrl} readOnly onFocus={(event) => event.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/25 bg-black/20 px-3 text-base text-purple-100 focus:outline focus:outline-2 focus:outline-parade-goldBright sm:text-xs" />
                <button type="button" onClick={() => void copyText("link")} aria-label="Copy website link" className={`inline-flex min-h-11 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-white/30 px-3 text-xs font-bold hover:bg-white/10 ${focusStyle}`}>{copied === "link" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />} Copy</button>
              </div>
              <p className="mt-2 text-xs leading-5 text-purple-200">Opens the live countdown, schedule, maps, and coverage.</p>
              <p role="status" aria-live="polite" aria-atomic="true" className="mt-3 text-sm font-semibold leading-5 text-parade-goldBright">{status}</p>
            </section>
          </div>
        </div>
      </div>
    </dialog>
  );
}
