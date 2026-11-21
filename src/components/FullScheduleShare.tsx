"use client";

import { Download, Share2, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { PARADE_SHARE_BANNER_PATH } from "@/lib/brand";
import type { ParadeSchedule } from "@/components/ScheduleRouteViewer";

const IMAGE_WIDTH = 1080;
const MARGIN = 46;
const MAX_IMAGE_EDGE = 4096;
const DAY_HEIGHT = 55;
const ROW_HEIGHT = 60;
const FOOTER_HEIGHT = 118;
const GOLD = "#ffd45a";
const PALE_GOLD = "#fff2b5";
const FONT = "system-ui, sans-serif";

async function renderSchedule(schedule: ParadeSchedule, scheduleUrl: string) {
  const banner = new window.Image();
  banner.src = PARADE_SHARE_BANNER_PATH;
  const hasBanner = await banner.decode().then(() => true, () => false);
  const contentWidth = IMAGE_WIDTH - MARGIN * 2;
  const bannerHeight = hasBanner ? contentWidth * banner.naturalHeight / banner.naturalWidth : 85;
  const titleY = 40 + bannerHeight + 45;
  const headerHeight = titleY + 100;
  const days = schedule.days.filter((day) => day.parades.length > 0);
  const height = headerHeight + FOOTER_HEIGHT + days.reduce(
    (total, day) => total + DAY_HEIGHT + day.parades.length * ROW_HEIGHT,
    0
  );
  const canvas = document.createElement("canvas");
  const scale = Math.min(1, MAX_IMAGE_EDGE / height);
  canvas.width = Math.round(IMAGE_WIDTH * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.scale(canvas.width / IMAGE_WIDTH, canvas.height / height);

  const background = ctx.createLinearGradient(0, 0, IMAGE_WIDTH, height);
  background.addColorStop(0, "#4a0b70");
  background.addColorStop(1, "#210637");
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, IMAGE_WIDTH, height);
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.strokeRect(22, 22, IMAGE_WIDTH - 44, height - 44);
  ctx.textBaseline = "middle";

  const right = IMAGE_WIDTH - MARGIN;
  if (hasBanner) {
    ctx.drawImage(banner, MARGIN, 40, contentWidth, bannerHeight);
  } else {
    ctx.fillStyle = GOLD;
    ctx.font = `900 42px ${FONT}`;
    ctx.fillText("MG251.xyz  /  MOBILE, ALABAMA", MARGIN, 85);
  }
  ctx.fillStyle = PALE_GOLD;
  ctx.font = `900 52px ${FONT}`;
  ctx.fillText(schedule.title, MARGIN, titleY, contentWidth);
  ctx.font = `700 27px ${FONT}`;
  ctx.fillText(`${schedule.displayDateRange}  ·  All times Central`, MARGIN, titleY + 52, contentWidth);

  let y = headerHeight;
  for (const day of days) {
    ctx.fillStyle = "#63228a";
    ctx.fillRect(MARGIN, y + 5, right - MARGIN, DAY_HEIGHT - 10);
    ctx.fillStyle = GOLD;
    ctx.font = `800 35px ${FONT}`;
    const label = day.specialLabel ? `${day.label}  ·  ${day.specialLabel}` : day.label;
    ctx.fillText(label, MARGIN + 14, y + DAY_HEIGHT / 2, right - MARGIN - 28);
    y += DAY_HEIGHT;

    for (const parade of day.parades) {
      const rowX = MARGIN + 14;
      const rowWidth = right - MARGIN - 28;
      ctx.fillStyle = PALE_GOLD;
      ctx.font = `750 38px ${FONT}`;
      ctx.fillText(parade.name, rowX, y + 17, rowWidth);
      ctx.fillStyle = GOLD;
      ctx.font = `700 28px ${FONT}`;
      ctx.fillText(`${parade.time}  ·  ${parade.route}`, rowX, y + 44, rowWidth);
      y += ROW_HEIGHT;
    }
  }

  ctx.fillStyle = PALE_GOLD;
  ctx.font = `600 23px ${FONT}`;
  ctx.fillText("Schedule subject to change. Check for updates and route maps at", MARGIN, y + 36);
  ctx.fillStyle = GOLD;
  ctx.font = `850 29px ${FONT}`;
  const url = new URL(scheduleUrl);
  ctx.fillText(url.host + url.pathname, MARGIN, y + 72);

  const png = new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG export failed")), "image/png");
  });
  return { png, width: canvas.width, height: canvas.height };
}

