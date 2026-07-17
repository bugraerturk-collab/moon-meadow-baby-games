"use client";

import { FormEvent, useState } from "react";
import { Key, LockKey, MoonStars, ShieldCheck, Sparkle } from "@phosphor-icons/react";

export default function AccessPage() {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const unlock = async (event: FormEvent) => {
    event.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError("");
    const response = await fetch("/api/access", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const result = await response.json().catch(() => ({})) as { error?: string };
    if (!response.ok) {
      setError(result.error || "We couldn't verify that code. Please try again.");
      setLoading(false);
      return;
    }
    const next = new URLSearchParams(window.location.search).get("next");
    window.location.href = next?.startsWith("/") ? next : "/";
  };

  return <main className="access-shell">
    <div className="ambient-stars" aria-hidden="true"><Sparkle weight="fill" /><Sparkle weight="fill" /><Sparkle weight="fill" /></div>
    <form className="access-card" onSubmit={unlock}>
      <a className="brand" href="/access"><span className="brand-mark"><MoonStars weight="fill" /></span><span>Wondreams<br />Baby Shower Games</span></a>
      <div className="access-icon"><LockKey weight="duotone" /></div>
      <span className="eyebrow"><Sparkle weight="fill" /> Purchaser access</span>
      <h1>Let the celebration begin.</h1>
      <p>Enter the access code included in your purchase PDF to open the host dashboard.</p>
      <label>Access code<div className="input-wrap"><Key weight="bold" /><input value={code} onChange={(event) => setCode(event.target.value.toUpperCase())} placeholder="Enter your access code" maxLength={24} autoCapitalize="characters" autoComplete="off" autoFocus /></div></label>
      {error && <div className="access-error" role="alert">{error}</div>}
      <button className="button button-primary button-large" type="submit" disabled={loading || !code.trim()}>{loading ? "Checking…" : "Unlock the Games"}</button>
      <small><ShieldCheck weight="fill" /> Access is included with your Etsy purchase</small>
    </form>
  </main>;
}
