"use client";

import Image from "next/image";
import { Check, Copy, Download, ExternalLink, Link2, LoaderCircle, RefreshCw, Share2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SocialBrandIcon } from "@/components/SocialBrandIcon";
import type { SocialPlatform } from "@/lib/social-links";
import {
  COUNTDOWN_CARD_SIZES,
  COUNTDOWN_PLATFORM_PRESETS,
  COUNTDOWN_SHARE_PLATFORMS,
  COUNTDOWN_SHARE_TITLE,
  TARGET_EVENT_NAME,
  TARGET_FULL_DATE_LABEL,
  buildCountdownCaption,
  buildCountdownCardUrl,
  buildCountdownShareUrl,
  createCountdownSnapshot,
  formatCountdownRemaining,
  type CardFormat,
  type CountdownSnapshot,
  type SharePlatform
} from "@/lib/countdown-share";

type PreparedCard = { file: File; url: string; key: string };
type ShareDraft = { snapshot: CountdownSnapshot; caption: string; edited: boolean };
const focusStyle = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-goldBright";
const formatLabels: Record<CardFormat, string> = { preview: "Landscape link card", feed: "Portrait post", story: "Story / vertical photo", square: "Square image post" };
const socialLabels: Record<Exclude<SharePlatform, "other">, SocialPlatform> = { facebook: "Facebook", instagram: "Instagram", x: "X", tiktok: "TikTok", youtube: "YouTube" };

function makeDraft(snapshot: CountdownSnapshot, platform: SharePlatform): ShareDraft {
  return { snapshot, caption: buildCountdownCaption(snapshot, platform), edited: false };
}

function writeClipboard(text: string): Promise<boolean> {
  try {
    return navigator.clipboard?.writeText(text).then(() => true, () => false) ?? Promise.resolve(false);
  } catch {
    return Promise.resolve(false);
  }
}