type ScheduleImage = { file: File; url: string; canShare: boolean; width: number; height: number };

export function FullScheduleShare({ schedule, scheduleUrl }: { schedule: ParadeSchedule; scheduleUrl: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const [image, setImage] = useState<ScheduleImage | null>(null);
  const [preparing, setPreparing] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    return () => {
      if (image) URL.revokeObjectURL(image.url);
    };
  }, [image]);

  async function prepareImage() {
    setPreparing(true);
    setStatus("Preparing schedule image…");
    try {
      const { png, width, height } = await renderSchedule(schedule, scheduleUrl);
      const blob = await png;
      const file = new File([blob], `MG251-${schedule.season}-Parade-Schedule.png`, { type: "image/png" });
      const canShare = typeof navigator.share === "function" && navigator.canShare?.({ files: [file] }) === true;
      setImage({ file, canShare, width, height, url: URL.createObjectURL(blob) });
      setStatus("");
    } catch {
      setStatus("The image couldn’t be prepared. Please try again.");
    } finally {
      setPreparing(false);
    }
  }

  function open() {
    dialog.current?.showModal();
    if (!image && !preparing) void prepareImage();
  }

  async function share() {
    if (!image?.canShare || sharing) return;
    setSharing(true);
    setStatus("");
    try {
      await navigator.share({ files: [image.file], title: schedule.title });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) {
        setStatus("Sharing couldn’t open. Use Save image to download the PNG.");
      }
    } finally {
      setSharing(false);
    }
  }

  const actionStyle = "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-parade-goldBright px-4 py-2.5 text-sm font-black text-parade-purpleDark hover:bg-parade-goldSoft disabled:opacity-50";

  return (
    <>
      <button
        type="button"
        ref={trigger}
        className={actionStyle}
        aria-haspopup="dialog"
        onClick={open}
      >
        Share full schedule <Share2 className="h-4 w-4" aria-hidden="true" />
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="full-schedule-share-title"
        onClose={() => trigger.current?.focus({ preventScroll: true })}
        className="m-auto max-h-[90dvh] w-[min(42rem,calc(100%-2rem))] max-w-none overflow-hidden rounded-2xl border border-parade-goldBright bg-parade-purpleDeep p-0 text-white backdrop:bg-black/70"
      >
        <div className="flex max-h-[calc(90dvh-2px)] flex-col">
          <div className="flex flex-wrap items-center gap-2 p-4 sm:p-5">
            <div className="flex w-full items-center justify-between gap-3">
              <h2 id="full-schedule-share-title" className="text-lg font-black">Share full schedule</h2>
              <button
                type="button"
                autoFocus
                aria-label="Close full schedule sharing"
                className="rounded-full p-2 hover:bg-white/10"
                onClick={() => dialog.current?.close()}
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            {image && (
              <>
                {image.canShare && (
                  <button type="button" className={actionStyle} onClick={share} disabled={sharing}>
                    <Share2 className="h-4 w-4" aria-hidden="true" /> Share image
                  </button>
                )}
                <a href={image.url} download={image.file.name} className={actionStyle}>
                  <Download className="h-4 w-4" aria-hidden="true" /> Save image
                </a>
              </>
            )}
            {!image && !preparing && (
              <button type="button" className={actionStyle} onClick={prepareImage}>Try again</button>
            )}
            <p role="status" className={status ? "w-full text-sm text-parade-goldSoft" : "sr-only"}>{status}</p>
          </div>
          {image && (
            <div className="min-h-0 overflow-y-auto overscroll-contain pb-4 sm:px-5 sm:pb-5">
              <Image
                src={image.url}
                alt={`${schedule.title} image preview, with all dates, start times and routes listed on this page.`}
                width={image.width}
                height={image.height}
                unoptimized
                className="h-auto w-full rounded-lg"
              />
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
