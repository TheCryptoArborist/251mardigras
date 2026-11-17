"use client";
import { useRef, useState, type FormEvent } from "react";
import societies from "@/data/ball-societies.json";
import venues from "@/data/ball-venues.json";
import ballDetails from "@/data/ball-details-2027.json";

const inputClass = "mt-1 w-full rounded-xl border border-parade-line bg-white px-3 py-3 text-base text-parade-ink focus:outline-none focus:ring-2 focus:ring-parade-gold";
const buttonClass = "inline-flex min-h-11 items-center justify-center rounded-full bg-parade-gold px-5 py-3 text-sm font-black text-parade-purpleDark hover:bg-parade-goldBright focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-parade-purple";
const normalize = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

export default function BallDirectory() {
  const [search, setSearch] = useState("");
  const [society, setSociety] = useState("");
  const [venue, setVenue] = useState("");
  const [address, setAddress] = useState("");
  const [autoAddress, setAutoAddress] = useState("");
  const [venueSource, setVenueSource] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle");
  const dialog = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const addressRef = useRef<HTMLInputElement>(null);
  const matches = societies.filter(n => normalize(n).includes(normalize(search)));
  const venueMatches = normalize(venue).length >= 2 ? venues.filter(v => [v.name, ...v.aliases].some(n => normalize(n).includes(normalize(venue)))) : [];
  function open(name: string) {
    formRef.current?.reset(); setSociety(name); setVenue(""); setAddress(""); setAutoAddress(""); setVenueSource(""); setShowSuggestions(false); setState("idle"); dialog.current?.showModal();
  }
  function choose(v: typeof venues[number]) {
    setVenue(v.name); setAddress(v.address); setAutoAddress(v.address); setVenueSource(v.source); setShowSuggestions(false); addressRef.current?.focus();
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); if(state === "sending") return;
    setState("sending");
    const data = new FormData(e.currentTarget);
    try {
      const response = await fetch("/__ball-form.html", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams(data as unknown as Record<string,string>).toString() });
      if(!response.ok) throw new Error("Submission failed");
      setState("success");
    } catch { setState("error"); }
  }
  return <div>
    <section className="border-b border-parade-gold/30 bg-gradient-to-r from-parade-purpleDeep via-parade-purpleDark to-parade-purple text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <p className="text-xs font-black uppercase tracking-[.2em] text-parade-goldBright">Mobile and the surrounding Gulf Coast</p>
        <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-6xl">2027 Mardi Gras<br/><span className="text-parade-goldBright">Balls &amp; Celebrations</span></h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-purple-100 sm:text-lg">Find your society. Share your ball details. Help build the 2027 Mardi Gras ball calendar, one celebration at a time.</p>
        <a href="#ball-directory" className={`${buttonClass} mt-6`}>Find your society ↓</a>
        <p className="mt-3 text-sm text-purple-100">Representing a society? Submit your 2027 details below.</p>
      </div>
    </section>
    <section id="ball-directory" className="mx-auto max-w-7xl scroll-mt-28 px-4 py-9 sm:px-6 lg:px-8">
      <h2 className="text-3xl font-black text-parade-purpleDark">Find your society</h2>
      <p className="mt-2 text-parade-muted">2027 dates are being collected. All submissions are reviewed before publication.</p>
      <label className="mt-6 block text-sm font-bold" htmlFor="society-search">Search societies</label>
      <input id="society-search" type="search" className={inputClass} placeholder="Search for your society…" value={search} onChange={e=>setSearch(e.target.value)} />
      <p className="my-5 text-sm text-parade-muted" aria-live="polite">{matches.length} {matches.length===1 ? "society" : "societies"} shown</p>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map(name=>{const ball = ballDetails.find(b=>b.society===name); return <article key={name} className="flex flex-col rounded-[1.5rem] border border-parade-line bg-white p-6 shadow-card">
          <div className="flex items-center justify-between gap-2"><span aria-hidden="true" className="grid h-11 w-11 place-items-center rounded-full border border-parade-gold/40 bg-parade-goldSoft text-parade-purple">✦</span><span className="rounded-full bg-parade-purpleMist px-3 py-1 text-xs font-bold text-parade-purple">{ball ? "Date and venue confirmed" : "Awaiting confirmation"}</span></div>
          <h3 className="mt-5 text-xl font-black text-parade-purpleDark">{name}</h3>
          {ball ? <div className="mb-5 mt-3 space-y-2 text-sm leading-6 text-parade-muted"><p className="font-bold text-parade-purpleDark">{ball.title}</p><p>{ball.dateLabel}<br/>Time: {ball.time ?? "Not announced"}</p><p className="font-bold">{ball.venue}<br/><span className="font-normal">{ball.address}</span></p><p>{ball.admission}</p><p className="text-xs">Source: {ball.source}.<br/>Verified November 16, 2026.</p></div> : <p className="mb-5 mt-3 text-sm leading-6 text-parade-muted">2027 date, time and venue awaiting confirmation.</p>}
          <button type="button" onClick={()=>open(name)} className="mt-auto min-h-11 border-t border-parade-line pt-3 text-left text-sm font-black text-parade-purple hover:underline" aria-label={`Submit 2027 ball details for ${name}`}>{ball ? "Submit a correction →" : "Submit 2027 Ball Details →"}</button>
        </article>})}
      </div>
      {!matches.length && <p className="py-6">No societies match your search. Try another name or add your organization below.</p>}
      <div className="mt-8 flex flex-col items-start justify-between gap-5 rounded-[1.5rem] border border-parade-line bg-parade-purpleMist p-6 sm:flex-row sm:items-center"><div><h3 className="text-xl font-black text-parade-purpleDark">Don’t see your organization?</h3><p className="mt-2 text-sm text-parade-muted">Add your society and ball details for review.</p></div><button type="button" className={buttonClass} onClick={()=>open("")}>Add your society +</button></div>
      <p className="mt-6 text-xs leading-6 text-parade-muted">Starting roster adapted from <a className="font-bold underline" href="https://mobilemask.com/mobile-mardi-gras/balls/" target="_blank" rel="noreferrer">Mobile Mask’s 2026 ball and reception list</a>. Includes surrounding communities. Historical dates and venues have not been carried forward as confirmed 2027 information. Contact details submitted here are kept private and are not published.</p>
    </section>
    <dialog ref={dialog} aria-labelledby="ball-form-title" className="m-auto max-h-[90dvh] w-[min(640px,94vw)] overflow-y-auto rounded-3xl border border-parade-line bg-parade-cream p-6 text-parade-ink shadow-2xl backdrop:bg-parade-purpleDeep/80 sm:p-8">
      <button type="button" className="float-right grid h-11 w-11 place-items-center rounded-full bg-parade-purpleMist text-xl" aria-label="Close form" onClick={()=>dialog.current?.close()}>×</button>
      <h2 id="ball-form-title" className="pr-12 text-2xl font-black text-parade-purpleDark">Share your 2027 details</h2>
      {state === "success" ? <div role="status" className="mt-5"><h3 className="text-xl font-bold">Thank you for your submission.</h3><p className="mt-3 leading-7">Your details have been submitted for MG251 review. They will not appear publicly until approved.</p><button className={`${buttonClass} mt-5`} onClick={()=>dialog.current?.close()}>Back to the directory</button></div> : <>
      <p className="mt-3 text-sm leading-6 text-parade-muted">Please confirm your society’s date, times and venue. MG251 will review the information before publishing it.</p>
      <form ref={formRef} name="mg251-ball-details-2027" method="POST" onSubmit={submit} className="mt-5 grid gap-4 sm:grid-cols-2">
        <input type="hidden" name="form-name" value="mg251-ball-details-2027"/>
        <p hidden><label>Leave this empty<input name="bot-field" tabIndex={-1} autoComplete="off"/></label></p>
        <label className="text-sm font-bold sm:col-span-2">Society name<input required name="society" className={inputClass} value={society} onChange={e=>setSociety(e.target.value)} maxLength={200}/></label>
        <label className="text-sm font-bold">Ball date<input required type="date" min="2026-11-01" max="2027-12-31" name="ball-date" className={inputClass}/></label>
        <label className="text-sm font-bold">Doors open<input required type="time" name="doors-open" className={inputClass}/></label>
        <label className="text-sm font-bold">Call outs time · optional<input type="time" name="call-outs" className={inputClass}/></label>
        <label className="text-sm font-bold">Ball starts · optional<input type="time" name="ball-start" className={inputClass}/></label>
        <div className="sm:col-span-2"><label htmlFor="ball-venue" className="text-sm font-bold">Venue name</label><input id="ball-venue" name="venue" required autoComplete="off" className={inputClass} placeholder="Start typing Fort Whiting, Crown Hall…" value={venue} aria-describedby="venue-help" aria-controls="venue-options" onChange={e=>{setVenue(e.target.value);if(address===autoAddress)setAddress("");setAutoAddress("");setVenueSource("");setShowSuggestions(true)}} onKeyDown={e=>{if(e.key==="Escape"){e.preventDefault();e.stopPropagation();setShowSuggestions(false)}if(e.key==="ArrowDown"){const first=document.querySelector<HTMLButtonElement>("#venue-options button");if(first){e.preventDefault();first.focus()}}}}/>
          <p id="venue-help" className="mt-2 text-xs leading-5 text-parade-muted">Choose a venue to fill its address, or enter another location manually.</p>
          <div id="venue-options" className="mt-2 grid gap-2">{showSuggestions&&venueMatches.map(v=><button type="button" key={v.name} onClick={()=>choose(v)} className="rounded-xl border border-parade-line bg-white px-3 py-3 text-left text-sm hover:bg-parade-purpleMist focus-visible:ring-2 focus-visible:ring-parade-gold"><strong className="block">{v.name}</strong><span className="mt-1 block text-xs text-parade-muted">{v.address}</span></button>)}</div>
          {venueSource&&<p className="mt-2 text-xs" role="status">Address filled. Please confirm your room or entrance. <a href={venueSource} target="_blank" rel="noreferrer" className="font-bold underline">Address source</a></p>}
        </div>
        <label className="text-sm font-bold sm:col-span-2">Venue address<input ref={addressRef} required name="venue-address" className={inputClass} value={address} onChange={e=>setAddress(e.target.value)} maxLength={300}/></label>
        <label className="text-sm font-bold sm:col-span-2">Room or entrance · optional<input name="room-entrance" className={inputClass} maxLength={200}/></label>
        <label className="text-sm font-bold">Your name<input required name="representative" autoComplete="name" className={inputClass} maxLength={150}/></label>
        <label className="text-sm font-bold">Role in the society<input required name="role" className={inputClass} placeholder="e.g. Ball chair" maxLength={150}/></label>
        <label className="text-sm font-bold sm:col-span-2">Your email · kept private<input required name="email" type="email" autoComplete="email" className={inputClass}/></label>
        <label className="text-sm font-bold sm:col-span-2">Official event or ticket link · optional<input name="event-link" type="url" className={inputClass} placeholder="https://" maxLength={1000}/></label>
        <label className="text-sm font-bold sm:col-span-2">Additional details · optional<textarea name="details" className={inputClass} rows={3} maxLength={4000} placeholder="Theme, dress code, admission or other notes"/></label>
        <label className="flex items-start gap-3 text-sm leading-6 sm:col-span-2"><input required type="checkbox" name="authorized" value="yes" className="mt-1 h-5 w-5 shrink-0"/>I am authorized to submit this society’s information.</label>
        {state==="error"&&<p role="alert" className="text-sm font-bold text-parade-purple sm:col-span-2">We couldn’t submit your details. Please try again. Your entries remain in the form.</p>}
        <button type="submit" disabled={state==="sending"} className={`${buttonClass} disabled:opacity-60 sm:col-span-2`}>{state==="sending"?"Submitting…":"Submit for review"}</button>
      </form></>}
    </dialog>
  </div>;
}