export function CountdownShareDialog({ snapshot: initialSnapshot, onClose }: { snapshot: CountdownSnapshot; onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const actionVersion = useRef(0);
  const [platform, setPlatform] = useState<SharePlatform>("facebook");
  const [format, setFormat] = useState<CardFormat>(COUNTDOWN_PLATFORM_PRESETS.facebook.defaultFormat);
  const [drafts, setDrafts] = useState(() => Object.fromEntries(COUNTDOWN_SHARE_PLATFORMS.map((value) => [value, makeDraft(initialSnapshot, value)])) as Record<SharePlatform, ShareDraft>);
  const [preparedCard, setPreparedCard] = useState<PreparedCard | null>(null);
  const [cardError, setCardError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [canShareCard, setCanShareCard] = useState(false);
  const [sharingCard, setSharingCard] = useState(false);
  const [status, setStatus] = useState("");
  const [copied, setCopied] = useState<"caption" | "link" | null>(null);
  const draft = drafts[platform];
  const { snapshot, caption } = draft;
  const preset = COUNTDOWN_PLATFORM_PRESETS[platform];
  const size = COUNTDOWN_CARD_SIZES[format];
  const cardKey = `${platform}-${snapshot.at}-${format}`;
  const card = preparedCard?.key === cardKey ? preparedCard : null;
  const shareUrl = buildCountdownShareUrl(snapshot, platform);
  const remaining = formatCountdownRemaining(snapshot);
  const facebookLinkShare = platform === "facebook" && format === "preview";
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: shareUrl })}`;
  // The caption already contains its snapshot URL, so do not append it twice.
  const xUrl = `https://x.com/intent/tweet?${new URLSearchParams({ text: caption })}`;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    dialog.querySelector<HTMLButtonElement>("[data-dialog-initial-focus]")?.focus({ preventScroll: true });
    return () => {
      actionVersion.current += 1;
      if (dialog.open) dialog.close();
      document.body.style.overflow = originalOverflow;
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let objectUrl: string | undefined;
    let active = true;
    const timeout = window.setTimeout(() => controller.abort(), 20_000);
    setPreparedCard(null);
    setCardError(false);
    setCanShareCard(false);

    async function prepareCard() {
      try {
        const response = await fetch(buildCountdownCardUrl(snapshot, format), { signal: controller.signal });
        if (!response.ok) throw new Error("Card unavailable");
        if (response.headers.get("X-Countdown-Snapshot-At") !== String(snapshot.at)) {
          throw new RangeError("The card time doesn’t match your device. Check your device’s clock, then choose Update time.");
        }
        const blob = await response.blob();
        if (!blob.type.startsWith("image/png") || !blob.size) throw new Error("Invalid card");
        if (!active) return;
        const file = new File([blob], `mg251-${platform}-${format}-${snapshot.dateKey}-${snapshot.at}.png`, { type: "image/png" });
        objectUrl = URL.createObjectURL(blob);
        setPreparedCard({ file, url: objectUrl, key: cardKey });
        try {
          setCanShareCard(typeof navigator.share === "function" && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] }));
        } catch {
          setCanShareCard(false);
        }
      } catch (error) {
        if (active) {
          setCardError(true);
          if (error instanceof RangeError) setStatus(error.message);
        }
      } finally {
        window.clearTimeout(timeout);
      }
    }

    void prepareCard();
    return () => {
      active = false;
      controller.abort();
      window.clearTimeout(timeout);
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [snapshot, platform, format, cardKey, retry]);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(null), 3000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  function choosePlatform(value: SharePlatform) {
    if (value === platform) return;
    actionVersion.current += 1;
    const freshSnapshot = createCountdownSnapshot();
    setDrafts((values) => values[value].edited ? values : { ...values, [value]: makeDraft(freshSnapshot, value) });
    setPlatform(value);
    setFormat(COUNTDOWN_PLATFORM_PRESETS[value].defaultFormat);
    setCopied(null);
    setStatus("");
  }

  function refreshDraft() {
    actionVersion.current += 1;
    const freshSnapshot = createCountdownSnapshot();
    setDrafts((values) => ({ ...values, [platform]: makeDraft(freshSnapshot, platform) }));
    setCopied(null);
    setStatus("Card and post updated to the current countdown.");
  }

  async function copyText(kind: "caption" | "link", download = false) {
    const version = actionVersion.current;
    const success = await writeClipboard(kind === "caption" ? caption : shareUrl);
    if (version !== actionVersion.current) return;
    if (success) {
      setCopied(kind);
      setStatus(kind === "link"
        ? "Website link copied. You can also use it in a Story link sticker."
        : download ? "Post copied and card download requested. Upload the saved card, then paste your post."
          : `${preset.label} post copied. Paste it before publishing.`);
    } else {
      const field = kind === "caption" ? captionRef.current : linkRef.current;
      field?.focus();
      field?.select();
      setCopied(null);
      setStatus(`Automatic copy is unavailable. The ${kind === "caption" ? "post" : "link"} is selected so you can copy it yourself.`);
    }
  }

  async function shareCard() {
    if (!card || typeof navigator.share !== "function" || sharingCard) return;
    const version = actionVersion.current;
    setSharingCard(true);
    // Start both operations in this click. Awaiting a fetch or clipboard request
    // before navigator.share can lose the browser's required user activation.
    const copyPromise = writeClipboard(caption);
    try {
      await navigator.share({ files: [card.file], title: COUNTDOWN_SHARE_TITLE });
      const didCopy = await copyPromise;
      if (version !== actionVersion.current) return;
      if (didCopy) setCopied("caption");
      setStatus(didCopy
        ? "Card sent to your device’s share menu. Your post is copied—paste it in the app before publishing."
        : "Card sent to your device’s share menu. Use Copy post here if you need to paste the text separately.");
    } catch (error) {
      const didCopy = await copyPromise;
      if (version !== actionVersion.current) return;
      if (didCopy) setCopied("caption");
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus(didCopy ? "Sharing canceled. Your post is copied and the card is still ready." : "Sharing canceled. Your card and post are still ready.");
      } else {
        setStatus("Your device couldn’t share the card. Use Save card and Copy post below.");
      }
    } finally {
      setSharingCard(false);
    }
  }

  const primaryStyle = `inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-parade-goldBright px-4 py-2.5 text-sm font-black text-parade-purpleDark hover:bg-parade-goldSoft disabled:opacity-50 ${focusStyle}`;
  const secondaryStyle = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-white/25 px-3 py-2 text-xs font-bold text-white hover:bg-white/10 disabled:opacity-50 ${focusStyle}`;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="countdown-share-heading"
      aria-describedby="countdown-share-description"
      className="fixed inset-0 m-0 h-[100dvh] max-h-none w-screen max-w-none items-center justify-center overflow-hidden border-0 bg-black/75 p-2 text-white backdrop-blur-sm backdrop:bg-transparent open:flex sm:p-5"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="flex max-h-[calc(100dvh-1rem)] w-full max-w-5xl flex-col overflow-hidden rounded-3xl border border-parade-gold/40 bg-parade-purpleDeep text-white shadow-card sm:max-h-[calc(100dvh-2.5rem)]">
        <header className="flex shrink-0 items-start justify-between gap-3 border-b border-white/15 bg-gradient-to-r from-parade-purpleDeep to-parade-purple px-4 py-4 sm:px-6">
          <div>
            <h2 id="countdown-share-heading" className="text-xl font-black leading-tight sm:text-2xl">Share the countdown</h2>
            <p id="countdown-share-description" className="mt-1.5 text-sm leading-5 text-purple-100">Pick a platform for your card and ready-to-post text.</p>
          </div>
          <button type="button" onClick={onClose} data-dialog-initial-focus aria-label="Close countdown sharing" className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-white/10 hover:bg-white/20 ${focusStyle}`}>
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 overflow-y-auto overscroll-contain px-4 pb-5 pt-4 sm:p-6">
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6" role="group" aria-label="Choose a sharing platform">
            {COUNTDOWN_SHARE_PLATFORMS.map((value) => (
              <button key={value} type="button" aria-pressed={platform === value} onClick={() => choosePlatform(value)} className={`inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-black transition ${focusStyle} ${platform === value ? "border-parade-goldBright bg-parade-goldBright text-parade-purpleDark" : "border-white/25 bg-white/5 text-white hover:bg-white/10"}`}>
                <span className="hidden shrink-0 min-[380px]:inline-flex">{value === "other" ? <Share2 className="h-4 w-4" aria-hidden="true" /> : <SocialBrandIcon platform={socialLabels[value]} />}</span>
                {value === "other" ? "Other" : COUNTDOWN_PLATFORM_PRESETS[value].label}
              </button>
            ))}
          </div>

          <div className="my-3 flex items-center justify-between gap-3">
            <p className="min-w-0 flex-1 text-xs leading-5 text-purple-200">As of {snapshot.dateLabel}.{draft.edited ? " Your edited post is saved." : ""}</p>
            <button type="button" onClick={refreshDraft} className={`inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded px-1 text-xs font-bold text-parade-goldBright hover:underline ${focusStyle}`}>
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> {draft.edited ? "Reset with current time" : "Update time"}
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <section aria-labelledby="countdown-card-heading" className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 id="countdown-card-heading" className="text-sm font-black text-parade-goldBright">Your {preset.label === "Other apps" ? "share" : preset.label} card</h3>
                {preset.formats.length > 1 ? (
                  <select aria-label="Card layout" value={format} onChange={(event) => { setFormat(event.target.value as CardFormat); setStatus(""); }} className={`min-h-11 max-w-44 rounded-lg border border-white/25 bg-parade-purpleDark px-2 text-xs font-semibold text-white ${focusStyle}`}>
                    {preset.formats.map((value) => <option key={value} value={value}>{formatLabels[value]}</option>)}
                  </select>
                ) : <span className="text-xs text-purple-200">{formatLabels[format]}</span>}
              </div>
              <div className="mt-2 flex h-40 items-center justify-center rounded-2xl border border-white/10 bg-black/20 p-2 md:h-80 md:p-3" aria-busy={!card && !cardError}>
                {card ? (
                  <Image
                    src={card.url}
                    width={size.width}
                    height={size.height}
                    unoptimized
                    alt={snapshot.expired ? "MG251: the first downtown parade’s scheduled start has arrived. Check the current schedule." : `${remaining} until Mobile’s first downtown parade. ${TARGET_EVENT_NAME}, ${TARGET_FULL_DATE_LABEL}. Captured ${snapshot.dateLabel}. MG251.xyz.`}
                    className="h-full w-full rounded-lg object-contain"
                    onError={() => { setCardError(true); setPreparedCard(null); }}
                  />
                ) : cardError ? (
                  <div className="max-w-xs px-2 text-center">
                    <p className="text-sm leading-6 text-purple-100">The card couldn’t load. Your post and website link are still ready.</p>
                    <button type="button" onClick={() => setRetry((value) => value + 1)} className={`mt-2 min-h-11 rounded-full border border-parade-gold/50 px-5 text-sm font-bold ${focusStyle}`}>Try card again</button>
                  </div>
                ) : <p className="flex items-center gap-2 text-sm text-purple-100" role="status"><LoaderCircle className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> Preparing your {preset.label} card…</p>}
              </div>
              <p className="mt-2 text-center text-xs leading-5 text-purple-200">{size.width} × {size.height} PNG • {snapshot.expired ? "Parade planning" : `${remaining} to go`}</p>
            </section>

            <section aria-labelledby="countdown-caption-heading" className="min-w-0">
              <label htmlFor="countdown-caption" id="countdown-caption-heading" className="block text-sm font-black text-parade-goldBright">Your {preset.label === "Other apps" ? "ready-to-share" : preset.label} post</label>
              <p className="mt-1 text-xs leading-5 text-purple-200">Ready to use. Edit it if you’d like.</p>
              <textarea ref={captionRef} id="countdown-caption" aria-label={`${preset.label} post`} value={caption} onChange={(event) => {
                const value = event.target.value;
                actionVersion.current += 1;
                setDrafts((values) => ({ ...values, [platform]: { ...values[platform], caption: value, edited: value !== buildCountdownCaption(snapshot, platform) } }));
                setCopied(null);
                setStatus("");
              }} rows={8} className="mt-2 block w-full resize-y rounded-xl border border-white/25 bg-white p-3 text-base leading-6 text-parade-ink outline-none focus:border-parade-goldBright focus:ring-2 focus:ring-parade-goldBright sm:text-sm" />
              <p className="mt-3 text-xs leading-5 text-purple-100">
                {facebookLinkShare ? "Facebook opens with this countdown’s link card. Paste the copied post before publishing."
                  : platform === "x" ? "X opens with your text and countdown link. To attach the PNG itself, save the card and add it in X."
                    : platform === "youtube" ? "Use the square card in a YouTube image post and paste the copied text."
                      : platform === "tiktok" ? "Use this vertical card in a TikTok photo post and paste the copied text."
                        : canShareCard ? `Choose ${platform === "other" ? "an app" : preset.label} in your device’s share menu, then paste the copied post.`
                          : `Save the card, upload it ${platform === "other" ? "in your chosen app" : `to ${preset.label}`}, and paste the copied post.`}
                {platform === "instagram" && format === "story" ? " Add the website link with a Story link sticker." : ""}
              </p>
              <label htmlFor="countdown-share-link" className="mt-3 flex items-center gap-1.5 text-xs font-bold text-purple-100"><Link2 className="h-3.5 w-3.5" aria-hidden="true" /> Website link</label>
              <div className="mt-1.5 flex gap-2">
                <input ref={linkRef} id="countdown-share-link" type="text" value={shareUrl} readOnly onFocus={(event) => event.currentTarget.select()} className="min-h-11 min-w-0 flex-1 rounded-lg border border-white/25 bg-black/20 px-3 text-base text-purple-100 focus:outline focus:outline-2 focus:outline-parade-goldBright sm:text-xs" />
                <button type="button" onClick={() => void copyText("link")} aria-label="Copy website link" className={secondaryStyle}>{copied === "link" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}</button>
              </div>
            </section>
          </div>
        </div>

        <footer className="shrink-0 border-t border-white/15 bg-parade-purpleDeep px-4 py-3 sm:px-6">
          <p role="status" aria-live="polite" aria-atomic="true" className={`text-xs font-semibold leading-5 text-parade-goldBright ${status ? "mb-2" : "sr-only"}`}>{status}</p>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_auto]">
            {facebookLinkShare ? (
              <a href={facebookUrl} target="_blank" rel="noopener noreferrer" onClick={() => void copyText("caption")} className={primaryStyle}><SocialBrandIcon platform="Facebook" /> Copy post &amp; open Facebook <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
            ) : platform === "x" ? (
              <a href={xUrl} target="_blank" rel="noopener noreferrer" className={primaryStyle}><SocialBrandIcon platform="X" /> Open X with post <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>
            ) : card && canShareCard ? (
              <button type="button" onClick={() => void shareCard()} disabled={sharingCard} className={primaryStyle}><Share2 className="h-4 w-4" aria-hidden="true" /> {sharingCard ? "Opening share menu…" : "Copy post & share card"}</button>
            ) : card ? (
              <a href={card.url} download={card.file.name} onClick={() => void copyText("caption", true)} className={primaryStyle}><Download className="h-4 w-4" aria-hidden="true" /> Save card &amp; copy post</a>
            ) : <button type="button" disabled className={primaryStyle}><LoaderCircle className={`h-4 w-4 ${cardError ? "" : "animate-spin motion-reduce:animate-none"}`} aria-hidden="true" /> {cardError ? "Card unavailable" : "Preparing card…"}</button>}
            <div className="grid grid-cols-2 gap-2 sm:contents">
              <button type="button" onClick={() => void copyText("caption")} className={secondaryStyle}>{copied === "caption" ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}{copied === "caption" ? "Post copied" : "Copy post"}</button>
              {card ? <a href={card.url} download={card.file.name} className={secondaryStyle}><Download className="h-4 w-4" aria-hidden="true" /> Save card</a> : <button type="button" disabled className={secondaryStyle}><Download className="h-4 w-4" aria-hidden="true" /> Save card</button>}
            </div>
          </div>
        </footer>
      </div>
    </dialog>
  );
}
