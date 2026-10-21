import type { SocialPlatform } from "@/lib/social-links";

export function SocialBrandIcon({ platform }: { platform: SocialPlatform }) {
  if (platform === "Facebook") return <FacebookLogo />;
  if (platform === "Instagram") return <InstagramLogo />;
  if (platform === "YouTube") return <YouTubeLogo />;
  if (platform === "TikTok") return <TikTokLogo />;
  return <XLogo />;
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31.3 31.3 0 0 0 0 12a31.3 31.3 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31.3 31.3 0 0 0 24 12a31.3 31.3 0 0 0-.5-5.8ZM9.6 15.6V8.4l6.3 3.6-6.3 3.6Z" />
    </svg>
  );
}

function FacebookLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M24 12.1C24 5.4 18.6 0 12 0S0 5.4 0 12.1c0 6 4.4 11 10.1 11.9v-8.4h-3v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5h-2.9V24c5.8-.9 10.2-5.9 10.2-11.9Z" />
    </svg>
  );
}

function InstagramLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
      <path d="M16.7 1.8c.4 3.1 2.1 5 5.1 5.2v3.5a8.7 8.7 0 0 1-5.1-1.6v7.1c0 4.5-3.1 6.7-6.3 6.7-3.6 0-6.4-2.5-6.4-5.9 0-3.6 3-6.1 6.9-5.9v3.7c-1.7-.2-3 .7-3 2.1 0 1.3 1.1 2.1 2.4 2.1 1.4 0 2.5-.8 2.5-2.8V1.8h3.9Z" />
    </svg>
  );
}

function XLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2h3.3l-7.2 8.2L23.5 22h-6.7l-5.2-6.8L5.6 22H2.3l7.7-8.8L1.8 2h6.8l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.6 3.9H5.7L17.7 20Z" />
    </svg>
  );
}
